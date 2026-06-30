import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '@/services/api/analytics';
import type { AnalyticsDateRange } from '@/types/analytics';

export const ANALYTICS_QUERY_KEY = (dateRange: AnalyticsDateRange) =>
  ['analytics', dateRange] as const;

export function useGetAnalytics(dateRange: AnalyticsDateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEY(dateRange),
    queryFn: () => getAnalytics({ dateRange }),
    staleTime: 30_000,
  });
}
