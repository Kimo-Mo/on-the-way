import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { NOTIFICATIONS_FIXTURES } from '@/lib/notifications-fixtures';
import type { AdminNotification } from '@/types/notifications';

export const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'] as const;

export function useGetNotifications() {
  return useQuery<AdminNotification[]>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await api.get('/admin/notifications');
        return response.data.data as AdminNotification[];
      } catch (err) {
        console.warn('Using notification fixtures:', err);
        return NOTIFICATIONS_FIXTURES;
      }
    },
    staleTime: 30_000,
  });
}