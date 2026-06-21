# Research: Reports & Obstacles Management

**Feature**: `005-reports-obstacles-management`
**Date**: 2026-06-19
**Status**: Complete — all unknowns resolved

---

## Decision 1: URL Search Parameter Strategy for List State

- **Decision**: Use React Router v7's `useSearchParams` hook to read and write list state (`page`, `pageSize`, `search`, `type`, `status`) as URL query parameters — identical to the pattern established in `UsersManagement.tsx`.
- **Rationale**: Native to the already-installed router, zero new dependencies, enables deep-linking, and aligns with the constitution's bundle-impact constraint. The pattern is proven and consistent across the admin dashboard.
- **Alternatives considered**: Zustand global store (adds unnecessary complexity for ephemeral page-level filter state); sessionStorage (not shareable, requires manual sync).

---

## Decision 2: React Query Configuration for Reports List and Detail

- **Decision**: `useReports` uses `useQuery` with key `['reports', params]` and `placeholderData: keepPreviousData`, `staleTime: 30_000`. `useReportDetails` uses `useQuery` with key `['reports', id]`, `staleTime: 60_000`. Mutation hooks (`useApproveReport`, `useMarkUrgent`, `useRemoveReport`, `useFlagUser`) use `useMutation` with `onSuccess` calling `queryClient.invalidateQueries(['reports'])` and `queryClient.invalidateQueries(['reports', id])`.
- **Rationale**: Consistent with the `useUsers` / `useUserDetails` pattern. `keepPreviousData` prevents layout flashes during pagination. Cache invalidation on mutations ensures the list and detail views are always fresh after a moderation action without requiring a manual page reload.
- **Alternatives considered**: Optimistic updates — deferred, adds implementation complexity disproportionate to the benefit for low-frequency admin actions.

---

## Decision 3: Mock-to-Live API Bridge Pattern

- **Decision**: Follow the established fixture fallback pattern: each query function wraps the Axios call in a try/catch; on error, it falls back to a typed local fixture file (`src/lib/reports-fixtures.ts`) and logs a console warning. The fixture schema must match the live API response exactly.
- **Rationale**: The live .NET backend is not yet connected for this feature. This pattern is already in use in `useUsers.ts` and `useDashboardOverview.ts`. Removing the fallback later requires only deleting the catch block — no production leakage.
- **Alternatives considered**: MSW (Mock Service Worker) — heavier global setup; deferred to a future mocking phase per the constitution.

---

## Decision 4: Source Code Structure

- **Decision**: Co-locate all reports-specific code:
  - `src/types/reports.ts` — all domain types
  - `src/hooks/useReports.ts`, `useReportDetails.ts`, and four mutation hooks
  - `src/pages/ReportsManagement.tsx`, `ReportDetails.tsx`
  - `src/components/reports/` — all UI components
- **Rationale**: Mirrors the established pattern from Phase 4 (`src/types/users.ts`, `src/hooks/useUsers.ts`, `src/components/users/`). Keeps related concerns together and satisfies the constitution's "predictable feature locations" requirement.
- **Alternatives considered**: Flat global components — rejected because it causes naming collisions at scale.

---

## Decision 5: Routing for Report Details

- **Decision**: Register `/reports` and `/reports/:id` as nested child routes under the existing `ProtectedRoute` wrapper in `App.tsx`. Use `useParams` in `ReportDetails` to extract the report ID.
- **Rationale**: Consistent with the existing `/users` and `/users/:id` routing pattern. The spec explicitly calls for a dedicated `/reports/:id` details page, not a modal.
- **Alternatives considered**: Modal-based detail view — rejected, spec requires a dedicated route.

---

## Decision 6: Leaflet Map Integration

- **Decision**: Reuse the existing `leaflet` + `react-leaflet` packages (already installed, used in Phase 3 Dashboard). Render a `<MapContainer>` with a `<TileLayer>` and a `<Marker>` pin in a dedicated `ReportMap` component. The map renders only when `gpsCoordinates` are valid (non-null, parseable lat/lng). When coordinates are missing/invalid, render a "Location unavailable" placeholder instead.
- **Rationale**: `leaflet` and `react-leaflet` are already installed (visible in `package.json`). No new runtime dependency is introduced. Conditional rendering prevents a broken map widget, matching the spec's edge case requirement.
- **Alternatives considered**: Google Maps — requires a new API key and SDK dependency; Mapbox — also a new dependency. Both rejected per the constitution's new-dependency justification rule.

---

## Decision 7: Removal Reason — Dialog + React Hook Form + Zod

- **Decision**: The "Remove Report" flow uses a Shadcn `Dialog` containing a `<Select>` form field (React Hook Form + Zod schema). The reason is a mandatory enum: `spam | inaccurate | inappropriate`. Zod validates the selection before enabling the confirm button. On submission the `reason` value is sent as part of the DELETE or PATCH request body.
- **Rationale**: Confirmed in the clarification session (2026-06-19): removal reason is mandatory. React Hook Form + Zod for forms is a constitution requirement. The dropdown aligns with the clarification answer of "mandatory dropdown of common reasons."
- **Alternatives considered**: Free-text input — rejected per clarification; no reason at all — rejected per clarification.

---

## Decision 8: Card-Based List Layout

- **Decision**: The reports list renders report cards (not a table) — each card shows the title, priority/status badge, obstacle type badge, location text, submission date, upvote count, downvote count, and a "View" button. The card grid uses a responsive CSS grid (single column on tablet, two columns on larger screens).
- **Rationale**: The spec describes report cards explicitly in User Story 1. Cards are a better fit than a table for data with mixed content types (text, badges, vote counts, location) and align with the admin dashboard's visual language.
- **Alternatives considered**: Table layout (like users) — rejected because the spec describes card layout and reports have heterogeneous data that reads better as cards.

---

## Decision 9: Moderation Action Feedback (Toast + State Reflection)

- **Decision**: All four moderation actions (Approve, Mark as Urgent, Remove, Flag User) provide feedback via Sonner toast (`toast.success` / `toast.error`). After a successful mutation, React Query cache invalidation causes the detail view to re-fetch and reflect the new state (e.g., the "Approve" button becomes disabled/replaced). This is already wired globally via the Axios response interceptor in `src/lib/axios.ts` for errors; success toasts are triggered in the mutation `onSuccess` callback.
- **Rationale**: Sonner is already installed and used in the global Axios interceptor for errors. Using it consistently for success feedback requires no new dependencies. Cache invalidation ensures the UI state always matches the server state.
- **Alternatives considered**: Optimistic UI updates — deferred; inline status changes without toast — insufficient feedback per the spec's SC-003 requirement.

---

## Decision 10: Deleted Submitter Handling

- **Decision**: When the API returns `submitter: null` (or `submitterDeleted: true`), the submitter name renders as `"Deleted User"` with the profile link disabled (rendered as `<span>` instead of `<Link>`). This is handled purely in the `ReportMetaSidebar` component via a conditional check.
- **Rationale**: Confirmed in the clarification session (2026-06-19). This graceful degradation prevents broken navigation and respects that the user account no longer exists.
- **Alternatives considered**: Hide submitter section entirely — rejected per clarification; retain username — rejected per clarification.
