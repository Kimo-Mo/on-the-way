import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import type { CreateNotificationPayload } from '@/types/notifications';
import { NOTIFICATIONS_QUERY_KEY } from './useGetNotifications';

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