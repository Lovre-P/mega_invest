'use server';

// This file contains server-side only code

import type { InvestmentStatus, Investment, User, Lead } from '@/lib/db-query';
// Import the refactored async functions from db.ts
import { 
  readDataAsync, 
  writeDataAsync,
  getInvestments as dbGetInvestments,
  getInvestmentById as dbGetInvestmentById,
  createInvestment as dbCreateInvestment,
  updateInvestment as dbUpdateInvestment,
  deleteInvestment as dbDeleteInvestment,
  getUsers as dbGetUsers,
  getUserById as dbGetUserById,
  getUserByEmail as dbGetUserByEmail,
  // createUser, updateUser, deleteUser, getLeads, getLeadById, createLead, deleteLead are not directly used by server-db.ts, 
  // but if they were, they'd be imported and wrapped here too.
} from './db'; 
import path from 'path'; // db.ts expects full paths, so server-db will construct them

// Define types for better type safety - these are already defined in db-query.ts, so we can re-export or rely on that
// For clarity, we can keep them here if server-db is meant to be a standalone interface layer
// export type InvestmentStatus = 'Active' | 'Pending' | 'Rejected' | 'Draft'; // from db-query

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

// export interface User { ... } // from db-query
// export interface Lead { ... } // from db-query


// Construct paths here, as db.ts functions expect full file paths
const investmentsPath = path.join(process.cwd(), 'src/data/investments.json');
const usersPath = path.join(process.cwd(), 'src/data/users.json');
// const leadsPath = path.join(process.cwd(), 'src/data/leads.json'); // Not used by server-db functions directly

// Investment functions
// These now wrap the functions from db.ts, which handle locking.
// server-db.ts primarily acts as a server-side API layer.

export async function getInvestments(): Promise<Investment[]> {
  return dbGetInvestments();
}

export async function getInvestmentById(id: string): Promise<Investment | undefined> {
  return dbGetInvestmentById(id);
}

export async function getInvestmentsByStatus(status: InvestmentStatus): Promise<Investment[]> {
  const investments = await dbGetInvestments(); // Use the wrapper
  return investments.filter((investment: Investment) => investment.status === status);
}

export async function createInvestment(investment: Partial<Investment>): Promise<boolean> {
  // The logic for ID generation, timestamps, and default status 
  // is already in dbCreateInvestment in db.ts.
  // If server-db needs to add specific logic BEFORE calling db.ts, it can do so here.
  // For now, it's a direct pass-through.
  return dbCreateInvestment(investment);

  // Example of how it was before, now handled by db.ts:
  // const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  // if (!data) return false;
  //
  // // Generate a slug-like ID if not provided
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

  // data.investments.push(investment as Investment);
  // return await writeDataAsync(investmentsPath, data);
}

export async function updateInvestment(id: string, updatedInvestment: Partial<Investment>): Promise<boolean> {
  // Timestamp and metadata logic is in dbUpdateInvestment in db.ts
  return dbUpdateInvestment(id, updatedInvestment);

  // Example of how it was before, now handled by db.ts:
  // const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  // if (!data) return false;
  //
  // const index = data.investments.findIndex((investment: Investment) => investment.id === id);
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

  // data.investments[index] = { ...data.investments[index], ...updatedInvestment };
  // return await writeDataAsync(investmentsPath, data);
}

export async function deleteInvestment(id: string): Promise<boolean> {
  return dbDeleteInvestment(id);
  
  // Example of how it was before, now handled by db.ts:
  // const data = await readDataAsync<{ investments: Investment[] }>(investmentsPath);
  // if (!data) return false;
  //
  // const initialLength = data.investments.length;
  // data.investments = data.investments.filter((investment: Investment) => investment.id !== id);
  //
  // if (data.investments.length === initialLength) return false;
  // return await writeDataAsync(investmentsPath, data);
}

// Investment submission functions
// This function adds business logic (setting submission metadata) before calling createInvestment
export async function submitInvestment(investment: Partial<Investment>, submitterEmail: string): Promise<boolean> {
  // Set submission metadata
  investment.submittedBy = submitterEmail;
  investment.submittedAt = new Date().toISOString();
  investment.status = 'Pending';

  // Calls the createInvestment wrapper, which calls dbCreateInvestment
  return await createInvestment(investment); 
}

// This function adds business logic before calling updateInvestment
export async function reviewInvestment(
  id: string,
  status: InvestmentStatus,
  reviewerEmail: string,
  rejectionReason?: string
): Promise<boolean> {
  // getInvestmentById is already a wrapper for dbGetInvestmentById
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

  // updateInvestment is already a wrapper for dbUpdateInvestment
  return await updateInvestment(id, updates); 
}

// User functions
// These are now wrappers for functions from db.ts
export async function getUsers(): Promise<User[]> {
  return dbGetUsers();
}

export async function getUserById(id: string): Promise<User | undefined> {
  return dbGetUserById(id);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  // This function is used by auth.ts
  return dbGetUserByEmail(email);
}
