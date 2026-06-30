import type {
  AdminProfile,
  NotificationPreferences,
  NotificationPreferenceKey,
  SystemSettings,
  DisplayPreferences,
} from '../../types/settings';

let _profile: AdminProfile = {
  id: '1',
  fullName: 'Admin User',
  email: 'admin@ontheway.com',
  phoneNumber: '+1 (555) 123-4567',
  role: 'Administrator',
};
let _notifPrefs: NotificationPreferences = {
  emailNotifications: true,
  urgentReportAlerts: true,
  moderationAlerts: true,
  weeklyReports: false,
};
let _systemSettings: SystemSettings = {
  autoApproveReports: false,
  autoApproveThreshold: 80,
  providerApprovalMode: 'Manual',
  trustScoreThreshold: 60,
  maxActiveHelpRequests: 100,
};
let _displayPrefs: DisplayPreferences = { language: 'en', timezone: 'Africa/Cairo' };

export async function getAdminProfile(): Promise<AdminProfile> {
  await delay();
  return { ..._profile };
}
export async function saveAdminProfile(
  data: Omit<AdminProfile, 'id' | 'role'>
): Promise<AdminProfile> {
  await delay();
  _profile = { ..._profile, ...data };
  return { ..._profile };
}
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  await delay();
  return { ..._notifPrefs };
}
export async function updateNotificationPreference(
  key: NotificationPreferenceKey,
  value: boolean
): Promise<NotificationPreferences> {
  await delay();
  _notifPrefs = { ..._notifPrefs, [key]: value };
  return { ..._notifPrefs };
}
export async function getSystemSettings(): Promise<SystemSettings> {
  await delay();
  return { ..._systemSettings };
}
export async function saveSystemSettings(data: SystemSettings): Promise<SystemSettings> {
  await delay();
  _systemSettings = { ...data };
  return { ..._systemSettings };
}
export async function getDisplayPreferences(): Promise<DisplayPreferences> {
  await delay();
  return { ..._displayPrefs };
}
export async function saveDisplayPreferences(
  data: DisplayPreferences
): Promise<DisplayPreferences> {
  await delay();
  _displayPrefs = { ...data };
  return { ..._displayPrefs };
}

function delay() {
  return new Promise((r) => setTimeout(r, 400));
}
