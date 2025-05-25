import { NextResponse } from 'next/server';
import { formatErrorResponse } from './error-handler';

/**
 * Create a success response for API endpoints
 * @param data Data to include in the response
 * @param status HTTP status code (default: 200)
 * @param headers Optional custom headers to include in the response
 * @returns NextResponse with the data
 */
export function createSuccessResponse(
  data: any, 
  status: number = 200, 
  headers?: HeadersInit
): NextResponse {
  return NextResponse.json(data, { status, headers });
}

/**
 * Create an error response for API endpoints
 * @param error Error object
 * @param status HTTP status code (default: 500)
 * @returns NextResponse with the error
 */
export function createErrorResponse(error: Error, status: number = 500): NextResponse {
  const formattedError = formatErrorResponse(error);
  return NextResponse.json(formattedError, { status });
}

/**
 * Create a not found response for API endpoints
 * @param message Custom message (default: 'Resource not found')
 * @returns NextResponse with 404 status
 */
export function createNotFoundResponse(message: string = 'Resource not found'): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Create a bad request response for API endpoints
 * @param message Custom message (default: 'Bad request')
 * @returns NextResponse with 400 status
 */
export function createBadRequestResponse(message: string = 'Bad request'): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Create an unauthorized response for API endpoints
 * @param message Custom message (default: 'Unauthorized')
 * @returns NextResponse with 401 status
 */
export function createUnauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Create a forbidden response for API endpoints
 * @param message Custom message (default: 'Forbidden')
 * @returns NextResponse with 403 status
 */
export function createForbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Create a conflict response for API endpoints
 * @param message Custom message (default: 'Conflict')
 * @returns NextResponse with 409 status
 */
export function createConflictResponse(message: string = 'Conflict'): NextResponse {
  return NextResponse.json({ error: message }, { status: 409 });
}
