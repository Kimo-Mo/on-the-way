import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  User,
  UserDetails,
  UsersListResponse,
  UsersQueryParams,
  UpdateUserStatusRequest,
  UserStatusEnum,
} from '@/types/users';
import { userStatusToNumeric } from '@/types/users';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

// ─── Fetch Functions ─────────────────────────────────────────────────────────

/**
 * Fetches the users list from GET /api/admin/users.
 * Backend wraps the response in ApiResponse<User[]>, so actual data is at response.data.data.
 *
 * @param params - Query params including search, role, status.
 * @returns UsersListResponse with a data array of User items.
 */
export const fetchUsers = async (params: UsersQueryParams): Promise<UsersListResponse> => {
  const apiParams: Record<string, string | undefined> = {
    search: params.search,
    role: params.role,
    status: params.status,
  };
  const response = await api.get<ApiResponse<User[]>>('/admin/users', { params: apiParams });
  const envelope = response.data;

  if (!envelope.isSuccess || envelope.data === null) {
    throw new Error(
      typeof envelope.error === 'string'
        ? envelope.error
        : (envelope.error?.message ?? 'Failed to fetch users.')
    );
  }

  const users = envelope.data;
  return {
    data: users,
    total: users.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(users.length / params.pageSize) || 1,
  };
};

/**
 * Fetches a single user's details from GET /api/admin/users/{id}.
 * Backend wraps the response in ApiResponse<AdminUserDetailsResponse>.
 *
 * @param id - The unique identifier of the user.
 * @returns UserDetails with activityHistory.
 */
export const fetchUserDetails = async (id: string): Promise<UserDetails> => {
  const response = await api.get<ApiResponse<UserDetails>>(`/admin/users/${id}`);
  const envelope = response.data;

  if (!envelope.isSuccess || envelope.data === null) {
    throw new Error(
      typeof envelope.error === 'string'
        ? envelope.error
        : (envelope.error?.message ?? 'Failed to fetch user details.')
    );
  }

  return envelope.data;
};

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const USERS_QUERY_KEY = (params: UsersQueryParams) => ['users', params] as const;
export const USER_DETAILS_QUERY_KEY = (id: string) => ['users', 'details', id] as const;

// ─── Query Hooks ─────────────────────────────────────────────────────────────

/**
 * React Query hook for fetching the paginated users list.
 */
export const useUsers = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: USERS_QUERY_KEY(params),
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

/**
 * React Query hook for fetching a single user's details.
 */
export const useUserDetails = (id: string) => {
  return useQuery({
    queryKey: USER_DETAILS_QUERY_KEY(id),
    queryFn: () => fetchUserDetails(id),
    staleTime: 60_000,
    enabled: !!id,
    retry: 1,
  });
};

// ─── Mutation Hooks ──────────────────────────────────────────────────────────

/**
 * Mutation hook for updating a user's status via PUT /api/admin/users/{id}/status.
 * Maps the display status string to the backend numeric enum before sending.
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: keyof typeof userStatusToNumeric }) => {
      const payload: UpdateUserStatusRequest = {
        newStatus: userStatusToNumeric[status] as UserStatusEnum,
      };
      return api.put(`/admin/users/${id}/status`, payload);
    },
    onSuccess: (_, { id, status }) => {
      toast.success(`User status updated to ${status}.`);
      
      // Optimistic update for the specific user's details cache
      queryClient.setQueryData<UserDetails>(USER_DETAILS_QUERY_KEY(id), (old) => {
        if (!old) return old;
        return { ...old, status };
      });

      // Optimistic update for all paginated users list caches
      queryClient.setQueriesData<UsersListResponse>(
        { queryKey: ['users'] },
        (old) => {
          // Because ['users'] matches both list and details queries, we verify it's a list response
          if (!old || !old.data || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((u) => (u.id === id ? { ...u, status } : u)),
          };
        }
      );

      // Invalidate to ensure consistency in the background
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: USER_DETAILS_QUERY_KEY(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user status.');
    },
  });
};
