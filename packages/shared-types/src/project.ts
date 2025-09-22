import type {
  BaseEntity,
  SoftDeletable,
  Status,
  ID,
  DateRange,
  Metadata,
} from "./common";

// Project management types
export interface Project extends BaseEntity, SoftDeletable {
  name: string;
  description?: string;
  slug: string;
  organizationId: string;
  departmentId?: string;
  ownerId: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  visibility: ProjectVisibility;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  currency?: string;
  tags: string[];
  settings: ProjectSettings;
  progress: number; // 0-100
  memberCount: number;
  taskCount: number;
  completedTaskCount: number;
}

export type ProjectStatus =
  | "planning"
  | "active"
  | "on-hold"
  | "completed"
  | "cancelled"
  | "archived";

export type ProjectPriority = "low" | "medium" | "high" | "critical";

export type ProjectVisibility = "public" | "private" | "team" | "department";

export interface ProjectSettings {
  allowTimeTracking: boolean;
  requireTaskApproval: boolean;
  enableNotifications: boolean;
  autoArchiveCompleted: boolean;
  defaultTaskPriority: TaskPriority;
  workingDays: number[]; // 0=Sunday, 1=Monday, etc.
  estimationUnit: "hours" | "days" | "story-points";
}

// Task management
export interface Task extends BaseEntity, SoftDeletable {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  creatorId: string;
  parentTaskId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  labels: string[];
  estimate?: number; // In hours or story points
  actualTime?: number; // In hours
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  position: number; // For ordering within columns/lists
  attachments: TaskAttachment[];
  comments: TaskComment[];
  dependencies: TaskDependency[];
  customFields: Record<string, unknown>;
}

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in-progress"
  | "review"
  | "testing"
  | "done"
  | "cancelled";

export type TaskPriority = "lowest" | "low" | "medium" | "high" | "highest";

export type TaskType = "story" | "bug" | "task" | "epic" | "subtask";

export interface TaskAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskComment extends BaseEntity {
  taskId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
  attachments?: TaskAttachment[];
  reactions: TaskReaction[];
  isEdited: boolean;
  editedAt?: Date;
}

export interface TaskReaction {
  emoji: string;
  userId: string;
  createdAt: Date;
}

export interface TaskDependency {
  id: string;
  dependentTaskId: string;
  dependsOnTaskId: string;
  type: "blocks" | "is-blocked-by" | "relates-to";
  createdBy: string;
  createdAt: Date;
}

// Kanban Board types
export interface KanbanBoard extends BaseEntity, SoftDeletable {
  name: string;
  description?: string;
  projectId: string;
  organizationId: string;
  createdBy: string;
  isDefault: boolean;
  settings: KanbanSettings;
  columns: KanbanColumn[];
}

export interface KanbanSettings {
  wipLimits: Record<string, number>; // columnId -> limit
  autoMoveRules: AutoMoveRule[];
  cardTemplate: KanbanCardTemplate;
  allowedTaskTypes: TaskType[];
}

export interface AutoMoveRule {
  id: string;
  name: string;
  trigger: "status-change" | "assignee-change" | "due-date" | "time-based";
  condition: Record<string, unknown>;
  action: "move-to-column" | "assign-to" | "add-label" | "send-notification";
  parameters: Record<string, unknown>;
  isActive: boolean;
}

export interface KanbanCardTemplate {
  showAssignee: boolean;
  showDueDate: boolean;
  showPriority: boolean;
  showLabels: boolean;
  showEstimate: boolean;
  showProgress: boolean;
  customFields: string[];
}

export interface KanbanColumn extends BaseEntity {
  boardId: string;
  name: string;
  description?: string;
  color?: string;
  position: number;
  isCollapsed: boolean;
  taskStatuses: TaskStatus[];
  wipLimit?: number;
  settings: KanbanColumnSettings;
}

export interface KanbanColumnSettings {
  allowTaskCreation: boolean;
  autoAssignTasks: boolean;
  defaultAssigneeId?: string;
  requireDueDate: boolean;
  allowedPriorities: TaskPriority[];
}

export interface KanbanCard {
  taskId: string;
  columnId: string;
  position: number;
  isCollapsed: boolean;
  customDisplay?: Record<string, unknown>;
}

// Project Member and Role management
export interface ProjectMember extends BaseEntity {
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  invitedBy: string;
  permissions: ProjectPermission[];
  isActive: boolean;
}

export type ProjectRole =
  | "owner"
  | "admin"
  | "manager"
  | "developer"
  | "viewer"
  | "guest";

export interface ProjectPermission {
  resource: ProjectResource;
  actions: ProjectAction[];
}

export type ProjectResource =
  | "project"
  | "task"
  | "board"
  | "member"
  | "comment"
  | "attachment"
  | "report";

export type ProjectAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "assign"
  | "comment";

// Project Templates
export interface ProjectTemplate extends BaseEntity {
  name: string;
  description?: string;
  category: string;
  isPublic: boolean;
  createdBy: string;
  organizationId?: string;
  usageCount: number;
  structure: ProjectTemplateStructure;
  defaultSettings: ProjectSettings;
  tags: string[];
}

export interface ProjectTemplateStructure {
  boards: Omit<KanbanBoard, "id" | "projectId" | "createdAt" | "updatedAt">[];
  taskTemplates: TaskTemplate[];
  milestones: ProjectMilestone[];
  roles: ProjectRole[];
}

export interface TaskTemplate {
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  estimate?: number;
  labels: string[];
  dependencies: string[]; // References to other task templates
}

export interface ProjectMilestone extends BaseEntity {
  projectId: string;
  name: string;
  description?: string;
  dueDate: Date;
  status: "upcoming" | "in-progress" | "completed" | "overdue";
  progress: number;
  taskIds: string[];
}

// Time tracking
export interface TimeEntry extends BaseEntity {
  taskId: string;
  userId: string;
  projectId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  description?: string;
  isManual: boolean;
  isBillable: boolean;
  rate?: number;
  tags: string[];
}

// Project Analytics
export interface ProjectAnalytics {
  projectId: string;
  period: DateRange;
  metrics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    averageCompletionTime: number; // in hours
    burndownData: BurndownPoint[];
    velocityData: VelocityPoint[];
    memberProductivity: MemberProductivity[];
    taskDistribution: TaskDistribution;
  };
}

export interface BurndownPoint {
  date: Date;
  remainingTasks: number;
  idealRemaining: number;
}

export interface VelocityPoint {
  sprint: string;
  completed: number;
  planned: number;
}

export interface MemberProductivity {
  userId: string;
  tasksCompleted: number;
  avgCompletionTime: number;
  timeLogged: number;
}

export interface TaskDistribution {
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  byType: Record<TaskType, number>;
  byAssignee: Record<string, number>;
}
