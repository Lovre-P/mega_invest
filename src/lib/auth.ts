import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { User } from './db-query';
import { getUserByEmail } from './server-db';
import { SignJWT, jwtVerify } from 'jose';

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password
 * @returns Boolean indicating if passwords match
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Authenticate a user with email and password
 * @param email User email
 * @param password User password
 * @returns User object without password if authentication successful, null otherwise
 */
export async function authenticateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
  try {
    // Check if it's the admin user from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // ONLY authenticate with .env credentials if they exist
    // This is the only way to log in as admin
    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      // Create a mock admin user
      const adminUser: Omit<User, 'password'> = {
        id: 'admin',
        name: 'Admin User',
        email: adminEmail,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return adminUser;
    }

    // If admin email is set in .env, we don't allow any other admin logins
    // This ensures only the admin from .env can log in
    if (adminEmail) {
      // If ADMIN_EMAIL is set, but the provided credentials didn't match,
      // then authentication fails. No fallback is attempted.
      return null;
    }

    // If ADMIN_EMAIL is not set in the environment, authentication is not possible.
    // This effectively means the admin user must be configured via .env variables.
    // (The old fallback to users.json is removed.)
    console.warn('Admin authentication attempted, but ADMIN_EMAIL is not set in environment variables. Authentication will fail.');
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

/**
 * Create a JWT token for the authenticated user
 * @param user User object
 * @returns JWT token
 */
export async function createJWT(user: Omit<User, 'password'>): Promise<string> {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_for_development_only'
  );

  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token expires in 24 hours
    .sign(secret);

  return token;
}

/**
 * Verify a JWT token
 * @param token JWT token
 * @returns Payload if token is valid, null otherwise
 */
export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development_only'
    );

    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
}

/**
 * Set a session cookie for the authenticated user
 * @param user User object
 */
export async function setSessionCookie(user: Omit<User, 'password'>): Promise<void> {
  // Create a JWT token
  const token = await createJWT(user);

  // Set the cookie using the correct API for Next.js 15
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

/**
 * Get the current user from the session cookie
 * @returns User payload if session exists and is valid, null otherwise
 */
export async function getSessionUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) return null;

  // Verify the JWT token
  return await verifyJWT(sessionCookie.value);
}

/**
 * Clear the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
