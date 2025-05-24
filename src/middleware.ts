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

    // Always check for admin role first.
    if (!typedPayload || typedPayload.role !== 'admin') {
      return false;
    }

    // Get admin email from .env
    const adminEmail = process.env.ADMIN_EMAIL;

    // If ADMIN_EMAIL is set, the token must match all admin criteria
    if (adminEmail) {
      return (
        typedPayload.email === adminEmail &&
        typedPayload.id === 'admin' &&
        typedPayload.role === 'admin' // This is redundant due to the check above, but good for clarity
      );
    } else {
      // If ADMIN_EMAIL is not set, no admin functionality via token is considered valid.
      // This makes the system secure by default if env vars are missing for admin.
      console.warn(
        'Admin token validation attempted, but ADMIN_EMAIL is not set in environment variables. Token will be considered invalid for admin routes.'
      );
      return false;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

// This function needs to be async to use JWT verification
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Define protected API routes and their methods
  // This can be more sophisticated, e.g., using a map or regex
  const protectedApiRoutes = [
    { pathPrefix: '/api/users', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
    { pathPrefix: '/api/investments', methods: ['POST', 'PUT', 'DELETE'] }, // GET is public
    { pathPrefix: '/api/investments/[id]/images', methods: ['POST', 'DELETE'] }, // Assuming specific image routes
    { pathPrefix: '/api/leads', methods: ['POST', 'DELETE'] }, // GET is public
  ];

  for (const route of protectedApiRoutes) {
    if (path.startsWith(route.pathPrefix) && route.methods.includes(method)) {
      const sessionCookie = request.cookies.get('session');
      if (!sessionCookie) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const isValidToken = await verifyToken(sessionCookie.value);
      if (!isValidToken) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      // If token is valid, proceed to the API route. Security headers added later.
      break; // Found and handled the protected API route
    }
  }
  
  // Check if the path is for UI admin routes (except the login page itself)
  if (path.startsWith('/admin') && !path.startsWith('/api') && path !== '/admin') { // Ensure it's not an API route and not the login page
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin', request.url)); // Redirect to login page
    }

    const isValidToken = await verifyToken(sessionCookie.value);
    if (!isValidToken) {
      return NextResponse.redirect(new URL('/admin', request.url)); // Redirect to login page
    }
    
    // For UI admin routes, if token is valid, allow access. Security headers added later.
  }

  // Add security headers to all responses that are not an early exit (redirect or JSON error)
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
    '/admin/:path*',           // Existing admin UI routes
    '/api/investments/:path*', // All investment modification and image routes
    '/api/users/:path*',       // All user routes
    '/api/leads/:path*',       // All lead modification routes
    // Note: GET /api/investments (list) and GET /api/leads (list) are public.
    // The middleware logic checks request.method for these.
  ],
};
