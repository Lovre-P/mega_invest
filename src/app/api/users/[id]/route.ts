import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/db';
import { 
  logError, 
  DatabaseError, 
  ValidationError, 
  ErrorCodes 
} from '@/lib/error-handler';
import { 
  createErrorResponse, 
  createNotFoundResponse, 
  createBadRequestResponse,
  createSuccessResponse 
} from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const user = await getUserById(id);
    
    if (!user) {
      return createNotFoundResponse(`User with ID ${id} not found`);
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = user;
    
    return createSuccessResponse(
      { user: userWithoutPassword },
      200,
      { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240' }
    );
  } catch (error) {
    logError(error as Error, { context: `Fetching user with ID ${id}` });
    return createErrorResponse(
      new DatabaseError(`Failed to fetch user with ID ${id}`, ErrorCodes.DB_READ_ERROR, error as Error)
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const updatedUser = await request.json();
    
    // Validate required fields
    if (!updatedUser.name || !updatedUser.email || !updatedUser.role) {
      const validationError = new ValidationError(
        'Missing required fields: name, email, and role are required.',
        'name, email, role'
      );
      return createBadRequestResponse(validationError.message);
    }
    
    // Note: updateUser in db.ts does not hash password, assume password is not updatable here
    // or should be handled in a separate endpoint for security.
    // If password can be updated here, it MUST be hashed.
    if (updatedUser.password) {
        // For this refactor, we'll forbid password updates via this general PUT endpoint.
        // A dedicated password change endpoint would be more secure.
        return createBadRequestResponse('Password updates are not allowed via this endpoint. Please use a dedicated password change function.');
    }

    const updatedUserResult = await updateUser(id, updatedUser); // Now returns User | null
    
    if (updatedUserResult) {
      // No need to call getUserById(id) again
      const { password, ...userWithoutPassword } = updatedUserResult;
      return createSuccessResponse({
        message: 'User updated successfully',
        user: userWithoutPassword
      });
    } else {
      // This could be DB_NOT_FOUND if the item wasn't there, or DB_WRITE_ERROR if update itself failed
      // updateUser now returns null if user not found or write failed.
      return createErrorResponse(
        new DatabaseError(`User not found or update failed for ID: ${id}`, ErrorCodes.DB_WRITE_ERROR)
      );
    }
  } catch (error) {
    logError(error as Error, { context: `Updating user with ID ${id}` });
     if (error instanceof SyntaxError) { // Error parsing JSON
        return createBadRequestResponse('Invalid JSON payload');
    }
    return createErrorResponse(
      new DatabaseError(`Failed to update user with ID ${id}`, ErrorCodes.DB_WRITE_ERROR, error as Error)
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const success = await deleteUser(id);
    
    if (success) {
      return createSuccessResponse({ message: `User with ID ${id} deleted successfully` });
    } else {
      return createNotFoundResponse(`User with ID ${id} not found or delete failed`);
    }
  } catch (error) {
    logError(error as Error, { context: `Deleting user with ID ${id}` });
    return createErrorResponse(
      new DatabaseError(`Failed to delete user with ID ${id}`, ErrorCodes.DB_DELETE_ERROR, error as Error)
    );
  }
}
