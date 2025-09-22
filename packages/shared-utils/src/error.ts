/**
 * Error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export interface ErrorHandler {
  handleError: (error: Error, context?: Record<string, unknown>) => void;
  logError: (error: Error, context?: Record<string, unknown>) => void;
}

export class DefaultErrorHandler implements ErrorHandler {
  handleError(error: Error, context?: Record<string, unknown>): void {
    this.logError(error, context);

    // In production, you might want to send errors to a service like Sentry
    if (process.env.NODE_ENV === "production") {
      // Send to error tracking service
      this.sendToErrorService(error, context);
    }
  }

  logError(error: Error, context?: Record<string, unknown>): void {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
    };

    console.error("Application Error:", errorInfo);
  }

  private sendToErrorService(
    error: Error,
    context?: Record<string, unknown>
  ): void {
    // Implement your error tracking service integration here
    // Example: Sentry, LogRocket, Bugsnag, etc.
  }
}

// Global error handler instance
let globalErrorHandler: ErrorHandler = new DefaultErrorHandler();

export const setErrorHandler = (handler: ErrorHandler): void => {
  globalErrorHandler = handler;
};

export const getErrorHandler = (): ErrorHandler => {
  return globalErrorHandler;
};

export const createErrorHandler = (
  customHandler?: Partial<ErrorHandler>
): ErrorHandler => {
  const defaultHandler = new DefaultErrorHandler();

  return {
    handleError:
      customHandler?.handleError ||
      defaultHandler.handleError.bind(defaultHandler),
    logError:
      customHandler?.logError || defaultHandler.logError.bind(defaultHandler),
  };
};

// Utility functions
export const logError = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  globalErrorHandler.logError(error, context);
};

export const handleError = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  globalErrorHandler.handleError(error, context);
};

// Error boundary helpers for React
export const createErrorInfo = (
  error: Error,
  errorInfo?: { componentStack: string }
) => {
  return {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  };
};

// Async error handling
export const handleAsyncError = (fn: (...args: any[]) => Promise<any>) => {
  return (...args: any[]) => {
    return fn(...args).catch((error: Error) => {
      handleError(error, { function: fn.name, arguments: args });
      throw error;
    });
  };
};

// API error handling
export const isApiError = (
  error: unknown
): error is { statusCode: number; message: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (isApiError(error)) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred";
};

export const getErrorCode = (error: unknown): string | undefined => {
  if (error instanceof AppError) {
    return error.code;
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    return String(error.code);
  }

  return undefined;
};

// Error categorization
export type ErrorCategory =
  | "network"
  | "validation"
  | "authentication"
  | "authorization"
  | "not-found"
  | "server"
  | "client"
  | "unknown";

export const categorizeError = (error: unknown): ErrorCategory => {
  if (isApiError(error)) {
    if (error.statusCode >= 500) return "server";
    if (error.statusCode === 404) return "not-found";
    if (error.statusCode === 401) return "authentication";
    if (error.statusCode === 403) return "authorization";
    if (error.statusCode >= 400) return "client";
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "network";
  }

  if (error instanceof Error && error.name === "ValidationError") {
    return "validation";
  }

  return "unknown";
};

// Error retry logic
export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff?: "linear" | "exponential";
  retryCondition?: (error: Error) => boolean;
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> => {
  const { maxAttempts, delay, backoff = "linear", retryCondition } = options;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        throw lastError;
      }

      if (retryCondition && !retryCondition(lastError)) {
        throw lastError;
      }

      const waitTime =
        backoff === "exponential" ? delay * Math.pow(2, attempt - 1) : delay;

      await new Promise((resolve) => setTimeout(resolve, waitTime));

      logError(lastError, { attempt, maxAttempts, retrying: true });
    }
  }

  throw lastError!;
};

// Error formatting for user display
export const formatErrorForUser = (error: unknown): string => {
  const category = categorizeError(error);

  switch (category) {
    case "network":
      return "Unable to connect. Please check your internet connection and try again.";
    case "authentication":
      return "Please log in to continue.";
    case "authorization":
      return "You do not have permission to perform this action.";
    case "not-found":
      return "The requested resource was not found.";
    case "validation":
      return getErrorMessage(error);
    case "server":
      return "A server error occurred. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

// Development helpers
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const debugError = (
  error: unknown,
  context?: Record<string, unknown>
): void => {
  if (isDevelopment()) {
    console.group("🐛 Debug Error");
    console.error("Error:", error);
    console.log("Context:", context);
    console.log("Category:", categorizeError(error));
    console.log("Message:", getErrorMessage(error));
    console.log("Code:", getErrorCode(error));
    console.groupEnd();
  }
};
