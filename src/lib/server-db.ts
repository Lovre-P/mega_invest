'use server';

// This file contains server-side only code

import type { InvestmentStatus, Investment, User } from '@/lib/db-query';
// Import the refactored async functions from db.ts
import {
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
}

export async function updateInvestment(id: string, updatedInvestment: Partial<Investment>): Promise<boolean> {
  // Timestamp and metadata logic is in dbUpdateInvestment in db.ts
  return dbUpdateInvestment(id, updatedInvestment);
}

export async function deleteInvestment(id: string): Promise<boolean> {
  return dbDeleteInvestment(id);
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
