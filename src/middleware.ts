import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
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
    
    // In a real app, you would verify the session token here
    // For now, we'll just check if it exists
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all admin routes except the login page
    '/admin/:path*',
  ],
};
