import api from '@/lib/axios';
import { reportDetailsFixtures } from '@/lib/reports-fixtures';
import type { ReportDetails } from '@/types/reports';
import { useQuery } from '@tanstack/react-query';

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
