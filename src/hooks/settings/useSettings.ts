import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAdminProfile,
  saveAdminProfile,
  getSystemSettings,
  saveSystemSettings,
  getDisplayPreferences,
  saveDisplayPreferences,
  getNotificationPreferences,
  updateNotificationPreference,
} from '@/services/api/settings';
import type {
  AdminProfile,
  SystemSettings,
  DisplayPreferences,
  NotificationPreferences,
  NotificationPreferenceKey,
} from '@/types/settings';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const PROFILE_QUERY_KEY = ['settings', 'profile'] as const;
export const SYSTEM_SETTINGS_QUERY_KEY = ['settings', 'system'] as const;
export const DISPLAY_PREFS_QUERY_KEY = ['settings', 'display-preferences'] as const;
export const NOTIFICATION_PREFS_QUERY_KEY = ['settings', 'notification-preferences'] as const;

// ─── Admin Profile ────────────────────────────────────────────────────────────

export function useGetAdminProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => getAdminProfile(),
  });
}

export function useSaveAdminProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AdminProfile, 'id' | 'role'>) => saveAdminProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success('Profile saved successfully.');
    },
    onError: () => {
      toast.error('Failed to save profile. Please try again.');
    },
  });
}

// ─── System Settings ──────────────────────────────────────────────────────────

export function useGetSystemSettings() {
  return useQuery({
    queryKey: SYSTEM_SETTINGS_QUERY_KEY,
    queryFn: () => getSystemSettings(),
  });
}

export function useSaveSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SystemSettings) => saveSystemSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEM_SETTINGS_QUERY_KEY });
      toast.success('System settings saved.');
    },
    onError: () => {
      toast.error('Failed to save system settings.');
    },
  });
}

// ─── Display Preferences ──────────────────────────────────────────────────────

export function useGetDisplayPreferences() {
  return useQuery({
    queryKey: DISPLAY_PREFS_QUERY_KEY,
    queryFn: () => getDisplayPreferences(),
  });
}

export function useSaveDisplayPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DisplayPreferences) => saveDisplayPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISPLAY_PREFS_QUERY_KEY });
      toast.success('Display preferences saved.');
    },
    onError: () => {
      toast.error('Failed to save display preferences.');
    },
  });
}

// ─── Notification Preferences ─────────────────────────────────────────────────

export function useGetNotificationPreferences() {
  return useQuery({
    queryKey: NOTIFICATION_PREFS_QUERY_KEY,
    queryFn: () => getNotificationPreferences(),
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: NotificationPreferenceKey; value: boolean }) =>
      updateNotificationPreference(key, value),
    onMutate: async ({ key, value }) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_PREFS_QUERY_KEY });
      const previous = queryClient.getQueryData<NotificationPreferences>(NOTIFICATION_PREFS_QUERY_KEY);
      queryClient.setQueryData<NotificationPreferences>(NOTIFICATION_PREFS_QUERY_KEY, (old) =>
        old ? { ...old, [key]: value } : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(NOTIFICATION_PREFS_QUERY_KEY, context.previous);
      toast.error('Failed to update preference. Please try again.');
    },
    onSuccess: () => {
      toast.success('Preference updated.');
    },
  });
}
