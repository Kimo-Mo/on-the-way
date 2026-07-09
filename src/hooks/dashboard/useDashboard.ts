import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { DashboardAnalyticsResponse } from '@/types/dashboard';
import { useQuery } from '@tanstack/react-query';

// ─── Fetch Functions ─────────────────────────────────────────────────────────

/**
 * Fetches the dashboard analytics from GET /api/admin/dashboard.
 * Backend wraps the response in ApiResponse<DashboardAnalyticsResponse>.
 *
 * @param params - Optional query params, e.g. { days: 30 }.
 * @returns DashboardAnalyticsResponse.
 */
export const fetchDashboardOverview = async (params?: {
  days?: number;
}): Promise<DashboardAnalyticsResponse> => {
  const response = await api.get<ApiResponse<DashboardAnalyticsResponse>>('/admin/dashboard', {
    params,
  });
  const envelope = response.data;

  if (!envelope.isSuccess || envelope.data === null) {
    throw new Error(
      typeof envelope.error === 'string'
        ? envelope.error
        : (envelope.error?.message ?? 'Failed to fetch dashboard data.')
    );
  }

  return envelope.data;
};

// ─── Query Keys ──────────────────────────────────────────────────────────────

const DASHBOARD_QUERY_KEY = (params?: { days?: number }) =>
  ['dashboard', 'overview', params] as const;

// ─── Query Hooks ─────────────────────────────────────────────────────────────

/**
 * Hook for Dashboard.tsx that provides the dashboard overview query.
 * The dashboard refetches every 5 minutes to stay fresh.
 */
export const useDashboardOverview = (params?: { days?: number }) => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY(params),
    queryFn: () => fetchDashboardOverview(params),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60_000,
    retry: 1,
  });
};
