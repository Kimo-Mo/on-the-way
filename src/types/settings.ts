export type AdminRole = 'Administrator';

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: AdminRole;
}

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
