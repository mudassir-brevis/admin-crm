/**
 * Enterprise Lead & Sales CRM — Shared Type Definitions
 */

// ==========================================
// ENUMS & CONSTANT TYPES
// ==========================================

export enum RoleName {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TELECALLER = 'TELECALLER',
  EXECUTIVE = 'EXECUTIVE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum LeadPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum LeadScoreTier {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
}

export enum AssignmentType {
  TELECALLER = 'TELECALLER',
  EXECUTIVE = 'EXECUTIVE',
}

export enum CallType {
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND',
}

export enum CallOutcome {
  CONNECTED = 'CONNECTED',
  NOT_CONNECTED = 'NOT_CONNECTED',
  BUSY = 'BUSY',
  SWITCHED_OFF = 'SWITCHED_OFF',
  WRONG_NUMBER = 'WRONG_NUMBER',
  CALL_LATER = 'CALL_LATER',
  INTERESTED = 'INTERESTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
  NEED_INFORMATION = 'NEED_INFORMATION',
  PRICE_ISSUE = 'PRICE_ISSUE',
  DECISION_MAKER_UNAVAILABLE = 'DECISION_MAKER_UNAVAILABLE',
  QUALIFIED = 'QUALIFIED',
}

export enum FollowupType {
  CALL = 'CALL',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  VISIT = 'VISIT',
  DEMO = 'DEMO',
  PAYMENT = 'PAYMENT',
}

export enum FollowupStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
}

export enum ActivityType {
  LEAD_CREATED = 'LEAD_CREATED',
  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
  LEAD_REASSIGNED = 'LEAD_REASSIGNED',
  CALL_COMPLETED = 'CALL_COMPLETED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  FOLLOWUP_CREATED = 'FOLLOWUP_CREATED',
  FOLLOWUP_COMPLETED = 'FOLLOWUP_COMPLETED',
  NOTE_ADDED = 'NOTE_ADDED',
  MEETING_CREATED = 'MEETING_CREATED',
  MEETING_COMPLETED = 'MEETING_COMPLETED',
  OPPORTUNITY_CREATED = 'OPPORTUNITY_CREATED',
  OPPORTUNITY_UPDATED = 'OPPORTUNITY_UPDATED',
  PROPOSAL_CREATED = 'PROPOSAL_CREATED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  WON = 'WON',
  LOST = 'LOST',
  CUSTOMER_CONVERTED = 'CUSTOMER_CONVERTED',
}

export enum MeetingType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  VISIT = 'VISIT',
  DEMO = 'DEMO',
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum OpportunityStage {
  QUALIFICATION = 'QUALIFICATION',
  DISCOVERY = 'DISCOVERY',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum LostReason {
  PRICE = 'PRICE',
  COMPETITOR = 'COMPETITOR',
  NO_RESPONSE = 'NO_RESPONSE',
  NO_BUDGET = 'NO_BUDGET',
  REQUIREMENT_CHANGED = 'REQUIREMENT_CHANGED',
  TIMING = 'TIMING',
  NOT_INTERESTED = 'NOT_INTERESTED',
  OTHER = 'OTHER',
}

export enum NotificationType {
  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
  LEAD_REASSIGNED = 'LEAD_REASSIGNED',
  FOLLOWUP_DUE = 'FOLLOWUP_DUE',
  FOLLOWUP_OVERDUE = 'FOLLOWUP_OVERDUE',
  MEETING_REMINDER = 'MEETING_REMINDER',
  OPPORTUNITY_CREATED = 'OPPORTUNITY_CREATED',
  PROPOSAL_STATUS_CHANGED = 'PROPOSAL_STATUS_CHANGED',
  DEAL_WON = 'DEAL_WON',
  MANAGER_ALERT = 'MANAGER_ALERT',
}

// ==========================================
// RBAC PERMISSIONS
// ==========================================

export type PermissionCode =
  | 'LEAD_VIEW_ALL'
  | 'LEAD_VIEW_ASSIGNED'
  | 'LEAD_CREATE'
  | 'LEAD_UPDATE'
  | 'LEAD_DELETE'
  | 'LEAD_ASSIGN'
  | 'CALL_CREATE'
  | 'CALL_VIEW'
  | 'FOLLOWUP_CREATE'
  | 'FOLLOWUP_VIEW'
  | 'FOLLOWUP_UPDATE'
  | 'NOTE_CREATE'
  | 'NOTE_UPDATE'
  | 'NOTE_DELETE'
  | 'ACTIVITY_VIEW'
  | 'MEETING_CREATE'
  | 'MEETING_VIEW'
  | 'MEETING_UPDATE'
  | 'OPPORTUNITY_CREATE'
  | 'OPPORTUNITY_VIEW'
  | 'OPPORTUNITY_UPDATE'
  | 'PROPOSAL_CREATE'
  | 'PROPOSAL_VIEW'
  | 'PROPOSAL_UPDATE'
  | 'CUSTOMER_VIEW'
  | 'CUSTOMER_UPDATE'
  | 'REPORT_VIEW'
  | 'TEAM_VIEW'
  | 'USER_CREATE'
  | 'USER_VIEW'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'ROLE_MANAGE'
  | 'SYSTEM_SETTINGS'
  | 'AUDIT_LOG_VIEW'
  | 'LEAD_IMPORT'
  | 'LEAD_EXPORT';

// ==========================================
// CORE DATA ENTITIES
// ==========================================

export interface Role {
  id: number;
  name: RoleName | string;
  description: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: PermissionCode | string;
  description: string;
  created_at: string;
}

export interface User {
  id: number;
  role_id: number;
  manager_id?: number | null;
  name: string;
  email: string;
  phone: string;
  password_hash?: string;
  status: UserStatus;
  permissions?: PermissionCode[];
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  role?: Role;
  manager?: User | null;
  subordinates?: User[];
}

export interface Company {
  id: number;
  name: string;
  industry?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  contacts?: Contact[];
  leads?: Lead[];
}

export interface Contact {
  id: number;
  company_id: number;
  name: string;
  designation?: string | null;
  phone: string;
  alternate_phone?: string | null;
  email?: string | null;
  whatsapp_number?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  company?: Company;
}

export interface LeadSource {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface LeadStatus {
  id: number;
  name: string;
  stage: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: number;
  lead_code: string;
  company_id: number;
  contact_id: number;
  source_id: number;
  status_id: number;
  created_by: number;
  telecaller_id?: number | null;
  executive_id?: number | null;
  priority: LeadPriority;
  score: number;
  expected_value: number;
  probability: number;
  next_followup_at?: string | null;
  lost_reason?: LostReason | string | null;
  lost_notes?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // Relations
  company?: Company;
  contact?: Contact;
  source?: LeadSource;
  status?: LeadStatus;
  creator?: User;
  telecaller?: User | null;
  executive?: User | null;
  assignments?: LeadAssignment[];
  call_logs?: CallLog[];
  follow_ups?: FollowUp[];
  activities?: Activity[];
  notes?: Note[];
  meetings?: Meeting[];
  opportunities?: Opportunity[];
  customer?: Customer | null;
}

export interface LeadAssignment {
  id: number;
  lead_id: number;
  assigned_to: number;
  assigned_by: number;
  assignment_type: AssignmentType;
  assigned_at: string;
  unassigned_at?: string | null;
  notes?: string | null;
  user?: User;
  assigner?: User;
}

export interface CallLog {
  id: number;
  lead_id: number;
  user_id: number;
  call_type: CallType;
  outcome: CallOutcome;
  duration_seconds: number;
  notes?: string | null;
  called_at: string;
  lead?: Lead;
  user?: User;
}

export interface FollowUp {
  id: number;
  lead_id: number;
  assigned_to: number;
  created_by: number;
  type: FollowupType;
  scheduled_at: string;
  status: FollowupStatus;
  notes?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  lead?: Lead;
  assignee?: User;
  creator?: User;
}

export interface Activity {
  id: number;
  lead_id: number;
  user_id: number;
  activity_type: ActivityType | string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
  user?: User;
  lead?: Lead;
}

export interface Note {
  id: number;
  lead_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  user?: User;
}

export interface Meeting {
  id: number;
  lead_id: number;
  assigned_to: number;
  title: string;
  meeting_type: MeetingType;
  scheduled_at: string;
  location?: string | null;
  status: MeetingStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  lead?: Lead;
  assignee?: User;
}

export interface Opportunity {
  id: number;
  lead_id: number;
  name: string;
  value: number;
  probability: number;
  stage: OpportunityStage;
  expected_close_date: string;
  assigned_to: number;
  created_at: string;
  updated_at: string;
  lead?: Lead;
  assignee?: User;
  proposals?: Proposal[];
}

export interface Proposal {
  id: number;
  opportunity_id: number;
  proposal_number: string;
  amount: number;
  status: ProposalStatus;
  sent_at?: string | null;
  valid_until: string;
  notes?: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  opportunity?: Opportunity;
  creator?: User;
}

export interface Customer {
  id: number;
  company_id: number;
  primary_contact_id: number;
  converted_from_lead_id: number;
  customer_code: string;
  status: CustomerStatus;
  created_at: string;
  updated_at: string;
  company?: Company;
  primary_contact?: Contact;
  converted_from_lead?: Lead;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType | string;
  reference_type?: string | null;
  reference_id?: number | null;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number | null;
  action: string;
  entity_type: string;
  entity_id: number;
  old_data?: Record<string, any> | null;
  new_data?: Record<string, any> | null;
  ip_address?: string | null;
  created_at: string;
  user?: User;
}

// ==========================================
// API REQUEST & RESPONSE STANDARDS
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  error?: ApiErrorPayload;
  errors?: ApiValidationErrorItem[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorPayload {
  code: string;
  details?: any;
}

export interface ApiValidationErrorItem {
  field: string;
  message: string;
}

// ==========================================
// AUTH DTOs & JWT
// ==========================================

export interface JwtUserPayload {
  id: number;
  email: string;
  name: string;
  role: RoleName | string;
  role_id: number;
  permissions: PermissionCode[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: RoleName | string;
    role_id: number;
    permissions: PermissionCode[];
  };
}

// ==========================================
// LEAD SCORING CRITERIA
// ==========================================

export interface LeadScoreFactors {
  isDecisionMaker?: boolean; // +20
  isBudgetConfirmed?: boolean; // +20
  isRequirementConfirmed?: boolean; // +20
  isVeryInterested?: boolean; // +15
  isMeetingScheduled?: boolean; // +10
  isQuotationRequested?: boolean; // +10
  isWhatsappResponseReceived?: boolean; // +5
}

// ==========================================
// IMPORT & DUPLICATE DETECTION
// ==========================================

export interface LeadImportRow {
  name: string;
  company: string;
  phone: string;
  alternate_phone?: string;
  email?: string;
  designation?: string;
  industry?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  source?: string;
  priority?: LeadPriority;
  expected_value?: number;
  description?: string;
}

export interface LeadImportResult {
  totalRows: number;
  successful: number;
  duplicates: number;
  failed: number;
  duplicateDetails: Array<{
    row: number;
    phone?: string;
    email?: string;
    company?: string;
    reason: string;
  }>;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
  importedLeadIds: number[];
  assigned: number;
  assignmentSummary: Array<{ telecallerId: number; telecallerName: string; leadCount: number }>;
}

// ==========================================
// DASHBOARDS & REPORTS DTOs
// ==========================================

export interface TelecallerDashboardData {
  totalAssignedLeads: number;
  todayCallsCount: number;
  completedCallsCount: number;
  pendingCallsCount: number;
  pendingFollowupsCount: number;
  overdueFollowupsCount: number;
  hotLeadsCount: number;
  qualifiedLeadsCount: number;
  recentCalls: CallLog[];
  todayFollowups: FollowUp[];
}

export interface ExecutiveDashboardData {
  assignedLeadsCount: number;
  todayMeetingsCount: number;
  upcomingMeetingsCount: number;
  pendingFollowupsCount: number;
  openOpportunitiesCount: number;
  proposalsCount: number;
  wonDealsCount: number;
  lostDealsCount: number;
  pipelineRevenue: number;
  todayMeetings: Meeting[];
  activeOpportunities: Opportunity[];
}

export interface ManagerDashboardData {
  totalLeads: number;
  newLeads: number;
  assignedLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  qualifiedLeads: number;
  meetingsScheduled: number;
  proposalsSent: number;
  wonCount: number;
  lostCount: number;
  pipelineValue: number;
  conversionRate: number;
  totalCallsToday: number;
  pendingFollowups: number;
  overdueFollowups: number;
  telecallerPerformance: Array<{
    userId: number;
    name: string;
    assigned: number;
    calls: number;
    connected: number;
    interested: number;
    qualified: number;
    overdueFollowups: number;
  }>;
  executivePerformance: Array<{
    userId: number;
    name: string;
    opportunities: number;
    meetings: number;
    proposals: number;
    won: number;
    lost: number;
    revenue: number;
    conversionRate: number;
  }>;
}

export interface AdminDashboardData extends ManagerDashboardData {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  totalCustomers: number;
  systemHealth: {
    database: string;
    redis: string;
    uptimeSeconds: number;
  };
}
