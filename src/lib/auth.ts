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
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@megainvest.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

    if (email === adminEmail && password === adminPassword) {
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

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) return null;

    // For existing users in the JSON file (which have plain text passwords)
    // In a real app, all passwords would be hashed
    const passwordMatches = user.password === password;

    if (passwordMatches) {
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

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

  // Use a different approach to set the cookie
  const cookieStore = cookies();
  cookieStore.set('session', token, {
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
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) return null;

  // Verify the JWT token
  return await verifyJWT(sessionCookie.value);
}

/**
 * Clear the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete('session');
}
