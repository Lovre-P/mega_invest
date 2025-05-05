import fs from 'fs';
import path from 'path';

// Define the paths to our JSON files
const investmentsPath = path.join(process.cwd(), 'src/data/investments.json');
const usersPath = path.join(process.cwd(), 'src/data/users.json');
const leadsPath = path.join(process.cwd(), 'src/data/leads.json');

// Helper function to read JSON data
export function readData(filePath: string) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file from ${filePath}:`, error);
    return null;
  }
}

// Helper function to write JSON data
export function writeData(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file to ${filePath}:`, error);
    return false;
  }
}

// Investment functions
export function getInvestments() {
  const data = readData(investmentsPath);
  return data ? data.investments : [];
}

export function getInvestmentById(id: string) {
  const investments = getInvestments();
  return investments.find((investment: any) => investment.id === id);
}

export function createInvestment(investment: any) {
  const data = readData(investmentsPath);
  if (!data) return false;

  // Generate a slug-like ID if not provided
  if (!investment.id) {
    investment.id = investment.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Add timestamps
  const now = new Date().toISOString();
  investment.createdAt = now;
  investment.updatedAt = now;

  data.investments.push(investment);
  return writeData(investmentsPath, data);
}

export function updateInvestment(id: string, updatedInvestment: any) {
  const data = readData(investmentsPath);
  if (!data) return false;

  const index = data.investments.findIndex((investment: any) => investment.id === id);
  if (index === -1) return false;

  // Update the timestamp
  updatedInvestment.updatedAt = new Date().toISOString();
  // Preserve the creation date
  updatedInvestment.createdAt = data.investments[index].createdAt;

  data.investments[index] = { ...data.investments[index], ...updatedInvestment };
  return writeData(investmentsPath, data);
}

export function deleteInvestment(id: string) {
  const data = readData(investmentsPath);
  if (!data) return false;

  const initialLength = data.investments.length;
  data.investments = data.investments.filter((investment: any) => investment.id !== id);

  if (data.investments.length === initialLength) return false;
  return writeData(investmentsPath, data);
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
