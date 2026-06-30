import { z } from 'zod';

// ─── Status & Audience Unions ────────────────────────────────────────────────

export type NotificationStatus = 'Published' | 'Draft' | 'Scheduled' | 'Failed';
export type NotificationAudience = 'Broadcast' | 'SpecificRoles';
export type NotificationDeliveryChannel = 'Push' | 'InApp';
export type NotificationRole = 'Driver' | 'ServiceProvider' | 'Admin';
export type NotificationPriority = 'High' | 'Medium' | 'Low';
export type NotificationType = 'Maintenance' | 'Policy' | 'Safety' | 'Legal' | 'Event';

// ─── Core Domain Entity ──────────────────────────────────────────────────────

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  status: NotificationStatus;
  targetAudience: NotificationAudience;
  type: NotificationType;
  priority: NotificationPriority;
  roles: NotificationRole[]; // non-empty only when targetAudience === 'SpecificRoles'
  deliveryChannels: NotificationDeliveryChannel[]; // always contains 'Push' and 'InApp'
  scheduledAt: string | null; // ISO 8601; non-null only when status === 'Scheduled'
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// ─── API Response Shape ──────────────────────────────────────────────────────

export interface NotificationsListResponse {
  data: AdminNotification[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Mutation Payloads ───────────────────────────────────────────────────────

export interface CreateNotificationPayload {
  title: string;
  message: string;
  targetAudience: NotificationAudience;
  type: NotificationType;
  priority: NotificationPriority;
  roles: NotificationRole[];
  deliveryChannels: NotificationDeliveryChannel[];
  scheduledAt: string | null;
  action: 'publish' | 'draft' | 'schedule';
}

export interface UpdateNotificationPayload extends CreateNotificationPayload {
  id: string;
}

// ─── Form Values (React Hook Form + Zod) ────────────────────────────────────

export const createNotificationSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or fewer'),
    message: z
      .string()
      .min(1, 'Message is required')
      .max(500, 'Message must be 500 characters or fewer'),
    targetAudience: z.enum(['Broadcast', 'SpecificRoles']),
    type: z.enum(['Maintenance', 'Policy', 'Safety', 'Legal', 'Event'], {
      message: 'Type is required',
    }),
    priority: z.enum(['High', 'Medium', 'Low'], {
      message: 'Priority is required',
    }),
    roles: z.array(z.enum(['Driver', 'ServiceProvider', 'Admin'])).optional(),
    scheduledAt: z.string().nullable().optional(),
    action: z.enum(['publish', 'draft', 'schedule']),
  })
  .superRefine((data, ctx) => {
    if (data.targetAudience === 'SpecificRoles' && (!data.roles || data.roles.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one role',
        path: ['roles'],
      });
    }
  });

export type CreateNotificationFormValues = z.infer<typeof createNotificationSchema>;

// ─── Display Helpers ─────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<NotificationStatus, string> = {
  Published: 'Published',
  Draft: 'Draft',
  Scheduled: 'Scheduled',
  Failed: 'Failed',
};

export const AUDIENCE_LABELS: Record<NotificationAudience, string> = {
  Broadcast: 'All Users',
  SpecificRoles: 'Specific Roles',
};
