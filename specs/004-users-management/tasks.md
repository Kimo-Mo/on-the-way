# Tasks: Users Management

**Input**: Design documents from `specs/004-users-management/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and verification.

> **Note for implementer**: This is a React + TypeScript + Vite + TanStack React Query v5 + Shadcn UI + Tailwind CSS project. All paths are relative to the repository root. The shared Axios client is at `src/lib/axios.ts`. Existing reference patterns: `src/hooks/useDashboardOverview.ts`, `src/lib/dashboard-fixtures.ts`, `src/types/dashboard.ts`. Do NOT use `useEffect` for data fetching. Do NOT fetch all users at once — always use server-side pagination.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on other in-progress tasks)
- **[Story]**: Which user story this task belongs to ([US1] or [US2])

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Register the new `/users/:id` route and prepare the pages barrel export so the router can load the feature before any components are built.

- [ ] T001 In `src/App.tsx`, add `import { lazy, Suspense } from 'react'` at the top. Then, after the existing `<Route path="/users" element={<UsersManagement />} />` line (line 18), add a new child route: `<Route path="/users/:id" element={<Suspense fallback={<div className="flex items-center justify-center h-full"><span className="text-muted-foreground text-sm">Loading…</span></div>}><UserDetails /></Suspense>} />`. Import `UserDetails` from `'./pages'`. Leave all other routes unchanged.

- [ ] T002 In `src/pages/index.ts`, add a new export line: `export { default as UserDetails } from './UserDetails';`. The file currently has 2 lines; append the new export as line 3. Leave the existing exports unchanged.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define all TypeScript types and create mock fixture data. All user story tasks depend on this phase being complete first.

**CRITICAL**: Do NOT start Phase 3 or Phase 4 tasks until all Phase 2 tasks are done.

- [ ] T003 Create `src/types/users.ts`. This file must export the following TypeScript types exactly as written below. Do not add extra fields or change type names.

  ```typescript
  // ─── Role & Status ───────────────────────────────────────────────────────────
  export type UserRole = 'admin' | 'driver' | 'serviceProvider';
  export type UserStatus = 'active' | 'suspended' | 'pending';

  // ─── Core User (used in the list table) ──────────────────────────────────────
  export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    trustScore: number;     // 0–100; render as "87%"
    joinedAt: string;       // ISO 8601
    avatarUrl?: string;
  }

  // ─── Activity ────────────────────────────────────────────────────────────────
  export type UserActivityType =
    | 'reportSubmitted'
    | 'reportVerified'
    | 'helpRequestCreated'
    | 'helpRequestResolved'
    | 'profileUpdated'
    | 'suspended'
    | 'reactivated';

  export interface UserActivity {
    id: string;
    userId: string;
    type: UserActivityType;
    description: string;
    timestamp: string;          // ISO 8601
    relatedEntityId?: string;
    relatedEntityRoute?: string;
  }

  // ─── Full User Details (used on /users/:id) ───────────────────────────────────
  export interface UserDetails extends User {
    phone?: string;
    address?: string;
    vehicleInfo?: string;
    activityHistory: UserActivity[];
  }

  // ─── Query Params (sent to API) ───────────────────────────────────────────────
  export interface UsersQueryParams {
    page: number;           // 1-indexed, default 1
    pageSize: number;       // default 10
    search?: string;        // searches name AND email
    role?: UserRole;
    status?: UserStatus;
  }

  // ─── Paginated List Response (from API) ───────────────────────────────────────
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }

  export type UsersListResponse = PaginatedResponse<User>;
  ```

- [ ] T004 [P] Create `src/lib/users-fixtures.ts`. This file provides typed mock data used as a fallback when the live API is unavailable. Follow the exact same pattern as `src/lib/dashboard-fixtures.ts`. The file must export one constant: `usersListFixture` of type `UsersListResponse`, and one constant `userDetailsFixtures` as a `Record<string, UserDetails>` (a lookup map of user details by user ID). Include at least 12 mock users covering all three roles (`admin`, `driver`, `serviceProvider`) and all three statuses (`active`, `suspended`, `pending`). Trust scores must range from 40–100. Use realistic Egyptian names and Cairo-based addresses. The `activityHistory` for each user in `userDetailsFixtures` must include at least 3 entries of mixed `UserActivityType` values.

  Reference the structure of `src/lib/dashboard-fixtures.ts` for how to structure this file. Import types from `@/types/users`.

  The `usersListFixture` must have:
  - `data`: array of 12 `User` objects
  - `total`: 12
  - `page`: 1
  - `pageSize`: 10
  - `totalPages`: 2

- [ ] T005 [P] In `src/types/index.ts`, add the following import and re-export at the end of the file (after the existing `NavItem` interface). Do NOT remove or modify existing content:

  ```typescript
  export type {
    UserRole,
    UserStatus,
    User,
    UserActivity,
    UserActivityType,
    UserDetails,
    UsersQueryParams,
    PaginatedResponse,
    UsersListResponse,
  } from './users';
  ```

---

## Phase 3: User Story 1 — View and Filter Users List (Priority: P1) MVP

**Goal**: Replace the stub at `/users` with a fully functional paginated table that supports search and role/status filtering. Table state is synced to URL search parameters.

**Independent Verification**: Navigate to `/users`. You should see a table with user rows. Type in the search box — the URL should update (e.g., `?search=ahmed`) and the table should filter. Change the Role or Status dropdown — the URL should update and the table should update. Click page 2 — URL shows `?page=2`. Navigate to `/users/:id` from a row, then press browser Back — you return to `/users` with your previous filters still in the URL.

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create `src/hooks/useUsers.ts`. This hook fetches the paginated users list using TanStack React Query v5. Follow the EXACT same pattern as `src/hooks/useDashboardOverview.ts` for the API call with fixture fallback.

  The file must export:
  1. `fetchUsers(params: UsersQueryParams): Promise<UsersListResponse>` — calls `GET /admin/users` via the shared `api` client from `@/lib/axios`, passing `params` as query parameters. On any error, logs a warning and returns `usersListFixture` from `@/lib/users-fixtures`.
  2. `USERS_QUERY_KEY` — a function `(params: UsersQueryParams) => ['users', params]`.
  3. `useUsers(params: UsersQueryParams)` — a React Query `useQuery` hook with:
     - `queryKey: USERS_QUERY_KEY(params)`
     - `queryFn: () => fetchUsers(params)`
     - `placeholderData: keepPreviousData` (import from `@tanstack/react-query`)
     - `staleTime: 30_000`

  Imports needed: `import api from '@/lib/axios'`, `import { usersListFixture } from '@/lib/users-fixtures'`, `import type { UsersListResponse, UsersQueryParams } from '@/types/users'`, `import { useQuery, keepPreviousData } from '@tanstack/react-query'`.

- [ ] T007 [P] [US1] Create `src/components/users/UserStatusBadge.tsx`. This component renders a Shadcn `Badge` with a color variant based on the user's status. It accepts one prop: `status: UserStatus`. Render rules:
  - `'active'` → `variant="default"` with green text (add class `bg-green-500/15 text-green-700 border-green-200 dark:text-green-400`)
  - `'suspended'` → `variant="destructive"`
  - `'pending'` → `variant="secondary"` with amber text (add class `bg-amber-500/15 text-amber-700 border-amber-200 dark:text-amber-400`)
  
  Display the status value capitalized (e.g., `Active`, `Suspended`, `Pending`). Import `Badge` from `@/components/ui/badge` and `UserStatus` from `@/types/users`.

- [ ] T008 [P] [US1] Create `src/components/users/UserRoleBadge.tsx`. This component renders a Shadcn `Badge` for the user's role. It accepts one prop: `role: UserRole`. Render rules:
  - `'admin'` → `variant="default"` (dark/primary)
  - `'driver'` → `variant="outline"`
  - `'serviceProvider'` → `variant="secondary"`
  
  Display human-readable labels: `admin` → `Admin`, `driver` → `Driver`, `serviceProvider` → `Service Provider`. Import `Badge` from `@/components/ui/badge` and `UserRole` from `@/types/users`.

- [ ] T009 [US1] Create `src/components/users/UsersTableToolbar.tsx`. This component renders the search input and filter dropdowns above the users table. It does NOT manage state internally — all state comes from URL search params via props.

  **Props interface**:
  ```typescript
  interface UsersTableToolbarProps {
    search: string;
    role: string;
    status: string;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onClearFilters: () => void;
    isFiltered: boolean; // true when any filter is active
  }
  ```

  **Layout** (use Tailwind flex): A single row with:
  1. A Shadcn `Input` (with a `Search` icon from `lucide-react` prepended inside a relative div) for the search field. Placeholder: `"Search by name or email…"`. `value={search}`, `onChange={(e) => onSearchChange(e.target.value)}`. Apply debounce of 300ms using `useCallback` + `setTimeout` so the URL is not updated on every keystroke.
  2. A Shadcn `Select` for Role filter. Options: `"all"` (label: "All Roles"), `"admin"`, `"driver"`, `"serviceProvider"` (label: "Service Provider"). `value={role || 'all'}`, `onValueChange={onRoleChange}`.
  3. A Shadcn `Select` for Status filter. Options: `"all"` (label: "All Statuses"), `"active"`, `"suspended"`, `"pending"`. `value={status || 'all'}`, `onValueChange={onStatusChange}`.
  4. Conditionally render a Shadcn `Button` with variant `"ghost"` and an `X` icon labeled `"Clear filters"` when `isFiltered` is `true`. Clicking it calls `onClearFilters()`.

  Imports needed: `Input` from `@/components/ui/input`, `Select, SelectContent, SelectItem, SelectTrigger, SelectValue` from `@/components/ui/select`, `Button` from `@/components/ui/button`, `Search, X` from `lucide-react`.

- [ ] T010 [US1] Create `src/components/users/UsersTable.tsx`. This component renders the Shadcn table for the users list.

  **Props interface**:
  ```typescript
  interface UsersTableProps {
    users: User[];
    isLoading: boolean;
    onViewDetails: (userId: string) => void;
  }
  ```

  **Columns**: ID (truncated to first 8 chars with `font-mono text-xs`), Name, Email, Role (render `<UserRoleBadge />`), Status (render `<UserStatusBadge />`), Trust Score (render as `{user.trustScore}%`), Actions.

  **Loading state**: When `isLoading` is `true`, render 5 skeleton rows using Shadcn `Skeleton` (import from `@/components/ui/skeleton`). Each skeleton row must have the same number of cells as the real table (7 columns). Skeleton height: `h-4`, width varies by column.

  **Empty state**: When `isLoading` is `false` and `users.length === 0`, render a single table row spanning all 7 columns with a centered message: a `Users` icon (from `lucide-react`) above the text `"No users found"` in `text-muted-foreground`.

  **Actions column**: Render a Shadcn `Button` with `variant="ghost"` and `size="sm"` labeled `"View"` with an `Eye` icon. Clicking it calls `onViewDetails(user.id)`.

  Wrap the entire table in a `rounded-md border` div. Use `Table, TableBody, TableCell, TableHead, TableHeader, TableRow` from `@/components/ui/table`. Import `User` from `@/types/users`, `UserRoleBadge` from `./UserRoleBadge`, `UserStatusBadge` from `./UserStatusBadge`.

- [ ] T011 [US1] Create `src/components/users/UsersPagination.tsx`. This component renders the pagination controls below the table.

  **Props interface**:
  ```typescript
  interface UsersPaginationProps {
    page: number;
    totalPages: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  }
  ```

  **Layout**: A flex row with:
  - Left side: text `"Showing {start}–{end} of {total} users"` in `text-sm text-muted-foreground` where `start = (page - 1) * pageSize + 1`, `end = Math.min(page * pageSize, total)`.
  - Right side: `ChevronLeft` button (Previous, disabled when `page === 1`) and `ChevronRight` button (Next, disabled when `page === totalPages`). Buttons use Shadcn `Button` with `variant="outline"` and `size="sm"`. Between the buttons, show `"Page {page} of {totalPages}"` in `text-sm`.

  Import `Button` from `@/components/ui/button`, `ChevronLeft, ChevronRight` from `lucide-react`.

- [ ] T012 [US1] Replace the entire content of `src/pages/UsersManagement.tsx`. This page is the `/users` route. It orchestrates the toolbar, table, and pagination using URL search params for state.

  The page must:
  1. Use `useSearchParams` from `react-router-dom` to read and write URL state. Parse these params: `page` (default `1`, convert to `Number`), `pageSize` (default `10`, convert to `Number`), `search` (default `''`), `role` (default `''`), `status` (default `''`).
  2. Call `useUsers({ page, pageSize, search: search || undefined, role: (role as UserRole) || undefined, status: (status as UserStatus) || undefined })`. Destructure `data, isLoading, isError, refetch` from the hook.
  3. Derive `isFiltered = !!(search || role || status)`.
  4. Implement handler functions:
     - `handleSearchChange(value: string)` → set `search` param, reset `page` to `1`
     - `handleRoleChange(value: string)` → set `role` to `value === 'all' ? '' : value`, reset `page` to `1`
     - `handleStatusChange(value: string)` → set `status` to `value === 'all' ? '' : value`, reset `page` to `1`
     - `handleClearFilters()` → remove `search`, `role`, `status` params, set `page` to `1`
     - `handlePageChange(newPage: number)` → set `page` to `newPage`
     - `handleViewDetails(userId: string)` → use `useNavigate()` to navigate to `/users/${userId}`
  5. Render (in order):
     - `<PageHeader title="Users Management" subtitle="Manage and monitor all system users" />` (import from `@/components/shared`)
     - If `isError`: render a Shadcn `Alert` with `variant="destructive"` containing the message `"Failed to load users. Please try again."` and a `Button` labeled `"Retry"` that calls `refetch()`. Import `Alert, AlertDescription` from `@/components/ui/alert`.
     - `<UsersTableToolbar ... />` with all the props wired up
     - `<UsersTable users={data?.data ?? []} isLoading={isLoading} onViewDetails={handleViewDetails} />`
     - Conditionally render `<UsersPagination ... />` only when `!isLoading && data && data.totalPages > 1`

  Wrap the body content in `<section className="py-7 space-y-4">`. Import `UserRole, UserStatus` from `@/types/users`. Import components from their respective paths in `@/components/users/`.

- [ ] T013 [US1] Create `src/components/users/index.ts` as a barrel export file for all users components:
  ```typescript
  export { default as UsersTableToolbar } from './UsersTableToolbar';
  export { default as UsersTable } from './UsersTable';
  export { default as UserStatusBadge } from './UserStatusBadge';
  export { default as UserRoleBadge } from './UserRoleBadge';
  export { default as UsersPagination } from './UsersPagination';
  ```

- [ ] T014 [US1] Verify User Story 1 is functional: Open the browser at `/users`. Confirm the following work correctly without console errors: (a) table renders with user data, (b) typing in the search box updates the URL after ~300ms, (c) selecting a role/status filter updates the URL and the table data changes, (d) clicking "Clear filters" resets all params, (e) the pagination footer appears and clicking Next changes `?page=2` in the URL. Fix any TypeScript errors by running `npx tsc --noEmit` and resolving all reported issues.

**Checkpoint**: User Story 1 is fully functional. The `/users` route shows a paginated, filterable users table with URL-persisted state.

---

## Phase 4: User Story 2 — View User Details (Priority: P1)

**Goal**: Implement the `/users/:id` page to display a user's full profile and activity history.

**Independent Verification**: From the users table, click "View" on any user row. You should land on `/users/{id}`. The page must show the user's name, email, role badge, status badge, trust score as a percentage, join date, and a chronological list of their activity events. Clicking "Back to Users" must return to `/users` with the previous filters still in the URL. If the ID is invalid, a "User Not Found" error must be shown.

### Implementation for User Story 2

- [ ] T015 [US2] Create `src/hooks/useUserDetails.ts`. This hook fetches a single user's full profile and activity history.

  The file must export:
  1. `fetchUserDetails(id: string): Promise<UserDetails>` — calls `GET /admin/users/{id}` via the shared `api` client. On any error, look up the user in `userDetailsFixtures` from `@/lib/users-fixtures` by the given `id`. If found, return it. If NOT found (truly unknown ID), re-throw the error so React Query treats it as a failure.
  2. `USER_DETAILS_QUERY_KEY` — a function `(id: string) => ['users', 'details', id]`.
  3. `useUserDetails(id: string)` — a React Query `useQuery` hook with:
     - `queryKey: USER_DETAILS_QUERY_KEY(id)`
     - `queryFn: () => fetchUserDetails(id)`
     - `staleTime: 60_000`
     - `enabled: !!id` (don't fetch if id is empty)
     - `retry: 1`

  Imports: `import api from '@/lib/axios'`, `import { userDetailsFixtures } from '@/lib/users-fixtures'`, `import type { UserDetails } from '@/types/users'`, `import { useQuery } from '@tanstack/react-query'`.

- [ ] T016 [US2] Create `src/pages/UserDetails.tsx`. This is the `/users/:id` page. It shows the full user profile and activity history.

  The page must:
  1. Use `useParams<{ id: string }>()` to get the `id`.
  2. Call `useUserDetails(id ?? '')`. Destructure `data: user, isLoading, isError`.
  3. Use `useNavigate()` for the back button. The back button must navigate to `-1` (browser back) so the user returns to the previous `/users` URL with filters intact.
  4. **Loading state**: Render a loading skeleton layout that matches the shape of the profile card. Use Shadcn `Skeleton` components — at minimum a circular avatar skeleton, a title skeleton, and 4 line skeletons for the metadata fields.
  5. **Error / not found state**: When `isError` is `true`, render a centered card with:
     - A `UserX` icon (from `lucide-react`) in a large muted color
     - Heading: `"User Not Found"`
     - Subtext: `"The user you are looking for does not exist or has been removed."`
     - A Shadcn `Button` labeled `"← Back to Users"` that calls `navigate(-1)`.
  6. **Loaded state**: Render the following layout:
     - **Back button**: A `Button` variant `"ghost"` with `ChevronLeft` icon and text `"Back to Users"` at the top, calls `navigate(-1)`.
     - **Profile Card**: A Shadcn `Card` containing:
       - User's name as `<h1>` (large, bold)
       - User's email in `text-muted-foreground`
       - `<UserRoleBadge role={user.role} />` and `<UserStatusBadge status={user.status} />` side by side
       - A grid of info rows (label + value pairs) for: Trust Score (`{user.trustScore}%` with a Shadcn `Progress` bar beneath it, `value={user.trustScore}`), Member Since (format `user.joinedAt` as a human-readable date using `new Date(user.joinedAt).toLocaleDateString()`), Phone (`user.phone ?? '—'`), Address (`user.address ?? '—'`), Vehicle Info (`user.vehicleInfo ?? '—'`, only show if user role is `'driver'`).
     - **Activity History section**: Below the card, an `<h2>` heading `"Activity History"`. Then a list of `user.activityHistory` sorted by timestamp descending. Each activity item must show: a colored dot (use `tone` logic similar to dashboard — map `UserActivityType` to a color), the `description`, and a relative or formatted timestamp. If `activityHistory` is empty, show `"No activity recorded yet."` in muted text.
  7. Wrap the whole page in `<section className="py-7 space-y-6">`. Import `UserRoleBadge, UserStatusBadge` from `@/components/users`. Import `Progress` from `@/components/ui/progress`. Import `Card, CardContent, CardHeader` from `@/components/ui/card`.

- [ ] T017 [US2] Verify User Story 2 is functional: Click "View" on a user in the table. Confirm: (a) the details page loads with correct data, (b) trust score displays as `XX%` with a progress bar, (c) clicking "Back to Users" goes back with filters intact in the URL, (d) navigating directly to `/users/nonexistent-id` shows the error card. Fix any TypeScript errors.

**Checkpoint**: Both user stories are independently functional. `/users` and `/users/:id` are complete.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks across both user stories.

- [ ] T018 [P] Run `npx tsc --noEmit` from the repository root. Fix ALL TypeScript errors reported. Do not use `any` as a fix — use proper types from `@/types/users`.

- [ ] T019 [P] Accessibility and responsive layout verification. For each of the two pages:
  - Confirm all `Button` and interactive elements have accessible labels (the icon-only buttons need an `aria-label`).
  - Confirm the table has `<caption>` or the toolbar acts as a visual label.
  - Confirm the page is usable at 768px viewport width (no clipped controls, no overflowing table — wrap the table in `overflow-x-auto`).

- [ ] T020 Performance check. Confirm that navigating between `/users` page 1 and page 2 does NOT show a blank loading skeleton (because `placeholderData: keepPreviousData` is set). If it does show a blank, fix the `useUsers` hook to ensure `keepPreviousData` is correctly imported and applied from `@tanstack/react-query`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — blocks all user story work.
- **Phase 3 (User Story 1)**: Depends on Phase 2. Tasks T006–T011 can run in parallel (different files). T012 depends on T006–T011 being done. T013 depends on T007–T011.
- **Phase 4 (User Story 2)**: Depends on Phase 2. T015 can start in parallel with Phase 3. T016 depends on T015, T007, T008 (badge components from Phase 3).
- **Phase 5 (Polish)**: Depends on Phases 3 and 4 being complete.

### Parallel Opportunities Per Story

**Phase 3 (User Story 1)** — after Phase 2 is done, these can run in parallel:
- T006 (`useUsers.ts`) + T007 (`UserStatusBadge.tsx`) + T008 (`UserRoleBadge.tsx`) + T011 (`UsersPagination.tsx`)
- T009 (`UsersTableToolbar.tsx`) can start in parallel (no deps within story)
- T010 (`UsersTable.tsx`) depends on T007 and T008

**Phase 4 (User Story 2)** — can start in parallel with Phase 3:
- T015 (`useUserDetails.ts`) has no dependencies on Phase 3 tasks
- T016 (`UserDetails.tsx`) depends on T015, T007, T008

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001–T002)
2. Complete Phase 2 (T003–T005)
3. Complete Phase 3 (T006–T013)
4. **STOP and VALIDATE**: Run T014 verification
5. The `/users` page is MVP-complete and can be demoed

### Full Delivery

1. Setup + Foundational → Foundation ready
2. Phase 3 → `/users` page verified (MVP)
3. Phase 4 → `/users/:id` page verified
4. Phase 5 → Polish complete, ready for backend connection

---

## Notes

- `[P]` tasks write to **different files** with no shared in-progress dependencies — safe to parallelize
- `[US1]` / `[US2]` maps tasks to spec user stories for traceability
- **No test tasks** — not requested in this feature
- **Fixture pattern**: The fixture fallback must be removable by deleting just the `catch` block when the live `.NET` backend is connected
- **No new npm packages** — use only what is already installed (check `package.json` before adding anything)
- Commit after each phase checkpoint before proceeding
