# Research: Analytics & Settings

## Decisions

### Decision 1: Charting Library
- **Decision**: Use **Recharts** (already in stack per PLAN.md and Constitution).
- **Rationale**: Recharts is already listed in the project stack and Constitution. It provides composable React components for AreaChart (Reports Trends), BarChart (Help Requests by Type), and LineChart (User Growth), with built-in responsive containers, tooltips, and legends. No new dependency is introduced.
- **Alternatives considered**: Chart.js (requires imperative canvas API, less idiomatic with React); Victory (heavier bundle); Tremor charts (adds an extra UI library not in the stack).

### Decision 2: Date Range Picker
- **Decision**: Use **Shadcn `DatePickerWithRange`** pattern (built on Radix UI + `react-day-picker`, already a Shadcn pattern).
- **Rationale**: Shadcn's date range picker is built on `react-day-picker` which is installed as a Shadcn peer dependency. It integrates with the existing Tailwind/Shadcn design system with no extra runtime dependencies. The 90-day cap is enforced by setting `disabled` dates on the picker (any date more than 90 days from the current start).
- **Alternatives considered**: `react-datepicker` (inconsistent styling with Shadcn); a custom inline implementation (unnecessary effort given Shadcn already covers this).

### Decision 3: Form Validation & State (Settings)
- **Decision**: Use **React Hook Form + Zod** for Profile Settings, System Settings, and Display Preferences forms.
- **Rationale**: Mandated by the Constitution. RHF provides efficient re-render management for multi-field forms; Zod provides type-safe schema validation that produces TypeScript types directly. The unsaved-changes guard is implemented using RHF's `formState.isDirty` flag — no additional library needed.
- **Alternatives considered**: Controlled components with `useState` (excessive re-renders, no built-in dirty tracking); Formik (not in the stack).

### Decision 4: Auto-save Toggle Implementation (Notification Preferences)
- **Decision**: Each `Switch` toggle calls a dedicated `useMutation` (`useUpdateNotificationPreference`) immediately `onCheckedChange`. Optimistic update updates local React Query cache; rollback on error; Sonner `toast` shown on both success and error.
- **Rationale**: Auto-save on toggle (Q1 clarification). Using optimistic updates via React Query's `onMutate` makes the UI feel instant and resilient to transient failures. No RHF needed for a single boolean field — direct mutation is simpler and matches the spirit of the spec.
- **Alternatives considered**: Batch save with a Save button (ruled out in clarification Q1); debounced auto-save (unnecessary complexity for a boolean toggle).

### Decision 5: Unsaved Changes Guard
- **Decision**: Use **React Router v7's `useBlocker`** hook to intercept navigation when `formState.isDirty` is true; display a **Shadcn `AlertDialog`** for the "You have unsaved changes. Leave anyway?" confirmation.
- **Rationale**: React Router v7 exposes `useBlocker` natively, which fires before in-app navigation. Pairing with RHF `isDirty` requires no custom event listeners. The Shadcn `AlertDialog` satisfies the UX and accessibility (focus trap, keyboard dismiss) requirements from the spec.
- **Alternatives considered**: `window.beforeunload` only (does not work for in-app SPA navigation); a global Zustand dirty-state flag (unnecessary indirection when RHF already tracks this).

### Decision 6: KPI Delta Computation
- **Decision**: **Backend-computed**; frontend receives and displays the pre-computed delta value from `AnalyticsSnapshot`.
- **Rationale**: Q5 clarification established that deltas are always the preceding equivalent window and computed server-side. This avoids the frontend needing to make two API calls (current period + previous period) and simplifies the `AnalyticsSnapshot` shape.
- **Alternatives considered**: Frontend dual-fetch (two API calls, more network overhead, complex diff logic in the client).

### Decision 7: Mocking Strategy
- **Decision**: Build mock service functions returning `Promise<T>` with a small synthetic delay, wrapped by React Query hooks. Mock data is co-located in `services/api/*.ts` files behind a `USE_MOCK` flag or a simple export swap.
- **Rationale**: Consistent with the established pattern from Phases 4–8. Phase 10 will replace mock exports with real Axios calls without touching React Query hooks or components.
- **Alternatives considered**: MSW (overkill for a single-team admin dashboard with a clear Phase 10 migration plan).

### Decision 8: Super-Admin Permission Check
- **Decision**: Read the role from the **authenticated session/token payload** (e.g., Zustand auth store or React Context already used by prior phases). System Settings fields are rendered with `disabled` prop and a read-only notice for non-super-admins. No server-side guard is modelled in the frontend (backend enforces it on save).
- **Rationale**: Q5 clarification: super-admin status is from the token payload, not re-fetched. The Constitution says auth state should be in Zustand for global session state — this is the correct consumer pattern.
- **Alternatives considered**: Re-fetching role from an API at settings page load (unnecessary network call; creates stale-state risk).
