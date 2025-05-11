'use server';

// This file contains server-side only code
// We'll use dynamic imports for fs and path to avoid client-side errors

import type { InvestmentStatus, Investment, User, Lead } from '@/lib/db-query';

// Define the paths to our JSON files - these will be resolved at runtime
let investmentsPath: string;
let usersPath: string;
let leadsPath: string;

// Initialize paths function - will be called at runtime
async function initPaths() {
  const { join } = await import('path');
  const cwd = process.cwd();

  investmentsPath = join(cwd, 'src/data/investments.json');
  usersPath = join(cwd, 'src/data/users.json');
  leadsPath = join(cwd, 'src/data/leads.json');
}

// Define types for better type safety
export type InvestmentStatus = 'Active' | 'Inactive' | 'Pending' | 'Rejected' | 'Draft';

export interface Investment {
  id: string;
  title: string;
  description: string;
  expectedReturn: string;
  minimumInvestment: string;
  category: string;
  risk: string;
  status: InvestmentStatus;
  detailedDescription: string;
  createdAt: string;
  updatedAt: string;
  submittedBy?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  investmentInterest: string;
  message: string;
  createdAt: string;
}

// Helper function to read JSON data
async function readData(filePath: string) {
  try {
    // Dynamically import fs
    const fs = await import('fs');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return null;
    }

    const data = fs.readFileSync(filePath, 'utf8');

    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error(`Error parsing JSON from ${filePath}:`, parseError);
      return null;
    }
  } catch (error) {
    console.error(`Error reading file from ${filePath}:`, error);
    return null;
  }
}

// Helper function to write JSON data
async function writeData(filePath: string, data: any) {
  try {
    // Dynamically import fs and path
    const fs = await import('fs');
    const path = await import('path');

    // Create a backup before writing
    if (fs.existsSync(filePath)) {
      const backupPath = `${filePath}.bak`;
      fs.copyFileSync(filePath, backupPath);
    }

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file to ${filePath}:`, error);
    return false;
  }
}

// Investment functions
export async function getInvestments(): Promise<Investment[]> {
  // Make sure paths are initialized
  await initPaths();

  const data = await readData(investmentsPath);
  return data ? data.investments : [];
}

export async function getInvestmentById(id: string): Promise<Investment | undefined> {
  const investments = await getInvestments();
  return investments.find((investment: Investment) => investment.id === id);
}

export async function getInvestmentsByStatus(status: InvestmentStatus): Promise<Investment[]> {
  const investments = await getInvestments();
  return investments.filter((investment: Investment) => investment.status === status);
}

export async function createInvestment(investment: Partial<Investment>): Promise<boolean> {
  // Make sure paths are initialized
  await initPaths();

  const data = await readData(investmentsPath);
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
  return await writeData(investmentsPath, data);
}

export async function updateInvestment(id: string, updatedInvestment: Partial<Investment>): Promise<boolean> {
  // Make sure paths are initialized
  await initPaths();

  const data = await readData(investmentsPath);
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
  return await writeData(investmentsPath, data);
}

export async function deleteInvestment(id: string): Promise<boolean> {
  // Make sure paths are initialized
  await initPaths();

  const data = await readData(investmentsPath);
  if (!data) return false;

  const initialLength = data.investments.length;
  data.investments = data.investments.filter((investment: Investment) => investment.id !== id);

  if (data.investments.length === initialLength) return false;
  return await writeData(investmentsPath, data);
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
  // Make sure paths are initialized
  await initPaths();

  const data = await readData(usersPath);
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
