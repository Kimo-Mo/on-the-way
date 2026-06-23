import api from '@/lib/axios';
import { PROVIDERS_FIXTURES } from '@/lib/providers-fixtures';
import type { ProvidersListResponse, ProvidersQueryParams } from '@/types/providers';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

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
      filtered = filtered.filter(p => 
        p.businessName.toLowerCase().includes(search) || 
        p.operatingArea.toLowerCase().includes(search) ||
        (p.primaryContactName && p.primaryContactName.toLowerCase().includes(search))
      );
    }
    if (params.type) {
      filtered = filtered.filter(p => p.serviceType === params.type);
    }
    if (params.status) {
      filtered = filtered.filter(p => p.status === params.status);
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

export const PROVIDERS_QUERY_KEY = (params: ProvidersQueryParams) => ['providers', params] as const;

export const useProviders = (params: ProvidersQueryParams) => {
  return useQuery({
    queryKey: PROVIDERS_QUERY_KEY(params),
    queryFn: () => fetchProviders(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
