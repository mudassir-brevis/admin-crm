/**
 * Enterprise Lead & Sales CRM — Shared Business Config & Constants
 */
export declare const APP_CONFIG: {
    DEFAULT_TIMEZONE: string;
    PAGINATION: {
        DEFAULT_PAGE: number;
        DEFAULT_LIMIT: number;
        MAX_LIMIT: number;
    };
    LEAD_CODE_PREFIX: string;
    CUSTOMER_CODE_PREFIX: string;
    PROPOSAL_CODE_PREFIX: string;
    JWT: {
        ACCESS_TOKEN_EXPIRY: string;
        REFRESH_TOKEN_EXPIRY: string;
    };
    RATE_LIMIT: {
        WINDOW_MS: number;
        MAX: number;
    };
};
export declare const LEAD_STATUS_NAMES: {
    readonly NEW: "NEW";
    readonly ASSIGNED: "ASSIGNED";
    readonly CONTACTED: "CONTACTED";
    readonly NO_RESPONSE: "NO_RESPONSE";
    readonly INTERESTED: "INTERESTED";
    readonly QUALIFIED: "QUALIFIED";
    readonly EXECUTIVE_ASSIGNED: "EXECUTIVE_ASSIGNED";
    readonly MEETING_SCHEDULED: "MEETING_SCHEDULED";
    readonly PROPOSAL_SENT: "PROPOSAL_SENT";
    readonly NEGOTIATION: "NEGOTIATION";
    readonly WON: "WON";
    readonly LOST: "LOST";
    readonly NOT_INTERESTED: "NOT_INTERESTED";
};
export declare const LEAD_SOURCES_SEED: string[];
export declare const LEAD_STATUSES_SEED: {
    name: string;
    stage: string;
    sort_order: number;
}[];
/**
 * Valid Lead State Machine transitions
 */
export declare const VALID_STATUS_TRANSITIONS: Record<string, string[]>;
export declare const LEAD_SCORING_WEIGHTS: {
    DECISION_MAKER: number;
    BUDGET_CONFIRMED: number;
    REQUIREMENT_CONFIRMED: number;
    VERY_INTERESTED: number;
    MEETING_SCHEDULED: number;
    QUOTATION_REQUESTED: number;
    WHATSAPP_RESPONSE: number;
};
export declare const SCORE_TIERS: {
    HOT_MIN: number;
    WARM_MIN: number;
};
export declare const REGEX_PATTERNS: {
    PHONE: RegExp;
    EMAIL: RegExp;
};
//# sourceMappingURL=index.d.ts.map