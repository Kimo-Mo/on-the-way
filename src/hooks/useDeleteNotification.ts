import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { NOTIFICATIONS_QUERY_KEY } from './useGetNotifications';

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