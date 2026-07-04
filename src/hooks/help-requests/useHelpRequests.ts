import api from '@/lib/axios';
import {
  fetchHelpRequests,
  fetchHelpRequestDetails,
  updateHelpRequestStatus,
  reassignProvider,
} from '@/lib/help-requests-fixtures';
import type {
  HelpRequestsQueryParams,
  HelpRequestsListResponse,
  HelpRequestDetails,
  HelpRequestStatus,
} from '@/types/help-requests';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

// ─── Query keys ───────────────────────────────────────────────────────────────
export const HELP_REQUESTS_QUERY_KEY = (params: HelpRequestsQueryParams) =>
  ['help-requests', params] as const;

export const HELP_REQUEST_DETAILS_QUERY_KEY = (id: string) =>
  ['help-requests', 'details', id] as const;

// ─── List query ───────────────────────────────────────────────────────────────
export const useHelpRequests = (params: HelpRequestsQueryParams) => {
  return useQuery({
    queryKey: HELP_REQUESTS_QUERY_KEY(params),
    queryFn: async () => {
      try {
        const { data } = await api.get<HelpRequestsListResponse>('/admin/help-requests', {
          params,
        });
        return data;
      } catch (error) {
        console.warn('[help-requests] API unavailable, using fixture data:', error);
        return fetchHelpRequests(params);
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

// ─── Details query ────────────────────────────────────────────────────────────
export const useHelpRequestDetails = (id: string) => {
  return useQuery({
    queryKey: HELP_REQUEST_DETAILS_QUERY_KEY(id),
    queryFn: async () => {
      try {
        const { data } = await api.get<HelpRequestDetails>(`/admin/help-requests/${id}`);
        return data;
      } catch (error) {
        console.warn('[help-request-details] API unavailable, using fixture data:', error);
        return fetchHelpRequestDetails(id);
      }
    },
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });
};

// ─── Status mutation ──────────────────────────────────────────────────────────
export const useUpdateHelpRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: HelpRequestStatus }) =>
      updateHelpRequestStatus(id, newStatus),
    onSuccess: (_, { id, newStatus }) => {
      toast.success(`Request marked as ${newStatus}.`);
      queryClient.invalidateQueries({ queryKey: ['help-requests'] });
      queryClient.invalidateQueries({ queryKey: HELP_REQUEST_DETAILS_QUERY_KEY(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update request status.');
    },
  });
};

// ─── Reassign provider mutation ───────────────────────────────────────────────
export const useReassignProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, providerId }: { id: string; providerId: string }) =>
      reassignProvider(id, providerId),
    onSuccess: (_, { id }) => {
      toast.success('Provider reassigned successfully.');
      queryClient.invalidateQueries({ queryKey: ['help-requests'] });
      queryClient.invalidateQueries({ queryKey: HELP_REQUEST_DETAILS_QUERY_KEY(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reassign provider.');
    },
  });
};
