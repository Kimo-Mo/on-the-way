import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { NOTIFICATIONS_FIXTURES } from '@/lib/notifications-fixtures';
import type { AdminNotification, CreateNotificationPayload } from '@/types/notifications';
import type { Notification } from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'] as const;
export const HEADER_NOTIFICATIONS_QUERY_KEY = ['notifications', 'header'] as const;

// ─── Get Notifications (Admin List) ──────────────────────────────────────────

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

// ─── Get Header Notifications ─────────────────────────────────────────────────

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
        return NOTIFICATIONS_FIXTURES.filter((n) => n.status === 'Published')
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
    refetchOnWindowFocus: false,
  });
}

// ─── Create Notification ──────────────────────────────────────────────────────

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateNotificationPayload>({
    mutationFn: async (payload: CreateNotificationPayload) => {
      const response = await api.post('/admin/notifications', payload);
      return response.data;
    },
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      if (payload.action === 'publish') {
        toast.success('Notification published successfully.');
      } else if (payload.action === 'schedule') {
        toast.success('Notification scheduled.');
      } else {
        toast.success('Draft saved.');
      }
    },
    onError: () => {
      toast.error('Failed to save notification. Please try again.');
    },
  });
}

// ─── Delete Notification ──────────────────────────────────────────────────────

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (notificationId: string) => {
      const response = await api.delete(`/admin/notifications/${notificationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      toast.success('Notification deleted.');
    },
    onError: () => {
      toast.error('Failed to delete notification. Please try again.');
    },
  });
}
