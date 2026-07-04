# Research & Architectural Decisions: Help Requests Management

## Technical Context

The implementation of Phase 10 requires the development of a React-based admin interface for managing Help Requests. The technology stack is strictly defined by the project Constitution (TypeScript, React 19, Vite, TanStack React Query, Tailwind CSS, Shadcn UI).

## Decisions

### 1. Data Fetching and State Management
- **Decision**: Use TanStack React Query with custom hooks (`useGetHelpRequests`, `useGetHelpRequestDetails`, `useUpdateHelpRequestStatus`, `useReassignHelpRequestProvider`) backed by a mock Axios service layer.
- **Rationale**: The Constitution mandates TanStack React Query for data fetching. Phase 10 explicitly requires mock data until Phase 11. Mocking at the service layer allows the React Query hooks to remain unchanged when the real backend is connected.
- **Alternatives considered**: Mocking directly in the React Query hooks (rejected because it makes the Phase 11 transition harder).

### 2. URL-based Filter and Pagination State
- **Decision**: Store Category, Status, Search, Page, and Page Size in URL query parameters using React Router's `useSearchParams`.
- **Rationale**: Spec FR-004 requires URL encoding so views can be shared or bookmarked.
- **Alternatives considered**: Local component state (rejected due to FR-004).

### 3. Map Component Integration
- **Decision**: Reuse the existing `react-leaflet` integration from Phase 5 (Reports Management).
- **Rationale**: The spec explicitly assumes reuse of this existing component to avoid duplicate dependencies and maintain UI consistency.
- **Alternatives considered**: Introducing a new map library like `google-map-react` (rejected to minimize bundle size and respect the Constitution's mandate against unjustified new runtime dependencies).

### 4. UI Components
- **Decision**: Use standard Shadcn UI components for the Toolbar (Input, Select), Action Panel (Button, Dialog for confirmation), Reassignment (Dialog, Command/Select), and Contact User (Dialog).
- **Rationale**: Constitution Principle III requires reusing Shadcn/Radix/Tailwind patterns for consistent admin user experience.
- **Alternatives considered**: Custom built accessible primitives (rejected due to maintenance cost and inconsistency).

### 5. Transition Rules Enforcement
- **Decision**: Enforce valid status transitions in the UI by selectively disabling buttons (FR-013) and in the mock service layer by rejecting invalid transitions.
- **Rationale**: The spec mandates strict one-way transitions and terminal states.

All initial unknowns have been resolved. The architecture aligns with the On The Way Admin Dashboard Constitution.
