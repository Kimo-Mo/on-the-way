import api from '@/lib/axios';
import {
  FLAGGED_REPORTS_FIXTURES,
  SUSPICIOUS_USERS_FIXTURES,
  MODERATION_SUMMARY_FIXTURE,
  getPendingItemsFixtures,
} from '@/lib/moderation-fixtures';
import type {
  FlaggedReport,
  SuspiciousUser,
  PendingModerationItem,
  ModerationSummary,
  ModerationActionPayload,
} from '@/types/moderation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const FLAGGED_REPORTS_QUERY_KEY = ['moderation', 'flaggedReports'] as const;
export const SUSPICIOUS_USERS_QUERY_KEY = ['moderation', 'suspiciousUsers'] as const;
export const PENDING_ITEMS_QUERY_KEY = ['moderation', 'pendingItems'] as const;
export const MODERATION_SUMMARY_QUERY_KEY = ['moderation', 'summary'] as const;

const SHARED_OPTIONS = {
  refetchInterval: 60_000,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: false,
  staleTime: 59_000,
} as const;

// ─── Get Flagged Reports ──────────────────────────────────────────────────────

export const useGetFlaggedReports = () => {
  return useQuery({
    queryKey: FLAGGED_REPORTS_QUERY_KEY,
    queryFn: async (): Promise<FlaggedReport[]> => {
      try {
        const { data } = await api.get<{ data: FlaggedReport[] }>(
          '/admin/moderation/flagged-reports'
        );
        return data.data;
      } catch (error) {
        console.warn('[moderation] Flagged reports API unavailable, using fixtures:', error);
        return FLAGGED_REPORTS_FIXTURES;
      }
    },
    ...SHARED_OPTIONS,
  });
};

// ─── Get Suspicious Users ─────────────────────────────────────────────────────

export const useGetSuspiciousUsers = () => {
  return useQuery({
    queryKey: SUSPICIOUS_USERS_QUERY_KEY,
    queryFn: async (): Promise<SuspiciousUser[]> => {
      try {
        const { data } = await api.get<{ data: SuspiciousUser[] }>(
          '/admin/moderation/suspicious-users'
        );
        return data.data;
      } catch (error) {
        console.warn('[moderation] Suspicious users API unavailable, using fixtures:', error);
        return SUSPICIOUS_USERS_FIXTURES;
      }
    },
    ...SHARED_OPTIONS,
  });
};

// ─── Get Pending Moderation Items ─────────────────────────────────────────────

export const useGetPendingModerationItems = () => {
  return useQuery({
    queryKey: PENDING_ITEMS_QUERY_KEY,
    queryFn: async (): Promise<PendingModerationItem[]> => {
      try {
        const { data } = await api.get<{ data: PendingModerationItem[] }>(
          '/admin/moderation/pending-items'
        );
        return data.data;
      } catch (error) {
        console.warn('[moderation] Pending items API unavailable, using fixtures:', error);
        return getPendingItemsFixtures();
      }
    },
    ...SHARED_OPTIONS,
  });
};

// ─── Get Moderation Summary ───────────────────────────────────────────────────

export const useGetModerationSummary = () => {
  return useQuery({
    queryKey: MODERATION_SUMMARY_QUERY_KEY,
    queryFn: async (): Promise<ModerationSummary> => {
      try {
        const { data } = await api.get<ModerationSummary>('/admin/moderation/summary');
        return data;
      } catch (error) {
        console.warn('[moderation] Summary API unavailable, using fixture:', error);
        return MODERATION_SUMMARY_FIXTURE;
      }
    },
    ...SHARED_OPTIONS,
  });
};

// ─── Moderation Action ────────────────────────────────────────────────────────

export const useModerationAction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ModerationActionPayload) => {
      if (payload.targetType === 'report') {
        return api.post(`/admin/moderation/reports/${payload.targetId}/actions`, {
          action: payload.action,
        });
      }
      return api.post(`/admin/moderation/users/${payload.targetId}/actions`, {
        action: payload.action,
      });
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
