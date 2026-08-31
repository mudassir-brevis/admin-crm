"use strict";
/**
 * Enterprise Lead & Sales CRM — Shared Type Definitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.LostReason = exports.CustomerStatus = exports.ProposalStatus = exports.OpportunityStage = exports.MeetingStatus = exports.MeetingType = exports.ActivityType = exports.FollowupStatus = exports.FollowupType = exports.CallOutcome = exports.CallType = exports.AssignmentType = exports.LeadScoreTier = exports.LeadPriority = exports.UserStatus = exports.RoleName = void 0;
// ==========================================
// ENUMS & CONSTANT TYPES
// ==========================================
var RoleName;
(function (RoleName) {
    RoleName["ADMIN"] = "ADMIN";
    RoleName["MANAGER"] = "MANAGER";
    RoleName["TELECALLER"] = "TELECALLER";
    RoleName["EXECUTIVE"] = "EXECUTIVE";
})(RoleName || (exports.RoleName = RoleName = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var LeadPriority;
(function (LeadPriority) {
    LeadPriority["LOW"] = "LOW";
    LeadPriority["MEDIUM"] = "MEDIUM";
    LeadPriority["HIGH"] = "HIGH";
    LeadPriority["URGENT"] = "URGENT";
})(LeadPriority || (exports.LeadPriority = LeadPriority = {}));
var LeadScoreTier;
(function (LeadScoreTier) {
    LeadScoreTier["HOT"] = "HOT";
    LeadScoreTier["WARM"] = "WARM";
    LeadScoreTier["COLD"] = "COLD";
})(LeadScoreTier || (exports.LeadScoreTier = LeadScoreTier = {}));
var AssignmentType;
(function (AssignmentType) {
    AssignmentType["TELECALLER"] = "TELECALLER";
    AssignmentType["EXECUTIVE"] = "EXECUTIVE";
})(AssignmentType || (exports.AssignmentType = AssignmentType = {}));
var CallType;
(function (CallType) {
    CallType["OUTBOUND"] = "OUTBOUND";
    CallType["INBOUND"] = "INBOUND";
})(CallType || (exports.CallType = CallType = {}));
var CallOutcome;
(function (CallOutcome) {
    CallOutcome["CONNECTED"] = "CONNECTED";
    CallOutcome["NOT_CONNECTED"] = "NOT_CONNECTED";
    CallOutcome["BUSY"] = "BUSY";
    CallOutcome["SWITCHED_OFF"] = "SWITCHED_OFF";
    CallOutcome["WRONG_NUMBER"] = "WRONG_NUMBER";
    CallOutcome["CALL_LATER"] = "CALL_LATER";
    CallOutcome["INTERESTED"] = "INTERESTED";
    CallOutcome["NOT_INTERESTED"] = "NOT_INTERESTED";
    CallOutcome["NEED_INFORMATION"] = "NEED_INFORMATION";
    CallOutcome["PRICE_ISSUE"] = "PRICE_ISSUE";
    CallOutcome["DECISION_MAKER_UNAVAILABLE"] = "DECISION_MAKER_UNAVAILABLE";
    CallOutcome["QUALIFIED"] = "QUALIFIED";
})(CallOutcome || (exports.CallOutcome = CallOutcome = {}));
var FollowupType;
(function (FollowupType) {
    FollowupType["CALL"] = "CALL";
    FollowupType["WHATSAPP"] = "WHATSAPP";
    FollowupType["EMAIL"] = "EMAIL";
    FollowupType["MEETING"] = "MEETING";
    FollowupType["VISIT"] = "VISIT";
    FollowupType["DEMO"] = "DEMO";
    FollowupType["PAYMENT"] = "PAYMENT";
})(FollowupType || (exports.FollowupType = FollowupType = {}));
var FollowupStatus;
(function (FollowupStatus) {
    FollowupStatus["PENDING"] = "PENDING";
    FollowupStatus["COMPLETED"] = "COMPLETED";
    FollowupStatus["CANCELLED"] = "CANCELLED";
    FollowupStatus["OVERDUE"] = "OVERDUE";
})(FollowupStatus || (exports.FollowupStatus = FollowupStatus = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["LEAD_CREATED"] = "LEAD_CREATED";
    ActivityType["LEAD_ASSIGNED"] = "LEAD_ASSIGNED";
    ActivityType["LEAD_REASSIGNED"] = "LEAD_REASSIGNED";
    ActivityType["CALL_COMPLETED"] = "CALL_COMPLETED";
    ActivityType["STATUS_CHANGED"] = "STATUS_CHANGED";
    ActivityType["FOLLOWUP_CREATED"] = "FOLLOWUP_CREATED";
    ActivityType["FOLLOWUP_COMPLETED"] = "FOLLOWUP_COMPLETED";
    ActivityType["NOTE_ADDED"] = "NOTE_ADDED";
    ActivityType["MEETING_CREATED"] = "MEETING_CREATED";
    ActivityType["MEETING_COMPLETED"] = "MEETING_COMPLETED";
    ActivityType["OPPORTUNITY_CREATED"] = "OPPORTUNITY_CREATED";
    ActivityType["OPPORTUNITY_UPDATED"] = "OPPORTUNITY_UPDATED";
    ActivityType["PROPOSAL_CREATED"] = "PROPOSAL_CREATED";
    ActivityType["PROPOSAL_SENT"] = "PROPOSAL_SENT";
    ActivityType["WON"] = "WON";
    ActivityType["LOST"] = "LOST";
    ActivityType["CUSTOMER_CONVERTED"] = "CUSTOMER_CONVERTED";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var MeetingType;
(function (MeetingType) {
    MeetingType["ONLINE"] = "ONLINE";
    MeetingType["OFFLINE"] = "OFFLINE";
    MeetingType["VISIT"] = "VISIT";
    MeetingType["DEMO"] = "DEMO";
})(MeetingType || (exports.MeetingType = MeetingType = {}));
var MeetingStatus;
(function (MeetingStatus) {
    MeetingStatus["SCHEDULED"] = "SCHEDULED";
    MeetingStatus["COMPLETED"] = "COMPLETED";
    MeetingStatus["CANCELLED"] = "CANCELLED";
    MeetingStatus["NO_SHOW"] = "NO_SHOW";
})(MeetingStatus || (exports.MeetingStatus = MeetingStatus = {}));
var OpportunityStage;
(function (OpportunityStage) {
    OpportunityStage["QUALIFICATION"] = "QUALIFICATION";
    OpportunityStage["DISCOVERY"] = "DISCOVERY";
    OpportunityStage["PROPOSAL"] = "PROPOSAL";
    OpportunityStage["NEGOTIATION"] = "NEGOTIATION";
    OpportunityStage["CLOSED_WON"] = "CLOSED_WON";
    OpportunityStage["CLOSED_LOST"] = "CLOSED_LOST";
})(OpportunityStage || (exports.OpportunityStage = OpportunityStage = {}));
var ProposalStatus;
(function (ProposalStatus) {
    ProposalStatus["DRAFT"] = "DRAFT";
    ProposalStatus["SENT"] = "SENT";
    ProposalStatus["VIEWED"] = "VIEWED";
    ProposalStatus["ACCEPTED"] = "ACCEPTED";
    ProposalStatus["REJECTED"] = "REJECTED";
    ProposalStatus["EXPIRED"] = "EXPIRED";
})(ProposalStatus || (exports.ProposalStatus = ProposalStatus = {}));
var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["ACTIVE"] = "ACTIVE";
    CustomerStatus["INACTIVE"] = "INACTIVE";
})(CustomerStatus || (exports.CustomerStatus = CustomerStatus = {}));
var LostReason;
(function (LostReason) {
    LostReason["PRICE"] = "PRICE";
    LostReason["COMPETITOR"] = "COMPETITOR";
    LostReason["NO_RESPONSE"] = "NO_RESPONSE";
    LostReason["NO_BUDGET"] = "NO_BUDGET";
    LostReason["REQUIREMENT_CHANGED"] = "REQUIREMENT_CHANGED";
    LostReason["TIMING"] = "TIMING";
    LostReason["NOT_INTERESTED"] = "NOT_INTERESTED";
    LostReason["OTHER"] = "OTHER";
})(LostReason || (exports.LostReason = LostReason = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["LEAD_ASSIGNED"] = "LEAD_ASSIGNED";
    NotificationType["LEAD_REASSIGNED"] = "LEAD_REASSIGNED";
    NotificationType["FOLLOWUP_DUE"] = "FOLLOWUP_DUE";
    NotificationType["FOLLOWUP_OVERDUE"] = "FOLLOWUP_OVERDUE";
    NotificationType["MEETING_REMINDER"] = "MEETING_REMINDER";
    NotificationType["OPPORTUNITY_CREATED"] = "OPPORTUNITY_CREATED";
    NotificationType["PROPOSAL_STATUS_CHANGED"] = "PROPOSAL_STATUS_CHANGED";
    NotificationType["DEAL_WON"] = "DEAL_WON";
    NotificationType["MANAGER_ALERT"] = "MANAGER_ALERT";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=index.js.map