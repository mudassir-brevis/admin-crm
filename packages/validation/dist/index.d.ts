/**
 * Enterprise Lead & Sales CRM — Shared Zod Validation Schemas
 */
import { z } from 'zod';
import { UserStatus, LeadPriority, AssignmentType, CallType, CallOutcome, FollowupType, FollowupStatus, MeetingType, MeetingStatus, OpportunityStage, ProposalStatus, LostReason } from '@crm/types';
export declare const phoneSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["ASC", "DESC", "asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "ASC" | "DESC" | "asc" | "desc";
    search?: string | undefined;
    sortBy?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "ASC" | "DESC" | "asc" | "desc" | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    role_id: z.ZodNumber;
    manager_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof UserStatus>>;
}, "strip", z.ZodTypeAny, {
    status: UserStatus;
    email: string;
    password: string;
    name: string;
    phone: string;
    role_id: number;
    manager_id?: number | null | undefined;
}, {
    email: string;
    password: string;
    name: string;
    phone: string;
    role_id: number;
    status?: UserStatus | undefined;
    manager_id?: number | null | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<Omit<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role_id: z.ZodOptional<z.ZodNumber>;
    manager_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof UserStatus>>>;
}, "password"> & {
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: UserStatus | undefined;
    email?: string | undefined;
    password?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    role_id?: number | undefined;
    manager_id?: number | null | undefined;
}, {
    status?: UserStatus | undefined;
    email?: string | undefined;
    password?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    role_id?: number | undefined;
    manager_id?: number | null | undefined;
}>;
export declare const createCompanySchema: z.ZodObject<{
    name: z.ZodString;
    industry: z.ZodOptional<z.ZodString>;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    country: z.ZodDefault<z.ZodString>;
    pincode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    country: string;
    industry?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    pincode?: string | undefined;
}, {
    name: string;
    industry?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    pincode?: string | undefined;
}>;
export declare const createContactSchema: z.ZodObject<{
    company_id: z.ZodNumber;
    name: z.ZodString;
    designation: z.ZodOptional<z.ZodString>;
    phone: z.ZodString;
    alternate_phone: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    whatsapp_number: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    company_id: number;
    email?: string | undefined;
    designation?: string | undefined;
    alternate_phone?: string | undefined;
    whatsapp_number?: string | undefined;
}, {
    name: string;
    phone: string;
    company_id: number;
    email?: string | undefined;
    designation?: string | undefined;
    alternate_phone?: string | undefined;
    whatsapp_number?: string | undefined;
}>;
export declare const createLeadSchema: z.ZodObject<{
    company: z.ZodObject<{
        name: z.ZodString;
        industry: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        pincode: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        industry?: string | undefined;
        website?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        country?: string | undefined;
        pincode?: string | undefined;
    }, {
        name: string;
        industry?: string | undefined;
        website?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        country?: string | undefined;
        pincode?: string | undefined;
    }>;
    contact: z.ZodObject<{
        name: z.ZodString;
        designation: z.ZodOptional<z.ZodString>;
        phone: z.ZodString;
        alternate_phone: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        whatsapp_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
        email?: string | undefined;
        designation?: string | undefined;
        alternate_phone?: string | undefined;
        whatsapp_number?: string | undefined;
    }, {
        name: string;
        phone: string;
        email?: string | undefined;
        designation?: string | undefined;
        alternate_phone?: string | undefined;
        whatsapp_number?: string | undefined;
    }>;
    source_id: z.ZodNumber;
    status_id: z.ZodOptional<z.ZodNumber>;
    telecaller_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    executive_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    priority: z.ZodDefault<z.ZodNativeEnum<typeof LeadPriority>>;
    expected_value: z.ZodDefault<z.ZodNumber>;
    probability: z.ZodDefault<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    next_followup_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    company: {
        name: string;
        industry?: string | undefined;
        website?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        country?: string | undefined;
        pincode?: string | undefined;
    };
    contact: {
        name: string;
        phone: string;
        email?: string | undefined;
        designation?: string | undefined;
        alternate_phone?: string | undefined;
        whatsapp_number?: string | undefined;
    };
    source_id: number;
    priority: LeadPriority;
    expected_value: number;
    probability: number;
    status_id?: number | undefined;
    telecaller_id?: number | null | undefined;
    executive_id?: number | null | undefined;
    description?: string | undefined;
    next_followup_at?: string | null | undefined;
}, {
    company: {
        name: string;
        industry?: string | undefined;
        website?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        country?: string | undefined;
        pincode?: string | undefined;
    };
    contact: {
        name: string;
        phone: string;
        email?: string | undefined;
        designation?: string | undefined;
        alternate_phone?: string | undefined;
        whatsapp_number?: string | undefined;
    };
    source_id: number;
    status_id?: number | undefined;
    telecaller_id?: number | null | undefined;
    executive_id?: number | null | undefined;
    priority?: LeadPriority | undefined;
    expected_value?: number | undefined;
    probability?: number | undefined;
    description?: string | undefined;
    next_followup_at?: string | null | undefined;
}>;
export declare const updateLeadSchema: z.ZodObject<{
    priority: z.ZodOptional<z.ZodNativeEnum<typeof LeadPriority>>;
    expected_value: z.ZodOptional<z.ZodNumber>;
    probability: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    next_followup_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    telecaller_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    executive_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    source_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    source_id?: number | undefined;
    telecaller_id?: number | null | undefined;
    executive_id?: number | null | undefined;
    priority?: LeadPriority | undefined;
    expected_value?: number | undefined;
    probability?: number | undefined;
    description?: string | undefined;
    next_followup_at?: string | null | undefined;
}, {
    source_id?: number | undefined;
    telecaller_id?: number | null | undefined;
    executive_id?: number | null | undefined;
    priority?: LeadPriority | undefined;
    expected_value?: number | undefined;
    probability?: number | undefined;
    description?: string | undefined;
    next_followup_at?: string | null | undefined;
}>;
export declare const changeLeadStatusSchema: z.ZodObject<{
    status_id: z.ZodNumber;
    lost_reason: z.ZodOptional<z.ZodNativeEnum<typeof LostReason>>;
    lost_notes: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status_id: number;
    lost_reason?: LostReason | undefined;
    lost_notes?: string | undefined;
    notes?: string | undefined;
}, {
    status_id: number;
    lost_reason?: LostReason | undefined;
    lost_notes?: string | undefined;
    notes?: string | undefined;
}>;
export declare const assignLeadSchema: z.ZodObject<{
    assigned_to: z.ZodNumber;
    assignment_type: z.ZodNativeEnum<typeof AssignmentType>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assigned_to: number;
    assignment_type: AssignmentType;
    notes?: string | undefined;
}, {
    assigned_to: number;
    assignment_type: AssignmentType;
    notes?: string | undefined;
}>;
export declare const roundRobinAssignSchema: z.ZodObject<{
    assignment_type: z.ZodNativeEnum<typeof AssignmentType>;
    role_id: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assignment_type: AssignmentType;
    role_id?: number | undefined;
    notes?: string | undefined;
}, {
    assignment_type: AssignmentType;
    role_id?: number | undefined;
    notes?: string | undefined;
}>;
export declare const createCallLogSchema: z.ZodObject<{
    call_type: z.ZodDefault<z.ZodNativeEnum<typeof CallType>>;
    outcome: z.ZodNativeEnum<typeof CallOutcome>;
    duration_seconds: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    called_at: z.ZodOptional<z.ZodString>;
    next_followup: z.ZodOptional<z.ZodObject<{
        type: z.ZodNativeEnum<typeof FollowupType>;
        scheduled_at: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: FollowupType;
        scheduled_at: string;
        notes?: string | undefined;
    }, {
        type: FollowupType;
        scheduled_at: string;
        notes?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    call_type: CallType;
    outcome: CallOutcome;
    duration_seconds: number;
    notes?: string | undefined;
    called_at?: string | undefined;
    next_followup?: {
        type: FollowupType;
        scheduled_at: string;
        notes?: string | undefined;
    } | undefined;
}, {
    outcome: CallOutcome;
    notes?: string | undefined;
    call_type?: CallType | undefined;
    duration_seconds?: number | undefined;
    called_at?: string | undefined;
    next_followup?: {
        type: FollowupType;
        scheduled_at: string;
        notes?: string | undefined;
    } | undefined;
}>;
export declare const createFollowUpSchema: z.ZodObject<{
    assigned_to: z.ZodOptional<z.ZodNumber>;
    type: z.ZodDefault<z.ZodNativeEnum<typeof FollowupType>>;
    scheduled_at: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: FollowupType;
    scheduled_at: string;
    notes?: string | undefined;
    assigned_to?: number | undefined;
}, {
    scheduled_at: string;
    type?: FollowupType | undefined;
    notes?: string | undefined;
    assigned_to?: number | undefined;
}>;
export declare const updateFollowUpSchema: z.ZodObject<{
    scheduled_at: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof FollowupType>>;
    notes: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof FollowupStatus>>;
}, "strip", z.ZodTypeAny, {
    type?: FollowupType | undefined;
    status?: FollowupStatus | undefined;
    notes?: string | undefined;
    scheduled_at?: string | undefined;
}, {
    type?: FollowupType | undefined;
    status?: FollowupStatus | undefined;
    notes?: string | undefined;
    scheduled_at?: string | undefined;
}>;
export declare const completeFollowUpSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
}, {
    notes?: string | undefined;
}>;
export declare const createNoteSchema: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export declare const createMeetingSchema: z.ZodObject<{
    assigned_to: z.ZodOptional<z.ZodNumber>;
    title: z.ZodString;
    meeting_type: z.ZodDefault<z.ZodNativeEnum<typeof MeetingType>>;
    scheduled_at: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    scheduled_at: string;
    title: string;
    meeting_type: MeetingType;
    notes?: string | undefined;
    assigned_to?: number | undefined;
    location?: string | undefined;
}, {
    scheduled_at: string;
    title: string;
    notes?: string | undefined;
    assigned_to?: number | undefined;
    meeting_type?: MeetingType | undefined;
    location?: string | undefined;
}>;
export declare const updateMeetingSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    meeting_type: z.ZodOptional<z.ZodNativeEnum<typeof MeetingType>>;
    scheduled_at: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof MeetingStatus>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: MeetingStatus | undefined;
    notes?: string | undefined;
    scheduled_at?: string | undefined;
    title?: string | undefined;
    meeting_type?: MeetingType | undefined;
    location?: string | undefined;
}, {
    status?: MeetingStatus | undefined;
    notes?: string | undefined;
    scheduled_at?: string | undefined;
    title?: string | undefined;
    meeting_type?: MeetingType | undefined;
    location?: string | undefined;
}>;
export declare const createOpportunitySchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodNumber;
    probability: z.ZodDefault<z.ZodNumber>;
    stage: z.ZodDefault<z.ZodNativeEnum<typeof OpportunityStage>>;
    expected_close_date: z.ZodUnion<[z.ZodString, z.ZodString]>;
    assigned_to: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value: number;
    name: string;
    probability: number;
    stage: OpportunityStage;
    expected_close_date: string;
    assigned_to?: number | undefined;
}, {
    value: number;
    name: string;
    expected_close_date: string;
    probability?: number | undefined;
    assigned_to?: number | undefined;
    stage?: OpportunityStage | undefined;
}>;
export declare const updateOpportunitySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodNumber>;
    probability: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    stage: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof OpportunityStage>>>;
    expected_close_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    assigned_to: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
} & {
    lost_reason: z.ZodOptional<z.ZodNativeEnum<typeof LostReason>>;
    lost_notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value?: number | undefined;
    name?: string | undefined;
    probability?: number | undefined;
    lost_reason?: LostReason | undefined;
    lost_notes?: string | undefined;
    assigned_to?: number | undefined;
    stage?: OpportunityStage | undefined;
    expected_close_date?: string | undefined;
}, {
    value?: number | undefined;
    name?: string | undefined;
    probability?: number | undefined;
    lost_reason?: LostReason | undefined;
    lost_notes?: string | undefined;
    assigned_to?: number | undefined;
    stage?: OpportunityStage | undefined;
    expected_close_date?: string | undefined;
}>;
export declare const createProposalSchema: z.ZodObject<{
    amount: z.ZodNumber;
    valid_until: z.ZodUnion<[z.ZodString, z.ZodString]>;
    notes: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof ProposalStatus>>;
}, "strip", z.ZodTypeAny, {
    status: ProposalStatus;
    amount: number;
    valid_until: string;
    notes?: string | undefined;
}, {
    amount: number;
    valid_until: string;
    status?: ProposalStatus | undefined;
    notes?: string | undefined;
}>;
export declare const updateProposalSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    valid_until: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof ProposalStatus>>>;
}, "strip", z.ZodTypeAny, {
    status?: ProposalStatus | undefined;
    notes?: string | undefined;
    amount?: number | undefined;
    valid_until?: string | undefined;
}, {
    status?: ProposalStatus | undefined;
    notes?: string | undefined;
    amount?: number | undefined;
    valid_until?: string | undefined;
}>;
export declare const importCsvRowSchema: z.ZodObject<{
    name: z.ZodString;
    company: z.ZodString;
    phone: z.ZodString;
    alternate_phone: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    designation: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    priority: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof LeadPriority>>>;
    expected_value: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    company: string;
    priority: LeadPriority;
    expected_value: number;
    email?: string | undefined;
    industry?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    designation?: string | undefined;
    alternate_phone?: string | undefined;
    description?: string | undefined;
    source?: string | undefined;
}, {
    name: string;
    phone: string;
    company: string;
    email?: string | undefined;
    industry?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    designation?: string | undefined;
    alternate_phone?: string | undefined;
    priority?: LeadPriority | undefined;
    expected_value?: number | undefined;
    description?: string | undefined;
    source?: string | undefined;
}>;
export declare const importLeadBatchSchema: z.ZodObject<{
    leads: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        company: z.ZodString;
        phone: z.ZodString;
        alternate_phone: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        designation: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
        priority: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof LeadPriority>>>;
        expected_value: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
        company: string;
        priority: LeadPriority;
        expected_value: number;
        email?: string | undefined;
        industry?: string | undefined;
        website?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        designation?: string | undefined;
        alternate_phone?: string | undefined;
        description?: string | undefined;
        source?: string | undefined;
    }, {
        name: string;
        phone: string;
        company: string;
        email?: string | undefined;
        industry?: string | undefined;
        website?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        designation?: string | undefined;
        alternate_phone?: string | undefined;
        priority?: LeadPriority | undefined;
        expected_value?: number | undefined;
        description?: string | undefined;
        source?: string | undefined;
    }>, "many">;
    duplicateHandling: z.ZodDefault<z.ZodEnum<["SKIP", "UPDATE", "FAIL"]>>;
}, "strip", z.ZodTypeAny, {
    leads: {
        name: string;
        phone: string;
        company: string;
        priority: LeadPriority;
        expected_value: number;
        email?: string | undefined;
        industry?: string | undefined;
        website?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        designation?: string | undefined;
        alternate_phone?: string | undefined;
        description?: string | undefined;
        source?: string | undefined;
    }[];
    duplicateHandling: "SKIP" | "UPDATE" | "FAIL";
}, {
    leads: {
        name: string;
        phone: string;
        company: string;
        email?: string | undefined;
        industry?: string | undefined;
        website?: string | undefined;
        address?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        designation?: string | undefined;
        alternate_phone?: string | undefined;
        priority?: LeadPriority | undefined;
        expected_value?: number | undefined;
        description?: string | undefined;
        source?: string | undefined;
    }[];
    duplicateHandling?: "SKIP" | "UPDATE" | "FAIL" | undefined;
}>;
//# sourceMappingURL=index.d.ts.map