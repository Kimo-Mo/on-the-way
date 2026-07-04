// ─── Enums / Unions ──────────────────────────────────────────────────────────

export type HelpRequestCategory = 'Medical' | 'Towing' | 'Fuel' | 'Repair';

export type HelpRequestStatus = 'Active' | 'Assigned' | 'Completed';

// Terminal states — no further transitions allowed from these:
export const TERMINAL_STATUSES: HelpRequestStatus[] = ['Completed'];

// Valid transitions map (source status → allowed target statuses):
export const VALID_TRANSITIONS: Record<HelpRequestStatus, HelpRequestStatus[]> = {
  Active: ['Assigned', 'Completed'],
  Assigned: ['Completed'],
  Completed: [],
};

// ─── Sub-entities ─────────────────────────────────────────────────────────────

export interface HelpRequestUser {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  phone: string | null;
  email: string | null;
}

export interface HelpRequestProvider {
  id: string;
  name: string;
  type: HelpRequestCategory;
  rating: number;
  etaMinutes: number;
}

export interface TimelineEvent {
  id: string;
  eventLabel: string;
  timestamp: string; // ISO 8601
  description: string | null;
}

// ─── Core entity ──────────────────────────────────────────────────────────────

export interface HelpRequest {
  id: string;
  category: HelpRequestCategory;
  status: HelpRequestStatus;
  locationText: string;
  coordinates: { lat: number; lng: number };
  createdAt: string; // ISO 8601
  user: HelpRequestUser;
  provider: HelpRequestProvider | null;
}

// ─── API contracts (mock) ─────────────────────────────────────────────────────

export interface HelpRequestsQueryParams {
  page: number;
  pageSize: number;
  category?: HelpRequestCategory;
  status?: HelpRequestStatus;
  search?: string;
}

export interface HelpRequestsListResponse {
  data: HelpRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HelpRequestDetails {
  request: HelpRequest;
  timeline: TimelineEvent[];
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const categoryLabels: Record<HelpRequestCategory, string> = {
  Medical: 'Medical',
  Towing: 'Towing',
  Fuel: 'Fuel',
  Repair: 'Repair',
};

export const statusLabels: Record<HelpRequestStatus, string> = {
  Active: 'Active',
  Assigned: 'Assigned',
  Completed: 'Completed',
};
