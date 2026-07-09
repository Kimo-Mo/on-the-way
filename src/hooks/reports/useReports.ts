import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  Report,
  ReportDetails,
  ReportsListResponse,
  ReportsQueryParams,
  RemoveReportPayload,
} from '@/types/reports';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

// ─── Fetch Functions ─────────────────────────────────────────────────────────

/**
 * Fetches the reports list from GET /api/admin/reports.
 * Backend wraps the response in ApiResponse<Report[]>.
 */
export const fetchReports = async (params: ReportsQueryParams): Promise<ReportsListResponse> => {
  const apiParams: { search?: string; type?: string; sortOrder?: string } = {
    search: params.search,
    type: params.type,
    sortOrder: params.sortOrder,
  };
  const response = await api.get<ApiResponse<Report[]>>('/admin/reports', { params: apiParams });
  const envelope = response.data;

  if (!envelope.isSuccess || envelope.data === null) {
    throw new Error(
      typeof envelope.error === 'string'
        ? envelope.error
        : (envelope.error?.message ?? 'Failed to fetch reports.')
    );
  }

  const reports = envelope.data;
  return {
    data: reports,
    total: reports.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(reports.length / params.pageSize) || 1,
  };
};

/**
 * Fetches a single report's details from GET /api/admin/reports/{id}.
 * Backend wraps the response in ApiResponse<ReportDetails>.
 */
export const fetchReportDetails = async (id: string): Promise<ReportDetails> => {
  const response = await api.get<ApiResponse<ReportDetails>>(`/admin/reports/${id}`);
  const envelope = response.data;

  if (!envelope.isSuccess || envelope.data === null) {
    throw new Error(
      typeof envelope.error === 'string'
        ? envelope.error
        : (envelope.error?.message ?? 'Failed to fetch report details.')
    );
  }

  return envelope.data;
};

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const REPORTS_QUERY_KEY = (params: ReportsQueryParams) => ['reports', params] as const;
export const REPORT_DETAILS_QUERY_KEY = (id: string) => ['reports', 'details', id] as const;

// ─── Query Hooks ─────────────────────────────────────────────────────────────

export const useReports = (params: ReportsQueryParams) => {
  return useQuery({
    queryKey: REPORTS_QUERY_KEY(params),
    queryFn: () => fetchReports(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useReportDetails = (id: string) => {
  return useQuery({
    queryKey: REPORT_DETAILS_QUERY_KEY(id),
    queryFn: () => fetchReportDetails(id),
    staleTime: 60_000,
    enabled: !!id,
    retry: 1,
  });
};

// ─── Mutation Hooks ──────────────────────────────────────────────────────────

export const useApproveReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/admin/reports/${id}/approve`),
    onSuccess: (_, id) => {
      toast.success('Report approved successfully.');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: REPORT_DETAILS_QUERY_KEY(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve report.');
    },
  });
};

export const useMarkUrgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/admin/reports/${id}/mark-urgent`),
    onSuccess: (_, id) => {
      toast.success('Report marked as urgent.');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: REPORT_DETAILS_QUERY_KEY(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to mark report as urgent.');
    },
  });
};

export const useFlagUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/admin/reports/${id}/flag-user`),
    onSuccess: (_, id) => {
      toast.success('User flagged for moderation review.');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: REPORT_DETAILS_QUERY_KEY(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to flag user.');
    },
  });
};

export const useRemoveReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RemoveReportPayload }) =>
      api.delete(`/admin/reports/${id}`, { data: payload }),
    onSuccess: (_, { id }) => {
      toast.success('Report removed successfully.');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: REPORT_DETAILS_QUERY_KEY(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove report.');
    },
  });
};
