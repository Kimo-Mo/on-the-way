import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  HelpRequest,
  HelpRequestDetails,
  HelpRequestsListResponse,
  HelpRequestsQueryParams,
} from '@/types/help-requests';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const HELP_REQUESTS_QUERY_KEY = (params: HelpRequestsQueryParams) =>
  ['help-requests', params] as const;
export const HELP_REQUEST_DETAILS_QUERY_KEY = (id: string) =>
  ['help-requests', 'details', id] as const;

// ─── Query Hooks ─────────────────────────────────────────────────────────────

/**
 * React Query hook for fetching the help requests list from GET /api/admin/help-requests.
 * Backend wraps the response in ApiResponse<AdminHelpRequestListItem[]>.
 */
export const useHelpRequests = (params: HelpRequestsQueryParams) => {
  return useQuery({
    queryKey: HELP_REQUESTS_QUERY_KEY(params),
    queryFn: async () => {
      const apiParams: { search?: string; type?: string; sortOrder?: string } = {
        search: params.search,
        type: params.type,
        sortOrder: params.sortOrder,
      };
      const response = await api.get<ApiResponse<HelpRequest[]>>('/admin/help-requests', {
        params: apiParams,
      });
      const envelope = response.data;

      if (!envelope.isSuccess || envelope.data === null) {
        throw new Error(
          typeof envelope.error === 'string'
            ? envelope.error
            : (envelope.error?.message ?? 'Failed to fetch help requests.')
        );
      }

      const items = envelope.data;
      const result: HelpRequestsListResponse = {
        data: items,
        total: items.length,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(items.length / params.pageSize) || 1,
      };
      return result;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

/**
 * React Query hook for fetching a single help request's details from GET /api/admin/help-requests/{id}.
 * Backend wraps the response in ApiResponse<AdminHelpRequestDetails>.
 */
export const useHelpRequestDetails = (id: string) => {
  return useQuery({
    queryKey: HELP_REQUEST_DETAILS_QUERY_KEY(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<HelpRequestDetails>>(
        `/admin/help-requests/${id}`
      );
      const envelope = response.data;

      if (!envelope.isSuccess || envelope.data === null) {
        throw new Error(
          typeof envelope.error === 'string'
            ? envelope.error
            : (envelope.error?.message ?? 'Failed to fetch help request details.')
        );
      }

      return envelope.data;
    },
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });
};

// ─── Mutation Hooks ──────────────────────────────────────────────────────────

export const useUpdateHelpRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
      api.put(`/admin/help-requests/${id}/status`, { newStatus }),
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

