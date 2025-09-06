// Error helpers for API responses and logging

// Type for standardised error response
export type ErrorResponse = {
  message: string;
  details?: unknown;
  status?: number;
};

// Format an error response for API output
export function formatErrorResponse(message: string, details?: unknown, status: number = 500): ErrorResponse {
  return { message, details, status };
}

// Helper to log errors in a standardised way
// This can be extended to log to external services in future
export function logError(error: unknown): void {
  // Log error with timestamp for easier debugging
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] API Error:`, error);
  // In production, replace this with logging to a service such as Sentry or Datadog
}

