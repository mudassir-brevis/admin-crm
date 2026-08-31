/**
 * Enterprise Lead & Sales CRM — Shared Zod Validation Schemas
 */

import { z } from 'zod';
import {
  RoleName,
  UserStatus,
  LeadPriority,
  AssignmentType,
  CallType,
  CallOutcome,
  FollowupType,
  FollowupStatus,
  MeetingType,
  MeetingStatus,
  OpportunityStage,
  ProposalStatus,
  CustomerStatus,
  LostReason,
} from '@crm/types';
import { REGEX_PATTERNS } from '@crm/config';

// Common primitives
export const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Phone number must be at least 7 digits')
  .max(20, 'Phone number cannot exceed 20 characters')
  .regex(REGEX_PATTERNS.PHONE, 'Invalid phone number format');

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .max(150, 'Email cannot exceed 150 characters');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(['ASC', 'DESC', 'asc', 'desc']).default('DESC'),
});

// ==========================================
// AUTH SCHEMAS
// ==========================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token required'),
});

// ==========================================
// USER & ROLE SCHEMAS
// ==========================================

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  phone: phoneSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role_id: z.coerce.number().int().positive('Valid role ID required'),
  manager_id: z.coerce.number().int().positive().nullable().optional(),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true }).extend({
  password: z.string().min(6).optional(),
});

// ==========================================
// COMPANY & CONTACT SCHEMAS
// ==========================================

export const createCompanySchema = z.object({
  name: z.string().trim().min(2, 'Company name required').max(150),
  industry: z.string().trim().max(100).optional(),
  website: z.string().trim().max(200).optional().or(z.literal('')),
  address: z.string().trim().max(255).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).default('India'),
  pincode: z.string().trim().max(20).optional(),
});

export const createContactSchema = z.object({
  company_id: z.coerce.number().int().positive('Company ID required'),
  name: z.string().trim().min(2, 'Contact name required').max(100),
  designation: z.string().trim().max(100).optional(),
  phone: phoneSchema,
  alternate_phone: z.string().trim().optional(),
  email: emailSchema.optional().or(z.literal('')),
  whatsapp_number: z.string().trim().optional(),
});

// ==========================================
// LEAD SCHEMAS
// ==========================================

export const createLeadSchema = z.object({
  company: z.object({
    name: z.string().trim().min(2, 'Company name required'),
    industry: z.string().trim().optional(),
    website: z.string().trim().optional(),
    address: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    country: z.string().trim().optional(),
    pincode: z.string().trim().optional(),
  }),
  contact: z.object({
    name: z.string().trim().min(2, 'Contact name required'),
    designation: z.string().trim().optional(),
    phone: phoneSchema,
    alternate_phone: z.string().trim().optional(),
    email: emailSchema.optional().or(z.literal('')),
    whatsapp_number: z.string().trim().optional(),
  }),
  source_id: z.coerce.number().int().positive('Source ID required'),
  status_id: z.coerce.number().int().positive().optional(),
  telecaller_id: z.coerce.number().int().positive().nullable().optional(),
  executive_id: z.coerce.number().int().positive().nullable().optional(),
  priority: z.nativeEnum(LeadPriority).default(LeadPriority.MEDIUM),
  expected_value: z.coerce.number().min(0).default(0),
  probability: z.coerce.number().min(0).max(100).default(10),
  description: z.string().trim().optional(),
  next_followup_at: z.string().datetime().optional().nullable(),
});

export const updateLeadSchema = z.object({
  priority: z.nativeEnum(LeadPriority).optional(),
  expected_value: z.coerce.number().min(0).optional(),
  probability: z.coerce.number().min(0).max(100).optional(),
  description: z.string().trim().optional(),
  next_followup_at: z.string().datetime().optional().nullable(),
  telecaller_id: z.coerce.number().int().positive().nullable().optional(),
  executive_id: z.coerce.number().int().positive().nullable().optional(),
  source_id: z.coerce.number().int().positive().optional(),
});

export const changeLeadStatusSchema = z.object({
  status_id: z.coerce.number().int().positive('Status ID required'),
  lost_reason: z.nativeEnum(LostReason).optional(),
  lost_notes: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const assignLeadSchema = z.object({
  assigned_to: z.coerce.number().int().positive('User ID required to assign'),
  assignment_type: z.nativeEnum(AssignmentType),
  notes: z.string().trim().optional(),
});

export const roundRobinAssignSchema = z.object({
  assignment_type: z.nativeEnum(AssignmentType),
  role_id: z.coerce.number().int().positive().optional(),
  notes: z.string().trim().optional(),
});

// ==========================================
// CALL LOG SCHEMAS
// ==========================================

export const createCallLogSchema = z.object({
  call_type: z.nativeEnum(CallType).default(CallType.OUTBOUND),
  outcome: z.nativeEnum(CallOutcome),
  duration_seconds: z.coerce.number().int().min(0).default(0),
  notes: z.string().trim().optional(),
  called_at: z.string().datetime().optional(),
  // Optional follow-up creation immediately after call
  next_followup: z
    .object({
      type: z.nativeEnum(FollowupType),
      scheduled_at: z.string().datetime(),
      notes: z.string().trim().optional(),
    })
    .optional(),
});

// ==========================================
// FOLLOW-UP SCHEMAS
// ==========================================

export const createFollowUpSchema = z.object({
  assigned_to: z.coerce.number().int().positive().optional(),
  type: z.nativeEnum(FollowupType).default(FollowupType.CALL),
  scheduled_at: z.string().datetime('Valid scheduled ISO date-time required'),
  notes: z.string().trim().optional(),
});

export const updateFollowUpSchema = z.object({
  scheduled_at: z.string().datetime().optional(),
  type: z.nativeEnum(FollowupType).optional(),
  notes: z.string().trim().optional(),
  status: z.nativeEnum(FollowupStatus).optional(),
});

export const completeFollowUpSchema = z.object({
  notes: z.string().trim().optional(),
});

// ==========================================
// NOTE SCHEMAS
// ==========================================

export const createNoteSchema = z.object({
  content: z.string().trim().min(1, 'Note content required').max(2000),
});

// ==========================================
// MEETING SCHEMAS
// ==========================================

export const createMeetingSchema = z.object({
  assigned_to: z.coerce.number().int().positive().optional(),
  title: z.string().trim().min(2, 'Meeting title required').max(150),
  meeting_type: z.nativeEnum(MeetingType).default(MeetingType.ONLINE),
  scheduled_at: z.string().datetime('Valid ISO date-time required'),
  location: z.string().trim().max(255).optional(),
  notes: z.string().trim().optional(),
});

export const updateMeetingSchema = z.object({
  title: z.string().trim().optional(),
  meeting_type: z.nativeEnum(MeetingType).optional(),
  scheduled_at: z.string().datetime().optional(),
  location: z.string().trim().optional(),
  status: z.nativeEnum(MeetingStatus).optional(),
  notes: z.string().trim().optional(),
});

// ==========================================
// OPPORTUNITY & PROPOSAL SCHEMAS
// ==========================================

export const createOpportunitySchema = z.object({
  name: z.string().trim().min(2, 'Opportunity name required').max(150),
  value: z.coerce.number().min(0, 'Value must be positive'),
  probability: z.coerce.number().min(0).max(100).default(50),
  stage: z.nativeEnum(OpportunityStage).default(OpportunityStage.QUALIFICATION),
  expected_close_date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  assigned_to: z.coerce.number().int().positive().optional(),
});

export const updateOpportunitySchema = createOpportunitySchema.partial().extend({
  lost_reason: z.nativeEnum(LostReason).optional(),
  lost_notes: z.string().trim().optional(),
});

export const createProposalSchema = z.object({
  amount: z.coerce.number().min(0, 'Proposal amount must be positive'),
  valid_until: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  notes: z.string().trim().optional(),
  status: z.nativeEnum(ProposalStatus).default(ProposalStatus.DRAFT),
});

export const updateProposalSchema = createProposalSchema.partial();

// ==========================================
// CSV IMPORT SCHEMAS
// ==========================================

export const importCsvRowSchema = z.object({
  name: z.string().trim().optional(),
  company: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  alternate_phone: z.string().trim().optional(),
  email: z.string().trim().optional().or(z.literal('')),
  designation: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  website: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  source: z.string().trim().optional(),
  priority: z.nativeEnum(LeadPriority).optional().default(LeadPriority.MEDIUM),
  expected_value: z.coerce.number().optional().default(0),
  description: z.string().trim().optional(),
});

export const importLeadBatchSchema = z.object({
  leads: z.array(z.record(z.any())).min(1, 'At least 1 row required for import'),
  duplicateHandling: z.enum(['SKIP', 'FAIL']).default('SKIP'),
  assignmentMode: z.enum(['NONE', 'SPECIFIC', 'ROUND_ROBIN']).default('NONE'),
  telecallerIds: z.array(z.coerce.number().int().positive()).default([]),
});
