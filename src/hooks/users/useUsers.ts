import api from '@/lib/axios';
import { usersListFixture, userDetailsFixtures } from '@/lib/users-fixtures';
import type { UsersListResponse, UsersQueryParams, UserDetails } from '@/types/users';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

// ─── Users List ──────────────────────────────────────────────────────────────

export const fetchUsers = async (params: UsersQueryParams): Promise<UsersListResponse> => {
  try {
    const { data } = await api.get<UsersListResponse>('/admin/users', { params });
    return data;
  } catch (error) {
    console.warn('[users] API unavailable, using fixture data:', error);
    return usersListFixture;
  }
};

export const USERS_QUERY_KEY = (params: UsersQueryParams) => ['users', params] as const;

export const useUsers = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: USERS_QUERY_KEY(params),
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

// ─── User Details ─────────────────────────────────────────────────────────────

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
