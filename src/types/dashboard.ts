export type MetricTrendDirection = 'up' | 'down' | 'flat';
export type MetricTrendMeaning = 'positive' | 'negative' | 'neutral';

export interface MetricTrend {
  direction: MetricTrendDirection;
  percentage: number;
  periodLabel: string;
  meaning: MetricTrendMeaning;
}

export type DashboardMetricId = 
  | 'totalUsers'
  | 'totalReports'
  | 'activeHelpRequests'
  | 'serviceProviders'
  | 'reportsToday'
  | 'urgentIncidents';

export interface DashboardMetric {
  id: DashboardMetricId;
  label: string;
  value: number;
  trend?: MetricTrend;
  targetRoute?: string;
}

export type MapEventCategory = 'urgentReport' | 'helpRequest' | 'provider';

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

export type ActivityEventType = 
  | 'reportSubmitted'
  | 'reportVerified'
  | 'providerRegistered'
  | 'userFlagged'
  | 'announcementPublished'
  | 'system';

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
  label: string;
  value: number;
  timestamp?: string;
}

export interface CategoryCount {
  category: string;
  count: number;
  targetRoute?: string;
}

export interface DistributionSegment {
  label: string;
  count: number;
  percentage: number;
  targetRoute?: string;
}

export type FlaggedContentStatus = 'pending' | 'approved' | 'removed' | 'userFlagged';
export type FlaggedContentAction = 'approve' | 'remove' | 'flagUser';

export interface FlaggedContentItem {
  id: string;
  title: string;
  locationOrSource: string;
  reason: string;
  reportedAgeLabel: string;
  status: FlaggedContentStatus;
  availableActions: FlaggedContentAction[];
  targetRoute?: string;
}

export interface DashboardOverview {
  metrics: DashboardMetric[];
  mapEvents: MapEvent[];
  activityEvents: ActivityEvent[];
  reportsTrend: TrendPoint[];
  helpRequestCategories: CategoryCount[];
  userDistribution: DistributionSegment[];
  flaggedContent: FlaggedContentItem[];
  flaggedContentPendingCount: number;
  generatedAt: string;
}