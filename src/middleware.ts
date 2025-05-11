import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define the expected payload structure
interface JWTPayload {
  id?: string;
  email?: string;
  role?: string;
  [key: string]: any; // Allow for other properties
}

// Verify JWT token
async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development_only'
    );

    const { payload } = await jwtVerify(token, secret);

    // Cast the payload to our expected type
    const typedPayload = payload as JWTPayload;

    // Check if the token has a valid role (admin)
    if (!typedPayload || typedPayload.role !== 'admin') {
      return false;
    }

    // Get admin email from .env
    const adminEmail = process.env.ADMIN_EMAIL;

    // If admin email is set in .env, ONLY allow that admin
    if (adminEmail) {
      // Only allow the admin from .env file
      return typedPayload.email === adminEmail && typedPayload.id === 'admin';
    }

    // FALLBACK: If no admin email is set in .env, allow any admin from users.json
    // This is only used if you haven't set up an admin in .env
    return Boolean(typedPayload.id && typedPayload.email && typedPayload.role === 'admin');
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

// This function needs to be async to use JWT verification
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is for admin routes (except the login page)
  if (path.startsWith('/admin') && path !== '/admin') {
    // Check if the user is authenticated
    const sessionCookie = request.cookies.get('session');

    // If no session cookie, redirect to login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Verify the JWT token
    const isValidToken = await verifyToken(sessionCookie.value);

    if (!isValidToken) {
      // If token is invalid, redirect to login
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Add a header to indicate the user is authenticated
    const response = NextResponse.next();
    response.headers.set('x-authenticated', 'true');
    return response;
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Add basic security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all admin routes except the login page
    '/admin/:path*',
  ],
};
