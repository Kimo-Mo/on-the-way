# Tasks: Service Providers

**Input**: Design documents from `C:/iProjects/on-the-way/specs/006-service-providers/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api-contracts.md`, `quickstart.md`

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently after the foundational phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: Maps a task to a user story. Setup, foundational, and polish tasks do not use story labels.
- Every task includes an exact file path for a cheaper implementation model to follow.

## Phase 1: Setup (Shared Structure)

**Purpose**: Create the provider feature file structure and route/navigation placeholders without implementing behavior yet.

- [x] T001 Create provider component directory and barrel file at `src/components/providers/index.ts`
- [x] T002 [P] Create placeholder provider list page component exporting default `ProvidersManagement` at `src/pages/ProvidersManagement.tsx`
- [x] T003 [P] Create placeholder provider details page component exporting default `ProviderDetails` at `src/pages/ProviderDetails.tsx`
- [x] T004 Modify page exports to export `ProvidersManagement` and `ProviderDetails` from `src/pages/index.ts`
- [x] T005 Modify protected routes to import provider pages, add canonical `/providers` and `/providers/:id`, and redirect or replace existing `/service-providers` stub in `src/App.tsx`
- [x] T006 Modify service provider navigation constant from `/service-providers` to `/providers` in `src/lib/dashboard-links.ts`
- [x] T007 Modify sidebar service provider nav item path from `/service-providers` to `/providers` in `src/components/layouts/SidebarContent.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared provider types, validation, fixtures, and data hooks required by all user stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [x] T008 Create provider domain types, query params, mutation payload types, reason constants, required document constants, and Zod schemas from `data-model.md` in `src/types/providers.ts`
- [x] T009 Re-export all provider types and provider schemas from `src/types/index.ts`
- [x] T010 Create at least 12 typed provider list/detail fixtures covering all statuses, all service types, unrated provider, missing required documents, unavailable document preview, no reviews, and suspended provider with latest decision in `src/lib/providers-fixtures.ts`
- [x] T011 Create `fetchProviders`, `PROVIDERS_QUERY_KEY`, and `useProviders` with Axios GET `/admin/providers`, fixture fallback, `keepPreviousData`, and `staleTime: 30000` in `src/hooks/useProviders.ts`
- [x] T012 Create `fetchProviderDetails`, `PROVIDER_DETAILS_QUERY_KEY`, and `useProviderDetails` with Axios GET `/admin/providers/:id`, fixture fallback by ID, `enabled: !!id`, `retry: 1`, and `staleTime: 60000` in `src/hooks/useProviderDetails.ts`
- [x] T013 Create `useUpdateProviderStatus` mutation with Axios POST `/admin/providers/:id/status`, Sonner success/error toasts, and invalidation for `['providers']` plus provider detail query in `src/hooks/useUpdateProviderStatus.ts`
- [x] T014 Create reusable `ProviderStatusBadge` with labels and variants for `pending`, `approved`, `rejected`, and `suspended` in `src/components/providers/ProviderStatusBadge.tsx`
- [x] T015 [P] Create reusable `ProviderVerificationBadge` with labels for `missingRequired`, `readyForReview`, and `verified` in `src/components/providers/ProviderVerificationBadge.tsx`
- [x] T016 [P] Create reusable `ProviderRating` that renders average rating/review count or an unrated state in `src/components/providers/ProviderRating.tsx`
- [x] T017 Export `ProviderStatusBadge`, `ProviderVerificationBadge`, and `ProviderRating` from `src/components/providers/index.ts`

**Checkpoint**: Provider routes compile, provider domain data is typed, fixture-backed hooks exist, and shared badges/ratings can be imported by pages.

---

## Phase 3: User Story 1 - Browse and Filter Service Providers (Priority: P1) MVP

**Goal**: Administrators can open `/providers`, see a paginated providers table, search by business/contact/location text, filter by service type/status, and view empty/loading/error states.

**Independent Verification**: Visit `/providers`; verify provider rows show business name, service type, rating, provider status, verification state, and details action. Change `search`, `type`, `status`, and page controls; verify URL params update, page resets to 1 on filter changes, and fixture-backed results remain usable.

### Implementation for User Story 1

- [x] T018 [P] [US1] Create `ProvidersToolbar` with Shadcn `Input`, service type `Select`, status `Select`, clear-filters button, controlled props, and accessible labels in `src/components/providers/ProvidersToolbar.tsx`
- [x] T019 [P] [US1] Create `ProvidersPagination` using the same previous/next behavior as `UsersPagination`, but with provider copy, in `src/components/providers/ProvidersPagination.tsx`
- [x] T020 [P] [US1] Create `ProviderTableSkeleton` rendering stable skeleton rows for loading state in `src/components/providers/ProviderTableSkeleton.tsx`
- [x] T021 [US1] Create `ProvidersTable` with Shadcn table columns for business name, service type, rating, status badge, verification badge, operating area, and a View Details action in `src/components/providers/ProvidersTable.tsx`
- [x] T022 [US1] Update provider component barrel exports for toolbar, pagination, skeleton, and table in `src/components/providers/index.ts`
- [x] T023 [US1] Implement URL search param parsing for `page`, `pageSize`, `search`, `type`, and `status` in `src/pages/ProvidersManagement.tsx`
- [x] T024 [US1] Wire `useProviders` data, loading skeleton, destructive error alert with retry, filtered empty state, table rendering, and pagination into `src/pages/ProvidersManagement.tsx`
- [x] T025 [US1] Wire View Details row action to navigate to `/providers/:id` from `src/pages/ProvidersManagement.tsx`
- [x] T026 [US1] Verify US1 manually against `specs/006-service-providers/quickstart.md`: `/providers` loads within 2s using fixtures, skeleton appears before data, filters update URL, empty state appears, and page works at 768px+ without horizontal page scroll

**Checkpoint**: User Story 1 is independently complete as an MVP list/search/filter/table experience.

---

## Phase 4: User Story 2 - Review Provider Details (Priority: P1)

**Goal**: Administrators can select a provider and review full business details, contact information, operating area/address, current status, verification documents, and base review section shell.

**Independent Verification**: From `/providers`, open a row. Verify `/providers/:id` shows provider name, service type, status, verification state, contact details, operating area/address, document list, missing required docs when present, loading state, error retry, and back navigation.

### Implementation for User Story 2

- [x] T027 [P] [US2] Create `ProviderDetailsSummary` showing business name, service type, status badge, verification badge, contact name, phone, email, operating area, address, and optional description in `src/components/providers/ProviderDetailsSummary.tsx`
- [x] T028 [P] [US2] Create `VerificationDocumentsPanel` showing document type label, name, uploaded date, availability, preview link when available, unavailable state, no-documents state, and missing required document warning in `src/components/providers/VerificationDocumentsPanel.tsx`
- [x] T029 [P] [US2] Create `CustomerReviewsPanel` shell that accepts rating and recent reviews props and renders either recent reviews or a no-reviews/unavailable state in `src/components/providers/CustomerReviewsPanel.tsx`
- [x] T030 [US2] Export `ProviderDetailsSummary`, `VerificationDocumentsPanel`, and `CustomerReviewsPanel` from `src/components/providers/index.ts`
- [x] T031 [US2] Implement `ProviderDetails` route param parsing, back button, `useProviderDetails`, loading skeleton sections, not-found/error alert with retry, and two-column responsive layout in `src/pages/ProviderDetails.tsx`
- [x] T032 [US2] Integrate `ProviderDetailsSummary`, `VerificationDocumentsPanel`, and read-only `CustomerReviewsPanel` into `src/pages/ProviderDetails.tsx`
- [x] T033 [US2] Verify US2 manually against `specs/006-service-providers/quickstart.md`: open at least one fixture with documents, one with no documents, one with unavailable document preview, and one missing required documents from `src/lib/providers-fixtures.ts`

**Checkpoint**: User Story 2 is independently complete as a read-only provider details workflow.

---

## Phase 5: User Story 3 - Approve a Provider (Priority: P2)

**Goal**: Administrators can approve eligible pending providers after confirmation; approval is blocked when business license, provider identity document, or service eligibility proof is missing/unavailable.

**Independent Verification**: Open a pending provider with all required documents, approve it, and verify success feedback plus refreshed status. Open a pending provider missing a required document and verify approval is disabled or blocked with a visible missing-document explanation.

### Implementation for User Story 3

- [x] T034 [P] [US3] Add helper functions `getMissingRequiredDocumentLabels`, `canApproveProvider`, and `getProviderStatusActionAvailability` in `src/types/providers.ts`
- [x] T035 [US3] Create reusable `ProviderStatusActionDialog` with approve confirmation mode, cancel behavior, loading/disabled states, accessible title/description, and no reason field for approve in `src/components/providers/ProviderStatusActionDialog.tsx`
- [x] T036 [US3] Export `ProviderStatusActionDialog` from `src/components/providers/index.ts`
- [x] T037 [US3] Add Approve button to `src/pages/ProviderDetails.tsx` for pending providers, disable/block it when `missingRequiredDocumentTypes` is non-empty, and show the missing document labels near the action area
- [x] T038 [US3] Wire approve submission from `src/pages/ProviderDetails.tsx` through `useUpdateProviderStatus` with payload `{ action: 'approve' }`
- [x] T039 [US3] Verify US3 manually using fixtures in `src/lib/providers-fixtures.ts`: successful approve shows toast and refreshed `approved` status, missing required documents prevent submission, cancel leaves state unchanged, and failed mutation keeps original state visible

**Checkpoint**: User Story 3 is independently complete for approval behavior and document gating.

---

## Phase 6: User Story 4 - Reject a Provider (Priority: P2)

**Goal**: Administrators can reject pending providers by selecting a preset reason and optionally adding notes.

**Independent Verification**: Open a pending provider, choose Reject, verify reason is required, optional notes accept up to 500 characters, cancel changes nothing, submit shows feedback, and status refreshes to rejected.

### Implementation for User Story 4

- [x] T040 [US4] Extend `ProviderStatusActionDialog` with reject mode using React Hook Form, `zodResolver(rejectProviderSchema)`, preset reason `Select`, optional notes textarea/input, validation message, and submit payload mapping in `src/components/providers/ProviderStatusActionDialog.tsx`
- [x] T041 [US4] Add Reject button to `src/pages/ProviderDetails.tsx` for pending providers only and open `ProviderStatusActionDialog` in reject mode
- [x] T042 [US4] Wire reject submission from `src/pages/ProviderDetails.tsx` through `useUpdateProviderStatus` with payload `{ action: 'reject', reason, notes? }`
- [x] T043 [US4] Verify US4 manually using fixtures in `src/lib/providers-fixtures.ts`: submit is blocked without preset reason, optional notes do not block empty submission, successful reject shows toast and refreshed `rejected` status, and invalid status hides or disables Reject

**Checkpoint**: User Story 4 is independently complete for rejection behavior.

---

## Phase 7: User Story 5 - Suspend an Active Provider (Priority: P2)

**Goal**: Administrators can suspend approved providers by selecting a preset reason and optionally adding notes, while already suspended providers show the latest suspension reason.

**Independent Verification**: Open an approved provider, choose Suspend, verify reason is required, optional notes work, cancel changes nothing, submit shows feedback, and status refreshes to suspended. Open an already suspended provider and verify latest decision details are visible.

### Implementation for User Story 5

- [x] T044 [US5] Extend `ProviderStatusActionDialog` with suspend mode using React Hook Form, `zodResolver(suspendProviderSchema)`, preset reason `Select`, optional notes textarea/input, validation message, and submit payload mapping in `src/components/providers/ProviderStatusActionDialog.tsx`
- [x] T045 [US5] Add Suspend button to `src/pages/ProviderDetails.tsx` for approved providers only and open `ProviderStatusActionDialog` in suspend mode
- [x] T046 [US5] Render latest suspended status decision reason, notes, decision date, and admin reference for suspended providers in `src/pages/ProviderDetails.tsx`
- [x] T047 [US5] Wire suspend submission from `src/pages/ProviderDetails.tsx` through `useUpdateProviderStatus` with payload `{ action: 'suspend', reason, notes? }`
- [x] T048 [US5] Verify US5 manually using fixtures in `src/lib/providers-fixtures.ts`: submit is blocked without preset reason, optional notes do not block empty submission, successful suspend shows toast and refreshed `suspended` status, and invalid status hides or disables Suspend

**Checkpoint**: User Story 5 is independently complete for suspension behavior.

---

## Phase 8: User Story 6 - Inspect Customer Reviews (Priority: P3)

**Goal**: Administrators can inspect customer feedback and rating distribution context from the Provider Details page.

**Independent Verification**: Open a provider with reviews and verify reviewer label, rating, date, and text display. Open a provider with no reviews and verify the no-reviews state. Simulate unavailable review data via fixture and verify business/document sections remain usable.

### Implementation for User Story 6

- [x] T049 [US6] Enhance `CustomerReviewsPanel` to render rating summary, review count, recent review cards, anonymized reviewer fallback, formatted dates, and rating values between 1 and 5 in `src/components/providers/CustomerReviewsPanel.tsx`
- [x] T050 [US6] Add review-unavailable and no-reviews presentation states to `CustomerReviewsPanel` without blocking the rest of `ProviderDetails` in `src/components/providers/CustomerReviewsPanel.tsx`
- [x] T051 [US6] Ensure `ProviderDetails` passes rating summary and recent reviews to `CustomerReviewsPanel` for all loaded providers in `src/pages/ProviderDetails.tsx`
- [x] T052 [US6] Verify US6 manually using fixtures in `src/lib/providers-fixtures.ts`: provider with reviews, provider with no reviews, and provider with unavailable/empty review section all render without undefined text or layout overlap

**Checkpoint**: User Story 6 is independently complete for read-only review inspection.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validate quality gates across all completed stories and remove integration rough edges.

- [x] T053 Update `src/components/providers/index.ts` so every provider component created in this task list is exported exactly once
- [x] T054 Review `src/pages/ProviderDetails.tsx` action visibility so invalid transitions from `rejected` or `suspended` to `approved`, and from `approved` to `rejected`, are hidden, disabled, or clearly blocked
- [x] T055 Verify route consistency by searching for `/service-providers` and replacing remaining user-facing provider navigation with `/providers` in `src/App.tsx`, `src/lib/dashboard-links.ts`, and `src/components/layouts/SidebarContent.tsx`
- [x] T056 Verify loading, empty, unavailable, validation, authorization, and remote failure states for provider list and details against `specs/006-service-providers/spec.md`
- [x] T057 Verify accessibility manually for provider toolbar fields, table row action, pagination buttons, status dialogs, and details action buttons in `src/pages/ProvidersManagement.tsx` and `src/pages/ProviderDetails.tsx`
- [x] T058 Verify responsive layout manually at 768px and desktop widths for `src/pages/ProvidersManagement.tsx`, `src/pages/ProviderDetails.tsx`, and all components under `src/components/providers/`
- [x] T059 Run `npm run lint` from `package.json` and fix provider-related lint errors in `src/types/providers.ts`, `src/hooks/useProviders.ts`, `src/hooks/useProviderDetails.ts`, `src/hooks/useUpdateProviderStatus.ts`, `src/pages/ProvidersManagement.tsx`, `src/pages/ProviderDetails.tsx`, and `src/components/providers/`
- [x] T060 Run `npm run build` from `package.json` and fix provider-related type/build errors in `src/types/providers.ts`, `src/hooks/`, `src/pages/`, `src/components/providers/`, `src/App.tsx`, and `src/lib/dashboard-links.ts`
- [x] T061 Validate the implementation against `specs/006-service-providers/quickstart.md` and update only stale implementation notes in `specs/006-service-providers/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 US1**: Depends on Phase 2. This is the MVP.
- **Phase 4 US2**: Depends on Phase 2 and can start after provider detail hook/fixtures exist; it integrates naturally after US1 navigation exists.
- **Phase 5 US3**: Depends on Phase 4 because approval actions live on Provider Details.
- **Phase 6 US4**: Depends on Phase 4 and can run in parallel with US3 after `ProviderStatusActionDialog` exists.
- **Phase 7 US5**: Depends on Phase 4 and can run in parallel with US3/US4 after `ProviderStatusActionDialog` exists.
- **Phase 8 US6**: Depends on Phase 4 and can run in parallel with status-action stories.
- **Phase 9 Polish**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 Browse and Filter Service Providers**: No dependency on other stories after foundation.
- **US2 Review Provider Details**: No dependency on US1 for direct route testing, but US1 provides list navigation.
- **US3 Approve a Provider**: Depends on US2 details page and foundational mutation hook.
- **US4 Reject a Provider**: Depends on US2 details page and foundational mutation hook.
- **US5 Suspend an Active Provider**: Depends on US2 details page and foundational mutation hook.
- **US6 Inspect Customer Reviews**: Depends on US2 details page.

### Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T015 and T016 can run in parallel after T008.
- T018, T019, and T020 can run in parallel after foundational exports exist.
- T027, T028, and T029 can run in parallel after provider types exist.
- US3, US4, US5, and US6 can be implemented by separate workers after US2 establishes `ProviderDetails`.
- T057 and T058 can run in parallel after feature implementation is complete.

### Parallel Execution Examples

```text
# After Phase 2, build US1 supporting components in parallel:
T018 ProvidersToolbar
T019 ProvidersPagination
T020 ProviderTableSkeleton
```

```text
# After Phase 2, build US2 detail panels in parallel:
T027 ProviderDetailsSummary
T028 VerificationDocumentsPanel
T029 CustomerReviewsPanel
```

```text
# After US2, split status workflows:
T034/T035/T037/T038 for US3 approve
T040/T041/T042 for US4 reject
T044/T045/T046/T047 for US5 suspend
T049/T050/T051 for US6 reviews
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 User Story 1.
4. Stop and validate `/providers` list/search/filter/pagination independently.

### Incremental Delivery

1. Deliver US1 for provider list visibility.
2. Add US2 for provider detail review.
3. Add US3 for approval and document gating.
4. Add US4 for rejection.
5. Add US5 for suspension.
6. Add US6 for review inspection.
7. Finish Phase 9 polish and validation.

### Notes for Cheaper Implementation Models

- Follow `src/hooks/useReports.ts`, `src/hooks/useReportDetails.ts`, and `src/pages/ReportsManagement.tsx` as the closest implementation patterns.
- Do not invent new dependencies, state libraries, or routes.
- Keep `/providers` canonical; do not leave visible navigation pointing to `/service-providers`.
- Use fixtures from `src/lib/providers-fixtures.ts` whenever the API fails, matching the current reports/users pattern.
- Treat `businessLicense`, `providerIdentity`, and `serviceEligibilityProof` as the complete approval gate.
- Reject and Suspend require a preset reason; optional notes are never required.
