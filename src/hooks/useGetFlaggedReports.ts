import api from '@/lib/axios';
import { FLAGGED_REPORTS_FIXTURES } from '@/lib/moderation-fixtures';
import type { FlaggedReport } from '@/types/moderation';
import { useQuery } from '@tanstack/react-query';

export const FLAGGED_REPORTS_QUERY_KEY = ['moderation', 'flaggedReports'] as const;

export const useGetFlaggedReports = () => {
  return useQuery({
    queryKey: FLAGGED_REPORTS_QUERY_KEY,
    queryFn: async (): Promise<FlaggedReport[]> => {
      try {
        const { data } = await api.get<{ data: FlaggedReport[] }>('/admin/moderation/flagged-reports');
        return data.data;
      } catch (error) {
        console.warn('[moderation] Flagged reports API unavailable, using fixtures:', error);
        return FLAGGED_REPORTS_FIXTURES;
      }
    },
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 59_000,
  });
};
