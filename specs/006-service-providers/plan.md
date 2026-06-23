# Implementation Plan: Service Providers

**Branch**: `main` | **Date**: 2026-06-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-service-providers/spec.md`

## Summary

Build the Service Providers module for the On The Way Admin Dashboard. This replaces the current service-provider stub with a canonical `/providers` list page and `/providers/:id` detail page. Administrators can browse, search, filter, and review provider businesses by category and status; inspect business details, verification documents, and customer reviews; approve eligible pending providers; reject pending providers with a preset reason plus optional notes; and suspend approved providers with a preset reason plus optional notes. Approval is blocked until business license, provider identity document, and service eligibility proof are present. Approved providers become visible and available to drivers immediately.

## Technical Context

**Language/Version**: TypeScript ~6.0 (strict mode)  
**Primary Dependencies**: React 19, Vite, TanStack React Query v5, React Router v7, Axios, Shadcn UI, Radix UI, Tailwind CSS v4, Zod, React Hook Form, Lucide React, Sonner  
**Storage**: N/A (admin read + status mutations; no browser persistence beyond URL state)  
**Target Platform**: Web browser (admin dashboard, desktop-first, 768px+)  
**Project Type**: Web application (admin dashboard)  
**Performance Goals**: Providers list interactive within 2s of navigation; search/filter results within 2s; provider detail content visible within 5s; status-action feedback within 3s; skeleton content within 200ms of page access  
**Constraints**: Server-side pagination/filtering required; no new runtime dependencies; no `useEffect` for API fetching; status action forms validated with React Hook Form + Zod; `/providers` is canonical route while existing `/service-providers` navigation must be reconciled  
**Scale/Scope**: Potentially hundreds to thousands of providers; provider reviews shown as recent summary data rather than an unbounded full review-management module

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: PASS. Plan uses strict TypeScript domain/API types (`Provider`, `ProviderDetails`, `VerificationDocument`, `CustomerReview`, `StatusDecision`, query params, mutation payloads). Components remain functional and scoped to provider list/detail workflows. No `any` types or broad casts are required.
- **Data and State**: PASS. Server data flows through React Query hooks backed by the shared Axios client. URL search params are the source of truth for provider list pagination/search/filter state. Reject/Suspend dialogs use React Hook Form + Zod validation. No `useEffect` is planned for fetching.
- **UX Consistency**: PASS. UI uses existing Shadcn/Radix/Tailwind patterns: table, toolbar filters, badges, dialogs, form controls, skeletons, alerts, empty states, and toasts. Keyboard-accessible dialogs and action controls are included.
- **Performance**: PASS. Server-side pagination/filtering prevents loading all providers. Detail page avoids duplicate requests via stable query keys and cache invalidation. Heavy review lists are bounded to recent reviews. No new dependency or bundle growth is introduced.

*Post-design re-check*: PASS. `research.md`, `data-model.md`, `contracts/api-contracts.md`, and `quickstart.md` preserve all constitution gates. No violations require justification.

## Project Structure

### Documentation (this feature)

```text
C:/iProjects/on-the-way/specs/006-service-providers/
|-- plan.md
|-- spec.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- api-contracts.md
`-- tasks.md              # generated later by /speckit-tasks
```

### Source Code (repository root)

```text
C:/iProjects/on-the-way/src/
|-- App.tsx                              (modify - add /providers and /providers/:id routes)
|-- lib/
|   |-- dashboard-links.ts               (modify - canonical provider route)
|   `-- providers-fixtures.ts            (create - typed fallback data)
|-- types/
|   |-- index.ts                         (modify - re-export provider types)
|   `-- providers.ts                     (create - provider domain/API types)
|-- hooks/
|   |-- useProviders.ts                  (create - paginated list query)
|   |-- useProviderDetails.ts            (create - detail query)
|   `-- useUpdateProviderStatus.ts       (create - approve/reject/suspend mutation)
|-- pages/
|   |-- ProvidersManagement.tsx          (create - providers list)
|   |-- ProviderDetails.tsx              (create - detail + status actions)
|   `-- index.ts                         (modify - export provider pages)
`-- components/
    `-- providers/
        |-- ProvidersToolbar.tsx         (create - search + type/status filters)
        |-- ProvidersTable.tsx           (create - categorized provider table)
        |-- ProviderStatusBadge.tsx      (create - Pending/Approved/Rejected/Suspended)
        |-- ProviderVerificationBadge.tsx(create - document readiness/verification state)
        |-- ProviderRating.tsx           (create - rating or unrated state)
        |-- ProviderDetailsSummary.tsx   (create - business/contact/operating area)
        |-- VerificationDocumentsPanel.tsx(create - documents + missing required docs)
        |-- CustomerReviewsPanel.tsx     (create - rating summary + recent reviews)
        |-- ProviderStatusActionDialog.tsx(create - approve/reject/suspend dialog)
        `-- index.ts                     (create - component exports)
```

**Structure Decision**: Single React/Vite project with feature-adjacent provider files. Provider code mirrors the existing users and reports feature layout while keeping business-specific UI under `src/components/providers/`.

## Complexity Tracking

> No constitution violations detected. Section left intentionally empty.
