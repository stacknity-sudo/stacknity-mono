// Common utility types for the entire application

export type ID = string;

export type Timestamp = Date | string;

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type SortOrder = "asc" | "desc";

export interface SortOptions {
  field: string;
  order: SortOrder;
}

export interface FilterOptions {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface SearchParams {
  query?: string;
  filters?: FilterOptions;
  sort?: SortOptions;
  pagination?: PaginationParams;
}

// Status types
export type Status = "active" | "inactive" | "pending" | "archived";

// File and media types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Metadata type for extensible entities
export interface Metadata {
  [key: string]: string | number | boolean | null | undefined;
}

// Base entity interface
export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: Metadata;
}

// Soft delete interface
export interface SoftDeletable {
  deletedAt?: Timestamp | null;
  isDeleted?: boolean;
}
