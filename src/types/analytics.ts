export interface KpiData {
  avgResponseTimeMinutes: number;
  avgResponseTimeDelta: number;
  userSatisfactionRate: number;
  userSatisfactionDelta: number;
  resolutionRate: number;
  resolutionRateDelta: number;
  activeHelpRequests: number;
  activeHelpRequestsDelta: number;
}

export interface ReportsTrendPoint {
  date: string;
  reports: number;
  resolved: number;
}

export interface HelpRequestsByTypePoint {
  date: string;
  medical: number;
  towing: number;
  fuel: number;
  repair: number;
}

export interface UserGrowthPoint {
  month: string;
  users: number;
}

export interface KeyMetricsSummary {
  totalReportsThisMonth: number;
  totalReportsDelta: number;
  helpRequestsCompleted: number;
  helpRequestsDelta: number;
  newUsersThisMonth: number;
  newUsersDelta: number;
}

export interface AnalyticsSnapshot {
  dateRange: { from: string; to: string };
  kpi: KpiData;
  reportsTrends: ReportsTrendPoint[];
  helpRequestsByType: HelpRequestsByTypePoint[];
  userGrowth: UserGrowthPoint[];
  keyMetrics: KeyMetricsSummary;
}

export type AnalyticsDateRange = '7d' | '30d' | '90d' | 'year';

export interface AnalyticsQueryParams {
  dateRange: AnalyticsDateRange;
}
