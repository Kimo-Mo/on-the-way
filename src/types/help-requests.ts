// ─── Help Request List (GET /api/admin/help-requests — list item) ─────────────

/**
 * Matches AdminHelpRequestListItem from the API documentation exactly.
 */
export interface HelpRequest {
  id: string;
  type: string;   // e.g. "FlatTire", "CarBreakdown", "MedicalHelp", "Weather"
  status: string; // e.g. "Pending", "Accepted", "Completed", "Cancelled"
  address: string;
  userName: string;
  createdAt: string; // ISO 8601
}

// ─── Embedded user in help request details ────────────────────────────────────

export interface HelpRequestUserDetails {
  name: string;
  phone: string;
  email: string;
}

// ─── Help Request Details (GET /api/admin/help-requests/{id}) ─────────────────

/**
 * Matches AdminHelpRequestDetails from the API documentation exactly.
 */
export interface HelpRequestDetails {
  id: string;
  type: string;
  status: string;
  createdAt: string; // ISO 8601
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  user: HelpRequestUserDetails;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface HelpRequestsQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  type?: string;
  sortOrder?: string;
}

// ─── List Response ─────────────────────────────────────────────────────────────

export interface HelpRequestsListResponse {
  data: HelpRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Display Helpers ──────────────────────────────────────────────────────────

export const assistanceTypeLabels: Record<string, string> = {
  CarBreakdown: 'Car Breakdown',
  FlatTire: 'Flat Tire',
  MedicalHelp: 'Medical Help',
  Weather: 'Weather',
};

export const assistanceStatusLabels: Record<string, string> = {
  Pending: 'Pending',
  Accepted: 'Accepted',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};

// ─── Timeline Event (UI-only — not returned by API) ──────────────────────────

export interface TimelineEvent {
  id: string;
  eventLabel: string;
  timestamp: string; // ISO 8601
  description?: string;
}

// ─── Help Request User (alias for the embedded user in details) ───────────────

export type HelpRequestUser = HelpRequestUserDetails;

// ─── Legacy type aliases (kept for backward compat) ──────────────────────────

/** @deprecated Use HelpRequest directly */
export type HelpRequestCategory = string;
/** @deprecated Use HelpRequest directly */
export type HelpRequestStatus = string;
/** @deprecated Use assistanceTypeLabels instead */
export const categoryLabels = assistanceTypeLabels;
/** @deprecated Use assistanceStatusLabels instead */
export const statusLabels = assistanceStatusLabels;

// Terminal states — no further transitions allowed from these:
export const TERMINAL_STATUSES: string[] = ['Completed', 'Cancelled'];
