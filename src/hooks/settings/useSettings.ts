import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { AdminProfile, UpdateProfileRequest } from '@/types/settings';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const PROFILE_QUERY_KEY = ['settings', 'profile'] as const;

// ─── Fetch Functions ─────────────────────────────────────────────────────────

/**
 * Fetches the admin profile from GET /api/admin/settings/profile.
 * Backend wraps the response in ApiResponse<ProfileSettingsResponse>.
 *
 * @returns AdminProfile matching ProfileSettingsResponse exactly.
 */
export const fetchAdminProfile = async (): Promise<AdminProfile> => {
  const response = await api.get<ApiResponse<AdminProfile>>('/admin/settings/profile');
  const envelope = response.data;

  if (!envelope.isSuccess || envelope.data === null) {
    throw new Error(
      typeof envelope.error === 'string'
        ? envelope.error
        : (envelope.error?.message ?? 'Failed to fetch admin profile.')
    );
  }

  return envelope.data;
};

/**
 * Saves the admin profile via PUT /api/admin/settings/profile.
 *
 * @param payload - Profile fields to update (fullName, email, phoneNumber).
 * @returns AdminProfile from the backend response.
 */
export const saveAdminProfile = async (
  payload: UpdateProfileRequest
): Promise<AdminProfile> => {
  const response = await api.put<ApiResponse<AdminProfile>>('/admin/settings/profile', payload);
  const envelope = response.data;

  if (!envelope.isSuccess || envelope.data === null) {
    throw new Error(
      typeof envelope.error === 'string'
        ? envelope.error
        : (envelope.error?.message ?? 'Failed to save admin profile.')
    );
  }

  return envelope.data;
};

// ─── Admin Profile Hooks ─────────────────────────────────────────────────────

/**
 * React Query hook for fetching the admin profile from GET /api/admin/settings/profile.
 */
export function useGetAdminProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchAdminProfile,
  });
}

/**
 * Mutation hook for saving the admin profile via PUT /api/admin/settings/profile.
 */
export function useSaveAdminProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => saveAdminProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success('Profile saved successfully.');
    },
    onError: () => {
      toast.error('Failed to save profile. Please try again.');
    },
  });
}
