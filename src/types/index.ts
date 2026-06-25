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
  UserActivityType,
  UserDetails,
  UsersQueryParams,
  PaginatedResponse,
  UsersListResponse,
} from './users';

export type {
  ObstacleType,
  ReportStatus,
  RemovalReason,
  ReportSubmitter,
  CommunityVotes,
  GpsCoordinates,
  Report,
  ReportDetails,
  ReportsQueryParams,
  ReportsListResponse,
  RemoveReportPayload,
  RemoveReportFormValues,
} from './reports';

export { removeReportSchema } from './reports';

export type {
  ProviderServiceType,
  ProviderStatus,
  VerificationStatus,
  VerificationDocumentType,
  VerificationDocument,
  ProviderRatingSummary,
  CustomerReview,
  Provider,
  ProviderDetails,
  ProviderStatusAction,
  ProviderDecisionReason,
  StatusDecision,
  ProvidersQueryParams,
  ProvidersListResponse,
  ApproveProviderPayload,
  RejectProviderPayload,
  SuspendProviderPayload,
  UpdateProviderStatusPayload,
  RejectProviderFormValues,
  SuspendProviderFormValues,
} from './providers';

export {
  MANDATORY_DOCUMENT_TYPES,
  providerDecisionReasonSchema,
  rejectProviderSchema,
  suspendProviderSchema,
  getMissingRequiredDocumentLabels,
  canApproveProvider,
  getProviderStatusActionAvailability,
} from './providers';

export type {
  ModerationReportAction,
  ModerationUserAction,
  FlagReason,
  PendingItemType,
  PendingItemPriority,
  FlaggedReport,
  SuspiciousUser,
  PendingModerationItem,
  ModerationSummary,
  ModerationActionPayload,
  ApproveReportPayload,
  RemoveReportModerationPayload,
  WarnUserOnReportPayload,
  WarnUserPayload,
  SuspendUserPayload,
  FlagToAdminPayload,
} from './moderation';

export { FLAG_REASON_LABELS, PRIORITY_LABELS } from './moderation';

export type {
  NotificationStatus,
  NotificationAudience,
  NotificationDeliveryChannel,
  AdminRole,
  AdminNotification,
  NotificationsListResponse,
  CreateNotificationPayload,
  UpdateNotificationPayload,
  CreateNotificationFormValues,
} from './notifications';

export { createNotificationSchema, STATUS_LABELS, AUDIENCE_LABELS } from './notifications';
