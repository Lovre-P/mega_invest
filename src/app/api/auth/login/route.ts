import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Authenticate user
    const user = await authenticateUser(email, password);
    
    if (user) {
      // Set session cookie
      await setSessionCookie(user);
      
      // Return success response (user object without password is handled by authenticateUser)
      return NextResponse.json({
        message: 'Login successful',
        user // This user object from authenticateUser already excludes the password
      });
    } else {
      // Authentication failed
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error during login:', error);
    // General error for unexpected issues
    return NextResponse.json(
      { error: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
