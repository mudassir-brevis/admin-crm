/**
 * Enterprise Lead & Sales CRM — Shared Business Config & Constants
 */

export const APP_CONFIG = {
  DEFAULT_TIMEZONE: 'Asia/Kolkata',
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  LEAD_CODE_PREFIX: 'LD-',
  CUSTOMER_CODE_PREFIX: 'CUST-',
  PROPOSAL_CODE_PREFIX: 'PROP-',
  JWT: {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
  },
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX: 1000,
  },
};

export const LEAD_STATUS_NAMES = {
  NEW: 'NEW',
  ASSIGNED: 'ASSIGNED',
  CONTACTED: 'CONTACTED',
  NO_RESPONSE: 'NO_RESPONSE',
  INTERESTED: 'INTERESTED',
  QUALIFIED: 'QUALIFIED',
  EXECUTIVE_ASSIGNED: 'EXECUTIVE_ASSIGNED',
  MEETING_SCHEDULED: 'MEETING_SCHEDULED',
  PROPOSAL_SENT: 'PROPOSAL_SENT',
  NEGOTIATION: 'NEGOTIATION',
  WON: 'WON',
  LOST: 'LOST',
  NOT_INTERESTED: 'NOT_INTERESTED',
} as const;

export const LEAD_SOURCES_SEED = [
  'Website',
  'Google Ads',
  'Facebook',
  'Instagram',
  'Referral',
  'IndiaMART',
  'Justdial',
  'Cold Calling',
  'Walk-in',
  'Import',
  'Manual',
];

export const LEAD_STATUSES_SEED = [
  { name: 'NEW', stage: 'DISCOVERY', sort_order: 1 },
  { name: 'ASSIGNED', stage: 'DISCOVERY', sort_order: 2 },
  { name: 'CONTACTED', stage: 'CONTACT', sort_order: 3 },
  { name: 'NO_RESPONSE', stage: 'CONTACT', sort_order: 4 },
  { name: 'INTERESTED', stage: 'QUALIFICATION', sort_order: 5 },
  { name: 'NOT_INTERESTED', stage: 'DISQUALIFIED', sort_order: 6 },
  { name: 'QUALIFIED', stage: 'QUALIFICATION', sort_order: 7 },
  { name: 'EXECUTIVE_ASSIGNED', stage: 'OPPORTUNITY', sort_order: 8 },
  { name: 'MEETING_SCHEDULED', stage: 'OPPORTUNITY', sort_order: 9 },
  { name: 'PROPOSAL_SENT', stage: 'PROPOSAL', sort_order: 10 },
  { name: 'NEGOTIATION', stage: 'NEGOTIATION', sort_order: 11 },
  { name: 'WON', stage: 'CLOSED', sort_order: 12 },
  { name: 'LOST', stage: 'CLOSED', sort_order: 13 },
];

/**
 * Valid Lead State Machine transitions
 */
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  NEW: ['ASSIGNED', 'CONTACTED', 'NO_RESPONSE', 'INTERESTED', 'QUALIFIED', 'NOT_INTERESTED', 'LOST'],
  ASSIGNED: ['CONTACTED', 'NO_RESPONSE', 'INTERESTED', 'NOT_INTERESTED', 'QUALIFIED', 'LOST'],
  CONTACTED: ['NO_RESPONSE', 'INTERESTED', 'NOT_INTERESTED', 'QUALIFIED', 'ASSIGNED', 'LOST'],
  NO_RESPONSE: ['CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'LOST'],
  INTERESTED: ['QUALIFIED', 'NOT_INTERESTED', 'EXECUTIVE_ASSIGNED', 'MEETING_SCHEDULED', 'LOST'],
  NOT_INTERESTED: ['CONTACTED', 'INTERESTED', 'LOST'],
  QUALIFIED: ['EXECUTIVE_ASSIGNED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'LOST', 'NOT_INTERESTED'],
  EXECUTIVE_ASSIGNED: ['MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'NOT_INTERESTED'],
  MEETING_SCHEDULED: ['PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'NOT_INTERESTED', 'EXECUTIVE_ASSIGNED'],
  PROPOSAL_SENT: ['NEGOTIATION', 'WON', 'LOST', 'MEETING_SCHEDULED'],
  NEGOTIATION: ['WON', 'LOST', 'PROPOSAL_SENT'],
  WON: [], // Terminal won state
  LOST: ['NEW', 'CONTACTED'], // Can be reopened by admin/manager
};

export const LEAD_SCORING_WEIGHTS = {
  DECISION_MAKER: 20,
  BUDGET_CONFIRMED: 20,
  REQUIREMENT_CONFIRMED: 20,
  VERY_INTERESTED: 15,
  MEETING_SCHEDULED: 10,
  QUOTATION_REQUESTED: 10,
  WHATSAPP_RESPONSE: 5,
};

export const SCORE_TIERS = {
  HOT_MIN: 80,
  WARM_MIN: 50,
};

export const REGEX_PATTERNS = {
  PHONE: /^\+?[0-9]{7,15}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
