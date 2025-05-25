import { NextRequest, NextResponse } from 'next/server';
import { getLeadById, deleteLead } from '@/lib/db';
import { 
  logError, 
  DatabaseError, 
  ErrorCodes 
} from '@/lib/error-handler';
import { 
  createErrorResponse, 
  createNotFoundResponse, 
  createSuccessResponse 
} from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const lead = await getLeadById(id);
    
    if (!lead) {
      return createNotFoundResponse(`Lead with ID ${id} not found`);
    }
    
    return createSuccessResponse(
      { lead },
      200,
      { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    );
  } catch (error) {
    logError(error as Error, { context: `Fetching lead with ID ${id}` });
    return createErrorResponse(
      new DatabaseError(`Failed to fetch lead with ID ${id}`, ErrorCodes.DB_READ_ERROR, error as Error)
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const success = await deleteLead(id);
    
    if (success) {
      return createSuccessResponse({ message: `Lead with ID ${id} deleted successfully` });
    } else {
      // Assuming if deleteLead returns false, the lead was not found.
      return createNotFoundResponse(`Lead with ID ${id} not found or delete failed`);
    }
  } catch (error) {
    logError(error as Error, { context: `Deleting lead with ID ${id}` });
    return createErrorResponse(
      new DatabaseError(`Failed to delete lead with ID ${id}`, ErrorCodes.DB_DELETE_ERROR, error as Error)
    );
  }
}
