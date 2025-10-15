/**
 * Error handling utilities for the application
 */

export class AIFlowError extends Error {
  constructor(
    message: string,
    public readonly flowName: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AIFlowError';
  }
}

export class FirebaseError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'FirebaseError';
  }
}

/**
 * Safely execute an AI flow with error handling and retry logic
 */
export async function executeAIFlowSafely<T>(
  flowFn: () => Promise<T>,
  flowName: string,
  options: {
    retries?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
  } = {}
): Promise<T> {
  const { retries = 2, retryDelay = 1000, onError } = options;
  
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await flowFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      console.error(`AI flow "${flowName}" failed (attempt ${attempt + 1}/${retries + 1}):`, lastError);
      
      if (onError) {
        onError(lastError);
      }
      
      // Don't retry on the last attempt
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }
  
  throw new AIFlowError(
    `AI flow "${flowName}" failed after ${retries + 1} attempts: ${lastError?.message}`,
    flowName,
    lastError
  );
}

/**
 * Safely execute a Firebase operation with error handling
 */
export async function executeFirebaseOperationSafely<T>(
  operationFn: () => Promise<T>,
  operationName: string,
  options: {
    onError?: (error: Error) => void;
  } = {}
): Promise<T> {
  try {
    return await operationFn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    
    console.error(`Firebase operation "${operationName}" failed:`, err);
    
    if (options.onError) {
      options.onError(err);
    }
    
    throw new FirebaseError(
      `Firebase operation "${operationName}" failed: ${err.message}`,
      operationName,
      err
    );
  }
}

/**
 * Format error message for user display
 */
export function formatErrorForUser(error: unknown): string {
  if (error instanceof AIFlowError) {
    return `AI processing failed: ${error.message}. Please try again.`;
  }
  
  if (error instanceof FirebaseError) {
    return `Database operation failed: ${error.message}. Please check your connection.`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Log error for monitoring (placeholder for future integration)
 */
export function logError(error: Error, context?: Record<string, unknown>): void {
  // In production, send to error tracking service (e.g., Sentry)
  console.error('Error logged:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}
