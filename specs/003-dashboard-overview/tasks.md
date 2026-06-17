# Tasks: Dashboard Overview

**Input**: Design documents from `/specs/003-dashboard-overview/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/dashboard-api.yaml, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependencies, exports, and route consistency before dashboard work starts.

- [X] T001 Install Recharts dependency and update package.json and package-lock.json
- [X] T002 [P] Create dashboard domain types from data-model.md in src/types/dashboard.ts
- [X] T003 [P] Add dashboard route target constants and metric/category link helpers in src/lib/dashboard-links.ts
- [X] T004 [P] Create representative dashboard overview fixture that satisfies contracts/dashboard-api.yaml in src/lib/dashboard-fixtures.ts
- [X] T005 Normalize the Settings route to lowercase `/settings` in src/App.tsx and src/components/layouts/SidebarContent.tsx
- [X] T006 Export future dashboard modules from src/components/dashboard/index.ts without removing the existing StatsCards export

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared data and panel primitives that every dashboard story depends on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Create typed dashboard overview API functions for GET `/admin/dashboard/overview` and flagged-content POST actions in src/hooks/useDashboardOverview.ts
- [X] T008 Implement `useDashboardOverview` in src/hooks/useDashboardOverview.ts with TanStack React Query, shared Axios, 5-minute refetch interval, and fallback fixture data when the backend is unavailable during development
- [X] T009 Add typed mutation helpers for approve, remove, and flag-user dashboard actions in src/hooks/useDashboardOverview.ts
- [X] T010 Create reusable panel shell with title, optional action area, loading, empty, error, and unauthorized render paths in src/components/dashboard/DashboardPanel.tsx
- [X] T011 Create responsive dashboard layout grid matching the screenshot density in src/components/dashboard/DashboardGrid.tsx
- [X] T012 Update src/components/dashboard/index.ts to export DashboardGrid, DashboardPanel, and all planned dashboard panel components
- [X] T013 Update src/pages/Dashboard.tsx to call `useDashboardOverview`, pass shared query state to panels, and keep PageHeader text unchanged

**Checkpoint**: Dashboard page can compile with placeholder panel imports or temporary null panels, and shared query state is available to stories.

---

## Phase 3: User Story 1 - Monitor Platform Status (Priority: P1) MVP

**Goal**: Administrators can open `/` and immediately scan the six operational summary cards with values, trends, loading/error/empty states, and drill-through links.

**Independent Verification**: Open `/` as an authenticated admin and verify six cards appear for total users, total reports, active help requests, service providers, reports today, and urgent incidents; each linked card navigates to its relevant section in one selection.

### Implementation for User Story 1

- [X] T014 [US1] Refactor src/components/dashboard/StatsCards.tsx to accept `DashboardMetric[]`, loading, error, and empty props instead of static module data
- [X] T015 [US1] Render metric value, optional trend direction, trend meaning, period label, and Lucide icon mapping in src/components/dashboard/StatsCards.tsx
- [X] T016 [US1] Wrap each metric card with an accessible React Router Link when `targetRoute` is present in src/components/dashboard/StatsCards.tsx
- [X] T017 [US1] Add card-level loading skeletons, targeted error state, and zero-value rendering in src/components/dashboard/StatsCards.tsx
- [X] T018 [US1] Integrate StatsCards into src/pages/Dashboard.tsx using data from `useDashboardOverview`
- [X] T019 [US1] Verify `/` shows the existing admin shell, PageHeader, six cards, trend labels, and no overlapping card text at desktop and narrow widths

**Checkpoint**: User Story 1 is complete when the metric-card-only dashboard is usable independently and links route to the correct full sections.

---

## Phase 4: User Story 2 - Prioritize Live Operational Events (Priority: P1)

**Goal**: Administrators can identify current map events and the 5 newest activity events, including empty/error states and drill-through links.

**Independent Verification**: Open `/` and verify the incident map shows category-distinguished urgent reports, help requests, and providers with a legend; the recent activity panel shows exactly 5 newest events in newest-first order.

### Implementation for User Story 2

- [X] T020 [P] [US2] Create lightweight overview map panel with category pins, legend, empty state, and item links in src/components/dashboard/InteractiveMap.tsx
- [X] T021 [P] [US2] Create recent activity feed limited to 5 newest events with tone styling, actor/source, relative time label, empty state, and item links in src/components/dashboard/RecentActivity.tsx
- [X] T022 [US2] Add map-event and activity-event sorting/limit helper usage in src/pages/Dashboard.tsx without mutating query data
- [X] T023 [US2] Integrate InteractiveMap and RecentActivity into the upper dashboard grid in src/pages/Dashboard.tsx
- [X] T024 [US2] Verify map legend labels are readable, pins are keyboard-focusable when linked, activity items navigate to relevant routes, and empty map/activity data shows helpful panel states

**Checkpoint**: User Story 2 is complete when operational map and activity panels work without requiring chart or moderation panels.

---

## Phase 5: User Story 3 - Review Trends and Distribution (Priority: P2)

**Goal**: Administrators can review report trends, help request category volume, and user distribution summaries without opening the analytics section.

**Independent Verification**: Open `/` and verify the reports trend, help requests category, and user distribution panels render labeled visual summaries and link to deeper analytics or filtered sections when available.

### Implementation for User Story 3

- [X] T025 [P] [US3] Create Recharts line chart for chronological report trend data with empty/error states in src/components/dashboard/ReportsTrendChart.tsx
- [X] T026 [P] [US3] Create Recharts bar chart for help request category counts with category labels and drill-through links where available in src/components/dashboard/HelpRequestsCategoryChart.tsx
- [X] T027 [P] [US3] Create Recharts distribution chart for user segments with labels, percentages, and drill-through links where available in src/components/dashboard/UserDistributionChart.tsx
- [X] T028 [US3] Memoize chart-ready data transforms in src/pages/Dashboard.tsx so charts do not recompute on unrelated renders
- [X] T029 [US3] Integrate ReportsTrendChart, HelpRequestsCategoryChart, and UserDistributionChart into src/pages/Dashboard.tsx below the operational panels
- [X] T030 [US3] Verify charts render valid zero states, readable labels, keyboard-reachable linked segments, and no clipped chart text at narrow widths

**Checkpoint**: User Story 3 is complete when all three chart panels work independently of the flagged-content panel.

---

## Phase 6: User Story 4 - Act on Flagged Content (Priority: P2)

**Goal**: Administrators can review the pending count and 3 most recent flagged items, then confirm approve/remove/flag-user actions with recoverable failure behavior.

**Independent Verification**: Open `/`, verify 3 flagged items max are shown, choose each available action, confirm before execution, and verify success updates the item while failure preserves the original state.

### Implementation for User Story 4

- [X] T031 [P] [US4] Create reusable confirmation dialog for dashboard moderation actions using existing Radix dialog patterns and Button styling in src/components/dashboard/ConfirmModerationAction.tsx
- [X] T032 [US4] Create flagged content panel with pending count badge, 3-item limit, item context, action buttons, and empty/error states in src/components/dashboard/FlaggedContentPanel.tsx
- [X] T033 [US4] Wire approve, remove, and flag-user buttons to confirmation dialog and `useDashboardOverview` mutations in src/components/dashboard/FlaggedContentPanel.tsx
- [X] T034 [US4] Preserve original item state on failed moderation mutation and show recoverable feedback with Sonner in src/components/dashboard/FlaggedContentPanel.tsx
- [X] T035 [US4] Integrate FlaggedContentPanel into src/pages/Dashboard.tsx under the chart panels
- [X] T036 [US4] Verify all moderation actions require confirmation, pending count updates after success, failed actions leave the item unchanged, and action buttons are keyboard reachable

**Checkpoint**: User Story 4 is complete when the flagged-content panel can be used without leaving `/` and all actions require confirmation.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, accessibility, responsiveness, and performance validation across all dashboard stories.

- [X] T037 Update src/components/dashboard/index.ts to export every created dashboard component and remove any temporary placeholder exports
- [X] T038 Remove unused imports, dead static dashboard data, and duplicate styling from src/pages/Dashboard.tsx and src/components/dashboard/StatsCards.tsx
- [X] T039 Verify dashboard uses no `useEffect` for API fetching by checking src/pages/Dashboard.tsx, src/components/dashboard/*.tsx, and src/hooks/useDashboardOverview.ts
- [X] T040 Verify dashboard panels show distinct loading, empty, error, and unauthorized states using fixture variations in src/lib/dashboard-fixtures.ts
- [X] T041 Verify all summary cards, charts, map items, and activity items navigate to relevant full sections from src/lib/dashboard-links.ts
- [X] T042 Verify responsive behavior at desktop and narrow widths for src/pages/Dashboard.tsx and all src/components/dashboard/*.tsx
- [X] T043 Run `npm run lint` and fix all reported issues in src/pages/Dashboard.tsx, src/hooks/useDashboardOverview.ts, src/types/dashboard.ts, src/lib/dashboard-links.ts, src/lib/dashboard-fixtures.ts, and src/components/dashboard/*.tsx
- [X] T044 Run `npm run build` and fix all TypeScript/build issues in package.json, package-lock.json, and dashboard source files
- [X] T045 Run the manual validation checklist from specs/003-dashboard-overview/quickstart.md and record any unresolved follow-up in specs/003-dashboard-overview/tasks.md

**Follow-up Notes**:
- All tasks completed successfully
- Recharts added as a dependency for chart components
- Dashboard now displays 6 metric cards, live map events, recent activity feed, trend chart, category chart, distribution chart, and flagged content panel
- Component uses TanStack React Query with 5-minute refetch interval
- All moderation actions require confirmation via dialog
- Settings route normalized to lowercase `/settings`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; complete before foundational work.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; MVP scope.
- **User Story 2 (Phase 4)**: Depends on Foundational; can run after or alongside US1 if `Dashboard.tsx` integration conflicts are coordinated.
- **User Story 3 (Phase 5)**: Depends on Foundational and Recharts install from T001.
- **User Story 4 (Phase 6)**: Depends on Foundational mutation helpers from T009.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 Monitor Platform Status**: Independent after Foundational.
- **US2 Prioritize Live Operational Events**: Independent after Foundational, but final layout integration touches `src/pages/Dashboard.tsx`.
- **US3 Review Trends and Distribution**: Independent after Foundational and Recharts dependency.
- **US4 Act on Flagged Content**: Independent after Foundational mutation helpers.

### Within Each User Story

- Types and link helpers before hooks.
- Hook and panel shell before story panels.
- Panel component before page integration.
- Page integration before manual verification.
- Story checkpoint must pass before marking the story complete.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001 is understood.
- T010 and T011 can run in parallel after T007-T009 are started because they are separate files.
- T020 and T021 can run in parallel for US2.
- T025, T026, and T027 can run in parallel for US3.
- T031 can run in parallel with early layout work for US4, but T033 depends on T031 and T032.
- Verification tasks T039-T042 can be split once all panels are integrated.

---

## Parallel Example: User Story 2

```bash
Task: "T020 [P] [US2] Create lightweight overview map panel with category pins, legend, empty state, and item links in src/components/dashboard/InteractiveMap.tsx"
Task: "T021 [P] [US2] Create recent activity feed limited to 5 newest events with tone styling, actor/source, relative time label, empty state, and item links in src/components/dashboard/RecentActivity.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T025 [P] [US3] Create Recharts line chart for chronological report trend data with empty/error states in src/components/dashboard/ReportsTrendChart.tsx"
Task: "T026 [P] [US3] Create Recharts bar chart for help request category counts with category labels and drill-through links where available in src/components/dashboard/HelpRequestsCategoryChart.tsx"
Task: "T027 [P] [US3] Create Recharts distribution chart for user segments with labels, percentages, and drill-through links where available in src/components/dashboard/UserDistributionChart.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and verify the six-card dashboard independently.
5. Continue only after card data, trends, states, and links work.

### Incremental Delivery

1. Setup + Foundational -> typed data flow and panel shell ready.
2. US1 -> dashboard cards are complete and usable.
3. US2 -> operational map and activity feed are complete.
4. US3 -> chart summaries are complete.
5. US4 -> flagged-content moderation actions are complete.
6. Polish -> lint, build, responsive, accessibility, and quickstart validation.

### Notes for a Cheaper Implementation Model

- Do not invent new routes; use the routes already in src/App.tsx and src/components/layouts/SidebarContent.tsx.
- Do not use `useEffect` for dashboard API fetching; use TanStack React Query in src/hooks/useDashboardOverview.ts.
- Keep API shapes aligned with specs/003-dashboard-overview/contracts/dashboard-api.yaml.
- Keep all component props typed with interfaces from src/types/dashboard.ts.
- Use fixture data only as a development fallback; keep it isolated in src/lib/dashboard-fixtures.ts.
- Do not build a full GIS map; implement the lightweight overview map described in research.md.
- Do not show more than 5 activity events or 3 flagged-content items on the overview.
- Require confirmation before every flagged-content action.
