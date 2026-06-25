import api from '@/lib/axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import type { ModerationActionPayload } from '@/types/moderation';
import { FLAGGED_REPORTS_QUERY_KEY } from './useGetFlaggedReports';
import { SUSPICIOUS_USERS_QUERY_KEY } from './useGetSuspiciousUsers';
import { MODERATION_SUMMARY_QUERY_KEY } from './useGetModerationSummary';

export const useModerationAction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ModerationActionPayload) => {
      if (payload.targetType === 'report') {
        return api.post(`/admin/moderation/reports/${payload.targetId}/actions`, { action: payload.action });
      }
      return api.post(`/admin/moderation/users/${payload.targetId}/actions`, { action: payload.action });
    },
    onSuccess: (_data, payload) => {
      if (payload.targetType === 'report') {
        queryClient.invalidateQueries({ queryKey: FLAGGED_REPORTS_QUERY_KEY });
      } else {
        queryClient.invalidateQueries({ queryKey: SUSPICIOUS_USERS_QUERY_KEY });
      }
      queryClient.invalidateQueries({ queryKey: MODERATION_SUMMARY_QUERY_KEY });

      if (payload.targetType === 'user' && payload.action === 'suspend') {
        toast.success('User suspended.', {
          action: {
            label: 'View profile →',
            onClick: () => navigate(`/users/${payload.targetId}`),
          },
        });
      } else {
        toast.success('Action applied successfully.');
      }
    },
    onError: () => {
      toast.error('Action failed. Please try again.');
    },
  });
};
