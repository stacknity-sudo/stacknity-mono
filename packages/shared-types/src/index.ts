// Performance-optimized type exports
// Types don't increase bundle size, but organizing them helps with intellisense performance

// Core domain types
export type {
  User,
  Organization,
  Tenant,
  Department,
  Role,
  Permission,
} from "./entities";

// API response types
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  ApiError,
} from "./api";

// Project management types
export type {
  Project,
  Task,
  KanbanBoard,
  KanbanCard,
  ProjectStatus,
  TaskPriority,
} from "./project";

// HR management types
export type {
  Employee,
  HRProfile,
  Attendance,
  LeaveRequest,
  PayrollInfo,
} from "./hr";

// Calendar and scheduling types
export type {
  CalendarEvent,
  EventType,
  RecurrenceRule,
  CalendarView,
} from "./calendar";

// Audit and activity types
export type {
  AuditLog,
  ActivityLog,
  AuditAction,
  AuditResource,
} from "./audit";

// Common utility types
export type {
  ID,
  Timestamp,
  DateRange,
  SortOrder,
  FilterOptions,
  PaginationParams,
} from "./common";
