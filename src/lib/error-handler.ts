/**
 * Custom error class for database operations
 */
export class DatabaseError extends Error {
  constructor(message: string, public readonly code: string, public readonly cause?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Custom error class for authentication operations
 */
export class AuthError extends Error {
  constructor(message: string, public readonly code: string, public readonly cause?: Error) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(message: string, public readonly field?: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error codes for database operations
 */
export const ErrorCodes = {
  DB_READ_ERROR: 'DB_READ_ERROR',
  DB_WRITE_ERROR: 'DB_WRITE_ERROR',
  DB_DELETE_ERROR: 'DB_DELETE_ERROR',
  DB_NOT_FOUND: 'DB_NOT_FOUND',
  DB_ALREADY_EXISTS: 'DB_ALREADY_EXISTS',
  // File system specific errors (could be for non-DB files like images, general config)
  FILE_READ_ERROR: 'FILE_READ_ERROR',
  FILE_WRITE_ERROR: 'FILE_WRITE_ERROR',
  FILE_DELETE_ERROR: 'FILE_DELETE_ERROR',
  // Auth errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_NOT_AUTHENTICATED: 'AUTH_NOT_AUTHENTICATED',
  AUTH_NOT_AUTHORIZED: 'AUTH_NOT_AUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

/**
 * Log an error with additional context
 */
export function logError(error: Error, context?: Record<string, any>): void {
  console.error(`[ERROR] ${error.name}: ${error.message}`, {
    ...(context || {}),
    stack: error.stack,
  });
}

/**
 * Format an error for API responses
 */
export function formatErrorResponse(error: Error): { error: string; code?: string; details?: any } {
  if (error instanceof DatabaseError || error instanceof AuthError) {
    return {
      error: error.message,
      code: error.code,
    };
  } else if (error instanceof ValidationError) {
    return {
      error: error.message,
      code: ErrorCodes.VALIDATION_ERROR,
      details: error.field ? { field: error.field } : undefined,
    };
  } else {
    // For unknown errors, don't expose internal details
    return {
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    };
  }
}
