import api from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { UpdateProviderStatusPayload } from '@/types/providers';

export const useUpdateProviderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProviderStatusPayload }) =>
      api.post(`/admin/providers/${id}/status`, payload),
    onSuccess: (_, { id, payload }) => {
      let actionLabel = '';
      if (payload.action === 'approve') actionLabel = 'approved';
      if (payload.action === 'reject') actionLabel = 'rejected';
      if (payload.action === 'suspend') actionLabel = 'suspended';
      
      toast.success(`Provider ${actionLabel} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      // The requirement says "plus provider detail query in src/hooks/useUpdateProviderStatus.ts"
      queryClient.invalidateQueries({ queryKey: ['providers', 'details', id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update provider status.');
    },
  });
};
