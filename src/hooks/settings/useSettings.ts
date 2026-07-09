import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  AdminProfile,
  SystemSettings,
  DisplayPreferences,
  NotificationPreferences,
  NotificationPreferenceKey,
  UpdateProfileRequest,
} from '@/types/settings';

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const PROFILE_QUERY_KEY = ['settings', 'profile'] as const;
export const SYSTEM_SETTINGS_QUERY_KEY = ['settings', 'system'] as const;
export const DISPLAY_PREFS_QUERY_KEY = ['settings', 'display-preferences'] as const;
export const NOTIFICATION_PREFS_QUERY_KEY = ['settings', 'notification-preferences'] as const;

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

// ─── Mock State (Settings without backend endpoints) ─────────────────────────

/**
 * @mock Backend endpoint not yet available. Uses in-memory state.
 * These mock implementations are retained because the backend does not yet
 * expose endpoints for notification preferences, system settings, or display preferences.
 */
let _notifPrefs: NotificationPreferences = {
  emailNotifications: true,
  urgentReportAlerts: true,
  moderationAlerts: true,
  weeklyReports: false,
};

const delay = () => new Promise((r) => setTimeout(r, 400));

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

// ─── System Settings Hooks (Mock) ────────────────────────────────────────────

let _systemSettings: SystemSettings = {
  autoApproveReports: false,
  autoApproveThreshold: 80,
  providerApprovalMode: 'Manual',
  trustScoreThreshold: 60,
  maxActiveHelpRequests: 100,
};

export function useGetSystemSettings() {
  return useQuery({
    queryKey: SYSTEM_SETTINGS_QUERY_KEY,
    queryFn: async (): Promise<SystemSettings> => {
      await delay();
      return { ..._systemSettings };
    },
  });
}

export function useSaveSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SystemSettings): Promise<SystemSettings> => {
      await delay();
      _systemSettings = { ...data };
      return { ..._systemSettings };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEM_SETTINGS_QUERY_KEY });
      toast.success('System settings saved.');
    },
    onError: () => {
      toast.error('Failed to save system settings.');
    },
  });
}

// ─── Display Preferences Hooks (Mock) ────────────────────────────────────────

let _displayPrefs: DisplayPreferences = { language: 'en', timezone: 'Africa/Cairo' };

export function useGetDisplayPreferences() {
  return useQuery({
    queryKey: DISPLAY_PREFS_QUERY_KEY,
    queryFn: async (): Promise<DisplayPreferences> => {
      await delay();
      return { ..._displayPrefs };
    },
  });
}

export function useSaveDisplayPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DisplayPreferences): Promise<DisplayPreferences> => {
      await delay();
      _displayPrefs = { ...data };
      return { ..._displayPrefs };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISPLAY_PREFS_QUERY_KEY });
      toast.success('Display preferences saved.');
    },
    onError: () => {
      toast.error('Failed to save display preferences.');
    },
  });
}

// ─── Notification Preferences Hooks (Mock) ───────────────────────────────────

export function useGetNotificationPreferences() {
  return useQuery({
    queryKey: NOTIFICATION_PREFS_QUERY_KEY,
    queryFn: async (): Promise<NotificationPreferences> => {
      await delay();
      return { ..._notifPrefs };
    },
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: NotificationPreferenceKey;
      value: boolean;
    }): Promise<NotificationPreferences> => {
      await delay();
      _notifPrefs = { ..._notifPrefs, [key]: value };
      return { ..._notifPrefs };
    },
    onMutate: async ({ key, value }) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_PREFS_QUERY_KEY });
      const previous = queryClient.getQueryData<NotificationPreferences>(
        NOTIFICATION_PREFS_QUERY_KEY
      );
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
