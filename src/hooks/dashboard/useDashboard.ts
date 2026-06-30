import api from '@/lib/axios';
import { dashboardFixtures } from '@/lib/dashboard-fixtures';
import type { DashboardOverview, FlaggedContentItem } from '@/types/dashboard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DASHBOARD_QUERY_KEY = ['dashboard', 'overview'];

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const { data } = await api.get<DashboardOverview>('/admin/dashboard/overview');
    return data;
  } catch (error) {
    console.warn('[dashboard] API unavailable, using fixture data:', error);
    return dashboardFixtures;
  }
};

export const approveFlaggedContent = async (id: string): Promise<FlaggedContentItem> => {
  const { data } = await api.post<FlaggedContentItem>(
    `/admin/dashboard/flagged-content/${id}/approve`
  );
  return data;
};

export const removeFlaggedContent = async (id: string): Promise<FlaggedContentItem> => {
  const { data } = await api.post<FlaggedContentItem>(
    `/admin/dashboard/flagged-content/${id}/remove`
  );
  return data;
};

export const flagRelatedUser = async (id: string): Promise<FlaggedContentItem> => {
  const { data } = await api.post<FlaggedContentItem>(
    `/admin/dashboard/flagged-content/${id}/flag-user`
  );
  return data;
};

export const useDashboardOverview = () => {
  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboardOverview,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 1000,
    retry: false,
  });

  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: approveFlaggedContent,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previous = queryClient.getQueryData<DashboardOverview>(DASHBOARD_QUERY_KEY);
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFlaggedContent,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previous = queryClient.getQueryData<DashboardOverview>(DASHBOARD_QUERY_KEY);
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  const flagUserMutation = useMutation({
    mutationFn: flagRelatedUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previous = queryClient.getQueryData<DashboardOverview>(DASHBOARD_QUERY_KEY);
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  return {
    ...query,
    approveFlaggedContent: approveMutation,
    removeFlaggedContent: removeMutation,
    flagRelatedUser: flagUserMutation,
  };
};
