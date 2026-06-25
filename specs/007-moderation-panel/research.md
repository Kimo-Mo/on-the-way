# Research: Moderation Panel

**Feature**: `007-moderation-panel`  
**Date**: 2026-06-24  
**Status**: Complete — all unknowns resolved

---

## Decision 1: Panel Layout Strategy

- **Decision**: Use a single `/moderation` route with three independently-rendered sections side by side (desktop) or stacked (narrower widths): Flagged Reports (left column), Suspicious Users (right column), and Pending Moderation Actions (full-width row below). A header badge shows the total pending count.
- **Rationale**: The screenshot reference and spec both depict a two-column top + full-width bottom layout. This matches the admin-dashboard style optimized for scanning and parallel review, which is exactly the moderation triage workflow.
- **Alternatives considered**: Tabbed layout (Flagged / Users / Queue) — rejected because admins need to see all three sections at once to assess urgency. Separate routes — rejected because splitting the panel adds navigation overhead for time-critical triage.

---

## Decision 2: React Query Hook Architecture

- **Decision**: Implement three independent React Query hooks: `useGetFlaggedReports()`, `useGetSuspiciousUsers()`, and `useGetPendingModerationItems()`. Each uses its own query key so errors and loading states are isolated. A fourth `useGetModerationSummary()` hook provides the pending count badge and can share/derive data from the three section queries. All four use `refetchInterval: 45_000` for background polling.
- **Rationale**: Independent hooks mean a backend error in one section does not crash the other two (FR-017, SC-009). The 45-second polling interval is the midpoint of the 30–60 second clarification answer and avoids both stale data and excessive backend load. This follows the established pattern from `useProviders` and `useReports`.
- **Alternatives considered**: Single `useModerationPanel()` hook returning all data — rejected because a single hook failure would crash all three sections. Real-time WebSocket — explicitly rejected in clarification (Decision Q2).

---

## Decision 3: Mutation Pattern for Quick Actions

- **Decision**: Implement `useModerationAction()` — a single shared mutation hook that accepts a discriminated union payload (report actions: approve / remove / warnUser; user actions: warn / suspend / flagToAdmin). On success: invalidate the relevant section query key and the summary query key. On error: show a Sonner toast error; do not change local state. Approve, Warn User, Warn, and Flag to Admin execute immediately on click. Remove and Suspend open a lightweight confirmation dialog (single "Confirm" / "Cancel") before the mutation is called.
- **Rationale**: A single mutation hook with typed payloads is consistent with `useUpdateProviderStatus` and reduces boilerplate. The confirmation dialog for Remove and Suspend directly implements the clarification outcome (Q1). Sonner toasts are already present in the project for success/error feedback.
- **Alternatives considered**: Separate mutation hooks per action — more hooks than needed for 6 closely-related actions. Optimistic UI — rejected because moderation decisions are safety-critical; server confirmation must be the source of truth.

---

## Decision 4: Background Polling Interval

- **Decision**: Set `refetchInterval: 45_000` (45 seconds) on all moderation section queries while the page is mounted. Use `refetchIntervalInBackground: false` so polling pauses when the browser tab is hidden.
- **Rationale**: 45 seconds is the clarification-specified midpoint of the 30–60 second range. Disabling background-tab polling avoids unnecessary API calls when the admin is not actively looking at the panel, consistent with React Query best practices.
- **Alternatives considered**: 30 seconds — more frequent than needed. 60 seconds — acceptable but 45 s provides a better balance. Polling while hidden — wastes backend resources.

---

## Decision 5: Confirmation Dialog for Destructive Actions

- **Decision**: Use a Shadcn `AlertDialog` (from Radix) as a lightweight single-step confirmation. It shows the action name and affected entity (report title or user name) with "Confirm" and "Cancel". No form fields or reason selectors are needed — this is a pure confirmation gate, not a data-collection dialog.
- **Rationale**: Clarification (Q1) explicitly chose a single confirmation step, not a full form dialog. The AlertDialog pattern is already used in the project for analogous destructive actions. It keeps the experience fast while preventing accidental removes/suspensions.
- **Alternatives considered**: Inline undo toast — higher complexity, requires temporary state management. Full reason-selector dialog — rejected; Q1 specified confirmation only, not reason collection.

---

## Decision 6: "Warn User" Warned Badge

- **Decision**: The `FlaggedReport` API response includes a `warnedAt: string | null` field. The Flagged Reports section renders a "Warned" badge (amber/warning color) on any entry where `warnedAt` is not null. The Warn User button remains enabled on warned reports so a second warning can still be issued if warranted.
- **Rationale**: Clarification (Q3) established that the report stays in queue but is visually marked "Warned". Using a server-provided timestamp (`warnedAt`) is the most reliable way to display this state — it survives page reloads and concurrent admin sessions without client-side state.
- **Alternatives considered**: Client-side optimistic badge — not durable across reloads or multi-admin sessions. Removing the Warn User button on warned reports — rejected by clarification (Q3) which keeps the button available.

---

## Decision 7: "Flag to Admin" Notification Delivery

- **Decision**: The `POST /admin/moderation/users/:id/actions` endpoint with `action: "flagToAdmin"` is responsible for sending the notification server-side. The frontend does not need to make a separate notification API call — the mutation response confirms delivery. If the notification fails server-side, the API returns an error and the frontend shows a Sonner toast error.
- **Rationale**: Clarification (Q4/Q5) established that an active notification is sent to super-admins. Keeping notification delivery server-side avoids the frontend needing to know who the super-admins are or managing notification payloads. This is the standard delegation pattern used elsewhere in the platform.
- **Alternatives considered**: Frontend calls a separate notification endpoint — rejected because it introduces a two-step mutation that can partially fail. Silent escalation — explicitly rejected in clarification (Q5).

---

## Decision 8: Suspension Reinstatement Cross-Link

- **Decision**: After successfully suspending a user from the Moderation Panel, show a Sonner success toast that includes a navigational link: "User suspended. View profile →" linking to `/users/:id`. This gives admins a quick path to the User Details page where reinstatement is managed.
- **Rationale**: Clarification (Q4) established reinstatement happens at `/users/:id`. Providing the link after suspension removes the need for admins to manually navigate to find the user, improving triage flow continuity.
- **Alternatives considered**: No link — valid but adds friction. Navigate automatically — too disruptive; admin may still have more items to review in the moderation panel.

---

## Decision 9: Mock-to-Live API Bridge

- **Decision**: Use typed fixture files (`src/lib/moderation-fixtures.ts`) with realistic moderation data matching the API contract shapes. The Axios fallback pattern from Phase 6 (`try { api.get(...) } catch { return fixtures }`) is reused for all four moderation endpoints. Fixtures must be easy to delete when the live .NET backend is connected.
- **Rationale**: The project pattern established in Phases 4–6 uses typed fixtures to keep UI development independent of backend readiness. All fixture shapes must match the contract types exactly to enable clean cutover.
- **Alternatives considered**: MSW — broader setup than needed for this phase. Hardcoded component data — rejected; it leaks data shape into UI layer.

---

## Decision 10: Pending Queue "Review" Navigation

- **Decision**: The "Review" button navigates using React Router `<Link>` (or `useNavigate`) to the target entity's existing detail route: report items → `/reports/:id`, user flag items → `/users/:id`. Content removal items show a toast "Content removal — no detail view available in this phase" and do not navigate.
- **Rationale**: FR-013 and FR-014 specify navigation to report and user detail views respectively. Content removal is listed as a pending item type in the spec but no detail route exists in this phase, so a graceful fallback is used instead of a broken link.
- **Alternatives considered**: Open a detail panel/drawer within `/moderation` — added scope and complexity; existing detail pages are complete and adequate. Ignore content removal items in the queue — rejected; they should still be visible even if the "Review" action is limited.
