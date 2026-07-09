import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  AdminNotification,
  CreateAnnouncementRequest,
} from '@/types/notifications';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'] as const;
export const NOTIFICATION_DETAIL_QUERY_KEY = (id: string) =>
  ['notifications', 'detail', id] as const;

// ─── Query Params ────────────────────────────────────────────────────────────

export interface AdminNotificationsApiParams {
  search?: string;
  category?: string;
}

// ─── Query Hooks ─────────────────────────────────────────────────────────────

/**
 * Fetches the notifications list from GET /api/admin/notifications.
 * Backend wraps the response in ApiResponse<AnnouncementListItem[]>.
 * Returns the unwrapped array as AdminNotification[].
 */
export function useGetNotifications(params?: AdminNotificationsApiParams) {
  return useQuery<AdminNotification[]>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AdminNotification[]>>('/admin/notifications', {
        params,
      });
      const envelope = response.data;

      if (!envelope.isSuccess || envelope.data === null) {
        throw new Error(
          typeof envelope.error === 'string'
            ? envelope.error
            : (envelope.error?.message ?? 'Failed to fetch notifications.')
        );
      }

      return envelope.data;
    },
    staleTime: 30_000,
  });
}

/**
 * Fetches a single notification from GET /api/admin/notifications/{id}.
 * Backend wraps the response in ApiResponse<AnnouncementDetailsResponse>.
 */
export function useGetNotificationById(id: string) {
  return useQuery<AdminNotification>({
    queryKey: NOTIFICATION_DETAIL_QUERY_KEY(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<AdminNotification>>(
        `/admin/notifications/${id}`
      );
      const envelope = response.data;

      if (!envelope.isSuccess || envelope.data === null) {
        throw new Error(
          typeof envelope.error === 'string'
            ? envelope.error
            : (envelope.error?.message ?? 'Failed to fetch notification details.')
        );
      }

      return envelope.data;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

// ─── Mutation Hooks ──────────────────────────────────────────────────────────

/**
 * Mutation hook for creating a notification via POST /api/admin/notifications.
 * Sends a CreateAnnouncementRequest body matching the API documentation exactly.
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, CreateAnnouncementRequest>({
    mutationFn: async (payload: CreateAnnouncementRequest) => {
      const response = await api.post<ApiResponse<null>>('/admin/notifications', payload);
      return response.data;
    },
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      if (payload.isPublished) {
        toast.success('Notification published successfully.');
      } else if (payload.publishDate) {
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

/**
 * Mutation hook for deleting a notification via DELETE /api/admin/notifications/{id}.
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (notificationId: string) => {
      const response = await api.delete<ApiResponse<null>>(
        `/admin/notifications/${notificationId}`
      );
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
