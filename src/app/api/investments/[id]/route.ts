import { NextRequest, NextResponse } from 'next/server';
import { getInvestmentById, updateInvestment, deleteInvestment } from '@/lib/db';
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
  createSuccessResponse // For successful PUT/DELETE
} from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params; // Resolve promise outside try-catch for id access in catch
  const id = resolvedParams.id;
  try {
    const investment = await getInvestmentById(id);

    if (!investment) {
      return createNotFoundResponse('Investment not found');
    }

    return createSuccessResponse(
      { investment },
      200,
      { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240' }
    );
  } catch (error) {
    logError(error as Error, { context: `Fetching investment ${id}` });
    return createErrorResponse(
      new DatabaseError(`Failed to fetch investment: ${id}`, ErrorCodes.DB_READ_ERROR, error as Error)
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  try {
    const updatedInvestment = await request.json();

    // Validate required fields
    if (!updatedInvestment.title || !updatedInvestment.description || !updatedInvestment.category) {
      const validationError = new ValidationError('Missing required fields: title, description, category are required.');
      return createBadRequestResponse(validationError.message);
    }

    const updatedInvestmentResult = await updateInvestment(id, updatedInvestment); // Now returns Investment | null

    if (updatedInvestmentResult) {
      // Optionally, can return the updated investment data in the response
      return createSuccessResponse({ 
        message: 'Investment updated successfully', 
        investment: updatedInvestmentResult 
      });
    } else {
      // This could be DB_NOT_FOUND if the item wasn't there, or DB_WRITE_ERROR if update itself failed
      // For simplicity, using DB_WRITE_ERROR as the primary assumption for a failed update operation
      // updateInvestment now returns null if not found or write failed.
      return createErrorResponse(
        new DatabaseError(`Investment not found or update failed for ID: ${id}`, ErrorCodes.DB_WRITE_ERROR)
      );
    }
  } catch (error) {
    logError(error as Error, { context: `Updating investment ${id}` });
    return createErrorResponse(
      new DatabaseError(`Failed to update investment: ${id}`, ErrorCodes.DB_WRITE_ERROR, error as Error)
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  try {
    const success = await deleteInvestment(id);

    if (success) {
      return createSuccessResponse({ message: 'Investment deleted successfully' });
    } else {
      return createNotFoundResponse(`Investment not found or delete failed for ID: ${id}`);
    }
  } catch (error) {
    logError(error as Error, { context: `Deleting investment ${id}` });
    return createErrorResponse(
      new DatabaseError(`Failed to delete investment: ${id}`, ErrorCodes.DB_DELETE_ERROR, error as Error)
    );
  }
}
