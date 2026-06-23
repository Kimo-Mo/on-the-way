import api from '@/lib/axios';
import { PROVIDERS_FIXTURES } from '@/lib/providers-fixtures';
import type { ProviderDetails } from '@/types/providers';
import { useQuery } from '@tanstack/react-query';

export const fetchProviderDetails = async (id: string): Promise<ProviderDetails> => {
  try {
    const { data } = await api.get<ProviderDetails>(`/admin/providers/${id}`);
    return data;
  } catch (error) {
    console.warn(`[provider details] API unavailable for id ${id}, using fixture data:`, error);
    const fixture = PROVIDERS_FIXTURES.find(p => p.id === id);
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
