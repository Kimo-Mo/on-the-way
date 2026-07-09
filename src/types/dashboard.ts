import type { ApiResponse } from './api';

// ─── Dashboard metrics ────────────────────────────────────────────────────────

/** A metric with its value and month-over-month growth. */
export interface MetricWithGrowth {
  value: number;
  growthPercentage: number;
}

/** A single data point for a chart (x-axis label + y-axis value). */
export interface ChartPoint {
  label: string;
  value: number;
}

/** A recent activity entry on the dashboard. */
export interface RecentActivityDto {
  title: string;
  user: string;
  date: string; // ISO 8601
  type: string;
}

// ─── Top-level dashboard analytics response ───────────────────────────────────

/**
 * Matches DashboardAnalyticsResponse from the API documentation exactly.
 * Returned by GET /api/admin/dashboard wrapped inside ApiResponse<DashboardAnalyticsResponse>.
 */
export interface DashboardAnalyticsResponse {
  totalUsers: MetricWithGrowth;
  totalReports: MetricWithGrowth;
  activeHelpRequests: MetricWithGrowth;
  reportsToday: MetricWithGrowth;
  resolutionRate: MetricWithGrowth;
  reportsOverTime: ChartPoint[];
  helpRequestsByCategory: ChartPoint[];
  userGrowth: ChartPoint[];
  recentActivities: RecentActivityDto[];
}

// ─── Re-export ApiResponse for dashboard consumers ────────────────────────────
export type { ApiResponse };

// ─── Legacy type aliases (kept for backward compat with existing dashboard UI) ─

/**
 * @deprecated The backend no longer returns this shape.
 * Use DashboardAnalyticsResponse instead.
 */
export type DashboardOverview = DashboardAnalyticsResponse;

export type MetricTrendDirection = 'up' | 'down' | 'flat';
export type MetricTrendMeaning = 'positive' | 'negative' | 'neutral';

export interface MetricTrend {
  direction?: MetricTrendDirection | string;
  percentage?: number;
  periodLabel?: string;
  meaning?: MetricTrendMeaning | string;
}

export type DashboardMetricId =
  | 'totalUsers'
  | 'totalReports'
  | 'activeHelpRequests'
  | 'serviceProviders'
  | 'reportsToday'
  | 'urgentIncidents'
  | string;

/** UI presentation model for a single stat card on the dashboard. */
export interface DashboardMetric {
  id?: DashboardMetricId;
  label?: string;
  value?: number;
  trend?: MetricTrend;
  targetRoute?: string;
}

export type MapEventCategory = 'urgentReport' | 'helpRequest' | 'provider' | string;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapEvent {
  id: string;
  category: MapEventCategory;
  title: string;
  coordinates: Coordinates;
  status: string;
  timestamp: string;
  targetRoute?: string;
}

export type ActivityEventType = 'help' | 'report';

export type ActivityEventTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  actorOrSource: string;
  timestamp: string;
  targetRoute?: string;
  tone?: ActivityEventTone;
}

export interface TrendPoint {
  label?: string;
  value?: number;
  timestamp?: string;
}

export interface CategoryCount {
  category?: string;
  count?: number;
  targetRoute?: string;
}

export interface DistributionSegment {
  label: string;
  count: number;
  percentage: number;
  targetRoute?: string;
}

export type FlaggedContentStatus = 'pending' | 'approved' | 'removed' | 'userFlagged' | string;
export type FlaggedContentAction = 'approve' | 'remove' | 'flagUser' | string;

export interface FlaggedContentItem {
  id?: string;
  title?: string;
  locationOrSource?: string;
  reason?: string;
  reportedAgeLabel?: string;
  status?: FlaggedContentStatus;
  availableActions?: FlaggedContentAction[];
  targetRoute?: string;
}