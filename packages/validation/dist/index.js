"use strict";
/**
 * Enterprise Lead & Sales CRM — Shared Zod Validation Schemas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.importLeadBatchSchema = exports.importCsvRowSchema = exports.updateProposalSchema = exports.createProposalSchema = exports.updateOpportunitySchema = exports.createOpportunitySchema = exports.updateMeetingSchema = exports.createMeetingSchema = exports.createNoteSchema = exports.completeFollowUpSchema = exports.updateFollowUpSchema = exports.createFollowUpSchema = exports.createCallLogSchema = exports.roundRobinAssignSchema = exports.assignLeadSchema = exports.changeLeadStatusSchema = exports.updateLeadSchema = exports.createLeadSchema = exports.createContactSchema = exports.createCompanySchema = exports.updateUserSchema = exports.createUserSchema = exports.refreshTokenSchema = exports.loginSchema = exports.paginationQuerySchema = exports.emailSchema = exports.phoneSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("@crm/types");
const config_1 = require("@crm/config");
// Common primitives
exports.phoneSchema = zod_1.z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(config_1.REGEX_PATTERNS.PHONE, 'Invalid phone number format');
exports.emailSchema = zod_1.z
    .string()
    .trim()
    .email('Invalid email address')
    .max(150, 'Email cannot exceed 150 characters');
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    search: zod_1.z.string().trim().optional(),
    sortBy: zod_1.z.string().trim().optional(),
    sortOrder: zod_1.z.enum(['ASC', 'DESC', 'asc', 'desc']).default('DESC'),
});
// ==========================================
// AUTH SCHEMAS
// ==========================================
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10, 'Refresh token required'),
});
// ==========================================
// USER & ROLE SCHEMAS
// ==========================================
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: exports.emailSchema,
    phone: exports.phoneSchema,
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role_id: zod_1.z.coerce.number().int().positive('Valid role ID required'),
    manager_id: zod_1.z.coerce.number().int().positive().nullable().optional(),
    status: zod_1.z.nativeEnum(types_1.UserStatus).default(types_1.UserStatus.ACTIVE),
});
exports.updateUserSchema = exports.createUserSchema.partial().omit({ password: true }).extend({
    password: zod_1.z.string().min(6).optional(),
});
// ==========================================
// COMPANY & CONTACT SCHEMAS
// ==========================================
exports.createCompanySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Company name required').max(150),
    industry: zod_1.z.string().trim().max(100).optional(),
    website: zod_1.z.string().trim().max(200).optional().or(zod_1.z.literal('')),
    address: zod_1.z.string().trim().max(255).optional(),
    city: zod_1.z.string().trim().max(100).optional(),
    state: zod_1.z.string().trim().max(100).optional(),
    country: zod_1.z.string().trim().max(100).default('India'),
    pincode: zod_1.z.string().trim().max(20).optional(),
});
exports.createContactSchema = zod_1.z.object({
    company_id: zod_1.z.coerce.number().int().positive('Company ID required'),
    name: zod_1.z.string().trim().min(2, 'Contact name required').max(100),
    designation: zod_1.z.string().trim().max(100).optional(),
    phone: exports.phoneSchema,
    alternate_phone: zod_1.z.string().trim().optional(),
    email: exports.emailSchema.optional().or(zod_1.z.literal('')),
    whatsapp_number: zod_1.z.string().trim().optional(),
});
// ==========================================
// LEAD SCHEMAS
// ==========================================
exports.createLeadSchema = zod_1.z.object({
    company: zod_1.z.object({
        name: zod_1.z.string().trim().min(2, 'Company name required'),
        industry: zod_1.z.string().trim().optional(),
        website: zod_1.z.string().trim().optional(),
        address: zod_1.z.string().trim().optional(),
        city: zod_1.z.string().trim().optional(),
        state: zod_1.z.string().trim().optional(),
        country: zod_1.z.string().trim().optional(),
        pincode: zod_1.z.string().trim().optional(),
    }),
    contact: zod_1.z.object({
        name: zod_1.z.string().trim().min(2, 'Contact name required'),
        designation: zod_1.z.string().trim().optional(),
        phone: exports.phoneSchema,
        alternate_phone: zod_1.z.string().trim().optional(),
        email: exports.emailSchema.optional().or(zod_1.z.literal('')),
        whatsapp_number: zod_1.z.string().trim().optional(),
    }),
    source_id: zod_1.z.coerce.number().int().positive('Source ID required'),
    status_id: zod_1.z.coerce.number().int().positive().optional(),
    telecaller_id: zod_1.z.coerce.number().int().positive().nullable().optional(),
    executive_id: zod_1.z.coerce.number().int().positive().nullable().optional(),
    priority: zod_1.z.nativeEnum(types_1.LeadPriority).default(types_1.LeadPriority.MEDIUM),
    expected_value: zod_1.z.coerce.number().min(0).default(0),
    probability: zod_1.z.coerce.number().min(0).max(100).default(10),
    description: zod_1.z.string().trim().optional(),
    next_followup_at: zod_1.z.string().datetime().optional().nullable(),
});
exports.updateLeadSchema = zod_1.z.object({
    priority: zod_1.z.nativeEnum(types_1.LeadPriority).optional(),
    expected_value: zod_1.z.coerce.number().min(0).optional(),
    probability: zod_1.z.coerce.number().min(0).max(100).optional(),
    description: zod_1.z.string().trim().optional(),
    next_followup_at: zod_1.z.string().datetime().optional().nullable(),
    telecaller_id: zod_1.z.coerce.number().int().positive().nullable().optional(),
    executive_id: zod_1.z.coerce.number().int().positive().nullable().optional(),
    source_id: zod_1.z.coerce.number().int().positive().optional(),
});
exports.changeLeadStatusSchema = zod_1.z.object({
    status_id: zod_1.z.coerce.number().int().positive('Status ID required'),
    lost_reason: zod_1.z.nativeEnum(types_1.LostReason).optional(),
    lost_notes: zod_1.z.string().trim().optional(),
    notes: zod_1.z.string().trim().optional(),
});
exports.assignLeadSchema = zod_1.z.object({
    assigned_to: zod_1.z.coerce.number().int().positive('User ID required to assign'),
    assignment_type: zod_1.z.nativeEnum(types_1.AssignmentType),
    notes: zod_1.z.string().trim().optional(),
});
exports.roundRobinAssignSchema = zod_1.z.object({
    assignment_type: zod_1.z.nativeEnum(types_1.AssignmentType),
    role_id: zod_1.z.coerce.number().int().positive().optional(),
    notes: zod_1.z.string().trim().optional(),
});
// ==========================================
// CALL LOG SCHEMAS
// ==========================================
exports.createCallLogSchema = zod_1.z.object({
    call_type: zod_1.z.nativeEnum(types_1.CallType).default(types_1.CallType.OUTBOUND),
    outcome: zod_1.z.nativeEnum(types_1.CallOutcome),
    duration_seconds: zod_1.z.coerce.number().int().min(0).default(0),
    notes: zod_1.z.string().trim().optional(),
    called_at: zod_1.z.string().datetime().optional(),
    // Optional follow-up creation immediately after call
    next_followup: zod_1.z
        .object({
        type: zod_1.z.nativeEnum(types_1.FollowupType),
        scheduled_at: zod_1.z.string().datetime(),
        notes: zod_1.z.string().trim().optional(),
    })
        .optional(),
});
// ==========================================
// FOLLOW-UP SCHEMAS
// ==========================================
exports.createFollowUpSchema = zod_1.z.object({
    assigned_to: zod_1.z.coerce.number().int().positive().optional(),
    type: zod_1.z.nativeEnum(types_1.FollowupType).default(types_1.FollowupType.CALL),
    scheduled_at: zod_1.z.string().datetime('Valid scheduled ISO date-time required'),
    notes: zod_1.z.string().trim().optional(),
});
exports.updateFollowUpSchema = zod_1.z.object({
    scheduled_at: zod_1.z.string().datetime().optional(),
    type: zod_1.z.nativeEnum(types_1.FollowupType).optional(),
    notes: zod_1.z.string().trim().optional(),
    status: zod_1.z.nativeEnum(types_1.FollowupStatus).optional(),
});
exports.completeFollowUpSchema = zod_1.z.object({
    notes: zod_1.z.string().trim().optional(),
});
// ==========================================
// NOTE SCHEMAS
// ==========================================
exports.createNoteSchema = zod_1.z.object({
    content: zod_1.z.string().trim().min(1, 'Note content required').max(2000),
});
// ==========================================
// MEETING SCHEMAS
// ==========================================
exports.createMeetingSchema = zod_1.z.object({
    assigned_to: zod_1.z.coerce.number().int().positive().optional(),
    title: zod_1.z.string().trim().min(2, 'Meeting title required').max(150),
    meeting_type: zod_1.z.nativeEnum(types_1.MeetingType).default(types_1.MeetingType.ONLINE),
    scheduled_at: zod_1.z.string().datetime('Valid ISO date-time required'),
    location: zod_1.z.string().trim().max(255).optional(),
    notes: zod_1.z.string().trim().optional(),
});
exports.updateMeetingSchema = zod_1.z.object({
    title: zod_1.z.string().trim().optional(),
    meeting_type: zod_1.z.nativeEnum(types_1.MeetingType).optional(),
    scheduled_at: zod_1.z.string().datetime().optional(),
    location: zod_1.z.string().trim().optional(),
    status: zod_1.z.nativeEnum(types_1.MeetingStatus).optional(),
    notes: zod_1.z.string().trim().optional(),
});
// ==========================================
// OPPORTUNITY & PROPOSAL SCHEMAS
// ==========================================
exports.createOpportunitySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Opportunity name required').max(150),
    value: zod_1.z.coerce.number().min(0, 'Value must be positive'),
    probability: zod_1.z.coerce.number().min(0).max(100).default(50),
    stage: zod_1.z.nativeEnum(types_1.OpportunityStage).default(types_1.OpportunityStage.QUALIFICATION),
    expected_close_date: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    assigned_to: zod_1.z.coerce.number().int().positive().optional(),
});
exports.updateOpportunitySchema = exports.createOpportunitySchema.partial().extend({
    lost_reason: zod_1.z.nativeEnum(types_1.LostReason).optional(),
    lost_notes: zod_1.z.string().trim().optional(),
});
exports.createProposalSchema = zod_1.z.object({
    amount: zod_1.z.coerce.number().min(0, 'Proposal amount must be positive'),
    valid_until: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    notes: zod_1.z.string().trim().optional(),
    status: zod_1.z.nativeEnum(types_1.ProposalStatus).default(types_1.ProposalStatus.DRAFT),
});
exports.updateProposalSchema = exports.createProposalSchema.partial();
// ==========================================
// CSV IMPORT SCHEMAS
// ==========================================
exports.importCsvRowSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Contact name required'),
    company: zod_1.z.string().trim().min(1, 'Company name required'),
    phone: exports.phoneSchema,
    alternate_phone: zod_1.z.string().trim().optional(),
    email: exports.emailSchema.optional().or(zod_1.z.literal('')),
    designation: zod_1.z.string().trim().optional(),
    industry: zod_1.z.string().trim().optional(),
    website: zod_1.z.string().trim().optional(),
    address: zod_1.z.string().trim().optional(),
    city: zod_1.z.string().trim().optional(),
    state: zod_1.z.string().trim().optional(),
    source: zod_1.z.string().trim().optional(),
    priority: zod_1.z.nativeEnum(types_1.LeadPriority).optional().default(types_1.LeadPriority.MEDIUM),
    expected_value: zod_1.z.coerce.number().optional().default(0),
    description: zod_1.z.string().trim().optional(),
});
exports.importLeadBatchSchema = zod_1.z.object({
    leads: zod_1.z.array(exports.importCsvRowSchema).min(1, 'At least 1 row required for import'),
    duplicateHandling: zod_1.z.enum(['SKIP', 'UPDATE', 'FAIL']).default('SKIP'),
});
//# sourceMappingURL=index.js.map