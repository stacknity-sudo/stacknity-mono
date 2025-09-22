import type { BaseEntity, SoftDeletable, Status, Metadata } from "./common";

// Core user entity
export interface User extends BaseEntity, SoftDeletable {
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  timezone: string;
  locale: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  status: Status;
}

// Organization entity
export interface Organization extends BaseEntity, SoftDeletable {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: "startup" | "small" | "medium" | "large" | "enterprise";
  settings: OrganizationSettings;
  status: Status;
}

export interface OrganizationSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  features: OrganizationFeatures;
  branding: BrandingSettings;
  integrations: IntegrationSettings;
}

export interface OrganizationFeatures {
  hrms: boolean;
  projectManagement: boolean;
  calendar: boolean;
  kanban: boolean;
  audit: boolean;
  customFields: boolean;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
}

export interface IntegrationSettings {
  slack?: SlackIntegration;
  teams?: TeamsIntegration;
  googleWorkspace?: GoogleWorkspaceIntegration;
}

export interface SlackIntegration {
  enabled: boolean;
  workspaceId?: string;
  botToken?: string;
}

export interface TeamsIntegration {
  enabled: boolean;
  tenantId?: string;
  clientId?: string;
}

export interface GoogleWorkspaceIntegration {
  enabled: boolean;
  domain?: string;
  serviceAccountKey?: string;
}

// Tenant entity (multi-tenancy support)
export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  organizationId: string;
  subdomain?: string;
  customDomain?: string;
  settings: TenantSettings;
  limits: TenantLimits;
  status: Status;
}

export interface TenantSettings {
  allowSignup: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
  maxFileSize: number;
  allowedDomains: string[];
  ssoConfig?: SSOConfig;
}

export interface SSOConfig {
  enabled: boolean;
  provider: "saml" | "oidc" | "google" | "microsoft";
  entityId?: string;
  ssoUrl?: string;
  x509cert?: string;
}

export interface TenantLimits {
  maxUsers: number;
  maxProjects: number;
  maxStorage: number; // in bytes
  maxApiCalls: number; // per hour
}

// Department entity
export interface Department extends BaseEntity, SoftDeletable {
  name: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  organizationId: string;
  memberCount: number;
  settings: DepartmentSettings;
  status: Status;
}

export interface DepartmentSettings {
  allowSubDepartments: boolean;
  requireApprovalForLeave: boolean;
  workingHours: WorkingHours;
  holidays: Holiday[];
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isWorkingDay: boolean;
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  breakStart?: string;
  breakEnd?: string;
}

export interface Holiday {
  name: string;
  date: Date;
  isRecurring: boolean;
  type: "public" | "company" | "department";
}

// Role and Permission entities
export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: Permission[];
  isSystemRole: boolean;
  isDefault: boolean;
  organizationId: string;
}

export interface Permission extends BaseEntity {
  name: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
  isSystemPermission: boolean;
}

export interface PermissionCondition {
  field: string;
  operator: "eq" | "ne" | "in" | "nin" | "gt" | "gte" | "lt" | "lte";
  value: string | number | boolean | string[] | number[];
}

// User-Organization relationship
export interface UserOrganization extends BaseEntity {
  userId: string;
  organizationId: string;
  roleId: string;
  departmentId?: string;
  joinedAt: Date;
  status: "active" | "inactive" | "invited" | "suspended";
  permissions: string[]; // Additional permissions beyond role
  metadata?: Metadata;
}
