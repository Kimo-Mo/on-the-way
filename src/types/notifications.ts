import { z } from 'zod';

// ─── Status & Audience Unions ────────────────────────────────────────────────

export type NotificationStatus = 'Published' | 'Draft' | 'Scheduled' | 'Failed';
export type NotificationAudience = 'Broadcast' | 'SpecificRoles';
export type NotificationDeliveryChannel = 'Push' | 'InApp';
export type NotificationRole = 'Driver' | 'ServiceProvider' | 'Admin';
export type NotificationPriority = 'High' | 'Medium' | 'Low';
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
  status?: string;
  type?: string;
  priority?: string;
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
    priority: z.enum(['High', 'Medium', 'Low'], {
      message: 'Priority is required',
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
