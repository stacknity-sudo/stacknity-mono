// API response and error types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
  message: string;
  timestamp: string;
  requestId?: string;
  path?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
  field?: string; // For validation errors
  errors?: ValidationError[]; // For multiple validation errors
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

// HTTP Status Codes (commonly used)
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

// API endpoint types
export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  version?: string;
}

// Request/Response types for common operations
export interface CreateRequest<T = Record<string, unknown>> {
  data: T;
}

export interface UpdateRequest<T = Record<string, unknown>> {
  id: string;
  data: Partial<T>;
}

export interface DeleteRequest {
  id: string;
  force?: boolean; // For hard delete vs soft delete
}

export interface BulkOperation<T = string> {
  ids: T[];
  operation: "create" | "update" | "delete";
  data?: Record<string, unknown>;
}

export interface BulkOperationResponse<T = string> {
  successful: T[];
  failed: Array<{
    id: T;
    error: ApiError;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// File upload types
export interface UploadRequest {
  file: File;
  folder?: string;
  metadata?: Record<string, unknown>;
}

export interface UploadResponse {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
}

// Search and filter types
export interface SearchRequest {
  query?: string;
  filters?: Record<string, unknown>;
  sort?: Array<{
    field: string;
    order: "asc" | "desc";
  }>;
  page?: number;
  limit?: number;
  include?: string[]; // Related entities to include
}

export interface SearchResponse<T = unknown> extends PaginatedResponse<T> {
  facets?: Record<
    string,
    Array<{
      value: string;
      count: number;
    }>
  >;
  suggestions?: string[];
}
