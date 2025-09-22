import type { BaseEntity, ID, DateRange, Metadata } from "./common";

// Calendar and Event Management Types
export interface CalendarEvent extends BaseEntity {
  title: string;
  description?: string;
  organizationId: string;
  creatorId: string;
  calendarId?: string;
  type: EventType;
  status: EventStatus;
  visibility: EventVisibility;
  startDateTime: Date;
  endDateTime: Date;
  isAllDay: boolean;
  timezone: string;
  location?: EventLocation;
  attendees: EventAttendee[];
  recurrence?: RecurrenceRule;
  reminders: EventReminder[];
  attachments: EventAttachment[];
  eventMetadata?: Metadata;
  externalEventId?: string; // For synced events
  lastSyncAt?: Date;
}

export type EventType =
  | "meeting"
  | "appointment"
  | "task"
  | "reminder"
  | "holiday"
  | "birthday"
  | "deadline"
  | "training"
  | "interview"
  | "other";

export type EventStatus = "tentative" | "confirmed" | "cancelled" | "completed";

export type EventVisibility = "public" | "private" | "confidential";

export interface EventLocation {
  type: "physical" | "virtual" | "hybrid";
  name?: string;
  address?: string;
  room?: string;
  floor?: string;
  building?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  virtualMeetingInfo?: VirtualMeetingInfo;
}

export interface VirtualMeetingInfo {
  platform: "zoom" | "teams" | "meet" | "webex" | "other";
  url: string;
  meetingId?: string;
  password?: string;
  dialInNumbers?: DialInNumber[];
  accessCode?: string;
}

export interface DialInNumber {
  country: string;
  number: string;
}

export interface EventAttendee {
  userId?: string;
  email: string;
  name?: string;
  type: AttendeeType;
  status: AttendeeStatus;
  isRequired: boolean;
  invitedAt?: Date;
  respondedAt?: Date;
  notes?: string;
}

export type AttendeeType = "organizer" | "required" | "optional" | "resource";

export type AttendeeStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "tentative"
  | "no-response";

export interface EventReminder {
  id: string;
  type: ReminderType;
  time: number; // Minutes before event
  recipient: "organizer" | "attendees" | "specific";
  specificRecipients?: string[];
  message?: string;
  isActive: boolean;
}

export type ReminderType = "email" | "push" | "sms" | "popup";

export interface EventAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Recurrence Rules (based on RFC 5545)
export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number; // Every X occurrences
  until?: Date; // End date
  count?: number; // Number of occurrences
  byWeekDay?: WeekDay[];
  byMonthDay?: number[];
  byMonth?: number[];
  bySetPos?: number[];
  weekStart?: WeekDay;
  exceptions?: Date[]; // Dates to exclude
  additions?: Date[]; // Additional dates to include
}

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type WeekDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

// Calendar Types
export interface Calendar extends BaseEntity {
  name: string;
  description?: string;
  organizationId: string;
  ownerId: string;
  type: CalendarType;
  visibility: CalendarVisibility;
  color: string;
  timezone: string;
  isDefault: boolean;
  isActive: boolean;
  permissions: CalendarPermission[];
  settings: CalendarSettings;
  externalCalendarId?: string; // For synced calendars
  syncStatus?: SyncStatus;
  lastSyncAt?: Date;
}

export type CalendarType =
  | "personal"
  | "shared"
  | "department"
  | "organization"
  | "project"
  | "resource"
  | "holiday";

export type CalendarVisibility = "public" | "private" | "organization";

export interface CalendarPermission {
  userId?: string;
  groupId?: string;
  role: CalendarRole;
  permissions: CalendarAction[];
}

export type CalendarRole =
  | "owner"
  | "admin"
  | "editor"
  | "contributor"
  | "viewer";

export type CalendarAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "invite"
  | "manage";

export interface CalendarSettings {
  defaultEventDuration: number; // in minutes
  defaultReminders: number[]; // minutes before event
  allowConflicts: boolean;
  requireApproval: boolean;
  autoAcceptInvitations: boolean;
  showDeclinedEvents: boolean;
  enableNotifications: boolean;
  workingHours: WorkingHours;
  businessDays: WeekDay[];
}

export interface WorkingHours {
  sunday?: WorkingDay;
  monday?: WorkingDay;
  tuesday?: WorkingDay;
  wednesday?: WorkingDay;
  thursday?: WorkingDay;
  friday?: WorkingDay;
  saturday?: WorkingDay;
}

export interface WorkingDay {
  isWorkingDay: boolean;
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  timeZone?: string;
}

export type SyncStatus = "active" | "error" | "paused" | "disabled";

// Calendar Views and Display
export type CalendarView = "month" | "week" | "day" | "agenda" | "year";

export interface CalendarViewSettings {
  defaultView: CalendarView;
  availableViews: CalendarView[];
  showWeekends: boolean;
  showAllDayEvents: boolean;
  showTimeGrid: boolean;
  startHour: number;
  endHour: number;
  slotDuration: number; // minutes
  snapDuration: number; // minutes
  firstDayOfWeek: WeekDay;
}

// Availability and Booking
export interface AvailabilitySlot {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  type: "available" | "busy" | "tentative" | "out-of-office";
  recurring?: RecurrenceRule;
  title?: string;
  isBookable: boolean;
  bookingUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface BookingRequest extends BaseEntity {
  requesterId: string;
  targetUserId: string;
  proposedStartTime: Date;
  proposedEndTime: Date;
  title: string;
  description?: string;
  status: BookingStatus;
  alternativeTimes?: TimeSlot[];
  responseDeadline?: Date;
  bookingMetadata?: Metadata;
}

export type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "expired";

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  preference: number; // 1-5 scale
}

// Meeting Room and Resource Management
export interface Resource extends BaseEntity {
  name: string;
  description?: string;
  type: ResourceType;
  organizationId: string;
  location: string;
  capacity?: number;
  equipment: string[];
  isActive: boolean;
  bookingSettings: ResourceBookingSettings;
  availability: AvailabilitySlot[];
  image?: string;
  resourceMetadata?: Metadata;
}

export type ResourceType =
  | "meeting-room"
  | "desk"
  | "equipment"
  | "vehicle"
  | "other";

export interface ResourceBookingSettings {
  requireApproval: boolean;
  advanceBookingDays: number;
  maxBookingDuration: number; // in minutes
  bufferTime: number; // minutes between bookings
  allowRecurringBookings: boolean;
  approvers: string[];
  bookingInstructions?: string;
}

// Calendar Integration and Sync
export interface CalendarIntegration extends BaseEntity {
  userId: string;
  provider: IntegrationProvider;
  providerAccountId: string;
  providerEmail: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  scopes: string[];
  isActive: boolean;
  syncSettings: SyncSettings;
  lastSyncAt?: Date;
  syncErrors?: SyncError[];
}

export type IntegrationProvider =
  | "google"
  | "outlook"
  | "apple"
  | "exchange"
  | "caldav";

export interface SyncSettings {
  syncDirection: "import" | "export" | "bidirectional";
  syncCalendars: string[]; // External calendar IDs to sync
  conflictResolution: "local" | "remote" | "manual";
  syncFrequency: number; // in minutes
  syncPastDays: number;
  syncFutureDays: number;
}

export interface SyncError {
  timestamp: Date;
  error: string;
  eventId?: string;
  resolution?: string;
}
