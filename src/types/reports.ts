// ─── Obstacle Type ─────────────────────────────────────────────────────────────
export type ObstacleType =
  | 'pothole'
  | 'roadDebris'
  | 'trafficLight'
  | 'accident'
  | 'roadClosure'
  | 'fog';

// ─── Report Status ─────────────────────────────────────────────────────────────
export type ReportStatus = 'pending' | 'urgent' | 'approved' | 'removed';

// ─── Removal Reason ────────────────────────────────────────────────────────────
export type RemovalReason = 'spam' | 'inaccurate' | 'inappropriate';

// ─── Report Submitter ──────────────────────────────────────────────────────────
export interface ReportSubmitter {
  id: string;
  name: string;
  isDeleted: boolean;
}

// ─── Community Votes ───────────────────────────────────────────────────────────
export interface CommunityVotes {
  upvotes: number;
  downvotes: number;
}

// ─── GPS Coordinates ───────────────────────────────────────────────────────────
export interface GpsCoordinates {
  lat: number;
  lng: number;
}

// ─── Report (list item) ────────────────────────────────────────────────────────
export interface Report {
  id: string;
  title: string;
  obstacleType: ObstacleType;
  status: ReportStatus;
  location: string;
  submittedAt: string;
  votes: CommunityVotes;
  submitter: ReportSubmitter;
}

// ─── Report Details ────────────────────────────────────────────────────────────
export interface ReportDetails extends Report {
  description: string;
  imageUrls: string[];
  gpsCoordinates: GpsCoordinates | null;
  removalReason?: RemovalReason;
}

// ─── Query Params ──────────────────────────────────────────────────────────────
export interface ReportsQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  obstacleType?: ObstacleType;
  status?: ReportStatus;
}

// ─── Paginated Response ────────────────────────────────────────────────────────
import type { PaginatedResponse } from './users';
export type ReportsListResponse = PaginatedResponse<Report>;

// ─── Mutation Payloads ─────────────────────────────────────────────────────────
export interface RemoveReportPayload {
  reason: RemovalReason;
}

// ─── Zod Validation Schemas ────────────────────────────────────────────────────
import { z } from 'zod';

export const removeReportSchema = z.object({
  reason: z.enum(['spam', 'inaccurate', 'inappropriate']),
});

export type RemoveReportFormValues = z.infer<typeof removeReportSchema>;

// ─── Display Labels ────────────────────────────────────────────────────────────
export const obstacleTypeLabels: Record<ObstacleType, string> = {
  pothole: 'Pothole',
  roadDebris: 'Road Debris',
  trafficLight: 'Traffic Light',
  accident: 'Accident',
  roadClosure: 'Road Closure',
  fog: 'Fog',
};

export const reportStatusLabels: Record<ReportStatus, string> = {
  pending: 'Pending',
  urgent: 'Urgent',
  approved: 'Approved',
  removed: 'Removed',
};

export const removalReasonLabels: Record<RemovalReason, string> = {
  spam: 'Spam',
  inaccurate: 'Inaccurate',
  inappropriate: 'Inappropriate',
};
