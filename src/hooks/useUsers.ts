import api from '@/lib/axios';
import { usersListFixture } from '@/lib/users-fixtures';
import type { UsersListResponse, UsersQueryParams } from '@/types/users';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

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