// Performance-optimized utility exports
// Using specific exports to enable tree shaking and reduce bundle size

// Date and time utilities
export {
  formatDate,
  parseDate,
  isValidDate,
  getDaysDifference,
  addDays,
  formatRelativeTime,
} from "./date";

// String and text utilities
export {
  slugify,
  truncateText,
  capitalizeFirst,
  camelToKebab,
  kebabToCamel,
  generateId,
} from "./string";

// Validation utilities (Zod-based)
export {
  createValidationSchema,
  validateEmail,
  validatePassword,
  ValidationError,
} from "./validation";

// API client utilities
export {
  ApiClient,
  createApiClient,
  type ApiClientConfig,
  type ApiResponse,
  ApiError,
} from "./api";

// React Query helpers (TanStack Query)
export {
  createQueryClient,
  createInfiniteQuery,
  createMutation,
  type QueryConfig,
} from "./query";

// Form utilities
export {
  createFormSchema,
  validateFormData,
  type FormField,
  type FormValidation,
} from "./forms";

// File and upload utilities
export {
  formatFileSize,
  validateFileType,
  validateFileSize,
  createFileUpload,
  type FileUploadConfig,
} from "./files";

// URL and routing utilities
export {
  buildUrl,
  parseQueryString,
  createQueryString,
  isValidUrl,
  getBaseUrl,
} from "./url";

// Local storage utilities
export {
  createStorage,
  type StorageAdapter,
  LocalStorageAdapter,
  SessionStorageAdapter,
} from "./storage";

// Error handling utilities
export {
  createErrorHandler,
  logError,
  type ErrorHandler,
  AppError,
} from "./error";

// Common constants
export { HTTP_STATUS, API_ENDPOINTS, VALIDATION_RULES } from "./constants";
