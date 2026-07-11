import type { LucideIcon } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number | string;
}

export type {
  UserRole,
  UserStatus,
  User,
  UserActivity,
  UserDetails,
  UsersQueryParams,
  PaginatedResponse,
  UsersListResponse,
  UpdateUserStatusRequest,
} from './users';

export { UserStatusEnum, userStatusToNumeric } from './users';

export type {
  IncidentTypeLabel,
  IncidentStatusLabel,
  Report,
  ReportDetails,
  ReportsQueryParams,
  ReportsListResponse,
  RemoveReportPayload,
  RemoveReportFormValues,
} from './reports';

export { removeReportSchema, incidentTypeLabels, incidentStatusLabels } from './reports';

export type {
  NotificationStatus,
  NotificationAudience,
  NotificationDeliveryChannel,
  AdminNotification,
  NotificationsListResponse,
  UpdateNotificationPayload,
  CreateNotificationFormValues,
  CreateAnnouncementRequest,
} from './notifications';

export { createNotificationSchema, AUDIENCE_LABELS, deriveNotificationStatus } from './notifications';
