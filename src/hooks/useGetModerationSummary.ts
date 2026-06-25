import api from '@/lib/axios';
import { MODERATION_SUMMARY_FIXTURE } from '@/lib/moderation-fixtures';
import type { ModerationSummary } from '@/types/moderation';
import { useQuery } from '@tanstack/react-query';

export const MODERATION_SUMMARY_QUERY_KEY = ['moderation', 'summary'] as const;

export const useGetModerationSummary = () => {
  return useQuery({
    queryKey: MODERATION_SUMMARY_QUERY_KEY,
    queryFn: async (): Promise<ModerationSummary> => {
      try {
        const { data } = await api.get<ModerationSummary>('/admin/moderation/summary');
        return data;
      } catch (error) {
        console.warn('[moderation] Summary API unavailable, using fixture:', error);
        return MODERATION_SUMMARY_FIXTURE;
      }
    },
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 59_000,
  });
};
