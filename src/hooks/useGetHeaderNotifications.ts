import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Notification } from '@/types';
import { NOTIFICATIONS_FIXTURES } from '@/lib/notifications-fixtures';

export const HEADER_NOTIFICATIONS_QUERY_KEY = ['notifications', 'header'] as const;

export function useGetHeaderNotifications() {
  return useQuery<Notification[]>({
    queryKey: HEADER_NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await api.get('/admin/notifications?status=Published&pageSize=5');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (response.data.data as any[]).map((n: any) => ({
          id: n.id,
          title: n.title,
          description: n.message,
          timestamp: new Date(n.createdAt),
          isRead: false,
          type: 'info' as const,
        }));
      } catch {
        // fallback: adapt first 5 Published fixtures
        return NOTIFICATIONS_FIXTURES
          .filter((n) => n.status === 'Published')
          .slice(0, 5)
          .map((n) => ({
            id: n.id,
            title: n.title,
            description: n.message,
            timestamp: new Date(n.createdAt),
            isRead: false,
            type: 'info' as const,
          }));
      }
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });
}