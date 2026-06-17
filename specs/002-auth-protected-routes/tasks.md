# Tasks: Authentication & Protected Routes

**Input**: Design documents from `/specs/002-auth-protected-routes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React app**: `src/` at repository root
- **Feature code**: `src/components/auth/`, `src/pages/`, `src/hooks/`, `src/lib/`, `src/store/`, `src/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create feature directories: `src/components/auth`, `src/hooks`, `src/store`, `src/types`, `src/lib` (if missing)
- [x] T002 [P] Install `zustand` dependency: `npm install zustand`
- [x] T003 [P] Verify/Install `react-hook-form`, `zod`, and `lucide-react` (standard in stack)
- [x] T004 [P] Initialize Shadcn UI components if missing: `form`, `input`, `button`, `label`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Define `AdminUser` and `AuthState` interfaces in `src/types/auth.ts` based on `data-model.md` and `contracts/auth.md`
- [x] T006 [P] Create Zustand store in `src/store/auth-store.ts` using `persist` middleware to manage `token`, `user`, and `isAuthenticated`
- [x] T007 Enhance `src/lib/axios.ts` to include a response interceptor that catches 401 Unauthorized errors and calls `logout()` from the auth store
- [x] T008 [P] Implement `useAuth` custom hook in `src/hooks/useAuth.ts` to expose store state and actions
- [x] T009 [P] Implement `ProtectedRoute` component in `src/components/auth/ProtectedRoute.tsx` to redirect unauthenticated users to `/login`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Administrator Login (Priority: P1) MVP

**Goal**: Allow system administrators to securely log in using email and password.

**Independent Verification**: Access `/login`, submit valid credentials, and verify redirection to `/` with token stored in `localStorage`.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create `LoginForm` component in `src/components/auth/LoginForm.tsx` using `react-hook-form`, `zod` validation, and Shadcn UI primitives
- [x] T011 [US1] Implement `Login` page in `src/pages/Login.tsx` that uses the `LoginForm`
- [x] T012 [US1] Add `/login` route to `src/App.tsx` outside the main layout if it's meant to be a standalone page
- [x] T013 [US1] Implement `useLogin` mutation in `src/hooks/useAuth.ts` (or a separate file) to call the `/api/auth/login` endpoint and update the auth store on success
- [x] T014 [US1] Add error handling to `LoginForm` to display messages from the backend (e.g., "Invalid credentials")

**Checkpoint**: At this point, User Story 1 should be fully functional and verifiable independently

---

## Phase 4: User Story 2 - Restricted Access to Protected Routes (Priority: P1)

**Goal**: Ensure all dashboard management routes are inaccessible to unauthenticated users.

**Independent Verification**: Attempt to navigate to `/users` while logged out and verify redirect to `/login`.

### Implementation for User Story 2

- [x] T015 [US2] Update `src/App.tsx` to wrap the `MainLayout` route or its children with the `ProtectedRoute` component
- [x] T016 [US2] Verify that all sub-routes (e.g., `/users`, `/reports`) are protected and trigger a redirect if the session is missing

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Session Persistence and Automatic Logout (Priority: P2)

**Goal**: Maintain the session for 8 hours and handle token expiration/401 errors.

**Independent Verification**: Refresh page while logged in and verify state persistence. Simulate 401 response and verify redirect to `/login`.

### Implementation for User Story 3

- [x] T017 [US3] Configure Zustand `persist` middleware in `src/store/auth-store.ts` to use a 8-hour expiration logic (or verify standard persistence is sufficient)
- [x] T018 [US3] Verify that `src/lib/axios.ts` correctly attaches the `Authorization: Bearer <token>` header to all requests
- [x] T019 [US3] Test the automatic logout flow by manually clearing `localStorage` or receiving a 401 error from the API

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 [P] Update `src/components/layouts/ProfileMenu.tsx` (if it exists) to display the logged-in user's name and email
- [x] T021 [P] Implement `logout` action in the UI (e.g., in the header dropdown)
- [x] T022 Run `npm run lint` and `npm run type-check` (if available) to ensure code quality
- [x] T023 Verify responsive layout of the Login page on mobile screens
- [x] T024 Final validation using `quickstart.md` scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Depends on US1 (need a way to log in to test protection)
- **User Story 3 (P3)**: Depends on US1 (need session to test persistence)

### Parallel Opportunities

- T002, T003, T004 (Setup)
- T005, T006, T008, T009 (Foundational)
- T010, T013 (US1 parts)
- T020, T021 (Polish)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify Login works.

### Incremental Delivery

1. Foundation ready
2. Add Login (US1) -> Verify
3. Add Protection (US2) -> Verify
4. Add Persistence/401 handling (US3) -> Verify

---

## Notes

- Use `localStorage` for token storage as specified in `plan.md`.
- Ensure `Authorization` header format is `Bearer <token>`.
- Redirect route for unauthenticated access is `/login`.
