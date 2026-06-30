import api from '@/lib/axios';
import { PROVIDERS_FIXTURES } from '@/lib/providers-fixtures';
import type {
  ProvidersListResponse,
  ProvidersQueryParams,
  ProviderDetails,
  UpdateProviderStatusPayload,
} from '@/types/providers';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

// ─── Providers List ───────────────────────────────────────────────────────────

export const fetchProviders = async (params: ProvidersQueryParams): Promise<ProvidersListResponse> => {
  try {
    const { data } = await api.get<ProvidersListResponse>('/admin/providers', { params });
    return data;
  } catch (error) {
    console.warn('[providers] API unavailable, using fixture data:', error);

    // Simulate pagination & filtering
    let filtered = PROVIDERS_FIXTURES;
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.businessName.toLowerCase().includes(search) ||
          p.operatingArea.toLowerCase().includes(search) ||
          (p.primaryContactName && p.primaryContactName.toLowerCase().includes(search))
      );
    }
    if (params.type) {
      filtered = filtered.filter((p) => p.serviceType === params.type);
    }
    if (params.status) {
      filtered = filtered.filter((p) => p.status === params.status);
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      data: paginated,
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  }
};

export const PROVIDERS_QUERY_KEY = (params: ProvidersQueryParams) =>
  ['providers', params] as const;

export const useProviders = (params: ProvidersQueryParams) => {
  return useQuery({
    queryKey: PROVIDERS_QUERY_KEY(params),
    queryFn: () => fetchProviders(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

// ─── Provider Details ─────────────────────────────────────────────────────────

export const fetchProviderDetails = async (id: string): Promise<ProviderDetails> => {
  try {
    const { data } = await api.get<ProviderDetails>(`/admin/providers/${id}`);
    return data;
  } catch (error) {
    console.warn(`[provider details] API unavailable for id ${id}, using fixture data:`, error);
    const fixture = PROVIDERS_FIXTURES.find((p) => p.id === id);
    if (fixture) {
      return fixture;
    }
    throw new Error('Provider not found', { cause: error });
  }
};

export const PROVIDER_DETAILS_QUERY_KEY = (id: string) => ['providers', 'details', id] as const;

export const useProviderDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: id ? PROVIDER_DETAILS_QUERY_KEY(id) : [],
    queryFn: () => fetchProviderDetails(id!),
    enabled: !!id,
    retry: 1,
    staleTime: 60_000,
  });
};

// ─── Provider Status Mutation ─────────────────────────────────────────────────

export const useUpdateProviderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProviderStatusPayload }) =>
      api.post(`/admin/providers/${id}/status`, payload),
    onSuccess: (_, { id, payload }) => {
      let actionLabel = '';
      if (payload.action === 'approve') actionLabel = 'approved';
      if (payload.action === 'reject') actionLabel = 'rejected';
      if (payload.action === 'suspend') actionLabel = 'suspended';

      toast.success(`Provider ${actionLabel} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'details', id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update provider status.');
    },
  });
};
