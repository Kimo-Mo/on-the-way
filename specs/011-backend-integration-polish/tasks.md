# Tasks: Backend Integration, Refactoring & Final Polish

**Input**: Design documents from `/specs/011-backend-integration-polish/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api-contracts.md`, `quickstart.md`

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently. Tasks are intentionally specific enough for a low-cost LLM to execute without guessing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it edits a different file or only reads/verifies files
- **[Story]**: Which user story this task belongs to, omitted for Setup, Foundational, and Polish tasks
- Every task names the exact file or directory to inspect, create, update, or delete

## Important Implementation Rules

- Do not add runtime dependencies to `package.json`.
- Keep existing TypeScript interfaces in `src/types/` as the frontend source of truth.
- Put backend response mappers in the hook file that consumes them; do not create shared mapper utilities.
- Live endpoints must call `api` from `src/lib/axios.ts` directly and let errors propagate to React Query.
- Mock-only endpoints must not attempt API calls. They may use retained fixture or inline in-memory data with a clear JSDoc comment.
- Remove `console.log` and `console.warn` from source code.
- Use JSDoc for every exported fetch function and every exported custom hook.
- Do not remove `src/lib/analytics-fixtures.ts`.
- Remove `src/services/api/` only after Analytics and Settings logic is inlined into their hook files.
- No test tasks are generated because the spec did not request TDD; verification is covered by build, lint, grep, and manual state checks.

---

## Phase 1: Setup (Shared Orientation)

**Purpose**: Confirm the implementation context before changing source files.

- [X] T001 [P] Read endpoint requirements in `specs/011-backend-integration-polish/contracts/api-contracts.md` and use the listed paths without adding or renaming endpoints
- [X] T002 [P] Read mapping rules in `specs/011-backend-integration-polish/data-model.md` and keep all mapper return values aligned to existing files in `src/types/`
- [X] T003 [P] Read hook convention in `specs/011-backend-integration-polish/quickstart.md` and apply the imports -> mapper -> fetch -> query key -> hook -> mutation order in `src/hooks/`
- [X] T004 [P] Confirm scripts in `package.json` remain unchanged except if TypeScript or lint errors require a minimal existing-script fix

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared infrastructure and remove the global debug statement before story work starts.

**CRITICAL**: Complete this phase before implementing any user story.

- [X] T005 Remove the request-interceptor `console.log` while preserving auth header and 401 behavior in `src/lib/axios.ts`
- [X] T006 [P] Create `PageError` with props `message?: string`, `onRetry?: () => void`, and optional `className?: string` in `src/components/shared/PageError.tsx`
- [X] T007 [P] Create `PageEmpty` with props `title: string`, `description?: string`, `icon?: LucideIcon`, and optional `className?: string` in `src/components/shared/PageEmpty.tsx`
- [X] T008 [P] Create `TableSkeleton` with props `columns: number`, `rows?: number`, and optional `className?: string` in `src/components/shared/TableSkeleton.tsx`
- [X] T009 [P] Create `CardSkeleton` with props `count?: number`, `className?: string`, and card-friendly responsive layout in `src/components/shared/CardSkeleton.tsx`
- [X] T010 Re-export `PageError`, `PageEmpty`, `TableSkeleton`, and `CardSkeleton` from `src/components/shared/index.ts`

**Checkpoint**: Shared state components exist, Axios has no request debug output, and user story work can begin.

---

## Phase 3: User Story 1 - Admin Views Live Data from Backend (Priority: P1) MVP

**Goal**: All live dashboard domains fetch from the .NET backend, normalize backend shapes into existing frontend types, and no longer silently fall back to fixtures for live endpoints.

**Independent Verification**: With `VITE_API_BASE_URL` pointing to a running backend, Users, Reports, Providers, Dashboard, Help Requests, Moderation, Notifications, and Settings Profile use network data. When a live endpoint fails, the hook exposes a React Query error instead of returning fixture data.

### Implementation for User Story 1

- [X] T011 [US1] Add local backend response types, mapper functions, wrapper normalization, enum fallbacks, and JSDoc to Users list/detail fetchers in `src/hooks/users/useUsers.ts`
- [X] T012 [US1] Add local backend response types, mapper functions, wrapper normalization, enum fallbacks, and JSDoc to Reports list/detail fetchers in `src/hooks/reports/useReports.ts`
- [X] T013 [US1] Add local backend response types, mapper functions, wrapper normalization, enum fallbacks, and JSDoc to Providers list/detail fetchers in `src/hooks/providers/useProviders.ts`
- [X] T014 [US1] Replace dashboard fixture fallback with a direct `api.get('/admin/dashboard')` fetch, mapper normalization, error propagation, and JSDoc in `src/hooks/dashboard/useDashboard.ts`
- [X] T015 [US1] Add local backend response types, mapper functions, wrapper normalization, enum fallbacks, and JSDoc to Help Requests list/detail fetchers in `src/hooks/help-requests/useHelpRequests.ts`
- [X] T016 [US1] Remove all fixture fallback and `console.warn` paths for live moderation endpoints, then add mappers and JSDoc in `src/hooks/moderation/useModeration.ts`
- [X] T017 [US1] Add local backend response types, mapper functions, wrapper normalization, enum fallbacks, and JSDoc to Notifications list/detail/create/delete fetchers in `src/hooks/notifications/useNotifications.ts`
- [X] T018 [US1] Wire Admin Profile get/save to direct `api.get('/admin/settings/profile')` and `api.put('/admin/settings/profile')` calls with mapper normalization and JSDoc in `src/hooks/settings/useSettings.ts`
- [X] T019 [US1] Confirm live hook imports no longer reference removed live fixture files in `src/hooks/users/useUsers.ts`, `src/hooks/reports/useReports.ts`, `src/hooks/providers/useProviders.ts`, `src/hooks/dashboard/useDashboard.ts`, `src/hooks/help-requests/useHelpRequests.ts`, `src/hooks/moderation/useModeration.ts`, and `src/hooks/notifications/useNotifications.ts`

**Checkpoint**: User Story 1 is complete when live endpoint hooks no longer return fixture data and React Query receives real errors from failed live API requests.

---

## Phase 4: User Story 2 - Codebase Passes Academic Code Review (Priority: P1)

**Goal**: Source code is professional, documented, and free of debug output, conversational comments, TODOs, and dead commented code.

**Independent Verification**: Searches for `console.log`, `console.warn`, `// I fixed`, `// Here is`, `TODO`, and obvious commented-out source blocks return no source matches under `src/`.

### Implementation for User Story 2

- [X] T020 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/users/useUsers.ts`
- [X] T021 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/reports/useReports.ts`
- [X] T022 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/providers/useProviders.ts`
- [X] T023 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/dashboard/useDashboard.ts`
- [X] T024 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/help-requests/useHelpRequests.ts`
- [X] T025 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/moderation/useModeration.ts`
- [X] T026 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/notifications/useNotifications.ts`
- [X] T027 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/analytics/useAnalytics.ts`
- [X] T028 [P] [US2] Add JSDoc with `@param` and `@returns` for every exported fetch function and exported hook in `src/hooks/settings/useSettings.ts`
- [X] T029 [P] [US2] Add JSDoc for exported authentication hooks and mutations in `src/hooks/auth/useAuth.ts`
- [X] T030 [P] [US2] Add concise comments only for non-obvious auth persistence logic in `src/store/auth-store.ts`
- [X] T031 [US2] Remove conversational, AI-style, TODO, and commented-out dead code comments from `src/hooks/`
- [X] T032 [US2] Remove conversational, AI-style, TODO, and commented-out dead code comments from `src/components/`
- [X] T033 [US2] Remove conversational, AI-style, TODO, and commented-out dead code comments from `src/pages/`
- [X] T034 [US2] Verify no forbidden debug or review strings remain by searching `src/` for `console.log`, `console.warn`, `// I fixed`, `// Here is`, and `TODO`

**Checkpoint**: User Story 2 is complete when hook exports are documented and the forbidden-source search has zero matches.

---

## Phase 5: User Story 3 - Hooks Architecture Is Consistent Across All Modules (Priority: P2)

**Goal**: Every hook module uses the same direct Axios or pure-mock inline architecture, with no separate service layer and no one-off hook structure.

**Independent Verification**: Any two files in `src/hooks/` show the same organization order: imports, local types/mappers or mock state, fetch functions, query keys, query hooks, mutation hooks.

### Implementation for User Story 3

- [X] T035 [US3] Inline Analytics mock fetch logic into `src/hooks/analytics/useAnalytics.ts`, import only `src/lib/analytics-fixtures.ts`, remove `@/services/api/analytics`, and document that no backend endpoint exists
- [X] T036 [US3] Inline Notification Preferences mock state and save logic from `src/services/api/settings.ts` into `src/hooks/settings/useSettings.ts`
- [X] T037 [US3] Inline System Settings mock state and save logic from `src/services/api/settings.ts` into `src/hooks/settings/useSettings.ts`
- [X] T038 [US3] Inline Display Preferences mock state and save logic from `src/services/api/settings.ts` into `src/hooks/settings/useSettings.ts`
- [X] T039 [US3] Standardize query key exports and hook ordering in `src/hooks/users/useUsers.ts`, `src/hooks/reports/useReports.ts`, and `src/hooks/providers/useProviders.ts`
- [X] T040 [US3] Standardize query key exports and hook ordering in `src/hooks/dashboard/useDashboard.ts`, `src/hooks/help-requests/useHelpRequests.ts`, and `src/hooks/moderation/useModeration.ts`
- [X] T041 [US3] Standardize query key exports and hook ordering in `src/hooks/notifications/useNotifications.ts`, `src/hooks/analytics/useAnalytics.ts`, `src/hooks/settings/useSettings.ts`, and `src/hooks/auth/useAuth.ts`
- [X] T042 [US3] Delete `src/services/api/analytics.ts` after `src/hooks/analytics/useAnalytics.ts` no longer imports it
- [X] T043 [US3] Delete `src/services/api/settings.ts` after `src/hooks/settings/useSettings.ts` no longer imports it
- [X] T044 [US3] Remove the empty `src/services/api/` directory after its files are deleted and no source import references `@/services/api`

**Checkpoint**: User Story 3 is complete when `rg "@/services/api|src/services/api" src` returns no matches and the service directory is gone.

---

## Phase 6: User Story 4 - Mock Data Is Cleaned Up Without Breaking Unmapped Features (Priority: P2)

**Goal**: Fixture files for live domains are removed while Analytics and backend-unavailable Settings behavior remains functional.

**Independent Verification**: `src/lib/analytics-fixtures.ts` remains, all listed live-domain fixture files are gone, and the app compiles without imports from deleted fixtures.

### Implementation for User Story 4

- [X] T045 [P] [US4] Delete live-domain fixture file `src/lib/users-fixtures.ts` after `src/hooks/users/useUsers.ts` has no import from it
- [X] T046 [P] [US4] Delete live-domain fixture file `src/lib/reports-fixtures.ts` after `src/hooks/reports/useReports.ts` has no import from it
- [X] T047 [P] [US4] Delete live-domain fixture file `src/lib/providers-fixtures.ts` after `src/hooks/providers/useProviders.ts` has no import from it
- [X] T048 [P] [US4] Delete live-domain fixture file `src/lib/dashboard-fixtures.ts` after `src/hooks/dashboard/useDashboard.ts` has no import from it
- [X] T049 [P] [US4] Delete live-domain fixture file `src/lib/help-requests-fixtures.ts` after `src/hooks/help-requests/useHelpRequests.ts` has no import from it
- [X] T050 [P] [US4] Delete live-domain fixture file `src/lib/moderation-fixtures.ts` after `src/hooks/moderation/useModeration.ts` has no import from it
- [X] T051 [P] [US4] Delete live-domain fixture file `src/lib/notifications-fixtures.ts` after `src/hooks/notifications/useNotifications.ts` has no import from it
- [X] T052 [US4] Confirm `src/lib/analytics-fixtures.ts` is still imported only by `src/hooks/analytics/useAnalytics.ts` and is not deleted
- [X] T053 [US4] Confirm Settings mock-only data lives inline in `src/hooks/settings/useSettings.ts` and no settings mock fixture file is created under `src/lib/`
- [X] T054 [US4] Verify deleted fixture imports are gone by searching `src/` for `users-fixtures`, `reports-fixtures`, `providers-fixtures`, `dashboard-fixtures`, `help-requests-fixtures`, `moderation-fixtures`, and `notifications-fixtures`

**Checkpoint**: User Story 4 is complete when only intentionally retained mock data remains.

---

## Phase 7: User Story 5 - Admin Experiences Polished Error, Loading & Empty States (Priority: P3)

**Goal**: Admin pages show shared loading, error, and empty states instead of blank screens, raw errors, or inconsistent inline alerts.

**Independent Verification**: Each page can display a loading skeleton, a friendly retryable error, and an empty state. Responsive layouts remain usable down to 768px.

### Implementation for User Story 5

- [X] T055 [US5] Replace inline error alert, table loading, and empty user-list behavior with `PageError`, `TableSkeleton`, and `PageEmpty` in `src/pages/UsersManagement.tsx`
- [X] T056 [US5] Replace inline loading/error/empty behavior with shared state components in `src/pages/UserDetails.tsx`
- [X] T057 [US5] Replace reports list loading/error/empty behavior with `PageError`, `TableSkeleton` or `CardSkeleton`, and `PageEmpty` in `src/pages/ReportsManagement.tsx`
- [X] T058 [US5] Replace report details loading/error/empty behavior with shared state components in `src/pages/ReportDetails.tsx`
- [X] T059 [US5] Replace providers list loading/error/empty behavior with `PageError`, `TableSkeleton`, and `PageEmpty` in `src/pages/ProvidersManagement.tsx`
- [X] T060 [US5] Replace provider details loading/error/empty behavior with shared state components in `src/pages/ProviderDetails.tsx`
- [X] T061 [US5] Replace dashboard widget loading/error/empty behavior with `PageError`, `CardSkeleton`, and widget-level empty states in `src/pages/Dashboard.tsx`
- [X] T062 [US5] Replace help requests list loading/error/empty behavior with `PageError`, `CardSkeleton` or `TableSkeleton`, and `PageEmpty` in `src/pages/HelpRequestsPage.tsx`
- [X] T063 [US5] Replace help request details loading/error/empty behavior with shared state components in `src/pages/HelpRequestDetailsPage.tsx`
- [X] T064 [US5] Replace moderation panel loading/error/empty behavior with `PageError`, `CardSkeleton`, and section-level `PageEmpty` usage in `src/pages/ModerationPanel.tsx`
- [X] T065 [US5] Replace notifications loading/error/empty behavior with `PageError`, `TableSkeleton`, and `PageEmpty` in `src/pages/NotificationsPage.tsx`
- [X] T066 [US5] Replace settings profile and mock settings loading/error behavior with shared state components in `src/pages/SettingsPage.tsx`
- [X] T067 [US5] Replace analytics mock loading and empty behavior with `CardSkeleton` and context-specific empty states in `src/pages/AnalyticsPage.tsx`
- [X] T068 [US5] Ensure table containers scroll horizontally below 768px in `src/components/users/UsersTable.tsx`, `src/components/providers/ProvidersTable.tsx`, and `src/components/notifications/NotificationsList.tsx`
- [X] T069 [US5] Ensure card grids stack without clipping below 768px in `src/components/dashboard/DashboardGrid.tsx`, `src/components/help-requests/HelpRequestCard.tsx`, and `src/components/moderation/FlaggedReportCard.tsx`

**Checkpoint**: User Story 5 is complete when every admin page has explicit loading, error, empty, and responsive behavior.

---

## Phase 8: Polish & Cross-Cutting Verification

**Purpose**: Validate the whole feature after all selected user stories are complete.

- [X] T070 Run TypeScript build command `npm run build` and fix any errors in `src/` without changing feature scope
- [X] T071 Run lint command `npm run lint` and fix any errors in `src/` without adding new dependencies
- [X] T072 Verify no forbidden console statements remain by running a source search for `console.log` and `console.warn` in `src/`
- [X] T073 Verify no deleted service-layer imports remain by searching `src/` for `@/services/api` and `services/api`
- [X] T074 Verify no deleted live fixture imports remain by searching `src/` for `users-fixtures`, `reports-fixtures`, `providers-fixtures`, `dashboard-fixtures`, `help-requests-fixtures`, `moderation-fixtures`, and `notifications-fixtures`
- [X] T075 Verify all exported hooks and fetch functions have JSDoc in `src/hooks/`
- [X] T076 Verify `src/lib/analytics-fixtures.ts` still exists and is the only retained fixture file with a `*-fixtures.ts` suffix under `src/lib/`
- [X] T077 Manually verify Users, Reports, Providers, Dashboard, Help Requests, Moderation, Notifications, Settings, and Analytics routes at 768px viewport using the running Vite app from `package.json`
- [X] T078 Update `specs/011-backend-integration-polish/quickstart.md` only if implementation commands or retained mock behavior changed during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; read-only orientation.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories because pages need shared state components and Axios cleanup.
- **US1 (Phase 3)**: Depends on Foundational; this is the MVP backend integration story.
- **US2 (Phase 4)**: Depends on Foundational; can run alongside US1 only if developers avoid editing the same hook files at the same time.
- **US3 (Phase 5)**: Depends on US1 and US2 for hook correctness and documentation.
- **US4 (Phase 6)**: Depends on US1 and US3 because fixture files and service files must not be deleted before imports are removed.
- **US5 (Phase 7)**: Depends on Foundational and benefits from US1 error propagation; page work can proceed after shared components exist.
- **Polish (Phase 8)**: Depends on all selected user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2; required for MVP.
- **User Story 2 (P1)**: Can start after Phase 2; required for academic review readiness.
- **User Story 3 (P2)**: Depends on US1 and US2 because it standardizes completed hooks.
- **User Story 4 (P2)**: Depends on US1 and US3 because cleanup must happen after hook imports are removed.
- **User Story 5 (P3)**: Depends on Phase 2 and should be finalized after US1 so live endpoint errors render through shared components.

### Parallel Opportunities

- Phase 1 read-only tasks T001-T004 can run in parallel.
- Phase 2 component creation tasks T006-T009 can run in parallel, then T010 exports them.
- US2 JSDoc tasks T020-T030 can run in parallel by file, but avoid overlap with US1 edits in the same hook file.
- US4 deletion tasks T045-T051 can run in parallel after imports are removed.
- US5 page integration tasks T055-T067 can run in parallel by page after shared components are exported.
- Responsive component tasks T068-T069 can run in parallel after page integrations are stable.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 tasks T011-T019.
3. Run `npm run build` and manually verify live data pages.
4. Stop and validate: live endpoint failures must produce React Query errors, not fixture fallback data.

### Academic Review Increment

1. Complete User Story 2 tasks T020-T034 after MVP hooks compile.
2. Ensure every exported hook and fetch function has JSDoc with useful business context.
3. Ensure forbidden debug and conversational comments have zero matches.

### Architecture and Cleanup Increment

1. Complete User Story 3 tasks T035-T044 to inline service logic.
2. Complete User Story 4 tasks T045-T054 to remove obsolete live-domain fixtures.
3. Build after deletions before moving to page polish.

### UX Polish Increment

1. Complete User Story 5 tasks T055-T069 page by page.
2. Verify loading, error, empty, retry, and responsive states per route.
3. Complete Phase 8 verification tasks before declaring the feature done.

---

## Independent Test Criteria Summary

- **US1**: Live hook files call backend endpoints from `contracts/api-contracts.md`, map backend shapes to `src/types/`, and propagate live API failures to React Query.
- **US2**: Source code under `src/` has JSDoc for exported hooks/fetchers and no `console.log`, `console.warn`, `TODO`, conversational comments, or dead commented code.
- **US3**: Hook files follow one consistent architecture and there are no imports from `@/services/api`.
- **US4**: Live-domain fixture files are deleted, `src/lib/analytics-fixtures.ts` remains, and Settings mock-only data is inline in `src/hooks/settings/useSettings.ts`.
- **US5**: All admin pages show shared loading, error, empty, and responsive states.

## Suggested MVP Scope

The MVP is Phase 1, Phase 2, and Phase 3 only: setup, shared foundation, and User Story 1 backend integration. User Story 2 should be completed before academic submission, and User Stories 3-5 complete the final polish.

## Format Validation

All task lines use the required checklist format:

```text
checkbox + T### + optional [P] + optional [US#] + description with exact file path
```

Setup, Foundational, and Polish tasks omit story labels. User Story phase tasks include `[US1]`, `[US2]`, `[US3]`, `[US4]`, or `[US5]`.
