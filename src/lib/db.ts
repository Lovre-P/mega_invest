import fs from 'fs';
import path from 'path';
import { writeJSONWithLock, readJSONWithLock } from './db-lock';
import { backupFile } from './backup';
import { InvestmentStatus, Investment, User, Lead } from './db-query';
import { DatabaseError, ErrorCodes, logError } from './error-handler';

// Define the paths to our JSON files
const investmentsPath = path.join(process.cwd(), 'src/data/investments.json');
const usersPath = path.join(process.cwd(), 'src/data/users.json');
const leadsPath = path.join(process.cwd(), 'src/data/leads.json');

// Helper function to read JSON data
export function readData(filePath: string) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      const error = new DatabaseError(
        `File does not exist: ${filePath}`,
        ErrorCodes.DB_READ_ERROR
      );
      logError(error, { filePath });
      return null;
    }

    const data = fs.readFileSync(filePath, 'utf8');

    try {
      return JSON.parse(data);
    } catch (parseError) {
      const error = new DatabaseError(
        `Error parsing JSON from ${filePath}`,
        ErrorCodes.DB_READ_ERROR,
        parseError as Error
      );
      logError(error, { filePath });
      return null;
    }
  } catch (error) {
    const dbError = new DatabaseError(
      `Error reading file from ${filePath}`,
      ErrorCodes.DB_READ_ERROR,
      error as Error
    );
    logError(dbError, { filePath });
    return null;
  }
}

// Helper function to write JSON data
export function writeData(filePath: string, data: any) {
  try {
    // Create a backup before writing
    backupFile(path.basename(filePath));

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    const dbError = new DatabaseError(
      `Error writing file to ${filePath}`,
      ErrorCodes.DB_WRITE_ERROR,
      error as Error
    );
    logError(dbError, { filePath });
    return false;
  }
}

// Async versions using file locking for concurrent access safety
export async function readDataAsync(filePath: string) {
  return await readJSONWithLock(filePath);
}

export async function writeDataAsync(filePath: string, data: any) {
  return await writeJSONWithLock(filePath, data);
}

// Investment functions
export function getInvestments() {
  const data = readData(investmentsPath);
  return data ? data.investments : [];
}

export function getInvestmentById(id: string): Investment | undefined {
  const investments = getInvestments();
  return investments.find((investment: Investment) => investment.id === id);
}

export function createInvestment(investment: Partial<Investment>): boolean {
  const data = readData(investmentsPath);
  if (!data) return false;

  // Generate a slug-like ID if not provided
  if (!investment.id) {
    investment.id = investment.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || '';
  }

  // Add timestamps
  const now = new Date().toISOString();
  investment.createdAt = now;
  investment.updatedAt = now;

  // Set default status if not provided
  if (!investment.status) {
    investment.status = 'Pending';
  }

  data.investments.push(investment);
  return writeData(investmentsPath, data);
}

export function updateInvestment(id: string, updatedInvestment: Partial<Investment>): boolean {
  const data = readData(investmentsPath);
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
  return writeData(investmentsPath, data);
}

export function deleteInvestment(id: string): boolean {
  const data = readData(investmentsPath);
  if (!data) return false;

  const initialLength = data.investments.length;
  data.investments = data.investments.filter((investment: Investment) => investment.id !== id);

  if (data.investments.length === initialLength) return false;
  return writeData(investmentsPath, data);
}

// Investment submission functions
export function submitInvestment(investment: Partial<Investment>, submitterEmail: string): boolean {
  // Set submission metadata
  investment.submittedBy = submitterEmail;
  investment.submittedAt = new Date().toISOString();
  investment.status = 'Pending';

  return createInvestment(investment);
}

export function reviewInvestment(
  id: string,
  status: InvestmentStatus,
  reviewerEmail: string,
  rejectionReason?: string
): boolean {
  const investment = getInvestmentById(id);
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

  return updateInvestment(id, updates);
}

// User functions
export function getUsers() {
  const data = readData(usersPath);
  return data ? data.users : [];
}

export function getUserById(id: string) {
  const users = getUsers();
  return users.find((user: any) => user.id === id);
}

export function getUserByEmail(email: string) {
  const users = getUsers();
  return users.find((user: any) => user.email === email);
}

export function createUser(user: any) {
  const data = readData(usersPath);
  if (!data) return false;

  // Generate an ID if not provided
  if (!user.id) {
    user.id = (data.users.length + 1).toString();
  }

  // Add timestamps
  const now = new Date().toISOString();
  user.createdAt = now;
  user.updatedAt = now;

  data.users.push(user);
  return writeData(usersPath, data);
}

export function updateUser(id: string, updatedUser: any) {
  const data = readData(usersPath);
  if (!data) return false;

  const index = data.users.findIndex((user: any) => user.id === id);
  if (index === -1) return false;

  // Update the timestamp
  updatedUser.updatedAt = new Date().toISOString();
  // Preserve the creation date
  updatedUser.createdAt = data.users[index].createdAt;

  data.users[index] = { ...data.users[index], ...updatedUser };
  return writeData(usersPath, data);
}

export function deleteUser(id: string) {
  const data = readData(usersPath);
  if (!data) return false;

  const initialLength = data.users.length;
  data.users = data.users.filter((user: any) => user.id !== id);

  if (data.users.length === initialLength) return false;
  return writeData(usersPath, data);
}

// Lead functions
export function getLeads() {
  const data = readData(leadsPath);
  return data ? data.leads : [];
}

export function getLeadById(id: string) {
  const leads = getLeads();
  return leads.find((lead: any) => lead.id === id);
}

export function createLead(lead: any) {
  const data = readData(leadsPath);
  if (!data) return false;

  // Generate an ID if not provided
  if (!lead.id) {
    lead.id = (data.leads.length + 1).toString();
  }

  // Add timestamp
  lead.createdAt = new Date().toISOString();

  data.leads.push(lead);
  return writeData(leadsPath, data);
}

export function deleteLead(id: string) {
  const data = readData(leadsPath);
  if (!data) return false;

  const initialLength = data.leads.length;
  data.leads = data.leads.filter((lead: any) => lead.id !== id);

  if (data.leads.length === initialLength) return false;
  return writeData(leadsPath, data);
}
