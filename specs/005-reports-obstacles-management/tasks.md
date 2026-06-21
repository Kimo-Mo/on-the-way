# Tasks: Reports & Obstacles Management

**Input**: Design documents from `/specs/005-reports-obstacles-management/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story. These tasks are written with high granularity and exact file paths to ensure a seamless implementation by an LLM assistant.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create `src/types/reports.ts` containing all domain types (`ObstacleType`, `ReportStatus`, `RemovalReason`, `ReportSubmitter`, `CommunityVotes`, `GpsCoordinates`, `Report`, `ReportDetails`, `ReportsQueryParams`, `RemoveReportPayload`, `removeReportSchema`, and `RemoveReportFormValues`) per `data-model.md`.
- [X] T002 [P] Modify `src/types/index.ts` to export all types from `./reports`.
- [X] T003 [P] Create `src/lib/reports-fixtures.ts` and define `reportsListFixture` (at least 12 mock reports) and `reportDetailsFixtures` matching `api-contracts.md` and `quickstart.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Implement `src/hooks/useReports.ts` using `useQuery` (key: `['reports', params]`), `fetchReports` logic with fixture fallback, and `placeholderData: keepPreviousData` per `quickstart.md`.
- [X] T005 [P] Implement `src/hooks/useReportDetails.ts` using `useQuery` (key: `['reports', id]`) and `fetchReportDetails` logic with fixture fallback.
- [X] T006 Update `src/App.tsx` to add `<Route path="/reports" element={<ReportsManagement />} />` and `<Route path="/reports/:id" element={<ReportDetails />} />` inside the `<ProtectedRoute>`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse and Filter Incident Reports (Priority: P1)

**Goal**: Admins can see a paginated, searchable, and filterable list of reports rendered as cards.

**Independent Verification**: Navigate to `/reports` and verify cards render, search/filter works, and pagination functions.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create `src/components/reports/ReportStatusBadge.tsx` that renders a `Badge` colored according to the `ReportStatus` (e.g. red for urgent, orange for pending, green for approved).
- [X] T008 [P] [US1] Create `src/components/reports/ObstacleTypeBadge.tsx` that maps `ObstacleType` to a human-readable string and renders a `Badge` (e.g. blue outline).
- [X] T009 [P] [US1] Create `src/components/reports/ReportCardSkeleton.tsx` returning a `Card` structure with `Skeleton` elements matching the report card layout.
- [X] T010 [P] [US1] Create `src/components/reports/ReportsPagination.tsx` implementing a Previous/Next button footer that updates the `page` query parameter.
- [X] T011 [US1] Create `src/components/reports/ReportCard.tsx` that takes a `Report` prop and renders a `Card` displaying the title, badges, location, date, upvotes/downvotes, and a "View" button that calls an `onViewDetails` callback.
- [X] T012 [P] [US1] Create `src/components/reports/ReportsToolbar.tsx` containing a text `Input` for search, and two `Select` components for `ObstacleType` and `ReportStatus` filters. Include a "Clear Filters" button.
- [X] T013 [US1] Implement `src/pages/ReportsManagement.tsx` combining `useReports`, `PageHeader`, `ReportsToolbar`, a responsive CSS grid of `ReportCard` or `ReportCardSkeleton` elements, and `ReportsPagination`. Use `useSearchParams` for state.
- [X] T014 [US1] Export `ReportsManagement` from `src/pages/index.ts`.

**Checkpoint**: At this point, User Story 1 should be fully functional and verifiable independently

---

## Phase 4: User Story 2 - View Full Report Details (Priority: P1)

**Goal**: Admins can view full report context, including images, a map, and submitter info.

**Independent Verification**: Click "View" on a report card and verify the details page renders all data correctly.

### Implementation for User Story 2

- [X] T015 [P] [US2] Create `src/components/reports/ReportImageGallery.tsx` that takes an array of `imageUrls`. If empty, show a placeholder; otherwise, map over the array and render images.
- [X] T016 [P] [US2] Create `src/components/reports/ReportMap.tsx` using `react-leaflet`. It must take `gpsCoordinates` and `location` string. Render map only if coordinates exist; otherwise render a placeholder.
- [X] T017 [P] [US2] Create `src/components/reports/ReportMetaSidebar.tsx` that takes `submitter`, `gpsCoordinates`, and `votes`. Render the submitter as a Link or as "Deleted User" based on `submitter.isDeleted`.
- [X] T018 [US2] Implement `src/pages/ReportDetails.tsx` combining `useReportDetails`, `PageHeader`, `ReportImageGallery`, `ReportMap`, and `ReportMetaSidebar` in a two-column layout. (Do not implement action buttons yet).
- [X] T019 [US2] Export `ReportDetails` from `src/pages/index.ts`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Approve a Report (Priority: P2)

**Goal**: Admins can approve pending reports.

**Independent Verification**: Click "Approve Report" and verify the status changes to approved.

### Implementation for User Story 3

- [X] T020 [P] [US3] Create `src/hooks/useApproveReport.ts` using `useMutation` to hit `POST /admin/reports/:id/approve`. Show a toast on success and invalidate the `['reports']` query cache.
- [X] T021 [US3] Add an "Approve Report" `Button` to `src/pages/ReportDetails.tsx`. Wire it up to `useApproveReport` and disable it if the status is already approved/removed.

---

## Phase 6: User Story 4 - Mark a Report as Urgent (Priority: P2)

**Goal**: Admins can escalate report priority.

**Independent Verification**: Click "Mark as Urgent" and verify the priority updates.

### Implementation for User Story 4

- [X] T022 [P] [US4] Create `src/hooks/useMarkUrgent.ts` using `useMutation` to hit `POST /admin/reports/:id/mark-urgent`. Show a toast and invalidate cache on success.
- [X] T023 [US4] Add a "Mark as Urgent" `Button` to `src/pages/ReportDetails.tsx`. Wire it up to `useMarkUrgent` and disable it if the status is already urgent/removed.

---

## Phase 7: User Story 5 - Remove a Report (Priority: P2)

**Goal**: Admins can remove reports by providing a mandatory reason.

**Independent Verification**: Click "Remove Report", select a reason, confirm, and verify removal.

### Implementation for User Story 5

- [X] T024 [P] [US5] Create `src/hooks/useRemoveReport.ts` using `useMutation` to hit `DELETE /admin/reports/:id` with `RemoveReportPayload`. Show a toast and invalidate cache on success.
- [X] T025 [P] [US5] Create `src/components/reports/RemoveReportDialog.tsx` implementing a `Dialog` with a React Hook Form using `removeReportSchema`. Include a `Select` dropdown for the `reason`.
- [X] T026 [US5] Integrate `RemoveReportDialog` into `src/pages/ReportDetails.tsx` and wire it to the "Remove Report" button and `useRemoveReport` hook.

---

## Phase 8: User Story 6 - Flag the Submitting User (Priority: P3)

**Goal**: Admins can flag abusive users directly from the report details.

**Independent Verification**: Click "Flag User", confirm, and verify success toast.

### Implementation for User Story 6

- [X] T027 [P] [US6] Create `src/hooks/useFlagUser.ts` using `useMutation` to hit `POST /admin/reports/:id/flag-user`. Show a toast on success.
- [X] T028 [P] [US6] Create `src/components/reports/FlagUserDialog.tsx` implementing a simple confirmation dialog.
- [X] T029 [US6] Integrate `FlagUserDialog` into `src/pages/ReportDetails.tsx` and wire it to the "Flag User" button.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T030 Verify accessible labels on all buttons, ensure keyboard navigation works, and verify mobile responsiveness of the card grid.
- [X] T031 Run `npm run lint` and `npm run build` to ensure no strict mode or build errors.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion. Story 1 and Story 2 can be worked on in parallel. Stories 3-6 depend on Story 2 being complete.
- **Polish (Phase 9)**: Depends on all user stories being complete.

### Implementation Strategy

For a cheaper LLM, the recommended strategy is to process this file exactly in order from T001 to T031, strictly adhering to the file paths and dependencies. Do not attempt to merge user stories. Build them incrementally.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and verifiable
- All `useQuery` and `useMutation` implementations must follow the mock-to-live bridge pattern outlined in `quickstart.md`.
