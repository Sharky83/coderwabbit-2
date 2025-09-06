// Validation helpers for API routes
// British English comments throughout

import type { ErrorResponse } from './errorHelpers';
import { formatErrorResponse } from './errorHelpers';

// Check if an error is a validation error (e.g. from zod)
export function isValidationError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    error !== null &&
    'issues' in (error as Record<string, unknown>)
  );
}

// Handle validation errors and return a 400 status response
export function handleValidationError(error: unknown): ErrorResponse {
  // If the error is a validation error (e.g. from zod), return a 400 status
  if (isValidationError(error)) {
    const errObj = error as { issues?: unknown };
    return formatErrorResponse('Invalid request parameters', errObj.issues || error, 400);
  }
  // Otherwise, return a generic error response
  return formatErrorResponse('An unexpected error occurred', error, 500);
}

// Example usage in an API route:
// if (!parseResult.success) {
//   return NextResponse.json(handleValidationError(parseResult.error));
// }
