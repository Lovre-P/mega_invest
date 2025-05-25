import fs from 'fs';
import path from 'path';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache'; // Import unstable_cache and revalidateTag
import { writeJSONWithLock, readJSONWithLock } from './db-lock';
import { backupFile } from './backup';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { DatabaseError, ErrorCodes, logError } from './error-handler';
import type { Investment, User, Lead, InvestmentStatus } from './db-query'; // Import types

// Define the paths to our JSON files
const investmentsPath = path.join(process.cwd(), '_internal_data', 'investments.json');
const usersPath = path.join(process.cwd(), '_internal_data', 'users.json');
const leadsPath = path.join(process.cwd(), '_internal_data', 'leads.json');

// Async versions using file locking for concurrent access safety
async function readDataAsync<T = any>(filePath: string): Promise<T | null> {
  return await readJSONWithLock<T>(filePath);
}

async function writeDataAsync(filePath: string, data: any): Promise<boolean> {
  // Create a timestamped backup before writing
  const backupSuccessful = backupFile(path.basename(filePath));
  if (!backupSuccessful) {
    console.error(`Failed to create backup for ${filePath}. Aborting write operation.`);
    return false; 
  }

  // Ensure the directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return await writeJSONWithLock(filePath, data);
}

// Investment functions
export const getInvestments = nextCache(
  async (): Promise<Investment[]> => {
    const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
    return data ? data.investments : [];
  },
  ['investments-all'], // Cache key part
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['investments'], // Tag for potential on-demand revalidation
  }
);

export const getInvestmentById = nextCache(
  async (id: string): Promise<Investment | undefined> => {
    // Note: Caching getInvestments() means this find is on potentially cached data.
    // If getInvestments itself were not cached, this function would be a primary candidate for caching.
    // Given getInvestments IS cached, the benefit here is reduced unless getInvestments has a very short TTL
    // and this function needs a longer one for individual items.
    // For consistency and to allow individual item caching if getInvestments caching changes, we wrap it.
    const investments = await getInvestments(); 
    return investments.find((investment: Investment) => investment.id === id);
  },
  ['investment-by-id'], // Cache key part (id will be implicitly part of the full key)
  {
    revalidate: 120, // Potentially longer TTL for individual items
    tags: ['investments'], // Simplified tag, specific item invalidation is complex with current setup
  }
);
// Removed getInvestmentByIdTag as dynamic tags in unstable_cache are not directly used by revalidateTag in the same way.

export async function createInvestment(investment: Partial<Investment>): Promise<boolean> {
  const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  if (!data) return false;

  // Generate a slug-like ID if not provided
  if (!investment.id) {
    let baseSlug = investment.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!baseSlug) { // Handle empty title
      investment.id = uuidv4();
    } else {
      let potentialId = baseSlug;
      let counter = 1;
      // Check for uniqueness
      while (data.investments.some(inv => inv.id === potentialId)) {
        counter++;
        potentialId = `${baseSlug}-${counter}`; 
        // As an alternative for very high collision scenarios, a short random suffix could be used:
        // potentialId = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }
      investment.id = potentialId;
    }
  }

  // Add timestamps
  const now = new Date().toISOString();
  investment.createdAt = now;
  investment.updatedAt = now;

  // Set default status if not provided
  if (!investment.status) {
    investment.status = 'Pending';
  }

  data.investments.push(investment as Investment); // Ensure type compatibility
  const success = await writeDataAsync(investmentsPath, data);
  if (success) {
    revalidateTag('investments');
  }
  return success;
}

export async function updateInvestment(id: string, updatedInvestment: Partial<Investment>): Promise<Investment | null> {
  const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  if (!data) return null;

  const index = data.investments.findIndex((investment: Investment) => investment.id === id);
  if (index === -1) return null;

  // Update the timestamp
  updatedInvestment.updatedAt = new Date().toISOString();
  // Preserve the creation date and other metadata if not provided
  updatedInvestment.createdAt = data.investments[index].createdAt;

  // Preserve submission metadata if not provided
  if (!updatedInvestment.submittedBy && data.investments[index].submittedBy) {
    updatedInvestment.submittedBy = data.investments[index].submittedBy;
  }

  if (!updatedInvestment.submittedAt && data.investments[index].submittedAt) {
    updatedInvestment.submittedAt = data.investments[index].submittedAt;
  }

  const investmentToUpdate = { ...data.investments[index], ...updatedInvestment };
  data.investments[index] = investmentToUpdate;

  const success = await writeDataAsync(investmentsPath, data);
  if (success) {
    revalidateTag('investments');
    // revalidateTag(getInvestmentByIdTag(id)); // If specific item revalidation was set up differently
  }
  return success ? investmentToUpdate : null;
}

export async function deleteInvestment(id: string): Promise<boolean> {
  const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  if (!data) return false;

  const initialLength = data.investments.length;
  data.investments = data.investments.filter((investment: Investment) => investment.id !== id);

  if (data.investments.length === initialLength) return false;
  const success = await writeDataAsync(investmentsPath, data);
  if (success) {
    revalidateTag('investments');
  }
  return success;
}

// Investment submission functions
export async function submitInvestment(investment: Partial<Investment>, submitterEmail: string): Promise<boolean> {
  // Set submission metadata
  investment.submittedBy = submitterEmail;
  investment.submittedAt = new Date().toISOString();
  investment.status = 'Pending';

  return await createInvestment(investment);
}

export async function reviewInvestment(
  id: string,
  status: InvestmentStatus,
  reviewerEmail: string,
  rejectionReason?: string
): Promise<boolean> {
  const investment = await getInvestmentById(id);
  if (!investment) return false;

  const updates: Partial<Investment> = {
    status,
    reviewedBy: reviewerEmail,
    reviewedAt: new Date().toISOString()
  };

  // Add rejection reason if provided and status is Rejected
  if (status === 'Rejected' && rejectionReason) {
    updates.rejectionReason = rejectionReason;
  } else if (status !== 'Rejected') {
    // Remove rejection reason if status is not Rejected
    updates.rejectionReason = undefined;
  }

  return await updateInvestment(id, updates);
}

// User functions
export const getUsers = nextCache(
  async (): Promise<User[]> => {
    const data = await readDataAsync<{ users: User[] }>(usersPath);
    // Important: Filter out sensitive data if not already done by API handlers before caching
    // For now, assuming API handlers are responsible for stripping passwords.
    // If users data contains sensitive fields, they should be removed here before caching.
    return data ? data.users.map(user => {
      const { password, ...userWithoutPassword } = user; // Example: removing password
      return userWithoutPassword as User; // Adjust type if password is not optional
    }) : [];
  },
  ['users-all'],
  {
    revalidate: 60,
    tags: ['users'],
  }
);

export const getUserById = nextCache(
  async (id: string): Promise<User | undefined> => {
    const users = await getUsers(); // getUsers will return cached, password-stripped users
    return users.find((user: User) => user.id === id);
  },
  ['user-by-id'],
  {
    revalidate: 120,
    tags: ['users'], // Simplified tag
  }
);
// Removed getUserByIdTag

export const getUserByEmail = nextCache(
  async (email: string): Promise<User | undefined> => {
    const users = await getUsers(); // getUsers will return cached, password-stripped users
    return users.find((user: User) => user.email === email);
  },
  ['user-by-email'], // Key includes email implicitly
  {
    revalidate: 120,
    tags: ['users'], // Revalidate all users if one changes by email (simplification)
  }
);
// Removed getUserByEmailTag

export async function createUser(user: Partial<User>): Promise<boolean> {
  const data = await readDataAsync<{ users: User[] }>(usersPath);
  if (!data) return false;

  // Generate an ID if not provided
  if (!user.id) {
    user.id = uuidv4();
  }

  // Add timestamps
  const now = new Date().toISOString();
  user.createdAt = now;
  user.updatedAt = now;

  data.users.push(user as User);
  const success = await writeDataAsync(usersPath, data);
  if (success) {
    revalidateTag('users');
  }
  return success;
}

export async function updateUser(id: string, updatedUser: Partial<User>): Promise<User | null> {
  const data = await readDataAsync<{ users: User[] }>(usersPath);
  if (!data) return null;

  const index = data.users.findIndex((user: User) => user.id === id);
  if (index === -1) return null;

  // Update the timestamp
  updatedUser.updatedAt = new Date().toISOString();
  // Preserve the creation date
  updatedUser.createdAt = data.users[index].createdAt;

  // Ensure all fields of User are present, even if updatedUser is partial
  const userToUpdate = { ...data.users[index], ...updatedUser };
  data.users[index] = userToUpdate;

  const success = await writeDataAsync(usersPath, data);
  if (success) {
    revalidateTag('users');
    // revalidateTag(getUserByIdTag(id)); // If specific item revalidation was set up
  }
  return success ? userToUpdate : null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const data = await readDataAsync<{ users: User[] }>(usersPath);
  if (!data) return false;

  const initialLength = data.users.length;
  data.users = data.users.filter((user: User) => user.id !== id);

  if (data.users.length === initialLength) return false;
  const success = await writeDataAsync(usersPath, data);
  if (success) {
    revalidateTag('users');
  }
  return success;
}

// Lead functions
export const getLeads = nextCache(
  async (): Promise<Lead[]> => {
    const data = await readDataAsync<{ leads: Lead[] }>(leadsPath);
    return data ? data.leads : [];
  },
  ['leads-all'],
  {
    revalidate: 30, // Leads might be more dynamic
    tags: ['leads'],
  }
);

export const getLeadById = nextCache(
  async (id: string): Promise<Lead | undefined> => {
    const leads = await getLeads();
    return leads.find((lead: Lead) => lead.id === id);
  },
  ['lead-by-id'],
  {
    revalidate: 60,
    tags: ['leads'], // Simplified tag
  }
);
// Removed getLeadByIdTag

export async function createLead(lead: Partial<Lead>): Promise<boolean> {
  const data = await readDataAsync<{ leads: Lead[] }>(leadsPath);
  if (!data) return false;

  // Generate an ID if not provided
  if (!lead.id) {
    lead.id = uuidv4();
  }

  // Add timestamp
  lead.createdAt = new Date().toISOString();

  data.leads.push(lead as Lead);
  const success = await writeDataAsync(leadsPath, data);
  if (success) {
    revalidateTag('leads');
  }
  return success;
}

export async function deleteLead(id: string): Promise<boolean> {
  const data = await readDataAsync<{ leads: Lead[] }>(leadsPath);
  if (!data) return false;

  const initialLength = data.leads.length;
  data.leads = data.leads.filter((lead: Lead) => lead.id !== id);

  if (data.leads.length === initialLength) return false;
  const success = await writeDataAsync(leadsPath, data);
  if (success) {
    revalidateTag('leads');
  }
  return success;
}
