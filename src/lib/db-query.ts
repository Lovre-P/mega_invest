// import { readData } from './db'; // No longer used
// import path from 'path'; // No longer used

// Data paths are now handled by functions imported from './db'

// Import the actual data access functions from db.ts
import { 
  getInvestments as dbGetInvestments, 
  getUsers as dbGetUsers 
  // getLeads as dbGetLeads // If needed for future lead query functions
} from './db';

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
  images?: string[];
  mainImageId?: string;
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

/**
 * Get investments filtered by status
 * @param status The status to filter by (optional)
 * @returns Array of investments matching the status, or all investments if no status provided
 */
export async function getInvestmentsByStatus(status?: InvestmentStatus): Promise<Investment[]> {
  const investments = await dbGetInvestments();
  // dbGetInvestments returns [] if data is null or investments array is missing.
  if (!status) {
    return investments;
  }
  return investments.filter(investment => investment.status === status);
}

/**
 * Get investments submitted by a specific user
 * @param email The email of the user who submitted the investments
 * @returns Array of investments submitted by the user
 */
export async function getInvestmentsBySubmitter(email: string): Promise<Investment[]> {
  const investments = await dbGetInvestments();
  return investments.filter(investment => investment.submittedBy === email);
}

/**
 * Get investments reviewed by a specific admin
 * @param email The email of the admin who reviewed the investments
 * @returns Array of investments reviewed by the admin
 */
export async function getInvestmentsByReviewer(email: string): Promise<Investment[]> {
  const investments = await dbGetInvestments();
  return investments.filter(investment => investment.reviewedBy === email);
}

/**
 * Get investments by category
 * @param category The category to filter by
 * @returns Array of investments in the specified category
 */
export async function getInvestmentsByCategory(category: string): Promise<Investment[]> {
  const investments = await dbGetInvestments();
  return investments.filter(investment => investment.category === category);
}

/**
 * Get investments by risk level
 * @param risk The risk level to filter by
 * @returns Array of investments with the specified risk level
 */
export async function getInvestmentsByRisk(risk: string): Promise<Investment[]> {
  const investments = await dbGetInvestments();
  return investments.filter(investment => investment.risk === risk);
}

/**
 * Get investments created after a specific date
 * @param date The date to filter by
 * @returns Array of investments created after the specified date
 */
export async function getInvestmentsCreatedAfter(date: Date): Promise<Investment[]> {
  const investments = await dbGetInvestments();
  return investments.filter(investment => {
    const createdAt = new Date(investment.createdAt);
    return createdAt > date;
  });
}

/**
 * Search investments by title or description
 * @param searchTerm The term to search for
 * @returns Array of investments matching the search term
 */
export async function searchInvestments(searchTerm: string): Promise<Investment[]> {
  const investments = await dbGetInvestments();
  const term = searchTerm.toLowerCase();
  return investments.filter(investment =>
    investment.title.toLowerCase().includes(term) ||
    investment.description.toLowerCase().includes(term) ||
    investment.detailedDescription.toLowerCase().includes(term)
  );
}

/**
 * Get users by role
 * @param role The role to filter by
 * @returns Array of users with the specified role
 */
export async function getUsersByRole(role: string): Promise<User[]> {
  const users = await dbGetUsers();
  return users.filter(user => user.role === role);
}

/**
 * Search users by name or email
 * @param searchTerm The term to search for
 * @returns Array of users matching the search term
 */
export async function searchUsers(searchTerm: string): Promise<User[]> {
  const users = await dbGetUsers();
  const term = searchTerm.toLowerCase();
  return users.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  );
}
