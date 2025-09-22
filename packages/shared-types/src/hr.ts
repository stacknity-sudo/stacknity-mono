import type {
  BaseEntity,
  SoftDeletable,
  Status,
  ID,
  DateRange,
} from "./common";

// HR Management Types
export interface Employee extends BaseEntity, SoftDeletable {
  userId: string;
  organizationId: string;
  departmentId?: string;
  managerId?: string;
  employeeId: string; // Unique employee identifier
  profile: HRProfile;
  employment: EmploymentInfo;
  compensation: CompensationInfo;
  benefits: BenefitInfo[];
  documents: EmployeeDocument[];
  emergencyContacts: EmergencyContact[];
  status: EmployeeStatus;
}

export type EmployeeStatus =
  | "active"
  | "inactive"
  | "on-leave"
  | "terminated"
  | "suspended";

export interface HRProfile {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  maritalStatus: "single" | "married" | "divorced" | "widowed" | "other";
  nationality: string;
  personalEmail?: string;
  phone: string;
  alternatePhone?: string;
  address: Address;
  socialSecurityNumber?: string;
  taxId?: string;
  bankAccount?: BankAccount;
  profilePicture?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BankAccount {
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountType: "checking" | "savings";
}

export interface EmploymentInfo {
  hireDate: Date;
  terminationDate?: Date;
  jobTitle: string;
  jobDescription?: string;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  probationPeriod?: number; // in days
  probationEndDate?: Date;
  workLocation: string;
  reportingStructure: ReportingStructure;
}

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "intern"
  | "consultant";

export type WorkArrangement = "on-site" | "remote" | "hybrid";

export interface ReportingStructure {
  directManagerId?: string;
  secondaryManagerId?: string;
  skipLevelManagerId?: string;
  teamLeadId?: string;
}

export interface CompensationInfo {
  baseSalary: number;
  currency: string;
  payFrequency: PayFrequency;
  hourlyRate?: number;
  overtimeRate?: number;
  commissionStructure?: CommissionStructure;
  bonusStructure?: BonusStructure;
  salaryHistory: SalaryHistory[];
  effectiveDate: Date;
}

export type PayFrequency =
  | "hourly"
  | "weekly"
  | "bi-weekly"
  | "semi-monthly"
  | "monthly"
  | "annually";

export interface CommissionStructure {
  type: "percentage" | "fixed" | "tiered";
  rate: number;
  target?: number;
  minimumSales?: number;
}

export interface BonusStructure {
  type: "performance" | "annual" | "project" | "retention";
  amount?: number;
  percentage?: number;
  eligibilityDate?: Date;
}

export interface SalaryHistory extends BaseEntity {
  employeeId: string;
  previousSalary: number;
  newSalary: number;
  effectiveDate: Date;
  reason: string;
  approvedBy: string;
  notes?: string;
}

export interface BenefitInfo {
  id: string;
  name: string;
  type: BenefitType;
  provider?: string;
  isActive: boolean;
  enrollmentDate?: Date;
  terminationDate?: Date;
  employeeContribution?: number;
  employerContribution?: number;
  beneficiaries?: Beneficiary[];
}

export type BenefitType =
  | "health-insurance"
  | "dental-insurance"
  | "vision-insurance"
  | "life-insurance"
  | "401k"
  | "pto"
  | "disability"
  | "other";

export interface Beneficiary {
  name: string;
  relationship: string;
  percentage: number;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: Address;
  };
}

export interface EmployeeDocument extends BaseEntity {
  employeeId: string;
  name: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  expirationDate?: Date;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  tags: string[];
  isConfidential: boolean;
}

export type DocumentType =
  | "contract"
  | "resume"
  | "id-document"
  | "certification"
  | "performance-review"
  | "disciplinary-action"
  | "tax-document"
  | "other";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: Address;
  isPrimary: boolean;
}

// Attendance Management
export interface Attendance extends BaseEntity {
  employeeId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  totalHours?: number;
  regularHours?: number;
  overtimeHours?: number;
  status: AttendanceStatus;
  location?: AttendanceLocation;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half-day"
  | "holiday"
  | "sick-leave"
  | "vacation"
  | "personal-leave";

export interface AttendanceLocation {
  type: "office" | "home" | "client-site" | "other";
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Leave Management
export interface LeaveRequest extends BaseEntity {
  employeeId: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  status: LeaveStatus;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  supportingDocuments?: string[];
  delegatedTo?: string; // Employee handling responsibilities
  returnDate?: Date;
  isEmergency: boolean;
}

export type LeaveType =
  | "vacation"
  | "sick"
  | "personal"
  | "maternity"
  | "paternity"
  | "bereavement"
  | "medical"
  | "unpaid"
  | "sabbatical";

export type LeaveStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "in-progress"
  | "completed";

export interface LeaveBalance {
  employeeId: string;
  year: number;
  leaveType: LeaveType;
  totalAllowed: number;
  used: number;
  remaining: number;
  carried: number; // From previous year
  expires?: Date;
  lastUpdated: Date;
}

// Performance Management
export interface PerformanceReview extends BaseEntity {
  employeeId: string;
  reviewerId: string;
  reviewPeriod: DateRange;
  type: ReviewType;
  status: ReviewStatus;
  overallRating?: number;
  goals: PerformanceGoal[];
  competencies: CompetencyRating[];
  feedback: ReviewFeedback;
  developmentPlan?: DevelopmentPlan;
  nextReviewDate?: Date;
  isVisible: boolean;
}

export type ReviewType =
  | "annual"
  | "semi-annual"
  | "quarterly"
  | "360-degree"
  | "probationary"
  | "project-based";

export type ReviewStatus =
  | "not-started"
  | "in-progress"
  | "manager-review"
  | "hr-review"
  | "completed"
  | "cancelled";

export interface PerformanceGoal {
  id: string;
  title: string;
  description: string;
  category: "business" | "personal" | "skill" | "behavior";
  targetDate: Date;
  status: "not-started" | "in-progress" | "completed" | "cancelled";
  rating?: number;
  comments?: string;
  weight: number; // Percentage weight in overall rating
}

export interface CompetencyRating {
  competencyId: string;
  competencyName: string;
  rating: number;
  maxRating: number;
  comments?: string;
  examples?: string[];
}

export interface ReviewFeedback {
  strengths: string[];
  areasForImprovement: string[];
  achievements: string[];
  managerComments: string;
  employeeComments?: string;
  hrComments?: string;
}

export interface DevelopmentPlan {
  goals: DevelopmentGoal[];
  trainingRecommendations: string[];
  mentorshipOpportunities: string[];
  skillGaps: string[];
  careerPath?: string;
  nextSteps: string[];
}

export interface DevelopmentGoal {
  title: string;
  description: string;
  targetDate: Date;
  resources: string[];
  metrics: string[];
  status: "not-started" | "in-progress" | "completed";
}

// Payroll Information
export interface PayrollInfo extends BaseEntity {
  employeeId: string;
  payPeriod: DateRange;
  grossPay: number;
  netPay: number;
  deductions: PayrollDeduction[];
  earnings: PayrollEarning[];
  taxes: PayrollTax[];
  payDate: Date;
  payMethod: "direct-deposit" | "check" | "cash";
  status: "draft" | "approved" | "paid" | "cancelled";
}

export interface PayrollDeduction {
  type: string;
  description: string;
  amount: number;
  isPreTax: boolean;
}

export interface PayrollEarning {
  type: "regular" | "overtime" | "bonus" | "commission" | "other";
  description: string;
  hours?: number;
  rate?: number;
  amount: number;
}

export interface PayrollTax {
  type: "federal" | "state" | "local" | "social-security" | "medicare";
  description: string;
  amount: number;
  employeeContribution: number;
  employerContribution: number;
}
