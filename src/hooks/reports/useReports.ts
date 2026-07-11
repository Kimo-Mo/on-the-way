import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  Report,
  ReportDetails,
  ReportsListResponse,
  ReportsQueryParams,
} from '@/types/reports';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

// ─── Fetch Functions ─────────────────────────────────────────────────────────

/**
 * Fetches the reports list from GET /api/admin/reports.
 * Backend wraps the response in ApiResponse<Report[]>.
 */
export const fetchReports = async (params: ReportsQueryParams): Promise<ReportsListResponse> => {
  const apiParams: { search?: string; type?: string; sortOrder?: string; status?: string } = {
    search: params.search,
    type: params.type,
    sortOrder: params.sortOrder,
    status: params.status,
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

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: number }) =>
      api.put(`/admin/reports/${id}/status`, { newStatus }),
    onSuccess: (_, { id, newStatus }) => {
      const statusMap: Record<number, string> = { 0: 'Open', 1: 'Solved', 2: 'Closed' };
      const statusStr = statusMap[newStatus];
      toast.success(`Report marked as ${statusStr}.`);

      queryClient.setQueryData<ReportDetails>(REPORT_DETAILS_QUERY_KEY(id), (old) =>
        old ? { ...old, status: statusStr } : old
      );
      queryClient.setQueriesData<ReportsListResponse>({ queryKey: ['reports'] }, (old) => {
        if (!old || !old.data || !Array.isArray(old.data)) return old;
        return {
          ...old,
          data: old.data.map((r) => (r.id === id ? { ...r, status: statusStr } : r)),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: REPORT_DETAILS_QUERY_KEY(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update report status.');
    },
  });
};
