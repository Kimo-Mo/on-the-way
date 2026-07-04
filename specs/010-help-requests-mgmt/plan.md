# Implementation Plan: Help Requests Management

**Branch**: `010-help-requests-mgmt` | **Date**: 2026-07-01 | **Spec**: [spec.md](file:///C:/iProjects/on-the-way/specs/010-help-requests-mgmt/spec.md)
**Input**: Feature specification from `/specs/010-help-requests-mgmt/spec.md`

## Summary

The Help Requests Management feature provides administrators with a dedicated interface at `/help-requests` to view, filter, and manage incoming user assistance requests. The implementation utilizes a paginated card-based list and a comprehensive detail page integrating maps, timelines, and action workflows. Data fetching will rely on TanStack React Query hooked into a mock service layer, enforcing strict terminal status transition rules and URL-based filter states.

## Technical Context

**Language/Version**: TypeScript ~6.0 (strict mode) + React 19
**Primary Dependencies**: Vite, TanStack React Query v5, React Router v7, Axios, Shadcn UI, Radix UI, Tailwind CSS v4, Zod, React Hook Form, Lucide React, react-leaflet
**Storage**: Client-side fetching via Axios (mock service layer; .NET backend connected in Phase 11)
**Target Platform**: Web Browser (Admin Dashboard)
**Project Type**: Web Application (React SPA)
**Performance Goals**: Route render < 2s; Filter update < 500ms; Detail render < 3s
**Constraints**: Mock data only. URL-encoded filter/pagination state. Strict one-way status transitions.
**Scale/Scope**: Pagination sizes: 10/20/50. 5 major UX workflows (Browse, Detail, Reassign, Contact, Status update).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: YES - The plan preserves strict TypeScript, explicit API/domain types (in `data-model.md`), small functional components, and justified abstractions.
- **Data and State**: YES - The plan uses TanStack React Query custom hooks for server data backed by the shared Axios client, and limited client/global state (URL for view state).
- **UX Consistency**: YES - The plan reuses Shadcn/Radix/Tailwind patterns and includes accessibility behaviors for modals and pagination.
- **Performance**: YES - The plan defines measurable performance goals and addresses pagination to prevent heavy rendering on large datasets.

## Project Structure

### Documentation (this feature)

```text
specs/010-help-requests-mgmt/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── hooks/
│   └── help-requests/
│       └── useHelpRequests.ts
├── pages/
│   └── help-requests/
│       ├── HelpRequestsPage.tsx
│       └── HelpRequestDetailsPage.tsx
├── components/
│   ├── help-requests/
│       ├── HelpRequestCard.tsx
│       ├── PaginationFooter.tsx
│       ├── ActionPanel.tsx
│       ├── RequestTimeline.tsx
│       ├── ProviderCard.tsx
│       ├── UserInfoCard.tsx
│       └── LocationMap.tsx
└── lib/
    └── helpRequests-fixtures.ts
```

**Structure Decision**: The implementation follows a feature-folder structure within the `pages/` directory to encapsulate the help requests UI components, keeping global directories (`hooks/`, `services/`) organized by domain.
