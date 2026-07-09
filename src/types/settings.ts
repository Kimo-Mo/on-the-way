// ─── Admin Profile (GET /api/admin/settings/profile) ─────────────────────────

/**
 * Matches ProfileSettingsResponse from the API documentation exactly.
 * Note: the backend returns `fullName` (not `name`).
 */
export interface AdminProfile {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
}

// ─── Update Profile (PUT /api/admin/settings/profile) ────────────────────────

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
}

// ─── Mock-only settings (no backend endpoints yet) ────────────────────────────

export type AdminRole = string;

export interface NotificationPreferences {
  emailNotifications: boolean;
  urgentReportAlerts: boolean;
  moderationAlerts: boolean;
  weeklyReports: boolean;
}

export type NotificationPreferenceKey = keyof NotificationPreferences;

export interface SystemSettings {
  autoApproveReports: boolean;
  autoApproveThreshold: number;
  providerApprovalMode: 'Manual' | 'Automatic';
  trustScoreThreshold: number;
  maxActiveHelpRequests: number;
}

export interface DisplayPreferences {
  language: string;
  timezone: string;
}
