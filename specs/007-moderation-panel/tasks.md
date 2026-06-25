# Tasks: Moderation Panel

**Input**: Design documents from `/specs/007-moderation-panel/`  
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/api-contracts.md ✅ quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and verification.  
**Implementer note**: Every task includes the exact file path, exact type/hook/component names, and precise instructions so no additional context is needed.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependency on a prior incomplete task)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create all file stubs and register the route so the project compiles from the very first task.

- [X] T001 Create the directory `src/components/moderation/` (it does not exist yet)
- [X] T002 Create the empty barrel file `src/components/moderation/index.ts` with the comment `// moderation component exports — populated in later tasks`
- [X] T003 Create `src/types/moderation.ts` as an empty file with the comment `// moderation domain types — populated in T004`
- [X] T004 In `src/types/moderation.ts`, define and export ALL of the following types exactly as specified — do not skip any:

  ```typescript
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
    warnedAt: string | null;   // ISO 8601; non-null = Warn User already applied
    flaggedAt: string;          // ISO 8601
  }

  export interface SuspiciousUser {
    id: string;
    displayName: string;
    trustScore: number;
    reportCount: number;
    warningCount: number;
    activitySummary: string;
    flaggedAt: string;          // ISO 8601
  }

  export interface PendingModerationItem {
    id: string;
    type: PendingItemType;
    priority: PendingItemPriority;
    description: string;
    targetEntityId: string;
    submittedAt: string;        // ISO 8601
  }

  export interface ModerationSummary {
    totalPendingCount: number;
  }

  // Mutation payload — discriminated union
  export interface ApproveReportPayload   { targetType: 'report'; targetId: string; action: 'approve'; }
  export interface RemoveReportPayload    { targetType: 'report'; targetId: string; action: 'remove'; }
  export interface WarnUserOnReportPayload{ targetType: 'report'; targetId: string; action: 'warnUser'; }
  export interface WarnUserPayload        { targetType: 'user';   targetId: string; action: 'warn'; }
  export interface SuspendUserPayload     { targetType: 'user';   targetId: string; action: 'suspend'; }
  export interface FlagToAdminPayload     { targetType: 'user';   targetId: string; action: 'flagToAdmin'; }

  export type ModerationActionPayload =
    | ApproveReportPayload
    | RemoveReportPayload
    | WarnUserOnReportPayload
    | WarnUserPayload
    | SuspendUserPayload
    | FlagToAdminPayload;

  // Display helpers
  export const FLAG_REASON_LABELS: Record<FlagReason, string> = {
    highDownvotes:    'High downvotes',
    reportedAsSpam:   'Reported as spam',
    duplicateContent: 'Duplicate content',
    other:            'Flagged',
  };

  export const PRIORITY_LABELS: Record<PendingItemPriority, string> = {
    high:   'High',
    medium: 'Medium',
    low:    'Low',
  };
  ```

- [X] T005 In `src/types/index.ts`, add a re-export block at the bottom of the file for all moderation types:

  ```typescript
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
    RemoveReportPayload,
    WarnUserOnReportPayload,
    WarnUserPayload,
    SuspendUserPayload,
    FlagToAdminPayload,
  } from './moderation';

  export { FLAG_REASON_LABELS, PRIORITY_LABELS } from './moderation';
  ```

- [X] T006 Create `src/lib/moderation-fixtures.ts` with typed fixture data for all four data types. Use the exact shapes from `src/types/moderation.ts`. Include at minimum: 3 flagged reports (one with `warnedAt` set to a non-null ISO timestamp, two with `warnedAt: null`); 3 suspicious users with varied trust scores (32, 45, 58); 3 pending moderation items (one of each type: `reportReview`, `userFlag`, `contentRemoval`). Export named constants:

  ```typescript
  import type { FlaggedReport, SuspiciousUser, PendingModerationItem, ModerationSummary } from '@/types/moderation';

  export const FLAGGED_REPORTS_FIXTURES: FlaggedReport[] = [ /* 3 entries */ ];
  export const SUSPICIOUS_USERS_FIXTURES: SuspiciousUser[] = [ /* 3 entries */ ];
  export const PENDING_ITEMS_FIXTURES: PendingModerationItem[] = [ /* 3 entries */ ];
  export const MODERATION_SUMMARY_FIXTURE: ModerationSummary = { totalPendingCount: 9 };
  ```

- [X] T007 Create the page stub `src/pages/ModerationPanel.tsx` that renders a single `<div>Moderation Panel</div>` and exports `ModerationPanel` as a named export. This is a temporary placeholder to make the route compile.

- [X] T008 In `src/pages/index.ts`, add `export { ModerationPanel } from './ModerationPanel';`

- [X] T009 In `src/App.tsx`, replace the line `<Route path="/moderation" element={<h1>Moderation</h1>} />` with `<Route path="/moderation" element={<ModerationPanel />} />` and add `ModerationPanel` to the existing named import from `'./pages'`.

  **Verification**: Run `npm run dev`. Navigate to `/moderation`. The page renders "Moderation Panel" without TypeScript or console errors.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: All four React Query hooks and the mutation hook. These must exist before any section component can be built.

**CRITICAL**: No component work in US1–US4 can begin until T010–T014 are complete.

- [X] T010 [P] Create `src/hooks/useGetFlaggedReports.ts`. The hook must:
  - Import `api` from `@/lib/axios` and `FLAGGED_REPORTS_FIXTURES` from `@/lib/moderation-fixtures`
  - Import `FlaggedReport` from `@/types/moderation`
  - Export a constant `FLAGGED_REPORTS_QUERY_KEY = ['moderation', 'flaggedReports'] as const`
  - Export `useGetFlaggedReports()` using `useQuery` from `@tanstack/react-query`
  - `queryKey`: `FLAGGED_REPORTS_QUERY_KEY`
  - `queryFn`: call `GET /admin/moderation/flagged-reports`, extract `.data.data` as `FlaggedReport[]`; on any error, `console.warn` and return `FLAGGED_REPORTS_FIXTURES`
  - `refetchInterval: 45_000`
  - `refetchIntervalInBackground: false`
  - `staleTime: 30_000`
  - Return type of the query data is `FlaggedReport[]`

- [X] T011 [P] Create `src/hooks/useGetSuspiciousUsers.ts`. The hook must:
  - Import `api` from `@/lib/axios` and `SUSPICIOUS_USERS_FIXTURES` from `@/lib/moderation-fixtures`
  - Import `SuspiciousUser` from `@/types/moderation`
  - Export a constant `SUSPICIOUS_USERS_QUERY_KEY = ['moderation', 'suspiciousUsers'] as const`
  - Export `useGetSuspiciousUsers()` using `useQuery`
  - `queryKey`: `SUSPICIOUS_USERS_QUERY_KEY`
  - `queryFn`: call `GET /admin/moderation/suspicious-users`, extract `.data.data` as `SuspiciousUser[]`; on error, return `SUSPICIOUS_USERS_FIXTURES`
  - `refetchInterval: 45_000`, `refetchIntervalInBackground: false`, `staleTime: 30_000`

- [X] T012 [P] Create `src/hooks/useGetPendingModerationItems.ts`. The hook must:
  - Import `api` from `@/lib/axios` and `PENDING_ITEMS_FIXTURES` from `@/lib/moderation-fixtures`
  - Import `PendingModerationItem` from `@/types/moderation`
  - Export a constant `PENDING_ITEMS_QUERY_KEY = ['moderation', 'pendingItems'] as const`
  - Export `useGetPendingModerationItems()` using `useQuery`
  - `queryKey`: `PENDING_ITEMS_QUERY_KEY`
  - `queryFn`: call `GET /admin/moderation/pending-items`, extract `.data.data` as `PendingModerationItem[]`; on error, return `PENDING_ITEMS_FIXTURES`
  - `refetchInterval: 45_000`, `refetchIntervalInBackground: false`, `staleTime: 30_000`

- [X] T013 [P] Create `src/hooks/useGetModerationSummary.ts`. The hook must:
  - Import `api` from `@/lib/axios` and `MODERATION_SUMMARY_FIXTURE` from `@/lib/moderation-fixtures`
  - Import `ModerationSummary` from `@/types/moderation`
  - Export a constant `MODERATION_SUMMARY_QUERY_KEY = ['moderation', 'summary'] as const`
  - Export `useGetModerationSummary()` using `useQuery`
  - `queryKey`: `MODERATION_SUMMARY_QUERY_KEY`
  - `queryFn`: call `GET /admin/moderation/summary`, return the response as `ModerationSummary`; on error, return `MODERATION_SUMMARY_FIXTURE`
  - `refetchInterval: 45_000`, `refetchIntervalInBackground: false`, `staleTime: 30_000`

- [X] T014 Create `src/hooks/useModerationAction.ts`. The hook must:
  - Import `api` from `@/lib/axios`
  - Import `useQueryClient`, `useMutation` from `@tanstack/react-query`
  - Import `toast` from `sonner`
  - Import `ModerationActionPayload` from `@/types/moderation`
  - Import `FLAGGED_REPORTS_QUERY_KEY` from `./useGetFlaggedReports`
  - Import `SUSPICIOUS_USERS_QUERY_KEY` from `./useGetSuspiciousUsers`
  - Import `MODERATION_SUMMARY_QUERY_KEY` from `./useGetModerationSummary`
  - Export `useModerationAction()` using `useMutation`:
    - `mutationFn`: receives `ModerationActionPayload`; if `payload.targetType === 'report'`, calls `POST /admin/moderation/reports/${payload.targetId}/actions` with body `{ action: payload.action }`; otherwise calls `POST /admin/moderation/users/${payload.targetId}/actions` with body `{ action: payload.action }`
    - `onSuccess`: invalidate the correct section query key (report → `FLAGGED_REPORTS_QUERY_KEY`, user → `SUSPICIOUS_USERS_QUERY_KEY`) AND always invalidate `MODERATION_SUMMARY_QUERY_KEY`; for `suspend` action: show `toast.success('User suspended.', { action: { label: 'View profile →', onClick: () => navigate(\`/users/${payload.targetId}\`) } })` (use `useNavigate` from `react-router`); for all other actions: show `toast.success('Action applied successfully.')`
    - `onError`: show `toast.error('Action failed. Please try again.')`

  **Note**: To use `useNavigate` inside a mutation callback, call `const navigate = useNavigate()` at the top of the hook (inside the hook function body, not inside the callback).

  **Verification**: TypeScript `tsc --noEmit` passes with no errors on all five new hook files.

---

## Phase 3: User Story 1 — Review Flagged Reports (Priority: P1) MVP

**Goal**: The Flagged Reports section renders all pending flagged reports. Admins can Approve (instant) or Warn User (instant), both with immediate success/error toast. Remove opens a confirmation dialog before executing. Each flagged report shows a "Warned" badge when `warnedAt` is not null.

**Independent Verification**: Navigate to `/moderation`. The left section shows flagged report cards loaded from fixtures. Clicking "Approve" or "Warn User" shows a success toast immediately. Clicking "Remove" opens a dialog; confirming shows a success toast; cancelling closes the dialog without any change. The "Warned" badge appears on the fixture entry that has a non-null `warnedAt`. Section shows a skeleton while loading and an empty state message when the list is empty.

### Implementation for User Story 1

- [X] T015 [P] [US1] Create `src/components/moderation/FlagReasonBadge.tsx`. Props: `reason: FlagReason`. Render a Shadcn `<Badge>` with text from `FLAG_REASON_LABELS[reason]`. Use these Tailwind variant classes based on `reason`:
  - `highDownvotes` → `variant="destructive"`
  - `reportedAsSpam` → `variant="outline"` + `className="border-orange-500 text-orange-600"`
  - `duplicateContent` → `variant="secondary"`
  - `other` → `variant="outline"`

  Export `FlagReasonBadge` as a named export.

- [X] T016 [P] [US1] Create `src/components/moderation/WarnedBadge.tsx`. Renders a fixed badge with amber styling. No props. Use Shadcn `<Badge variant="outline">` with `className="border-amber-500 text-amber-600 gap-1"`. Include `<AlertTriangle className="h-3 w-3" />` from `lucide-react` before the text "Warned". Export `WarnedBadge` as a named export.

- [X] T017 [P] [US1] Create `src/components/moderation/ModerationConfirmDialog.tsx`. Props interface:

  ```typescript
  interface ModerationConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
  }
  ```

  Use Shadcn `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction` components. The "Confirm" button must have `className="bg-destructive text-destructive-foreground hover:bg-destructive/90"` and show "Processing…" when `isPending` is true. Both buttons must be `disabled` when `isPending` is true. Call `onCancel()` in `onOpenChange` when the dialog would close. Export `ModerationConfirmDialog` as a named export.

- [X] T018 [US1] Create `src/components/moderation/FlaggedReportCard.tsx`. Props interface:

  ```typescript
  interface FlaggedReportCardProps {
    report: FlaggedReport;
    onAction: (payload: ModerationActionPayload) => void;
    isPending: boolean;
  }
  ```

  Layout (use Tailwind, no custom CSS):
  - Card container: `rounded-lg border bg-card p-4 space-y-3`
  - Top row: Report title (bold, text-sm), location (text-muted-foreground text-xs), downvote count shown as `👎 {downvoteCount} downvotes` (text-xs)
  - Second row: `<FlagReasonBadge reason={report.flagReason} />` and — if `report.warnedAt !== null` — `<WarnedBadge />`
  - Third row: Submitting user's `displayName` (text-xs text-muted-foreground), prefixed with "by "
  - Action row: Three `<Button>` components side by side with `size="sm"`:
    - "Approve" → `variant="default"` (green-ish; add `className="bg-green-600 hover:bg-green-700 text-white"`). On click: calls `onAction({ targetType: 'report', targetId: report.id, action: 'approve' })` immediately.
    - "Remove" → `variant="destructive"`. On click: opens the `ModerationConfirmDialog` (manage `open` state locally with `useState`). On confirm: calls `onAction({ targetType: 'report', targetId: report.id, action: 'remove' })`.
    - "Warn User" → `variant="outline"`. On click: calls `onAction({ targetType: 'report', targetId: report.id, action: 'warnUser' })` immediately.
  - All three buttons must be `disabled` when `isPending` is true.
  - The `ModerationConfirmDialog` title: `"Remove Report"`. Description: `"This will permanently remove \"${report.reportTitle}\" from the platform. This action cannot be undone."`.

  Import `FlaggedReport`, `ModerationActionPayload` from `@/types/moderation`. Export `FlaggedReportCard` as a named export.

- [X] T019 [US1] Create `src/components/moderation/FlaggedReportsSection.tsx`. This is the section wrapper. It:
  - Calls `useGetFlaggedReports()` to get `{ data, isLoading, isError, refetch }`
  - Calls `useModerationAction()` to get `{ mutate: handleAction, isPending }`
  - Section header: text "Flagged Reports" (font-semibold) + a Shadcn `<Badge variant="destructive">` showing `{data?.length ?? 0} flagged` aligned to the right — wrap header in a `flex items-center justify-between` div
  - **Loading state**: When `isLoading`, render 3 `<Skeleton>` cards (each `h-32 rounded-lg`)
  - **Error state**: When `isError`, render an error message "Failed to load flagged reports." with a `<Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>`
  - **Empty state**: When `!isLoading && !isError && data?.length === 0`, render a centered message: "No flagged reports — all clear." with a checkmark icon
  - **Data state**: Render `data.map(report => <FlaggedReportCard key={report.id} report={report} onAction={handleAction} isPending={isPending} />)` in a `space-y-3` div

  Export `FlaggedReportsSection` as a named export.

- [X] T020 [US1] Update `src/components/moderation/index.ts` to export `FlaggedReportCard`, `FlaggedReportsBadge` (skip — not a component), `FlaggedReportsSection`, `FlagReasonBadge`, `WarnedBadge`, `ModerationConfirmDialog`.

- [X] T021 [US1] Replace the body of `src/pages/ModerationPanel.tsx` to render the real page layout. For now, only wire up the Flagged Reports section:

  ```tsx
  import { FlaggedReportsSection } from '@/components/moderation';

  export function ModerationPanel() {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Moderation Panel</h1>
          <p className="text-muted-foreground text-sm">Review and moderate flagged content and users</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlaggedReportsSection />
          {/* Suspicious Users section added in US2 */}
        </div>
        {/* Pending Queue added in US3 */}
      </div>
    );
  }
  ```

- [X] T022 [US1] Verify User Story 1 manually:
  - Navigate to `/moderation` — page loads, Flagged Reports section shows 3 fixture cards
  - The card with `warnedAt` set shows the amber "Warned" badge; the others do not
  - Clicking "Approve" on any card shows a "Action applied successfully." Sonner toast
  - Clicking "Warn User" on any card shows a "Action applied successfully." Sonner toast
  - Clicking "Remove" opens the `ModerationConfirmDialog`; clicking "Cancel" closes it; clicking "Confirm" shows a success toast
  - Run `npm run build` — no TypeScript errors

**Checkpoint**: User Story 1 is fully functional and independently verifiable ✅

---

## Phase 4: User Story 2 — Manage Suspicious Users (Priority: P1)

**Goal**: The Suspicious Users section renders all suspicious user entries. Admins can Warn (instant) or Flag to Admin (instant) with success toasts. Suspend opens a confirmation dialog. All entries show name, Trust Score, report count, warning count, and activity summary.

**Independent Verification**: The right column of the `/moderation` page shows suspicious user cards. "Warn" and "Flag to Admin" trigger instant success toasts. "Suspend" opens a confirmation dialog; confirming shows a success toast with a "View profile →" link. Empty and error states render correctly.

### Implementation for User Story 2

- [X] T023 [P] [US2] Create `src/components/moderation/SuspiciousUserCard.tsx`. Props interface:

  ```typescript
  interface SuspiciousUserCardProps {
    user: SuspiciousUser;
    onAction: (payload: ModerationActionPayload) => void;
    isPending: boolean;
  }
  ```

  Layout:
  - Card container: `rounded-lg border bg-card p-4 space-y-3`
  - Top row: User avatar placeholder (circle with first letter of `displayName`, `bg-muted rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium`), display name (font-medium text-sm), Trust Score shown as `Trust Score: {user.trustScore}` (text-xs text-muted-foreground)
  - Second row: `{user.reportCount} reports · {user.warningCount} warnings` (text-xs text-muted-foreground)
  - Third row: Activity summary (text-xs text-muted-foreground italic)
  - Action row: Three `<Button size="sm">` side by side:
    - "Warn" → `variant="outline"` with `className="border-orange-500 text-orange-600 hover:bg-orange-50"`. On click: calls `onAction({ targetType: 'user', targetId: user.id, action: 'warn' })` immediately.
    - "Suspend" → `variant="destructive"`. On click: opens `ModerationConfirmDialog` (local `useState`). On confirm: calls `onAction({ targetType: 'user', targetId: user.id, action: 'suspend' })`.
    - "Flag to Admin" → `variant="secondary"` with `className="bg-slate-700 text-white hover:bg-slate-800"`. On click: calls `onAction({ targetType: 'user', targetId: user.id, action: 'flagToAdmin' })` immediately.
  - All buttons `disabled` when `isPending`.
  - `ModerationConfirmDialog` title: `"Suspend User"`. Description: `"This will deactivate ${user.displayName}'s account. To reinstate the account, visit the User Details page."`.

  Import `SuspiciousUser`, `ModerationActionPayload` from `@/types/moderation`. Export `SuspiciousUserCard` as a named export.

- [X] T024 [US2] Create `src/components/moderation/SuspiciousUsersSection.tsx`. Mirror the structure of `FlaggedReportsSection.tsx`:
  - Calls `useGetSuspiciousUsers()` and `useModerationAction()`
  - Section header: text "Suspicious Users" + a `<Badge variant="destructive">` showing `{data?.length ?? 0} flagged`
  - **Loading**: 3 `<Skeleton className="h-32 rounded-lg" />`
  - **Error**: "Failed to load suspicious users." + Retry button that calls `refetch()`
  - **Empty**: "No suspicious users — all clear." with checkmark icon
  - **Data**: `data.map(user => <SuspiciousUserCard key={user.id} user={user} onAction={handleAction} isPending={isPending} />)` in a `space-y-3` div

  Export `SuspiciousUsersSection` as a named export.

- [X] T025 [US2] Update `src/components/moderation/index.ts` to also export `SuspiciousUserCard` and `SuspiciousUsersSection`.

- [X] T026 [US2] Update `src/pages/ModerationPanel.tsx` to import and render `<SuspiciousUsersSection />` in the right column of the `lg:grid-cols-2` grid, replacing the `{/* Suspicious Users section added in US2 */}` comment.

- [X] T027 [US2] Verify User Story 2 manually:
  - Right column shows 3 suspicious user cards with name, Trust Score, counts, and activity summary
  - "Warn" and "Flag to Admin" show instant success toasts
  - "Suspend" opens the confirmation dialog; "Confirm" shows a Sonner success toast that contains a "View profile →" action button
  - Both left (Flagged Reports) and right (Suspicious Users) sections are visible simultaneously
  - Run `npm run build` — no TypeScript errors

**Checkpoint**: User Stories 1 AND 2 are fully functional ✅

---

## Phase 5: User Story 3 — Pending Moderation Actions Queue (Priority: P2)

**Goal**: A full-width Pending Moderation Actions queue below the two-column section. Each item shows a priority badge, description, elapsed time, and a "Review" button. Report review items navigate to `/reports/:id`. User flag items navigate to `/users/:id`. Content removal items show a toast.

**Independent Verification**: Below the two-column grid, a "Pending Moderation Actions" section appears. Fixture items render with High/Medium/Low priority badges in the correct colors. "Review" on a `reportReview` item navigates to `/reports/{targetEntityId}`. "Review" on a `userFlag` item navigates to `/users/{targetEntityId}`. "Review" on a `contentRemoval` item shows a Sonner info toast. Empty and error states render correctly.

### Implementation for User Story 3

- [X] T028 [P] [US3] Create `src/components/moderation/PendingItemRow.tsx`. Props interface:

  ```typescript
  interface PendingItemRowProps {
    item: PendingModerationItem;
  }
  ```

  Use `useNavigate` from `react-router` (call it inside the component). The priority badge colors:
  - `high` → `<Badge variant="destructive">High</Badge>`
  - `medium` → `<Badge variant="secondary">Medium</Badge>`
  - `low` → `<Badge variant="outline">Low</Badge>`

  Layout (single horizontal row, `flex items-center gap-3`):
  - Priority badge (left)
  - Description text: `text-sm font-medium` (flex-1 to take remaining space)
  - Elapsed time: compute as a human-readable string from `item.submittedAt` to now — show "X hours ago" or "X minutes ago" (use simple date math, no external library). Style: `text-xs text-muted-foreground whitespace-nowrap`
  - "Review" button: `<Button size="sm" variant="outline">Review</Button>`. `onClick` handler:
    - `reportReview` → `navigate(\`/reports/${item.targetEntityId}\`)`
    - `userFlag` → `navigate(\`/users/${item.targetEntityId}\`)`
    - `contentRemoval` → `toast.info('Content removal — no detail view available in this phase.')`

  Wrap the whole row in a container div: `flex items-center gap-3 rounded-md border p-3`. Export `PendingItemRow` as a named export.

- [X] T029 [US3] Create `src/components/moderation/PendingModerationQueue.tsx`:
  - Calls `useGetPendingModerationItems()` to get `{ data, isLoading, isError, refetch }`
  - Section header row (`flex items-center justify-between`): "Pending Moderation Actions" (font-semibold)
  - **Loading**: 3 `<Skeleton className="h-12 rounded-md" />`
  - **Error**: "Failed to load pending items." + Retry button
  - **Empty**: "No pending items — queue is clear."
  - **Data**: `data.map(item => <PendingItemRow key={item.id} item={item} />)` in a `space-y-2` div

  Export `PendingModerationQueue` as a named export.

- [X] T030 [US3] Update `src/components/moderation/index.ts` to also export `PendingItemRow` and `PendingModerationQueue`.

- [X] T031 [US3] Update `src/pages/ModerationPanel.tsx` to import and render `<PendingModerationQueue />` below the `lg:grid-cols-2` grid, replacing the `{/* Pending Queue added in US3 */}` comment. Wrap it in a section container: `<div className="bg-card rounded-lg border p-4"><PendingModerationQueue /></div>`.

- [X] T032 [US3] Verify User Story 3 manually:
  - The pending queue section appears below the two columns
  - Each item shows the correct colored priority badge, description, elapsed time, and "Review" button
  - Clicking "Review" on the `reportReview` fixture item navigates to `/reports/{targetEntityId}`
  - Clicking "Review" on the `userFlag` fixture item navigates to `/users/{targetEntityId}`
  - Clicking "Review" on the `contentRemoval` fixture item shows a Sonner info toast (no navigation)

**Checkpoint**: User Stories 1, 2, AND 3 are all functional ✅

---

## Phase 6: User Story 4 — Moderation Summary Badge (Priority: P2)

**Goal**: A "N items pending" badge in the Moderation Panel page header. The count decrements immediately after any successful Approve, Remove, Suspend, or Flag to Admin action (via query invalidation).

**Independent Verification**: The header shows "6 items pending" (from the fixture `totalPendingCount: 9`, but it will show 9 from the fixture). After taking any action, `useGetModerationSummary` is invalidated and the badge re-fetches. When `totalPendingCount` is 0, the badge shows "0 items pending" or an all-clear indicator.

### Implementation for User Story 4

- [X] T033 [P] [US4] Create `src/components/moderation/ModerationPageHeader.tsx`. Props interface:

  ```typescript
  interface ModerationPageHeaderProps {
    pendingCount: number | undefined;
    isLoading: boolean;
  }
  ```

  Layout: `flex items-start justify-between` wrapper.
  - Left side: `<h1 className="text-2xl font-bold">Moderation Panel</h1>` and `<p className="text-muted-foreground text-sm mt-1">Review and moderate flagged content and users</p>`
  - Right side: pending count badge area:
    - If `isLoading`: render `<Skeleton className="h-8 w-32 rounded-full" />`
    - If `pendingCount === 0`: render `<Badge variant="outline" className="text-green-600 border-green-500 gap-1"><CheckCircle className="h-3 w-3" /> All clear</Badge>` (import `CheckCircle` from `lucide-react`)
    - Otherwise: render `<Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" /> {pendingCount} items pending</Badge>` (import `AlertCircle` from `lucide-react`)

  Export `ModerationPageHeader` as a named export.

- [X] T034 [US4] Update `src/components/moderation/index.ts` to also export `ModerationPageHeader`.

- [X] T035 [US4] Update `src/pages/ModerationPanel.tsx`:
  - Import `useGetModerationSummary` from `@/hooks/useGetModerationSummary`
  - Import `ModerationPageHeader` from `@/components/moderation`
  - Inside the component, call `const { data: summary, isLoading: summaryLoading } = useGetModerationSummary();`
  - Replace the existing hardcoded header (`<h1>` + `<p>`) with `<ModerationPageHeader pendingCount={summary?.totalPendingCount} isLoading={summaryLoading} />`

- [X] T036 [US4] Verify User Story 4 manually:
  - The header shows "9 items pending" (from `MODERATION_SUMMARY_FIXTURE.totalPendingCount = 9`)
  - After taking any action, the badge re-fetches (you can verify by temporarily setting the fixture count to 0 and reloading — the badge shows "All clear" with a green checkmark)
  - Run `npm run build` — no TypeScript errors

**Checkpoint**: All 4 User Stories are fully functional ✅

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, accessibility, responsive layout, and lint verification across all sections.

- [X] T037 [P] Accessibility audit — verify all interactive elements in `ModerationConfirmDialog`, `FlaggedReportCard`, and `SuspiciousUserCard`:
  - All `<Button>` elements have accessible names (text content is descriptive enough; if icon-only, add `aria-label`)
  - The `AlertDialog` moves focus to the dialog when it opens
  - All buttons remain focusable with the keyboard and have visible focus rings (Shadcn provides this by default; confirm it is not overridden)
  - Confirm that all 6 action buttons can be triggered by pressing Enter/Space while focused

- [X] T038 [P] Responsive layout verification:
  - At 1024px (lg breakpoint): two columns side by side, pending queue below — verify no overlapping content
  - At 768px (below lg): both sections stack vertically, pending queue stacks below — verify content is readable
  - At 1280px+: columns are not excessively wide; content is scannable

- [X] T039 [P] Verify all loading, empty, and error states:
  - Temporarily set the fixture to return an empty array for Flagged Reports → empty state message appears
  - Temporarily throw an error in `useGetFlaggedReports` → error state with Retry button appears; other sections unaffected
  - Confirm skeleton cards render during the simulated loading delay (set `staleTime: 0` temporarily to force re-fetch on every mount)

- [X] T040 [P] Verify the "Warned" badge lifecycle:
  - The fixture must include at least one `FlaggedReport` with `warnedAt` set to a non-null ISO string — confirm the "Warned" badge renders on that card only
  - Confirm the card without `warnedAt` does NOT show the badge

- [X] T041 [P] Verify the background polling does NOT run in a hidden tab:
  - Open DevTools → Network tab
  - Switch to another browser tab for 1–2 minutes
  - Switch back — confirm no `/admin/moderation/` requests fired while the tab was hidden (because `refetchIntervalInBackground: false`)

- [X] T042 TypeScript and lint pass:
  - Run `npx tsc --noEmit` — zero errors
  - Run `npm run lint` — zero errors or warnings related to moderation files
  - Confirm no `any` types in any moderation file

- [X] T043 Run the full quickstart acceptance checklist from `specs/007-moderation-panel/quickstart.md` line by line. Mark each checkbox in the quickstart file as verified or note any failures.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)         → no dependencies — start immediately
Phase 2 (Foundational)  → depends on Phase 1 complete — BLOCKS all user story phases
Phase 3 (US1)           → depends on Phase 2 complete
Phase 4 (US2)           → depends on Phase 2 complete (US1 not required, but renders alongside it)
Phase 5 (US3)           → depends on Phase 2 complete
Phase 6 (US4)           → depends on Phase 2 complete
Phase 7 (Polish)        → depends on Phases 3–6 complete
```

### Within Each Phase — Dependency Order

```
Phase 2: T010, T011, T012, T013 can run in parallel → T014 depends on all four
Phase 3: T015, T016, T017 parallel → T018 (needs T015, T016, T017) → T019 (needs T018) → T020 → T021 → T022
Phase 4: T023 → T024 (needs T023) → T025 → T026 → T027
Phase 5: T028 → T029 (needs T028) → T030 → T031 → T032
Phase 6: T033 → T034 → T035 (needs T033) → T036
Phase 7: T037, T038, T039, T040, T041 parallel → T042 → T043
```

### Parallel Opportunities

- T010, T011, T012, T013 — four hooks, four separate files, no shared dependencies
- T015, T016, T017 — three leaf components, no inter-dependencies
- T037, T038, T039, T040, T041 — independent verification tasks

---

## Implementation Strategy

### MVP First (User Story 1 Only — Flagged Reports)

1. Complete Phase 1: Setup (T001–T009)
2. Complete Phase 2 Foundation (T010–T014)
3. Complete Phase 3: US1 (T015–T022)
4. **STOP and VALIDATE**: Flagged Reports section works end-to-end
5. Continue to US2, US3, US4 incrementally

### Full Delivery Order

1. Phase 1 → Phase 2 → Phase 3 (US1 MVP) → validate
2. Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → validate all stories
3. Phase 7 (Polish) → final lint + acceptance checklist

---

## Notes

- `[P]` tasks touch different files — safe to run in parallel with no merge conflicts
- All fixture data must exactly match the TypeScript interfaces in `src/types/moderation.ts` — mismatches will cause TypeScript errors
- Never use `any` — if a type is unknown, check `src/types/moderation.ts` first
- The `useModerationAction` hook uses `useNavigate` from `react-router` — it must be called inside the hook function body, not inside a callback
- Shadcn components used: `Badge`, `Button`, `Skeleton`, `AlertDialog` family — if any are missing from the project, install them with `npx shadcn@latest add <component>`
- On fixture fallback: the API call is wrapped in `try/catch`; the fixture is returned on any error; this keeps the UI functional without a backend connection
- Commit after each checkpoint for clean rollback if needed
