import type { BaseEntity, ID, Timestamp } from "./common";

// Audit and Activity Logging Types
export interface AuditLog extends BaseEntity {
  organizationId: string;
  userId?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  resourceName?: string;
  details: AuditDetails;
  result: AuditResult;
  severity: AuditSeverity;
  category: AuditCategory;
  timestamp: Date;
  duration?: number; // in milliseconds
  apiEndpoint?: string;
  httpMethod?: string;
  statusCode?: number;
  correlationId?: string;
  tenantId?: string;
}

export type AuditAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "access"
  | "export"
  | "import"
  | "approve"
  | "reject"
  | "assign"
  | "unassign"
  | "invite"
  | "revoke";

export type AuditResource =
  | "user"
  | "organization"
  | "project"
  | "task"
  | "document"
  | "role"
  | "permission"
  | "department"
  | "employee"
  | "calendar"
  | "event"
  | "report"
  | "system";

export interface AuditDetails {
  before?: Record<string, unknown>; // Previous state
  after?: Record<string, unknown>; // New state
  changes?: FieldChange[]; // Specific field changes
  metadata?: Record<string, string | number | boolean>;
  reason?: string;
  comment?: string;
  bulkOperation?: BulkOperationInfo;
}

export interface FieldChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  type: "added" | "modified" | "removed";
}

export interface BulkOperationInfo {
  totalItems: number;
  successfulItems: number;
  failedItems: number;
  operationType: string;
}

export type AuditResult =
  | "success"
  | "failure"
  | "partial"
  | "unauthorized"
  | "forbidden";

export type AuditSeverity = "low" | "medium" | "high" | "critical";

export type AuditCategory =
  | "security"
  | "data"
  | "system"
  | "user"
  | "admin"
  | "compliance";

// Activity Logs (for user-facing activity feeds)
export interface ActivityLog extends BaseEntity {
  organizationId: string;
  userId: string;
  actorId: string; // Who performed the action
  actorName: string;
  actorAvatar?: string;
  type: ActivityType;
  action: string;
  subject: ActivitySubject;
  object?: ActivityObject;
  message: string;
  templateId?: string; // For message templating
  templateData?: Record<string, unknown>;
  visibility: ActivityVisibility;
  isRead: boolean;
  readAt?: Date;
  priority: ActivityPriority;
  tags: string[];
  contextUrl?: string;
  thumbnail?: string;
  aggregationKey?: string; // For grouping related activities
  expiresAt?: Date;
}

export type ActivityType =
  | "user_action"
  | "system_action"
  | "notification"
  | "milestone"
  | "reminder"
  | "achievement";

export interface ActivitySubject {
  type: string; // e.g., 'project', 'task', 'user'
  id: string;
  name: string;
  url?: string;
}

export interface ActivityObject {
  type: string;
  id: string;
  name: string;
  url?: string;
}

export type ActivityVisibility =
  | "public"
  | "team"
  | "department"
  | "organization"
  | "private";

export type ActivityPriority = "low" | "normal" | "high" | "urgent";

// Security Events (subset of audit logs focused on security)
export interface SecurityEvent extends BaseEntity {
  organizationId: string;
  userId?: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  sourceIp: string;
  userAgent?: string;
  location?: GeoLocation;
  deviceInfo?: DeviceInfo;
  riskScore: number; // 0-100
  isBlocked: boolean;
  resolution?: SecurityResolution;
  investigatedBy?: string;
  investigatedAt?: Date;
  notes?: string;
  relatedEvents?: string[]; // IDs of related security events
}

export type SecurityEventType =
  | "login_attempt"
  | "login_failure"
  | "suspicious_activity"
  | "data_breach"
  | "unauthorized_access"
  | "malware_detection"
  | "phishing_attempt"
  | "brute_force"
  | "privilege_escalation"
  | "data_export"
  | "configuration_change";

export type SecuritySeverity = "info" | "low" | "medium" | "high" | "critical";

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

export interface DeviceInfo {
  type: "desktop" | "mobile" | "tablet" | "unknown";
  os: string;
  browser: string;
  version: string;
  fingerprint?: string;
  isKnownDevice: boolean;
}

export type SecurityResolution =
  | "no_action"
  | "user_notified"
  | "account_locked"
  | "password_reset"
  | "investigation_ongoing"
  | "false_positive";

// Compliance and Audit Reports
export interface ComplianceReport extends BaseEntity {
  organizationId: string;
  name: string;
  type: ComplianceType;
  period: {
    startDate: Date;
    endDate: Date;
  };
  status: ReportStatus;
  generatedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  summary: ComplianceSummary;
  findings: ComplianceFinding[];
  recommendations: string[];
  attachments: ReportAttachment[];
  isConfidential: boolean;
  retentionPolicy: string;
  expiresAt?: Date;
}

export type ComplianceType =
  | "gdpr"
  | "hipaa"
  | "sox"
  | "iso27001"
  | "pci_dss"
  | "custom";

export type ReportStatus =
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "archived";

export interface ComplianceSummary {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  complianceScore: number; // percentage
  improvementFromLastReport?: number;
}

export interface ComplianceFinding {
  id: string;
  checkId: string;
  checkName: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pass" | "fail" | "warning" | "not_applicable";
  description: string;
  evidence?: string[];
  remediation?: string;
  dueDate?: Date;
  assignedTo?: string;
  comments?: string[];
}

export interface ReportAttachment {
  id: string;
  name: string;
  type: "pdf" | "excel" | "csv" | "image" | "other";
  url: string;
  size: number;
  createdAt: Date;
}

// Data Retention and Archival
export interface RetentionPolicy extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  resourceType: AuditResource;
  retentionPeriod: number; // in days
  archiveAfter?: number; // in days
  deleteAfter?: number; // in days
  isActive: boolean;
  conditions?: RetentionCondition[];
  approvedBy: string;
  effectiveDate: Date;
}

export interface RetentionCondition {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: string | number | boolean;
}

export interface DataArchival extends BaseEntity {
  policyId: string;
  resourceType: string;
  resourceIds: string[];
  archiveLocation: string;
  archiveSize: number; // in bytes
  compressionRatio?: number;
  checksum: string;
  isEncrypted: boolean;
  archivedBy: string;
  retrievalInstructions?: string;
  metadata?: Record<string, string | number>;
}
