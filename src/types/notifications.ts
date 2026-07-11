import { z } from 'zod';

// ─── Status & Audience Unions ────────────────────────────────────────────────

export type NotificationStatus = 'Published' | 'Draft' | 'Scheduled' | 'Failed';
export type NotificationAudience = 'Broadcast' | 'SpecificRoles';
export type NotificationDeliveryChannel = 'Push' | 'InApp';
export type NotificationRole = 'Driver' | 'Admin';
export type NotificationType = 'Maintenance' | 'Policy' | 'Safety' | 'Legal' | 'Event';

// ─── List Item (GET /api/admin/notifications) ─────────────────────────────────

/**
 * Matches AnnouncementListItem from the API documentation exactly.
 */
export interface AnnouncementListItem {
  id: string;
  title: string;
  category: string;
  publishDate: string | null; // ISO 8601
}

// ─── Details Response (GET /api/admin/notifications/{id}) ────────────────────

/**
 * Matches AnnouncementDetailsResponse from the API documentation exactly.
 */
export interface AnnouncementDetailsResponse {
  id: string;
  title: string;
  category: string;
  targetAudience: string;
  content: string;
  publishDate: string | null; // ISO 8601
  isPublished: boolean;
  adminName: string;
  createdAt: string; // ISO 8601
}

// ─── Core Domain Entity (union of list + detail fields for UI use) ────────────

/**
 * AdminNotification — UI entity combining list and detail fields.
 * All fields are optional to handle both list-item and detail shapes.
 */
export interface AdminNotification {
  id?: string;
  title?: string;
  content?: string | null;
  category?: string | null;
  targetAudience?: string | null;
  publishDate?: string | null; // ISO 8601 date-time
  isPublished?: boolean;
  adminName?: string;
  // UI-extended fields (not all present in API responses):
  type?: string;
  roles?: string[];
  deliveryChannels?: string[];
  createdAt?: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface NotificationsListResponse {
  data: AdminNotification[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Create/Update Request (POST /api/admin/notifications) ───────────────────

/**
 * Matches CreateAnnouncementRequest from the API documentation exactly.
 */
export interface CreateAnnouncementRequest {
  title: string;
  category: string;
  targetAudience: string;
  content: string;
  publishDate?: string | null; // ISO 8601 date string
  isPublished: boolean;
}

export interface UpdateNotificationPayload extends Partial<CreateAnnouncementRequest> {
  id: string;
}

// ─── Form Values (React Hook Form + Zod) ────────────────────────────────────

export const createNotificationSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or fewer'),
    content: z
      .string()
      .min(1, 'Message is required')
      .max(500, 'Message must be 500 characters or fewer'),
    targetAudience: z.enum(['Broadcast', 'SpecificRoles']),
    category: z.enum(['Maintenance', 'Policy', 'Safety', 'Legal', 'Event'], {
      message: 'Category is required',
    }),
    roles: z.array(z.enum(['Driver', 'ServiceProvider', 'Admin'])).optional(),
    publishDate: z.string().nullable().optional(),
    isPublished: z.boolean().optional(),
    action: z.enum(['publish', 'draft', 'schedule']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.targetAudience === 'SpecificRoles' && (!data.roles || data.roles.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one role',
        path: ['roles'],
      });
    }
    if (data.action === 'schedule' && (!data.publishDate || data.publishDate.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Schedule date is required when scheduling',
        path: ['publishDate'],
      });
    }
  });

export type CreateNotificationFormValues = z.infer<typeof createNotificationSchema>;

// ─── Display Helpers ─────────────────────────────────────────────────────────

export const AUDIENCE_LABELS: Record<NotificationAudience, string> = {
  Broadcast: 'All Users',
  SpecificRoles: 'Specific Roles',
};

/**
 * Derives the notification status dynamically from publishDate and isPublished.
 * - publishDate is null => "Draft"
 * - publishDate is in the future => "Scheduled"
 * - otherwise (publishDate is past/present) => "Published"
 */
export function deriveNotificationStatus(
  publishDate: string | null | undefined,
): NotificationStatus {
  if (!publishDate) return 'Draft';
  const utcDate = publishDate.endsWith('Z') ? publishDate : publishDate + 'Z';
  const scheduledTime = new Date(utcDate).getTime();
  if (scheduledTime > Date.now()) return 'Scheduled';
  return 'Published';
}
