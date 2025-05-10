import { NextRequest } from 'next/server';
import { getLeads, createLead } from '@/lib/db';
import {
  createSuccessResponse,
  createErrorResponse,
  createBadRequestResponse
} from '@/lib/api-response';
import { DatabaseError, ValidationError, ErrorCodes } from '@/lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    const leads = getLeads();
    return createSuccessResponse({ leads });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return createErrorResponse(error);
    }

    // For unknown errors, create a generic error response
    const dbError = new DatabaseError(
      'Failed to fetch leads',
      ErrorCodes.DB_READ_ERROR,
      error as Error
    );
    return createErrorResponse(dbError);
  }
}

export async function POST(request: NextRequest) {
  try {
    const lead = await request.json();

    // Validate required fields
    if (!lead.name || !lead.email || !lead.message) {
      const validationError = new ValidationError(
        'Missing required fields',
        'name, email, message'
      );
      return createBadRequestResponse(validationError.message);
    }

    const success = createLead(lead);

    if (success) {
      return createSuccessResponse(
        { message: 'Lead created successfully', lead: {
          ...lead,
          id: `lead-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'New'
        }},
        201
      );
    } else {
      const dbError = new DatabaseError(
        'Failed to create lead',
        ErrorCodes.DB_WRITE_ERROR
      );
      return createErrorResponse(dbError);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      return createErrorResponse(error);
    }

    // For unknown errors, create a generic error response
    const dbError = new DatabaseError(
      'Failed to create lead',
      ErrorCodes.DB_WRITE_ERROR,
      error as Error
    );
    return createErrorResponse(dbError);
  }
}
