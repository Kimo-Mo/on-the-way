---

description: "Task list for Architecture Setup & Core Layout implementation"
---

# Tasks: Architecture Setup & Core Layout

**Input**: Design documents from `/specs/001-arch-setup-core-layout/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Vitest and React Testing Library are required.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize required project dependencies (axios, vitest, @testing-library/react, @testing-library/jest-dom, jsdom) in `package.json`
- [x] T002 [P] Create `.env` and `.env.example` with `VITE_API_BASE_URL` in project root
- [x] T003 Configure Vitest in `vitest.config.ts` (or update `vite.config.ts`) and add `test` script to `package.json`
- [x] T004 [P] Create `tests/setup.ts` to configure jest-dom and global test environment

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 [P] Create global Axios instance with base URL and default headers in `src/lib/axios.ts`
- [x] T006 Implement Axios response interceptor for global error handling (using sonner) in `src/lib/axios.ts`
- [x] T007 Define global TypeScript interfaces for `Notification` and `NavItem` (from data-model.md) in `src/types/index.ts`
- [x] T008 [P] Ensure `QueryProvider.tsx` is correctly configured and wraps the app in `src/main.tsx`
- [x] T009 [P] Install missing Shadcn UI components (Dropdown Menu, Sheet, Popover, Skeleton, Sonner) via `npx shadcn@latest add`

---

## Phase 3: User Story 1 - Dashboard Foundation (Priority: P1) MVP

**Goal**: Functional base layout with Sidebar and Header.

**Independent Test**: Verify Sidebar (desktop) and Header are visible; verify Sidebar is hidden behind hamburger menu on mobile.

### Tests for User Story 1

- [x] T010 [P] [US1] Integration test for `MainLayout` visibility and responsiveness in `src/components/layouts/MainLayout.test.tsx`
- [x] T011 [P] [US1] Unit test for `Sidebar` navigation items rendering in `src/components/layouts/Sidebar.test.tsx`

### Implementation for User Story 1

- [x] T012 [P] [US1] Implement `Sidebar` component with hardcoded navigation items in `src/components/layouts/Sidebar.tsx`
- [x] T013 [P] [US1] Implement `SidebarMobile` component using Shadcn `Sheet` in `src/components/layouts/Header.tsx` (Integrated)
- [x] T014 [US1] Implement `Header` component with placeholder for Notifications and Profile in `src/components/layouts/Header.tsx`
- [x] T015 [US1] Implement `MainLayout` shell combining Header, Sidebar, and Content area in `src/components/layouts/MainLayout.tsx`
- [x] T016 [US1] Verify responsive behavior: Desktop Sidebar (fixed) vs Mobile Sidebar (Sheet/Drawer)

---

## Phase 4: User Story 2 - Global Data Fetching (Priority: P2)

**Goal**: Centralized API request handling with interceptors.

**Independent Test**: Trigger a dummy API call and verify headers are attached and 401/5xx errors trigger Toasts.

### Tests for User Story 2

- [x] T017 [P] [US2] Unit test for Axios instance configuration and headers in `src/lib/axios.test.ts`
- [x] T018 [P] [US2] Integration test for Axios interceptors (error toast trigger) in `src/lib/axios.test.ts`

### Implementation for User Story 2

- [x] T019 [US2] Refine Axios interceptors to use Shadcn `Toast` for error display in `src/lib/axios.ts`
- [x] T020 [US2] Create a dummy React Query hook `useHealthCheck` to verify Axios/Query configuration in `src/hooks/useHealthCheck.ts`

---

## Phase 5: User Story 3 - Header Interactions (Priority: P3)

**Goal**: Notification and Profile dropdowns in the Header.

**Independent Test**: Click Notification/Profile icons and verify dropdowns open with expected items and Skeleton loaders for loading state.

### Tests for User Story 3

- [x] T021 [P] [US3] Integration test for `NotificationsPanel` loading states (Skeleton) and list rendering in `src/components/layouts/NotificationsPanel.test.tsx`
- [x] T022 [P] [US3] Integration test for `ProfileMenu` dropdown options in `src/components/layouts/ProfileMenu.test.tsx`

### Implementation for User Story 3

- [x] T023 [P] [US3] Implement `NotificationsPanel` with Skeleton loaders and mock data in `src/components/layouts/NotificationsPanel.tsx`
- [x] T024 [P] [US3] Implement `ProfileMenu` using Shadcn `DropdownMenu` in `src/components/layouts/ProfileMenu.tsx` (Replaces AdminUserMenu)
- [x] T025 [US3] Integrate `NotificationsPanel` and `ProfileMenu` into `Header.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T026 [P] Documentation updates for architecture in `README.md`
- [x] T027 Run accessibility checks on Sidebar and Header (keyboard navigation, ARIA labels)
- [x] T028 Run `npm run lint`, `npm run build`, and `npm test` to verify complete feature
- [x] T029 [P] Remove any debug logs or dummy health check hooks created during development

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must complete first to enable testing and base environment.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks User Stories.
- **User Stories (Phase 3-5)**: Depend on Phase 2. Can be worked on in sequence or parallel if resources allow. US1 is MVP.
- **Polish (Phase 6)**: Final phase after all stories are verified.

### Parallel Opportunities

- T002 and T004 in Setup.
- T005, T008, T009 in Foundational.
- Tests (T010, T011) and initial component implementation (T012, T013) in US1.
- All tasks marked [P] can run independently across different files.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Setup Vitest and Axios.
2. Build the basic layout shell (MainLayout, Sidebar, Header).
3. Verify it works on desktop and mobile.

### Incremental Delivery

1. Foundation: Centralized API and Global State.
2. Story 1: Layout Shell.
3. Story 2: Error Handling & Interceptors.
4. Story 3: Rich Header Interactions (Notifications/Profile).
