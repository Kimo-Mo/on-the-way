# Research: Users Management

**Feature**: `004-users-management`
**Date**: 2026-06-18
**Status**: Complete — all unknowns resolved

---

## Decision 1: URL Search Parameter Strategy for Table State

- **Decision**: Use React Router DOM v7's `useSearchParams` hook to read and write table state (page, pageSize, search, role, status) as URL query parameters.
- **Rationale**: Native to the already-installed router, requires zero new dependencies, and aligns with the constitution's bundle-impact constraint. Enables deep-linking and back/forward navigation for free.
- **Alternatives considered**: Zustand global store (adds global state complexity for ephemeral UI state), sessionStorage (not shareable, requires manual sync).

---

## Decision 2: React Query Configuration for the Users List

- **Decision**: Use `useQuery` with a query key that includes all filter/pagination params `['users', params]`. Set `placeholderData: keepPreviousData` (TanStack v5) to avoid layout flashes between paginated pages. Configure `staleTime: 30_000` (30 seconds) for the list; `staleTime: 60_000` for individual user details.
- **Rationale**: `keepPreviousData` is the recommended pattern for paginated lists in TanStack Query v5, preventing the UI from resetting to a loading skeleton on every page navigation. Matches the pattern used in `useDashboardOverview.ts`.
- **Alternatives considered**: `prefetchQuery` on hover (more complex, premature optimization); no stale time (causes unnecessary refetches during filter interactions).

---

## Decision 3: Mock-to-Live API Bridge Pattern

- **Decision**: Follow the established pattern in `useDashboardOverview.ts`: wrap each API call in a try/catch; on error, fall back to a local fixture file (e.g., `src/lib/users-fixtures.ts`) and log a console warning. The fixture data must be typed identically to the live response.
- **Rationale**: The live .NET backend is not yet connected. This pattern ensures the feature is fully functional with mock data and that removing the fallback requires only deleting the catch block — there is no leakage into production logic.
- **Alternatives considered**: MSW (Mock Service Worker) — heavier setup, deferred for a future global mocking phase per the constitution.

---

## Decision 4: Source Code Structure — Feature-Adjacent Co-location

- **Decision**: Co-locate all users-specific code under feature directories rather than scattering across global `hooks/` and `types/`:
  - `src/types/users.ts` — domain types (mirrors pattern of `src/types/dashboard.ts`)
  - `src/hooks/useUsers.ts` — list query hook + fixture fallback
  - `src/hooks/useUserDetails.ts` — single user + activity query hook
  - `src/pages/UsersManagement.tsx` — replaces the existing stub
  - `src/pages/UserDetails.tsx` — new details page
  - `src/components/users/` — all users-scoped UI components
- **Rationale**: Keeps related concerns together, mirrors the existing dashboard pattern (`types/dashboard.ts`, `hooks/useDashboardOverview.ts`, `components/dashboard/`), and satisfies the constitution's "predictable feature locations" requirement.
- **Alternatives considered**: Flat global components — rejected because it creates naming collisions at scale.

---

## Decision 5: Routing for User Details

- **Decision**: Add `/users/:id` as a nested child route under the existing `ProtectedRoute` wrapper in `App.tsx`. Use React Router's `useParams` in the `UserDetails` page to extract the user ID.
- **Rationale**: This is already the expected pattern established in `PLAN.md` ("Build `UserDetails` page (`/users/:id`)"). The route infrastructure already exists and just needs the new page registered.
- **Alternatives considered**: Modal-based details — rejected because the spec explicitly calls for a dedicated page (`/users/:id`).

---

## Decision 6: Trust Score Display

- **Decision**: Render Trust Score as a numeric percentage (e.g., `95%`) throughout the application. In the table, display the raw number with a `%` suffix. On the details page, optionally render a visual progress bar alongside the percentage.
- **Rationale**: Confirmed in clarification session 2026-06-18. Numeric percentage is universally understood, easily sortable, and does not require a legend.
- **Alternatives considered**: Badge (e.g., "Good") — rejected as less precise and harder to sort.

---

## Decision 7: Table Loading & Empty States

- **Decision**:
  - **Loading**: Display Shadcn `Skeleton` rows (matching the table column count) during the initial fetch and page/filter transitions.
  - **Empty (no results)**: Display an inline empty state within the table body — icon, "No users found" message, and a "Clear Filters" button that resets URL search params.
  - **Error**: Display a Shadcn `Alert` (destructive variant) with a "Retry" button that calls `refetch()`.
- **Rationale**: Consistent with the constitution's requirement that "loading states, empty states, and authorization failures MUST be represented explicitly." Skeleton rows prevent cumulative layout shift (CLS) during pagination.
- **Alternatives considered**: Full-page spinner — rejected as it disrupts the admin's workflow context.
