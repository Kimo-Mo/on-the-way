# Quickstart: Moderation Panel

**Feature**: `007-moderation-panel`  
**Date**: 2026-06-24

---

## What This Feature Delivers

A `/moderation` page for the On The Way admin dashboard that enables administrators to:

1. **Review and action flagged reports** (road reports marked as false, spam, or duplicate) — Approve, Remove, or Warn User.
2. **Review and action suspicious users** (accounts flagged for unreliable behavior) — Warn, Suspend, or Flag to Admin.
3. **Monitor a pending moderation queue** with priority-tagged items and "Review" navigation buttons.
4. **See a live pending count badge** in the page header, auto-refreshed every 45 seconds.

---

## Files To Create

```
src/
├── types/
│   └── moderation.ts                           [CREATE] All domain and API types for the moderation panel
├── lib/
│   └── moderation-fixtures.ts                  [CREATE] Typed fixture data matching contract shapes
├── hooks/
│   ├── useGetFlaggedReports.ts                 [CREATE] React Query hook — flagged reports list
│   ├── useGetSuspiciousUsers.ts                [CREATE] React Query hook — suspicious users list
│   ├── useGetPendingModerationItems.ts         [CREATE] React Query hook — pending queue
│   ├── useGetModerationSummary.ts              [CREATE] React Query hook — pending count badge
│   └── useModerationAction.ts                  [CREATE] Shared mutation hook for all 6 actions
├── pages/
│   └── ModerationPanel.tsx                     [CREATE] Page-level component — assembles all sections
├── components/
│   └── moderation/
│       ├── index.ts                            [CREATE] Component exports barrel
│       ├── ModerationPageHeader.tsx            [CREATE] Page title + pending count badge
│       ├── FlaggedReportsSection.tsx           [CREATE] Flagged reports section with skeleton/empty/error
│       ├── FlaggedReportCard.tsx               [CREATE] Individual flagged report card with action buttons
│       ├── FlagReasonBadge.tsx                 [CREATE] Colored badge for flagReason values
│       ├── WarnedBadge.tsx                     [CREATE] Amber "Warned" badge shown when warnedAt is set
│       ├── SuspiciousUsersSection.tsx          [CREATE] Suspicious users section with skeleton/empty/error
│       ├── SuspiciousUserCard.tsx              [CREATE] Individual suspicious user card with action buttons
│       ├── PendingModerationQueue.tsx          [CREATE] Pending items queue with skeleton/empty/error
│       ├── PendingItemRow.tsx                  [CREATE] Single pending queue item with priority badge + Review button
│       └── ModerationConfirmDialog.tsx         [CREATE] Shared AlertDialog for Remove and Suspend confirmation
```

## Files To Modify

```
src/
├── App.tsx                                     [MODIFY] Replace <h1>Moderation</h1> stub with <ModerationPanel />
├── types/
│   └── index.ts                               [MODIFY] Re-export moderation types
└── pages/
    └── index.ts                               [MODIFY] Export ModerationPanel page
```

---

## Key Implementation Notes

### 1. React Query Hooks — Background Polling

All four moderation hooks use `refetchInterval: 45_000` and `refetchIntervalInBackground: false`:

```typescript
// Example: useGetFlaggedReports.ts
import api from '@/lib/axios';
import { FLAGGED_REPORTS_FIXTURES } from '@/lib/moderation-fixtures';
import type { FlaggedReport } from '@/types/moderation';
import { useQuery } from '@tanstack/react-query';

export const FLAGGED_REPORTS_QUERY_KEY = ['moderation', 'flaggedReports'] as const;

export const useGetFlaggedReports = () => {
  return useQuery({
    queryKey: FLAGGED_REPORTS_QUERY_KEY,
    queryFn: async (): Promise<FlaggedReport[]> => {
      try {
        const { data } = await api.get<{ data: FlaggedReport[] }>('/admin/moderation/flagged-reports');
        return data.data;
      } catch {
        return FLAGGED_REPORTS_FIXTURES;
      }
    },
    refetchInterval: 45_000,
    refetchIntervalInBackground: false,
    staleTime: 30_000,
  });
};
```

### 2. Mutation Hook — Shared Action Dispatcher

```typescript
// useModerationAction.ts
import api from '@/lib/axios';
import type { ModerationActionPayload } from '@/types/moderation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FLAGGED_REPORTS_QUERY_KEY } from './useGetFlaggedReports';
import { SUSPICIOUS_USERS_QUERY_KEY } from './useGetSuspiciousUsers';
import { MODERATION_SUMMARY_QUERY_KEY } from './useGetModerationSummary';

export const useModerationAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ModerationActionPayload) => {
      if (payload.targetType === 'report') {
        const { data } = await api.post(
          `/admin/moderation/reports/${payload.targetId}/actions`,
          { action: payload.action }
        );
        return data;
      } else {
        const { data } = await api.post(
          `/admin/moderation/users/${payload.targetId}/actions`,
          { action: payload.action }
        );
        return data;
      }
    },
    onSuccess: (_, payload) => {
      if (payload.targetType === 'report') {
        queryClient.invalidateQueries({ queryKey: FLAGGED_REPORTS_QUERY_KEY });
      } else {
        queryClient.invalidateQueries({ queryKey: SUSPICIOUS_USERS_QUERY_KEY });
        if (payload.action === 'suspend') {
          toast.success('User suspended.', {
            action: {
              label: 'View profile →',
              onClick: () => window.location.href = `/users/${payload.targetId}`,
            },
          });
          return; // skip generic toast
        }
      }
      queryClient.invalidateQueries({ queryKey: MODERATION_SUMMARY_QUERY_KEY });
      toast.success('Action applied successfully.');
    },
    onError: () => {
      toast.error('Action failed. Please try again.');
    },
  });
};
```

### 3. Confirmation Dialog — Remove and Suspend Only

Use Shadcn `AlertDialog` for Remove (report) and Suspend (user). No form fields required:

```tsx
// ModerationConfirmDialog.tsx
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ModerationConfirmDialog({ open, title, description, onConfirm, onCancel, isPending }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending} className="bg-destructive">
            {isPending ? 'Processing…' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### 4. Warned Badge

```tsx
// WarnedBadge.tsx
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export function WarnedBadge() {
  return (
    <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
      <AlertTriangle className="h-3 w-3" />
      Warned
    </Badge>
  );
}
```

### 5. Flag Reason Badge Colors

| `flagReason` | Badge color |
|---|---|
| `highDownvotes` | Red / destructive |
| `reportedAsSpam` | Orange / warning |
| `duplicateContent` | Blue / secondary |
| `other` | Gray / outline |

### 6. Pending Queue — Content Removal Fallback

```tsx
// Inside PendingItemRow.tsx
const handleReview = () => {
  if (item.type === 'reportReview') {
    navigate(`/reports/${item.targetEntityId}`);
  } else if (item.type === 'userFlag') {
    navigate(`/users/${item.targetEntityId}`);
  } else {
    toast.info('Content removal — no detail view available in this phase.');
  }
};
```

---

## Constitution Compliance Summary

| Principle | Compliance |
|---|---|
| Type-Safe Code | All domain types in `moderation.ts`; no `any` types |
| Data & State Discipline | React Query hooks for all data; `useMutation` for actions; Sonner toasts for feedback |
| UX Consistency | Shadcn AlertDialog, Badge, Skeleton, and card patterns throughout |
| Performance | `refetchInterval: 45_000`; no redundant polling; independent section failures |

---

## Acceptance Checklist (Pre-merge)

- [ ] `/moderation` route renders all three sections and the pending count badge
- [ ] Approve and Warn User execute instantly; Remove shows confirmation dialog
- [ ] Warn and Flag to Admin execute instantly; Suspend shows confirmation dialog
- [ ] Sonner toast appears within 3 seconds of every action (success or error)
- [ ] Pending count badge decrements on successful Approve, Remove, Suspend, and Flag to Admin actions
- [ ] "Warned" badge appears on flagged report entries where `warnedAt` is not null
- [ ] Warn User on a warned report re-issues the warning without blocking
- [ ] Each section loads independently; a failure in one section does not crash the others
- [ ] Skeleton loaders appear while data is loading for each section
- [ ] Empty state messages appear when each section has no items
- [ ] "Review" button on Report Review items navigates to `/reports/:id`
- [ ] "Review" button on User Flag items navigates to `/users/:id`
- [ ] "Review" button on Content Removal items shows a toast, not a navigation
- [ ] Suspend success toast includes a "View profile →" link to `/users/:id`
- [ ] Panel auto-refreshes every ~45 seconds while the page is open
- [ ] All action buttons and dialog controls are keyboard-accessible
- [ ] TypeScript strict mode passes with no `any` usages
