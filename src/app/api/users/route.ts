import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const users = getUsers();
    
    // Remove passwords from the response
    const usersWithoutPasswords = users.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return NextResponse.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await request.json();
    
    // Validate required fields
    if (!user.name || !user.email || !user.password || !user.role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUsers = getUsers();
    const emailExists = existingUsers.some((existingUser: any) => 
      existingUser.email === user.email
    );
    
    if (emailExists) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    const success = createUser(user);
    
    if (success) {
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return NextResponse.json(
        { 
          message: 'User created successfully',
          user: userWithoutPassword
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
