import fs from 'fs';
import path from 'path';
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
export async function getInvestments(): Promise<Investment[]> {
  const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  return data ? data.investments : [];
}

export async function getInvestmentById(id: string): Promise<Investment | undefined> {
  const investments = await getInvestments();
  return investments.find((investment: Investment) => investment.id === id);
}

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
  return await writeDataAsync(investmentsPath, data);
}

export async function updateInvestment(id: string, updatedInvestment: Partial<Investment>): Promise<boolean> {
  const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  if (!data) return false;

  const index = data.investments.findIndex((investment: Investment) => investment.id === id);
  if (index === -1) return false;

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

  data.investments[index] = { ...data.investments[index], ...updatedInvestment };
  return await writeDataAsync(investmentsPath, data);
}

export async function deleteInvestment(id: string): Promise<boolean> {
  const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  if (!data) return false;

  const initialLength = data.investments.length;
  data.investments = data.investments.filter((investment: Investment) => investment.id !== id);

  if (data.investments.length === initialLength) return false;
  return await writeDataAsync(investmentsPath, data);
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
export async function getUsers(): Promise<User[]> {
  const data = await readDataAsync<{ users: User[] }>(usersPath);
  return data ? data.users : [];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((user: User) => user.id === id);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((user: User) => user.email === email);
}

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
  return await writeDataAsync(usersPath, data);
}

export async function updateUser(id: string, updatedUser: Partial<User>): Promise<boolean> {
  const data = await readDataAsync<{ users: User[] }>(usersPath);
  if (!data) return false;

  const index = data.users.findIndex((user: User) => user.id === id);
  if (index === -1) return false;

  // Update the timestamp
  updatedUser.updatedAt = new Date().toISOString();
  // Preserve the creation date
  updatedUser.createdAt = data.users[index].createdAt;

  data.users[index] = { ...data.users[index], ...updatedUser };
  return await writeDataAsync(usersPath, data);
}

export async function deleteUser(id: string): Promise<boolean> {
  const data = await readDataAsync<{ users: User[] }>(usersPath);
  if (!data) return false;

  const initialLength = data.users.length;
  data.users = data.users.filter((user: User) => user.id !== id);

  if (data.users.length === initialLength) return false;
  return await writeDataAsync(usersPath, data);
}

// Lead functions
export async function getLeads(): Promise<Lead[]> {
  const data = await readDataAsync<{ leads: Lead[] }>(leadsPath);
  return data ? data.leads : [];
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  const leads = await getLeads();
  return leads.find((lead: Lead) => lead.id === id);
}

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
  return await writeDataAsync(leadsPath, data);
}

export async function deleteLead(id: string): Promise<boolean> {
  const data = await readDataAsync<{ leads: Lead[] }>(leadsPath);
  if (!data) return false;

  const initialLength = data.leads.length;
  data.leads = data.leads.filter((lead: Lead) => lead.id !== id);

  if (data.leads.length === initialLength) return false;
  return await writeDataAsync(leadsPath, data);
}
