import api from '@/lib/axios';
import { userDetailsFixtures } from '@/lib/users-fixtures';
import type { UserDetails } from '@/types/users';
import { useQuery } from '@tanstack/react-query';

export const fetchUserDetails = async (id: string): Promise<UserDetails> => {
  try {
    const { data } = await api.get<UserDetails>(`/admin/users/${id}`);
    return data;
  } catch (error) {
    console.warn('[user-details] API unavailable, using fixture data:', error);
    const fixture = userDetailsFixtures[id];
    if (fixture) {
      return fixture;
    }
    throw error;
  }
};

export const USER_DETAILS_QUERY_KEY = (id: string) => ['users', 'details', id] as const;

export const useUserDetails = (id: string) => {
  return useQuery({
    queryKey: USER_DETAILS_QUERY_KEY(id),
    queryFn: () => fetchUserDetails(id),
    staleTime: 60_000,
    enabled: !!id,
    retry: 1,
  });
};