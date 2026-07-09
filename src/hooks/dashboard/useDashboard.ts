import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { DashboardAnalyticsResponse } from '@/types/dashboard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

// ─── Query + Mutation Hooks ──────────────────────────────────────────────────

/**
 * Unified hook for Dashboard.tsx that provides the dashboard overview query
 * plus three moderation-related mutations (approve, remove, flag).
 * The dashboard refetches every 5 minutes to stay fresh.
 */
export const useDashboardOverview = (params?: { days?: number }) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY(params),
    queryFn: () => fetchDashboardOverview(params),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60_000,
    retry: 1,
  });

  const approveFlaggedContent = useMutation({
    mutationFn: (id: string) => api.post(`/admin/moderation/flagged/${id}/approve`),
    onSuccess: () => {
      toast.success('Content approved.');
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY(params) });
    },
    onError: () => {
      toast.error('Failed to approve content. Please try again.');
    },
  });

  const removeFlaggedContent = useMutation({
    mutationFn: (id: string) => api.post(`/admin/moderation/flagged/${id}/remove`),
    onSuccess: () => {
      toast.success('Content removed.');
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY(params) });
    },
    onError: () => {
      toast.error('Failed to remove content. Please try again.');
    },
  });

  const flagRelatedUser = useMutation({
    mutationFn: (id: string) => api.post(`/admin/moderation/flagged/${id}/flag-user`),
    onSuccess: () => {
      toast.success('User flagged for moderation review.');
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY(params) });
    },
    onError: () => {
      toast.error('Failed to flag user. Please try again.');
    },
  });

  return {
    ...query,
    approveFlaggedContent,
    removeFlaggedContent,
    flagRelatedUser,
  };
};
