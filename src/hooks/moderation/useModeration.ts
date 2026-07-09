import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  FlaggedReport,
  SuspiciousUser,
  PendingModerationItem,
  ModerationSummary,
  ModerationActionPayload,
} from '@/types/moderation';

// ─── Mock Data (Moderation backend not yet implemented) ──────────────────────

const mockFlaggedReports: FlaggedReport[] = [
  {
    id: 'flg-001',
    reportTitle: 'Major pothole on Corniche Road',
    location: 'Alexandria Corniche',
    downvoteCount: 12,
    flagReason: 'highDownvotes',
    submittingUser: { id: 'usr-003', displayName: 'Mohamed Gamal' },
    warnedAt: null,
    flaggedAt: '2024-06-25T08:30:00Z',
  },
  {
    id: 'flg-002',
    reportTitle: 'False accident report near Tahrir',
    location: 'Cairo, Tahrir Square',
    downvoteCount: 8,
    flagReason: 'reportedAsSpam',
    submittingUser: { id: 'usr-007', displayName: 'Nour Ibrahim' },
    warnedAt: '2024-06-20T14:00:00Z',
    flaggedAt: '2024-06-18T11:00:00Z',
  },
  {
    id: 'flg-003',
    reportTitle: 'Duplicate road closure report',
    location: 'Giza, Pyramids Road',
    downvoteCount: 5,
    flagReason: 'duplicateContent',
    submittingUser: { id: 'usr-012', displayName: 'Layla Mahmoud' },
    warnedAt: null,
    flaggedAt: '2024-06-27T16:45:00Z',
  },
];

const mockSuspiciousUsers: SuspiciousUser[] = [
  {
    id: 'usr-007',
    displayName: 'Nour Ibrahim',
    trustScore: 25,
    reportCount: 8,
    warningCount: 2,
    activitySummary: 'Multiple spam reports submitted. Low trust score.',
    flaggedAt: '2024-06-20T14:00:00Z',
  },
  {
    id: 'usr-015',
    displayName: 'Tarek Hassan',
    trustScore: 40,
    reportCount: 5,
    warningCount: 1,
    activitySummary: 'Reports frequently downvoted by community.',
    flaggedAt: '2024-06-22T09:30:00Z',
  },
];

const mockPendingItems: PendingModerationItem[] = [
  {
    id: 'pend-001',
    type: 'reportReview',
    priority: 'high',
    description: 'Report flagged by 12 users as inaccurate — needs admin review.',
    targetEntityId: 'flg-001',
    submittedAt: '2024-06-25T08:30:00Z',
  },
  {
    id: 'pend-002',
    type: 'userFlag',
    priority: 'medium',
    description: 'User Nour Ibrahim flagged for repeated spam report submissions.',
    targetEntityId: 'usr-007',
    submittedAt: '2024-06-20T14:00:00Z',
  },
  {
    id: 'pend-003',
    type: 'contentRemoval',
    priority: 'low',
    description: 'Duplicate road closure report should be merged with existing entry.',
    targetEntityId: 'flg-003',
    submittedAt: '2024-06-27T16:45:00Z',
  },
];

const _mockFlaggedReportsState = [...mockFlaggedReports];
const _mockSuspiciousUsersState = [...mockSuspiciousUsers];
const _mockPendingItemsState = [...mockPendingItems];

const delay = () => new Promise((r) => setTimeout(r, 300));

// ─── Query Keys ──────────────────────────────────────────────────────────────

/** Query key for the flagged reports list. */
export const FLAGGED_REPORTS_QUERY_KEY = ['moderation', 'flaggedReports'] as const;
/** Query key for the suspicious users list. */
export const SUSPICIOUS_USERS_QUERY_KEY = ['moderation', 'suspiciousUsers'] as const;
/** Query key for the pending moderation queue. */
export const PENDING_ITEMS_QUERY_KEY = ['moderation', 'pendingItems'] as const;
/** Query key for the moderation summary stats. */
export const MODERATION_SUMMARY_QUERY_KEY = ['moderation', 'summary'] as const;

const SHARED_OPTIONS = {
  refetchInterval: 60_000,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: false,
  staleTime: 59_000,
} as const;

// ─── Query Hooks (Mock) ─────────────────────────────────────────────────────

/** Fetches all flagged reports. Currently returns mock data. */
export const useGetFlaggedReports = () => {
  return useQuery({
    queryKey: FLAGGED_REPORTS_QUERY_KEY,
    queryFn: async (): Promise<FlaggedReport[]> => {
      await delay();
      return [..._mockFlaggedReportsState];
    },
    ...SHARED_OPTIONS,
  });
};

/** Fetches all suspicious users. Currently returns mock data. */
export const useGetSuspiciousUsers = () => {
  return useQuery({
    queryKey: SUSPICIOUS_USERS_QUERY_KEY,
    queryFn: async (): Promise<SuspiciousUser[]> => {
      await delay();
      return [..._mockSuspiciousUsersState];
    },
    ...SHARED_OPTIONS,
  });
};

/** Fetches pending moderation queue items. Currently returns mock data. */
export const useGetPendingModerationItems = () => {
  return useQuery({
    queryKey: PENDING_ITEMS_QUERY_KEY,
    queryFn: async (): Promise<PendingModerationItem[]> => {
      await delay();
      return [..._mockPendingItemsState];
    },
    ...SHARED_OPTIONS,
  });
};

/** Fetches moderation summary counts. Currently returns mock data. */
export const useGetModerationSummary = () => {
  return useQuery({
    queryKey: MODERATION_SUMMARY_QUERY_KEY,
    queryFn: async (): Promise<ModerationSummary> => {
      await delay();
      return { totalPendingCount: _mockPendingItemsState.length };
    },
    ...SHARED_OPTIONS,
  });
};

// ─── Mutation Hooks (Mock) ───────────────────────────────────────────────────

/** Mock mutation to apply a moderation action (approve/remove/warn/suspend). */
export const useModerationAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ModerationActionPayload) => {
      await delay();

      if (payload.targetType === 'report') {
        const idx = _mockFlaggedReportsState.findIndex((r) => r.id === payload.targetId);
        if (idx !== -1) {
          if (payload.action === 'remove') {
            _mockFlaggedReportsState.splice(idx, 1);
          }
        }
        const pIdx = _mockPendingItemsState.findIndex((p) => p.targetEntityId === payload.targetId);
        if (pIdx !== -1) _mockPendingItemsState.splice(pIdx, 1);
      } else {
        if (payload.action === 'suspend') {
          const idx = _mockSuspiciousUsersState.findIndex((u) => u.id === payload.targetId);
          if (idx !== -1) {
            _mockSuspiciousUsersState[idx] = {
              ..._mockSuspiciousUsersState[idx],
              warningCount: _mockSuspiciousUsersState[idx].warningCount + 1,
            };
          }
        }
      }

      return { success: true };
    },
    onSuccess: (_data, payload) => {
      if (payload.targetType === 'report') {
        queryClient.invalidateQueries({ queryKey: FLAGGED_REPORTS_QUERY_KEY });
      } else {
        queryClient.invalidateQueries({ queryKey: SUSPICIOUS_USERS_QUERY_KEY });
      }
      queryClient.invalidateQueries({ queryKey: MODERATION_SUMMARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_ITEMS_QUERY_KEY });

      if (payload.targetType === 'user' && payload.action === 'suspend') {
        toast.success('User suspended.');
      } else {
        toast.success('Action applied successfully.');
      }
    },
    onError: () => {
      toast.error('Action failed. Please try again.');
    },
  });
};
