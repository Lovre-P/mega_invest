import { NextRequest } from 'next/server';
import { getLeads, createLead } from '@/lib/db';
import {
  createSuccessResponse,
  createErrorResponse,
  createBadRequestResponse
} from '@/lib/api-response';
import { 
  logError, 
  DatabaseError, 
  ValidationError, 
  ErrorCodes 
} from '@/lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    const leads = await getLeads();
    return createSuccessResponse({ leads });
  } catch (error) {
    logError(error as Error, { context: 'Fetching all leads' });
    return createErrorResponse(
      new DatabaseError('Failed to fetch leads', ErrorCodes.DB_READ_ERROR, error as Error)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const lead = await request.json();

    // Validate required fields
    if (!lead.name || !lead.email || !lead.message) {
      const validationError = new ValidationError(
        'Missing required fields: name, email, and message are required.',
        'name, email, message' // Optional: can specify which fields, or a general message
      );
      return createBadRequestResponse(validationError.message);
    }

    // Note: createLead in db.ts generates id and createdAt
    const success = await createLead(lead);

    if (success) {
      // It's better if createLead returns the created object or its ID
      // For now, we'll return a generic success message as the ID might not be easily available here
      // without re-reading or modifying createLead.
      // The original code was creating a new lead object here which is not ideal.
      return createSuccessResponse(
        { message: 'Lead created successfully.'}, // Removed the constructed lead object
        201
      );
    } else {
      // If createLead returns false, it's a DB_WRITE_ERROR
      return createErrorResponse(
        new DatabaseError('Failed to create lead', ErrorCodes.DB_WRITE_ERROR)
      );
    }
  } catch (error) {
    // Catch errors from request.json() or other unexpected issues
    logError(error as Error, { context: 'Creating new lead' });
    if (error instanceof SyntaxError) { // Error parsing JSON
        return createBadRequestResponse('Invalid JSON payload');
    }
    return createErrorResponse(
      new DatabaseError('Failed to create lead due to an unexpected error', ErrorCodes.DB_WRITE_ERROR, error as Error)
    );
  }
}
