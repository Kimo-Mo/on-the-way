import api from '@/lib/axios';
import { getPendingItemsFixtures } from '@/lib/moderation-fixtures';
import type { PendingModerationItem } from '@/types/moderation';
import { useQuery } from '@tanstack/react-query';

export const PENDING_ITEMS_QUERY_KEY = ['moderation', 'pendingItems'] as const;

export const useGetPendingModerationItems = () => {
  return useQuery({
    queryKey: PENDING_ITEMS_QUERY_KEY,
    queryFn: async (): Promise<PendingModerationItem[]> => {
      try {
        const { data } = await api.get<{ data: PendingModerationItem[] }>('/admin/moderation/pending-items');
        return data.data;
      } catch (error) {
        console.warn('[moderation] Pending items API unavailable, using fixtures:', error);
        return getPendingItemsFixtures();
      }
    },
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 59_000,
  });
};
