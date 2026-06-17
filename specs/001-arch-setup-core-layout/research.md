# Research: Architecture Setup & Core Layout

## Decisions

### 1. Test Runner Selection
- **Decision**: Initialize **Vitest** with **React Testing Library**.
- **Rationale**: Vitest is native to Vite-based projects, offers excellent performance, and shares a similar API with Jest, making it the industry standard for React/Vite development. React Testing Library is required for the Constitution's mandate on testing component behavior.
- **Alternatives considered**: Jest (requires more complex setup with Vite/TS), Playwright (excellent for E2E but Vitest is better for unit/integration hooks/components).

### 2. Axios Implementation
- **Decision**: Create a centralized Axios instance in `src/lib/axios.ts` using `VITE_API_BASE_URL` from `.env`.
- **Rationale**: Complies with the Constitution's mandate to centralize base URL, auth headers (Phase 2), and 401 handling.
- **Alternatives considered**: Fetch API (lacks interceptors out-of-box).

### 3. Sidebar Responsive Behavior
- **Decision**: Use Shadcn `Sheet` component for the Mobile Drawer.
- **Rationale**: Directly addresses the "Mobile Drawer (Sheet)" clarification from the specification.
- **Alternatives considered**: Custom CSS transitions (reinventing the wheel).

### 4. Navigation Management
- **Decision**: Static array of items in `Sidebar.tsx`.
- **Rationale**: Aligns with the "Static/Hardcoded Items" clarification for Phase 1.
- **Alternatives considered**: `routes.ts` config (deferred to future phases if complexity grows).

### 5. Notification & Profile UI
- **Decision**: Use Shadcn `DropdownMenu` for Profile and a `Popover` or `Sheet` (depending on complexity) for Notifications.
- **Rationale**: Standard admin dashboard patterns that are accessible and consistent with Shadcn UI.
- **Alternatives considered**: Custom dropdowns.

## Research Tasks

- [x] Verify Shadcn UI component availability for Layout (Sheet, DropdownMenu, Popover).
- [x] Determine best test runner for Vite/React 19.
- [x] Plan Axios interceptor structure for global error handling (Toast).
