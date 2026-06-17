---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React app**: `src/` at repository root
- **Feature code**: `src/features/[feature]/`, `src/pages/`, `src/components/`, `src/hooks/`, `src/lib/`
- Paths shown below are examples; adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  - Constitution gates for code quality, data/state, UX, and performance

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Verified independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize required project dependencies
- [ ] T003 [P] Configure linting, formatting, and type checking if missing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup shared Axios client with base URL, auth header handling, and 401 handling
- [ ] T005 [P] Implement authentication/session state management
- [ ] T006 [P] Setup route guards and routing structure
- [ ] T007 Create shared domain/API types that all stories depend on
- [ ] T008 Configure error, loading, empty, and unauthorized UI patterns

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) MVP

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to verify this story works on its own]

### Implementation for User Story 1

- [ ] T009 [P] [US1] Define [Entity1] TypeScript type/schema in src/[location]/[entity1].ts
- [ ] T010 [P] [US1] Define [Entity2] TypeScript type/schema in src/[location]/[entity2].ts
- [ ] T011 [US1] Implement React Query hook/service in src/[location]/[hook].ts
- [ ] T012 [US1] Implement page or component in src/[location]/[file].tsx
- [ ] T013 [US1] Add form validation, error handling, and empty states
- [ ] T014 [US1] Verify accessible names, keyboard behavior, focus states, and responsive layout
- [ ] T015 [US1] Verify performance budget for [table/map/chart/form interaction]

**Checkpoint**: At this point, User Story 1 should be fully functional and verifiable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to verify this story works on its own]

### Implementation for User Story 2

- [ ] T016 [P] [US2] Define [Entity] TypeScript type/schema in src/[location]/[entity].ts
- [ ] T017 [US2] Implement React Query hook/service in src/[location]/[hook].ts
- [ ] T018 [US2] Implement page or component in src/[location]/[file].tsx
- [ ] T019 [US2] Integrate with User Story 1 components if needed
- [ ] T020 [US2] Verify accessible names, keyboard behavior, focus states, and responsive layout
- [ ] T021 [US2] Verify performance budget for [table/map/chart/form interaction]

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to verify this story works on its own]

### Implementation for User Story 3

- [ ] T022 [P] [US3] Define [Entity] TypeScript type/schema in src/[location]/[entity].ts
- [ ] T023 [US3] Implement React Query hook/service in src/[location]/[hook].ts
- [ ] T024 [US3] Implement page or component in src/[location]/[file].tsx
- [ ] T025 [US3] Verify accessible names, keyboard behavior, focus states, and responsive layout
- [ ] T026 [US3] Verify performance budget for [table/map/chart/form interaction]

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX Security hardening
- [ ] TXXX Run accessibility and responsive layout verification
- [ ] TXXX Run lint and build commands
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel if staffed
  - Or sequentially in priority order (P1 -> P2 -> P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently verifiable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently verifiable

### Within Each User Story

- Types and validation schemas before services/hooks
- Services/hooks before pages/components
- Core implementation before integration
- Accessibility, responsive, and performance verification before story completion
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel within Phase 2
- Once Foundational phase completes, all user stories can start in parallel if team capacity allows
- Types and schemas within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Verify independently -> Deploy/Demo (MVP)
3. Add User Story 2 -> Verify independently -> Deploy/Demo
4. Add User Story 3 -> Verify independently -> Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and verifiable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
