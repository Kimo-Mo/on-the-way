// ─── Report List (GET /api/admin/reports — list item) ─────────────────────────

/**
 * Matches AdminReportListItem from the API documentation exactly.
 * The backend uses `address` (not `location`), `type` (not `obstacleType`), and `createdAt` (not `submittedAt`).
 */
export interface Report {
  id: string;
  title: string;
  type: string;   // backend sends the incident type string (e.g. "Collision")
  status: string; // backend sends the status string (e.g. "Open")
  address: string;
  createdAt: string; // ISO 8601
  upvotes: number;
  downvotes: number;
}

// ─── Report Details (GET /api/admin/reports/{id}) ─────────────────────────────

/**
 * Matches AdminReportDetails from the API documentation exactly.
 */
export interface ReportDetails {
  id: string;
  description: string;
  type: string;
  createdAt: string; // ISO 8601
  address: string;
  latitude: number;
  longitude: number;
  submittedBy: string;
  imageUrl: string | null;
  upvotes: number;
  downvotes: number;
  status: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ReportsQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  type?: string;
  sortOrder?: string;
  status?: string;
}

// ─── List Response ─────────────────────────────────────────────────────────────

export interface ReportsListResponse {
  data: Report[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── UI-only types (kept for badge components) ─────────────────────────────────

/**
 * UI string labels for incident types (maps backend type string to display label).
 * The backend uses `type` as a string like "Collision", "RoadClosure", etc.
 */
export type IncidentTypeLabel =
  | 'Collision'
  | 'RoadClosure'
  | 'Obstacle'
  | 'SevereWeather'
  | 'VehicleBreakdown'
  | string;

/**
 * UI string labels for incident statuses (maps backend status string to display label).
 */
export type IncidentStatusLabel = 'Open' | 'Resolved' | 'Cancelled' | string;

// ─── Display Labels ────────────────────────────────────────────────────────────

export const incidentTypeLabels: Record<string, string> = {
  Collision: 'Collision',
  RoadClosure: 'Road Closure',
  Obstacle: 'Obstacle',
  SevereWeather: 'Severe Weather',
  VehicleBreakdown: 'Vehicle Breakdown',
};

export const incidentStatusLabels: Record<string, string> = {
  Open: 'Open',
  Resolved: 'Resolved',
  Cancelled: 'Cancelled',
};

// ─── Mutation Payloads ─────────────────────────────────────────────────────────

export interface RemoveReportPayload {
  reason: string;
}

// ─── Zod Validation Schemas ────────────────────────────────────────────────────
import { z } from 'zod';

export const removeReportSchema = z.object({
  reason: z.enum(['spam', 'inaccurate', 'inappropriate']),
});

export type RemoveReportFormValues = z.infer<typeof removeReportSchema>;

// ─── Display Labels for removal reasons ───────────────────────────────────────

export const removalReasonLabels: Record<string, string> = {
  spam: 'Spam',
  inaccurate: 'Inaccurate Information',
  inappropriate: 'Inappropriate Content',
};

// ─── Legacy type aliases (kept for backward compat with any badge components) ──

/** @deprecated Use IncidentTypeLabel instead */
export type ObstacleType = IncidentTypeLabel;
/** @deprecated Use IncidentStatusLabel instead */
export type ReportStatus = IncidentStatusLabel;
/** @deprecated Use incidentTypeLabels instead */
export const obstacleTypeLabels = incidentTypeLabels;
/** @deprecated Use incidentStatusLabels instead */
export const reportStatusLabels = incidentStatusLabels;
