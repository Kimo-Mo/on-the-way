import type { DashboardMetricId, MapEventCategory } from '@/types/dashboard';

export const DASHBOARD_ROUTES = {
  SETTINGS: '/settings',
  USERS: '/users',
  REPORTS: '/reports',
  HELP_REQUESTS: '/help-requests',
  ANALYTICS: '/analytics',
  NOTIFICATIONS: '/notifications',
} as const;

export const METRIC_ROUTES: Record<DashboardMetricId, string | undefined> = {
  totalUsers: DASHBOARD_ROUTES.USERS,
  totalReports: DASHBOARD_ROUTES.REPORTS,
  activeHelpRequests: DASHBOARD_ROUTES.HELP_REQUESTS,
  reportsToday: DASHBOARD_ROUTES.REPORTS,
  urgentIncidents: DASHBOARD_ROUTES.REPORTS,
};

export const MAP_EVENT_ROUTES: Record<MapEventCategory, string | undefined> = {
  urgentReport: DASHBOARD_ROUTES.REPORTS,
  helpRequest: DASHBOARD_ROUTES.HELP_REQUESTS,
};

export function getMetricRoute(metricId: DashboardMetricId): string | undefined {
  return METRIC_ROUTES[metricId];
}

export function getMapEventRoute(category: MapEventCategory): string | undefined {
  return MAP_EVENT_ROUTES[category];
}