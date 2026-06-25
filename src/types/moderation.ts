// Moderation action union types
export type ModerationReportAction = 'approve' | 'remove' | 'warnUser';
export type ModerationUserAction = 'warn' | 'suspend' | 'flagToAdmin';

// Flag reason
export type FlagReason = 'highDownvotes' | 'reportedAsSpam' | 'duplicateContent' | 'other';

// Pending item types
export type PendingItemType = 'reportReview' | 'userFlag' | 'contentRemoval';
export type PendingItemPriority = 'high' | 'medium' | 'low';

// Domain entities
export interface FlaggedReport {
  id: string;
  reportTitle: string;
  location: string;
  downvoteCount: number;
  flagReason: FlagReason;
  submittingUser: { id: string; displayName: string };
  warnedAt: string | null;
  flaggedAt: string;
}

export interface SuspiciousUser {
  id: string;
  displayName: string;
  trustScore: number;
  reportCount: number;
  warningCount: number;
  activitySummary: string;
  flaggedAt: string;
}

export interface PendingModerationItem {
  id: string;
  type: PendingItemType;
  priority: PendingItemPriority;
  description: string;
  targetEntityId: string;
  submittedAt: string;
}

export interface ModerationSummary {
  totalPendingCount: number;
}

// Mutation payload — discriminated union
export interface ApproveReportPayload {
  targetType: 'report';
  targetId: string;
  action: 'approve';
}
export interface RemoveReportModerationPayload {
  targetType: 'report';
  targetId: string;
  action: 'remove';
}
export interface WarnUserOnReportPayload {
  targetType: 'report';
  targetId: string;
  action: 'warnUser';
}
export interface WarnUserPayload {
  targetType: 'user';
  targetId: string;
  action: 'warn';
}
export interface SuspendUserPayload {
  targetType: 'user';
  targetId: string;
  action: 'suspend';
}
export interface FlagToAdminPayload {
  targetType: 'user';
  targetId: string;
  action: 'flagToAdmin';
}

export type ModerationActionPayload =
  | ApproveReportPayload
  | RemoveReportModerationPayload
  | WarnUserOnReportPayload
  | WarnUserPayload
  | SuspendUserPayload
  | FlagToAdminPayload;

// Display helpers
export const FLAG_REASON_LABELS: Record<FlagReason, string> = {
  highDownvotes: 'High downvotes',
  reportedAsSpam: 'Reported as spam',
  duplicateContent: 'Duplicate content',
  other: 'Flagged',
};

export const PRIORITY_LABELS: Record<PendingItemPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
