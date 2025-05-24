import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { 
  logError, 
  DatabaseError, 
  ValidationError, 
  ErrorCodes 
} from '@/lib/error-handler';
import { 
  createErrorResponse, 
  createBadRequestResponse, 
  createConflictResponse,
  createSuccessResponse 
} from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const users = await getUsers();

    // Get admin email from .env
    const adminEmail = process.env.ADMIN_EMAIL;

    // Filter out users that match the admin email from .env
    const filteredUsers = adminEmail
      ? users.filter((user: any) => user.email !== adminEmail)
      : users;

    // Remove passwords from the response
    const usersWithoutPasswords = filteredUsers.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return createSuccessResponse({ users: usersWithoutPasswords });
  } catch (error) {
    logError(error as Error, { context: 'Fetching all users' });
    return createErrorResponse(
      new DatabaseError('Failed to fetch users', ErrorCodes.DB_READ_ERROR, error as Error)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await request.json();

    // Validate required fields
    if (!user.name || !user.email || !user.password || !user.role) {
      const validationError = new ValidationError(
        'Missing required fields: name, email, password, and role are required.',
        'name, email, password, role'
      );
      return createBadRequestResponse(validationError.message);
    }

    // Get admin email from .env
    const adminEmail = process.env.ADMIN_EMAIL;

    // Prevent creating a user with the same email as the admin in .env
    if (adminEmail && user.email === adminEmail) {
      return createConflictResponse('Cannot create a user with the admin email address.');
    }

    // Check if email already exists
    const existingUsers = await getUsers(); // This could throw, caught by outer catch
    const emailExists = existingUsers.some((existingUser: any) =>
      existingUser.email === user.email
    );

    if (emailExists) {
      return createConflictResponse(`User with email ${user.email} already exists.`);
    }

    // Hash the password
    const hashedPassword = await hashPassword(user.password);
    const userToCreate = { ...user, password: hashedPassword };

    const success = await createUser(userToCreate);

    if (success) {
      // Remove password from the response object
      const { password, ...userWithoutPassword } = userToCreate;
      return createSuccessResponse(
        { message: 'User created successfully', user: userWithoutPassword },
        201
      );
    } else {
      // This path might be hard to reach if createUser throws an error on failure,
      // but if it returns false for other reasons, this is a fallback.
      return createErrorResponse(
        new DatabaseError('Failed to create user', ErrorCodes.DB_WRITE_ERROR)
      );
    }
  } catch (error) {
    logError(error as Error, { context: 'Creating new user' });
    if (error instanceof SyntaxError) { // Error parsing JSON
        return createBadRequestResponse('Invalid JSON payload');
    }
    // Generic error for other issues (e.g. getUsers failed, createUser threw an unexpected error)
    return createErrorResponse(
      new DatabaseError('Failed to create user due to an unexpected error', ErrorCodes.DB_WRITE_ERROR, error as Error)
    );
  }
}
