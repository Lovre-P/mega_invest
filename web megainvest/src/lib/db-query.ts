import { readData } from './db';
import path from 'path';

// Define the paths to our JSON files
const investmentsPath = path.join(process.cwd(), 'src/data/investments.json');
const usersPath = path.join(process.cwd(), 'src/data/users.json');
const leadsPath = path.join(process.cwd(), 'src/data/leads.json');

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

/**
 * Get investments filtered by status
 * @param status The status to filter by (optional)
 * @returns Array of investments matching the status, or all investments if no status provided
 */
export function getInvestmentsByStatus(status?: InvestmentStatus): Investment[] {
  const data = readData(investmentsPath);
  if (!data) return [];

  const investments = data.investments as Investment[];

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
export function getInvestmentsBySubmitter(email: string): Investment[] {
  const data = readData(investmentsPath);
  if (!data) return [];

  const investments = data.investments as Investment[];

  return investments.filter(investment => investment.submittedBy === email);
}

/**
 * Get investments reviewed by a specific admin
 * @param email The email of the admin who reviewed the investments
 * @returns Array of investments reviewed by the admin
 */
export function getInvestmentsByReviewer(email: string): Investment[] {
  const data = readData(investmentsPath);
  if (!data) return [];

  const investments = data.investments as Investment[];

  return investments.filter(investment => investment.reviewedBy === email);
}

/**
 * Get investments by category
 * @param category The category to filter by
 * @returns Array of investments in the specified category
 */
export function getInvestmentsByCategory(category: string): Investment[] {
  const data = readData(investmentsPath);
  if (!data) return [];

  const investments = data.investments as Investment[];

  return investments.filter(investment => investment.category === category);
}

/**
 * Get investments by risk level
 * @param risk The risk level to filter by
 * @returns Array of investments with the specified risk level
 */
export function getInvestmentsByRisk(risk: string): Investment[] {
  const data = readData(investmentsPath);
  if (!data) return [];

  const investments = data.investments as Investment[];

  return investments.filter(investment => investment.risk === risk);
}

/**
 * Get investments created after a specific date
 * @param date The date to filter by
 * @returns Array of investments created after the specified date
 */
export function getInvestmentsCreatedAfter(date: Date): Investment[] {
  const data = readData(investmentsPath);
  if (!data) return [];

  const investments = data.investments as Investment[];

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
export function searchInvestments(searchTerm: string): Investment[] {
  const data = readData(investmentsPath);
  if (!data) return [];

  const investments = data.investments as Investment[];
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
export function getUsersByRole(role: string): User[] {
  const data = readData(usersPath);
  if (!data) return [];

  const users = data.users as User[];

  return users.filter(user => user.role === role);
}

/**
 * Search users by name or email
 * @param searchTerm The term to search for
 * @returns Array of users matching the search term
 */
export function searchUsers(searchTerm: string): User[] {
  const data = readData(usersPath);
  if (!data) return [];

  const users = data.users as User[];
  const term = searchTerm.toLowerCase();

  return users.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  );
}
