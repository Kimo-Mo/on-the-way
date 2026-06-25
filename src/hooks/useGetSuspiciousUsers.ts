import api from '@/lib/axios';
import { SUSPICIOUS_USERS_FIXTURES } from '@/lib/moderation-fixtures';
import type { SuspiciousUser } from '@/types/moderation';
import { useQuery } from '@tanstack/react-query';

export const SUSPICIOUS_USERS_QUERY_KEY = ['moderation', 'suspiciousUsers'] as const;

export const useGetSuspiciousUsers = () => {
  return useQuery({
    queryKey: SUSPICIOUS_USERS_QUERY_KEY,
    queryFn: async (): Promise<SuspiciousUser[]> => {
      try {
        const { data } = await api.get<{ data: SuspiciousUser[] }>('/admin/moderation/suspicious-users');
        return data.data;
      } catch (error) {
        console.warn('[moderation] Suspicious users API unavailable, using fixtures:', error);
        return SUSPICIOUS_USERS_FIXTURES;
      }
    },
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 59_000,
  });
};
