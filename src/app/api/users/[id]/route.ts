import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const user = getUserById(id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error(`Error fetching user with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updatedUser = await request.json();
    
    // Validate required fields
    if (!updatedUser.name || !updatedUser.email || !updatedUser.role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const success = updateUser(id, updatedUser);
    
    if (success) {
      // Get the updated user
      const user = getUserById(id);
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return NextResponse.json({
        message: 'User updated successfully',
        user: userWithoutPassword
      });
    } else {
      return NextResponse.json(
        { error: 'User not found or update failed' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error updating user with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const success = deleteUser(id);
    
    if (success) {
      return NextResponse.json(
        { message: 'User deleted successfully' }
      );
    } else {
      return NextResponse.json(
        { error: 'User not found or delete failed' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error deleting user with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
