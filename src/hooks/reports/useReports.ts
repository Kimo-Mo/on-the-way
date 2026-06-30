import api from '@/lib/axios';
import { reportsListFixture, reportDetailsFixtures } from '@/lib/reports-fixtures';
import type {
  ReportsListResponse,
  ReportsQueryParams,
  RemoveReportPayload,
  ReportDetails,
} from '@/types/reports';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

// ─── Reports List ─────────────────────────────────────────────────────────────

export const fetchReports = async (params: ReportsQueryParams): Promise<ReportsListResponse> => {
  try {
    const { data } = await api.get<ReportsListResponse>('/admin/reports', { params });
    return data;
  } catch (error) {
    console.warn('[reports] API unavailable, using fixture data:', error);
    return reportsListFixture;
  }
};

export const REPORTS_QUERY_KEY = (params: ReportsQueryParams) => ['reports', params] as const;

export const useReports = (params: ReportsQueryParams) => {
  return useQuery({
    queryKey: REPORTS_QUERY_KEY(params),
    queryFn: () => fetchReports(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

// ─── Report Details ───────────────────────────────────────────────────────────

export const fetchReportDetails = async (id: string): Promise<ReportDetails> => {
  try {
    const { data } = await api.get<ReportDetails>(`/admin/reports/${id}`);
    return data;
  } catch (error) {
    console.warn('[report-details] API unavailable, using fixture data:', error);
    const fixture = reportDetailsFixtures[id];
    if (fixture) {
      return fixture;
    }
    throw error;
  }
};

export const REPORT_DETAILS_QUERY_KEY = (id: string) => ['reports', 'details', id] as const;

export const useReportDetails = (id: string) => {
  return useQuery({
    queryKey: REPORT_DETAILS_QUERY_KEY(id),
    queryFn: () => fetchReportDetails(id),
    staleTime: 60_000,
    enabled: !!id,
    retry: 1,
  });
};

// ─── Report Mutations ─────────────────────────────────────────────────────────

export const useApproveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post(`/admin/reports/${id}/approve`),
    onSuccess: (_, id) => {
      toast.success('Report approved successfully.');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', 'details', id] });
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
      queryClient.invalidateQueries({ queryKey: ['reports', 'details', id] });
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
      queryClient.invalidateQueries({ queryKey: ['reports', 'details', id] });
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
      queryClient.invalidateQueries({ queryKey: ['reports', 'details', id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove report.');
    },
  });
};
