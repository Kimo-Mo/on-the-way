import type { FlaggedReport, SuspiciousUser, PendingModerationItem, ModerationSummary } from '@/types/moderation';

export const FLAGGED_REPORTS_FIXTURES: FlaggedReport[] = [
  {
    id: 'rpt-001',
    reportTitle: 'Blocked highway near downtown',
    location: 'Downtown Intersection, Main St',
    downvoteCount: 12,
    flagReason: 'reportedAsSpam',
    submittingUser: { id: 'usr-101', displayName: 'Jane Doe' },
    warnedAt: '2026-06-20T14:30:00Z',
    flaggedAt: '2026-06-18T09:00:00Z',
  },
  {
    id: 'rpt-002',
    reportTitle: 'Fake accident on highway 5',
    location: 'Highway 5, Mile Marker 22',
    downvoteCount: 8,
    flagReason: 'highDownvotes',
    submittingUser: { id: 'usr-102', displayName: 'Bob Smith' },
    warnedAt: null,
    flaggedAt: '2026-06-21T11:15:00Z',
  },
  {
    id: 'rpt-003',
    reportTitle: 'Duplicate road closure report',
    location: 'Oak Avenue & 3rd Street',
    downvoteCount: 5,
    flagReason: 'duplicateContent',
    submittingUser: { id: 'usr-103', displayName: 'Carlos Ruiz' },
    warnedAt: null,
    flaggedAt: '2026-06-22T16:45:00Z',
  },
];

export const SUSPICIOUS_USERS_FIXTURES: SuspiciousUser[] = [
  {
    id: 'usr-201',
    displayName: 'Mark Wilson',
    trustScore: 32,
    reportCount: 7,
    warningCount: 3,
    activitySummary: 'Submitted multiple reports flagged as spam in the past week.',
    flaggedAt: '2026-06-19T08:00:00Z',
  },
  {
    id: 'usr-202',
    displayName: 'Lisa Chen',
    trustScore: 45,
    reportCount: 4,
    warningCount: 1,
    activitySummary: 'Reports consistently downvoted by community. Low reliability score.',
    flaggedAt: '2026-06-20T13:20:00Z',
  },
  {
    id: 'usr-203',
    displayName: 'Tom Baker',
    trustScore: 58,
    reportCount: 3,
    warningCount: 0,
    activitySummary: 'Submitted duplicate content across multiple locations.',
    flaggedAt: '2026-06-22T10:00:00Z',
  },
];

export const getPendingItemsFixtures = (): PendingModerationItem[] => [
  {
    id: 'pend-001',
    type: 'reportReview',
    priority: 'high',
    description: 'Report flagged as spam requires review',
    targetEntityId: 'rpt-001',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pend-002',
    type: 'userFlag',
    priority: 'medium',
    description: 'User activity pattern suggests spam behavior',
    targetEntityId: 'usr-201',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pend-003',
    type: 'contentRemoval',
    priority: 'low',
    description: 'Duplicate content detected for removal',
    targetEntityId: 'rpt-003',
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MODERATION_SUMMARY_FIXTURE: ModerationSummary = { totalPendingCount: 9 };
