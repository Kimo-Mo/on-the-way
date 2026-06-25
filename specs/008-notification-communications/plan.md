# Implementation Plan: Notification & Communications

**Branch**: `[008-notification-communications]` | **Date**: 2026-06-25 | **Spec**: [spec.md](file:///c:/iProjects/on-the-way/specs/008-notification-communications/spec.md)
**Input**: Feature specification from `/specs/008-notification-communications/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

This feature implements the Notification & Communications module for the Admin Dashboard. It allows administrators to view, create, draft, schedule, and publish notifications (Push and In-app alerts) to specific target audiences. It also integrates a Notifications Panel in the global header for administrative alerts.

## Technical Context

**Language/Version**: TypeScript ~6.0 (strict mode)  
**Primary Dependencies**: React 19, Vite, TanStack React Query v5, React Router v7, Axios, Shadcn UI, React Hook Form, Zod  
**Storage**: Client-side fetching via Axios (connecting to .NET backend eventually, currently mock)  
**Target Platform**: Web browsers (Admin Dashboard)
**Project Type**: Web Application  
**Performance Goals**: < 1s load for 50 items, < 2m to publish  
**Constraints**: Must follow Constitution (TanStack Query for data, Shadcn for UI)  
**Scale/Scope**: Admin side for managing potentially thousands of notifications

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: Does the plan preserve strict TypeScript, explicit API/domain
  types, small functional components, and justified abstractions?
- **Data and State**: Does the plan use TanStack React Query custom hooks for server
  data, the shared Axios client for API access, React Hook Form + Zod for submitted
  forms, and limited client/global state?
- **UX Consistency**: Does the plan reuse Shadcn/Radix/Tailwind patterns, include
  accessibility behavior, and preserve responsive admin workflows?
- **Performance**: Does the plan define measurable performance goals and address
  pagination/virtualization, duplicate requests, heavy maps/charts/tables, and
  bundle impact?

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── notifications/
│   │   │   ├── NotificationList.tsx
│   │   │   ├── CreateNotificationForm.tsx
│   │   │   └── NotificationsPanel.tsx
│   ├── pages/
│   │   ├── notifications/
│   │   │   ├── index.tsx
│   ├── services/
│   │   └── api/
│   │       └── notifications.ts
│   └── types/
│       └── notification.ts
```

**Structure Decision**: The feature is integrated into the existing `frontend/src/` structure, separating concerns into `components`, `pages`, `services/api`, and `types`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
