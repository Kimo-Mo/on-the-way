# Research: Notification & Communications

## Decisions

### Decision 1: Form Validation & State
- **Decision**: Use `React Hook Form` combined with `Zod`.
- **Rationale**: The Constitution mandates this combination for robust client-side validation. Creating a notification involves multiple fields (Title, Message, Audience Criteria, Scheduled Time) that require strict validation (e.g., character limits, required fields, date > now) before submission.
- **Alternatives considered**: Formik, native HTML5 validation.

### Decision 2: Data Fetching and State Management
- **Decision**: Use `TanStack React Query v5` with `Axios`.
- **Rationale**: Mandated by the Constitution to prevent duplicate requests, handle loading/error states explicitly, and provide caching for the notifications list.
- **Alternatives considered**: `useEffect` with fetch, Redux Toolkit.

### Decision 3: Component Library
- **Decision**: Use `Shadcn UI` + `Tailwind CSS`.
- **Rationale**: Mandated for consistent admin UX. Provides accessible data tables, dialogs, forms, and dropdowns (for the header Notifications Panel).
- **Alternatives considered**: Material UI, Ant Design.

### Decision 4: Mocking Strategy
- **Decision**: Build mock API hooks returning Promises with synthetic delays, wrapped by React Query.
- **Rationale**: Phase 10 of the `PLAN.md` states live .NET integration will happen later. Mocking at the service layer allows easy swapping to real `Axios` calls.
