import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton, Switch } from '@/components/ui';
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreference,
} from '@/hooks/settings/useSettings';
import type { NotificationPreferenceKey } from '@/types/settings';

const preferenceRows: { key: NotificationPreferenceKey; label: string; description: string }[] = [
  {
    key: 'emailNotifications',
    label: 'Email Notifications',
    description: 'Receive email updates for important events',
  },
  {
    key: 'urgentReportAlerts',
    label: 'Urgent Report Alerts',
    description: 'Get notified when urgent reports are submitted',
  },
  {
    key: 'moderationAlerts',
    label: 'Moderation Alerts',
    description: 'Notifications for content requiring moderation',
  },
  {
    key: 'weeklyReports',
    label: 'Weekly Reports',
    description: 'Receive weekly analytics and summary reports',
  },
];

export function NotificationPreferencesSection() {
  const { data: prefs, isLoading } = useGetNotificationPreferences();
  const mutation = useUpdateNotificationPreference();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferenceRows.map((row) => (
          <div key={row.key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{row.label}</p>
              <p className="text-sm text-muted-foreground">{row.description}</p>
            </div>
            <Switch
              checked={prefs?.[row.key] ?? false}
              onCheckedChange={(value) => mutation.mutate({ key: row.key, value })}
              disabled={mutation.isPending}
              aria-label={`Toggle ${row.label.toLowerCase()}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
