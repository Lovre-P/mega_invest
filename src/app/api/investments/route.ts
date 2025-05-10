import { NextRequest } from 'next/server';
import { getInvestments, createInvestment } from '@/lib/db';
import {
  createSuccessResponse,
  createErrorResponse,
  createBadRequestResponse
} from '@/lib/api-response';
import { DatabaseError, ValidationError, ErrorCodes } from '@/lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    const investments = getInvestments();

    // Handle query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const risk = searchParams.get('risk');

    let filteredInvestments = investments;

    if (category) {
      filteredInvestments = filteredInvestments.filter(
        (investment: any) => investment.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (status) {
      filteredInvestments = filteredInvestments.filter(
        (investment: any) => investment.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (risk) {
      filteredInvestments = filteredInvestments.filter(
        (investment: any) => investment.risk.toLowerCase() === risk.toLowerCase()
      );
    }

    return createSuccessResponse({ investments: filteredInvestments });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return createErrorResponse(error);
    }

    // For unknown errors, create a generic error response
    const dbError = new DatabaseError(
      'Failed to fetch investments',
      ErrorCodes.DB_READ_ERROR,
      error as Error
    );
    return createErrorResponse(dbError);
  }
}

export async function POST(request: NextRequest) {
  try {
    const investment = await request.json();

    // Validate required fields
    if (!investment.title || !investment.description || !investment.category) {
      const validationError = new ValidationError(
        'Missing required fields',
        'title, description, category'
      );
      return createBadRequestResponse(validationError.message);
    }

    const success = createInvestment(investment);

    if (success) {
      return createSuccessResponse(
        { message: 'Investment created successfully', investment },
        201
      );
    } else {
      const dbError = new DatabaseError(
        'Failed to create investment',
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
      'Failed to create investment',
      ErrorCodes.DB_WRITE_ERROR,
      error as Error
    );
    return createErrorResponse(dbError);
  }
}
