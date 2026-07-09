# Feature Specification: Backend Integration, Refactoring & Final Polish

**Feature Branch**: `011-backend-integration-polish`  
**Created**: 2026-07-07  
**Status**: Draft  
**Input**: User description: "Phase 11: Backend Integration, Refactoring & Final Polish from PLAN.md"

## Clarifications

### Session 2026-07-07

- Q: Where should dedicated data mapper functions (e.g., `mapBackendUser → FrontendUser`) be defined? → A: Co-located in each hook file alongside the fetch function (Option A), matching the dominant pattern established by Users/Reports/Providers hooks.
- Q: What fallback strategy should be standard for hooks connecting to confirmed live endpoints? → A: Live-endpoint hooks let errors propagate to React Query error state (no silent fallback); only backend-unavailable hooks (Analytics, some Settings) use silent fixture fallback (Option B).
- Q: Should `console.warn` statements used for API-fallback diagnostics be retained or removed? → A: Remove all `console.warn` statements. Code comments document mock status instead (Option A).
- Q: Should UX error/empty/loading states be shared reusable components or inline per page? → A: Create shared reusable components (`PageError`, `PageEmpty`, `TableSkeleton`, `CardSkeleton`) used by all pages (Option A).

## User Scenarios *(mandatory)*

### User Story 1 - Admin Views Live Data from Backend (Priority: P1)

An administrator logs into the dashboard and sees real-time data fetched from the live .NET backend instead of hardcoded mock data. All tables, cards, charts, and detail views display actual production data. The transition from mock to live is seamless — the UI layout, column order, and formatting remain identical to what the admin is already accustomed to.

**Why this priority**: Without live backend connectivity, the entire dashboard is non-functional for production use. This is the foundational requirement that unlocks real-world value for every other feature.

**Acceptance Scenarios**:

1. **Given** the backend is running and accessible, **When** the admin navigates to any list page (Users, Reports, Providers, Help Requests, Moderation, Notifications), **Then** the data displayed is fetched from the live API and matches what the backend returns.
2. **Given** the backend returns data in a structure or naming convention different from the frontend types (e.g., PascalCase keys, mismatched field names), **When** the data is received, **Then** it is transparently transformed into the existing frontend TypeScript interfaces without any UI changes.
3. **Given** a backend endpoint is unavailable or not yet implemented, **When** the admin navigates to the affected page, **Then** the system falls back to retained mock data gracefully, without errors or blank screens.

---

### User Story 2 - Codebase Passes Academic Code Review (Priority: P1)

A supervising professor reviews the project source code and finds professional, well-documented code with no AI-generated conversational comments, no commented-out dead code, and no leftover debugging statements. Every complex function, custom hook, and API interaction has clear, descriptive comments explaining the business logic.

**Why this priority**: This is a graduation project requirement. Code quality and professional commenting directly impact the academic evaluation. Equally critical as live data because the project must be presentable for review.

**Acceptance Scenarios**:

1. **Given** the codebase has been scrubbed, **When** a reviewer searches for patterns like `console.log`, `console.warn`, `// I fixed`, `// Here is the`, `// TODO`, or blocks of commented-out code, **Then** zero results are found.
2. **Given** a custom React Query hook file, **When** a reviewer reads it, **Then** each exported hook and fetch function has a JSDoc-style comment explaining what data it fetches, what parameters it accepts, and any data transformation it performs.
3. **Given** a complex component or utility function, **When** a reviewer reads it, **Then** inline comments explain the *what* and *why* of non-obvious business logic decisions (not the *how* of trivial code).

---

### User Story 3 - Hooks Architecture Is Consistent Across All Modules (Priority: P2)

A developer opening any hook file in `src/hooks/` finds a consistent, predictable structure: the same import patterns, the same query key conventions, the same error handling approach, and the same loading/stale time configurations. No hook is a "special case" that uses a different service-layer abstraction or skips standard patterns.

**Why this priority**: Architectural consistency is essential for maintainability and for demonstrating software engineering best practices during academic review. It directly supports Story 2 (code review readiness).

**Acceptance Scenarios**:

1. **Given** the Analytics hooks currently delegate to a separate `services/api/analytics.ts` service layer, **When** they are refactored, **Then** they follow the same direct Axios pattern used by Users, Reports, and Providers hooks (fetch function + query key + hook in a single file).
2. **Given** the Settings hooks currently delegate to a separate `services/api/settings.ts` service layer for mocked endpoints, **When** they are refactored, **Then** mock-backed endpoints use the same inline pattern and real-API-backed endpoints call Axios directly — matching the standard hook structure.
3. **Given** any two hook files chosen at random, **When** their structures are compared, **Then** they share the same organizational pattern: imports → fetch function(s) → query key constant(s) → query hook(s) → mutation hook(s).

---

### User Story 4 - Mock Data Is Cleaned Up Without Breaking Unmapped Features (Priority: P2)

After backend integration is complete, the `src/lib/` directory no longer contains fixture files for features that are successfully connected to the live API. However, any feature whose backend endpoint does not yet exist retains its mock data so the UI continues to function.

**Why this priority**: Removing obsolete mocks reduces codebase noise and proves that the app runs against real data. Retaining mocks for unimplemented endpoints prevents regressions.

**Acceptance Scenarios**:

1. **Given** the Users, Reports, Providers, Dashboard, Help Requests, Moderation, and Notifications modules are connected to live endpoints, **When** their corresponding fixture files are reviewed, **Then** the fixture files have been removed from the codebase.
2. **Given** the Settings module has endpoints that are not yet implemented in the backend (Notification Preferences, System Settings, Display Preferences), **When** the settings hooks are reviewed, **Then** those specific hooks still use in-memory mock data and the settings page functions normally.
3. **Given** the Analytics module has no backend endpoint in the swagger spec, **When** the analytics page is accessed, **Then** it still renders with mock/fixture data until a backend endpoint is provided.

---

### User Story 5 - Admin Experiences Polished Error, Loading & Empty States (Priority: P3)

An administrator encounters a network error, a slow API response, or a page with no data and sees polished, informative UI states instead of blank screens, frozen interfaces, or raw error messages. The experience feels complete and production-ready.

**Why this priority**: UX polish is the final layer that transforms a functional application into a professional product. It demonstrates attention to detail during academic evaluation.

**Acceptance Scenarios**:

1. **Given** the backend returns a 500 error on any list page, **When** the error occurs, **Then** the admin sees a user-friendly error message with an option to retry, not a blank screen or raw error text.
2. **Given** data is being fetched from the backend, **When** the request is in-flight, **Then** the admin sees skeleton placeholders or a loading spinner appropriate to the content type (table skeleton for tables, card skeleton for cards).
3. **Given** a list endpoint returns zero items, **When** the page renders, **Then** the admin sees a descriptive empty state illustration or message (e.g., "No reports found") with context-appropriate guidance.
4. **Given** the admin is viewing the dashboard on a tablet-sized screen, **When** the layout renders, **Then** tables scroll horizontally, cards stack vertically, and no content is clipped or overflowing.

---

### Edge Cases

- What happens when the backend returns a 401 during an active session? The Axios interceptor should trigger a forced logout and redirect to the login page.
- What happens when a backend response contains unexpected/extra fields not in the frontend interface? The data mapper should ignore unknown fields without throwing errors.
- What happens when the backend returns paginated data but the frontend expects a flat array (or vice versa)? The normalization layer in the fetch function should handle both response shapes.
- What happens when multiple API calls fail simultaneously (e.g., dashboard stats, recent activity, map data)? Each widget should show its own independent error state rather than crashing the entire page.
- What happens if the backend changes its enum values or status codes? The data mapper should have a fallback for unknown enum values rather than rendering `undefined`.
- What loading, empty, validation, authorization, and remote API failure states must be visible to admins? Every list page, detail page, and dashboard widget must have explicit loading, empty, and error states. Form submissions must show validation errors inline. 401 errors trigger automatic logout.
- What responsive or accessibility constraints could block task completion? Tables must be horizontally scrollable on viewports below 768px. All interactive elements must be keyboard-navigable. Color contrast must meet WCAG AA.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST connect all React Query hooks to the live .NET backend endpoints as documented in the swagger.json specification.
- **FR-002**: System MUST implement data transformation layers as mapper functions co-located within each hook file (alongside the fetch function) to map backend response structures (PascalCase, mismatched field names, different enum representations) into existing frontend TypeScript interfaces. Mappers MUST NOT be placed in a shared utility file or in the types directory.
- **FR-003**: System MUST gracefully fall back to mock data ONLY for endpoints confirmed as not yet implemented by the backend (Analytics, Notification Preferences, System Settings, Display Preferences). For all confirmed live endpoints, errors MUST propagate to React Query's error state so the admin sees a proper error message with retry capability. Silent fallback to fixtures MUST NOT be used for live endpoints.
- **FR-004**: System MUST remove all mock/fixture data files from `src/lib/` for features that are fully connected to live API endpoints.
- **FR-005**: System MUST retain mock data exclusively for features whose backend endpoints are confirmed as not yet available.
- **FR-006**: System MUST standardize all hook files in `src/hooks/` to follow a single consistent architectural pattern: direct Axios calls within fetch functions, exported query key constants, and React Query hooks — all in a single file per domain.
- **FR-007**: System MUST refactor the Analytics hooks to eliminate the separate `services/api/analytics.ts` service layer and bring the fetch logic inline, matching the standard pattern.
- **FR-008**: System MUST refactor the Settings hooks to eliminate the separate `services/api/settings.ts` service layer, moving real-API calls inline and keeping mock implementations self-contained within the hook file.
- **FR-009**: System MUST remove all AI-generated conversational comments, commented-out dead code blocks, debugging `console.log` statements, and all `console.warn` statements from the entire codebase. Mock status for backend-unavailable endpoints MUST be documented via code comments only, not console output.
- **FR-010**: System MUST add professional JSDoc-style comments to all exported custom hooks and fetch functions, describing their purpose, parameters, return values, and any data transformations.
- **FR-011**: System MUST add inline comments to complex business logic explaining the *what* and *why* of non-obvious decisions.
- **FR-012**: System MUST provide shared reusable skeleton components (`TableSkeleton`, `CardSkeleton`) and use them during data fetching on all list pages, detail pages, and dashboard widgets. These components MUST live in a shared directory (e.g., `src/components/shared/`) and be imported by each page.
- **FR-013**: System MUST provide a shared `PageError` component that displays a user-friendly error message with a retry button when API calls fail (400/500 status codes). All pages MUST use this component for error states.
- **FR-014**: System MUST provide a shared `PageEmpty` component that displays a descriptive empty-state message when list endpoints return zero items. All pages MUST use this component with context-appropriate text and optional icon.
- **FR-015**: System MUST ensure responsive behavior: tables horizontally scrollable on small viewports, cards stacking vertically, no content clipping.
- **FR-016**: System MUST remove the `console.log` statement in the Axios request interceptor (`src/lib/axios.ts` line 14).
- **FR-017**: System MUST ensure the `services/api/` directory is removed entirely once its contents have been inlined into the respective hook files, leaving no orphaned service layer.
- **FR-018**: System MUST remove the Dashboard hook's silent try/catch fixture fallback pattern once the `/admin/dashboard` endpoint is confirmed live, converting it to the standard direct Axios call that lets errors propagate to React Query.

### Key Entities

- **Data Mapper**: A transformation function defined in the same hook file as the fetch function that consumes it (e.g., `mapUserResponse()` in `useUsers.ts`). It converts backend response shapes and naming conventions into the frontend's established TypeScript interfaces, acting as a co-located anti-corruption layer between the API contract and the UI contract.
- **Hook Module**: A single file per domain (e.g., `useUsers.ts`, `useReports.ts`) that encapsulates all data-fetching logic, query keys, query hooks, and mutation hooks for that domain. It is the only file a component imports for data access.
- **Fixture File**: A TypeScript file in `src/lib/` containing hardcoded mock data used during development. These files are removed once the corresponding live API connection is established.
- **Shared UI State Components**: A set of reusable components (`PageError`, `PageEmpty`, `TableSkeleton`, `CardSkeleton`) that provide consistent loading, error, and empty-state experiences across all pages. They live in a shared components directory and accept props for context-specific messaging.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of list pages (Users, Reports, Providers, Help Requests, Moderation, Notifications) display data from the live backend when the backend is running.
- **SC-002**: All data displayed in the UI matches the backend response after transformation, with zero field-mapping mismatches visible to the admin.
- **SC-003**: Zero fixture files remain in `src/lib/` for features connected to live endpoints; only fixture files for backend-unavailable features are retained.
- **SC-004**: Every hook file in `src/hooks/` follows an identical structural pattern, verifiable by comparing any two files side-by-side.
- **SC-005**: A text search for `console.log`, `console.warn`, `// I fixed`, `// Here is`, `// TODO`, and blocks of `// ` commented-out code returns zero matches across the codebase (excluding node_modules).
- **SC-006**: 100% of exported hooks and fetch functions have JSDoc comments with `@param` and `@returns` documentation.
- **SC-007**: Every list page displays a loading skeleton, an error state with retry, and an empty state — verified by testing each state.
- **SC-008**: All pages render without horizontal overflow or content clipping on viewports as narrow as 768px.
- **SC-009**: The admin can complete any primary workflow (view list → view details → perform action) within the existing time expectations after backend integration, with no degradation from the mock-data experience.

## Assumptions

- The .NET backend is deployed and accessible at the URL configured in `VITE_API_BASE_URL` environment variable.
- A `swagger.json` or Postman collection is available documenting the exact request/response schemas for all implemented endpoints.
- The existing Axios instance configuration (base URL, auth interceptor, 401 handling) is correct and functional for communicating with the backend.
- Backend endpoints for Analytics, Notification Preferences, System Settings, and Display Preferences are NOT yet implemented and will retain mock data.
- The existing frontend TypeScript interfaces represent the desired data shape; the backend data will be transformed to match these interfaces, not the other way around.
- The project is a graduation/academic project, so code comments must meet a professional academic standard suitable for professor review.
- The existing React Query cache and stale-time configurations are appropriate for production use and do not need significant tuning.
- Authentication (login, token storage, token refresh) is already functional from Phase 2 and does not require changes in this phase.
