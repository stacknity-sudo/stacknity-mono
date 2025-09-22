/**
 * Common constants used across the application
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Users
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    AVATAR: (id: string) => `/users/${id}/avatar`,
  },

  // Organizations
  ORGANIZATIONS: {
    LIST: "/organizations",
    CREATE: "/organizations",
    GET: (id: string) => `/organizations/${id}`,
    UPDATE: (id: string) => `/organizations/${id}`,
    DELETE: (id: string) => `/organizations/${id}`,
    MEMBERS: (id: string) => `/organizations/${id}/members`,
    INVITE: (id: string) => `/organizations/${id}/invite`,
  },

  // Projects
  PROJECTS: {
    LIST: "/projects",
    CREATE: "/projects",
    GET: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    TASKS: (id: string) => `/projects/${id}/tasks`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
  },

  // Tasks
  TASKS: {
    LIST: "/tasks",
    CREATE: "/tasks",
    GET: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    COMMENTS: (id: string) => `/tasks/${id}/comments`,
    ATTACHMENTS: (id: string) => `/tasks/${id}/attachments`,
  },

  // Files
  FILES: {
    UPLOAD: "/files/upload",
    GET: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`,
    DOWNLOAD: (id: string) => `/files/${id}/download`,
  },

  // HR
  HR: {
    EMPLOYEES: "/hr/employees",
    EMPLOYEE: (id: string) => `/hr/employees/${id}`,
    ATTENDANCE: "/hr/attendance",
    LEAVE_REQUESTS: "/hr/leave-requests",
    PAYROLL: "/hr/payroll",
  },

  // Calendar
  CALENDAR: {
    EVENTS: "/calendar/events",
    EVENT: (id: string) => `/calendar/events/${id}`,
    CALENDARS: "/calendar/calendars",
    CALENDAR: (id: string) => `/calendar/calendars/${id}`,
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  // User validation
  USER: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 254,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
  },

  // File validation
  FILE: {
    MAX_SIZE_MB: 10,
    IMAGE_MAX_SIZE_MB: 5,
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    ALLOWED_DOCUMENT_TYPES: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  },

  // Text validation
  TEXT: {
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 1000,
    COMMENT_MAX_LENGTH: 500,
    SLUG_MAX_LENGTH: 100,
  },

  // Organization validation
  ORGANIZATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    SLUG_MIN_LENGTH: 3,
    SLUG_MAX_LENGTH: 50,
  },

  // Project validation
  PROJECT: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 2000,
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Date and Time formats
export const DATE_FORMATS = {
  ISO: "YYYY-MM-DD",
  US: "MM/DD/YYYY",
  EUROPEAN: "DD/MM/YYYY",
  DATETIME_ISO: "YYYY-MM-DD HH:mm:ss",
  TIME_12H: "hh:mm A",
  TIME_24H: "HH:mm",
} as const;

// Cache duration (in milliseconds)
export const CACHE_DURATION = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "stacknity_auth_token",
  REFRESH_TOKEN: "stacknity_refresh_token",
  USER_PREFERENCES: "stacknity_user_preferences",
  THEME: "stacknity_theme",
  LANGUAGE: "stacknity_language",
  SIDEBAR_STATE: "stacknity_sidebar_state",
} as const;

// Event names for custom events
export const EVENT_NAMES = {
  AUTH_LOGIN: "stacknity:auth:login",
  AUTH_LOGOUT: "stacknity:auth:logout",
  AUTH_TOKEN_REFRESH: "stacknity:auth:token_refresh",
  THEME_CHANGE: "stacknity:theme:change",
  NOTIFICATION_SHOW: "stacknity:notification:show",
  MODAL_OPEN: "stacknity:modal:open",
  MODAL_CLOSE: "stacknity:modal:close",
} as const;

// Color constants
export const COLORS = {
  PRIORITY: {
    LOWEST: "#8B5CF6", // Purple
    LOW: "#06B6D4", // Cyan
    MEDIUM: "#F59E0B", // Amber
    HIGH: "#F97316", // Orange
    HIGHEST: "#EF4444", // Red
    CRITICAL: "#DC2626", // Dark Red
  },

  STATUS: {
    SUCCESS: "#10B981", // Green
    WARNING: "#F59E0B", // Amber
    ERROR: "#EF4444", // Red
    INFO: "#3B82F6", // Blue
  },

  PROJECT_STATUS: {
    PLANNING: "#8B5CF6", // Purple
    ACTIVE: "#10B981", // Green
    ON_HOLD: "#F59E0B", // Amber
    COMPLETED: "#6B7280", // Gray
    CANCELLED: "#EF4444", // Red
  },
} as const;

// Regular expressions
export const REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9-]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_REAL_TIME: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_CALENDAR: true,
  ENABLE_HR: true,
  ENABLE_KANBAN: true,
  ENABLE_TIME_TRACKING: true,
  ENABLE_REPORTS: true,
} as const;

// Environment constants
export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
  TEST: "test",
} as const;
