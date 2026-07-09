# Implementation Plan: Backend Integration, Refactoring & Final Polish

**Branch**: `011-backend-integration-polish` | **Date**: 2026-07-07 | **Spec**: [spec.md](file:///c:/iProjects/on-the-way/specs/011-backend-integration-polish/spec.md)  
**Input**: Feature specification from `specs/011-backend-integration-polish/spec.md`

## Summary

Connect the admin dashboard frontend to the live .NET backend by rewiring all React Query hooks from mock/fixture data to real Axios API calls, implementing co-located data mappers for backend response transformation, standardizing hook architecture across all domains, removing obsolete mock data and debugging artifacts, adding professional JSDoc documentation, and creating shared UI state components (error, empty, loading) for a polished production experience.

## Technical Context

**Language/Version**: TypeScript ~6.0 (strict mode)  
**Primary Dependencies**: React 19, Vite, TanStack React Query v5, React Router v7, Axios, Shadcn UI, Radix UI, Tailwind CSS v4, Zod, React Hook Form, Lucide React, Recharts, Sonner, react-leaflet  
**Storage**: N/A (consumes .NET backend via REST API)  
**Target Platform**: Web (modern browsers, responsive down to 768px)  
**Project Type**: Web application (admin dashboard SPA)  
**Performance Goals**: Route-level code splitting, no duplicate API requests, paginated lists, memoized chart/map transforms  
**Constraints**: Must pass academic code review (professional comments, no debug artifacts), no new runtime dependencies  
**Scale/Scope**: 10 hook domains, ~15 pages, 11 fixture files (7 to remove, 1 to retain, 2 service files to inline and delete)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: ✅ Plan preserves strict TypeScript with explicit API/domain types. All hooks use typed generics. Mapper functions produce typed output. JSDoc documentation added to all exports. No `any` introduced.
- **Data and State**: ✅ All server data flows through TanStack React Query custom hooks backed by the shared Axios client. No `useEffect` for data fetching. Forms remain on React Hook Form + Zod. Client state unchanged (Zustand for auth store only). API errors, loading, and empty states are explicitly rendered via shared components.
- **UX Consistency**: ✅ Shared `PageError`, `PageEmpty`, `TableSkeleton`, `CardSkeleton` components reuse Shadcn/Tailwind patterns. Responsive tables scroll horizontally below 768px. Keyboard navigation and accessibility preserved.
- **Performance**: ✅ No new bundle dependencies. Existing pagination, stale times, and refetch intervals preserved. Dashboard refetch at 5-minute intervals. List hooks use `keepPreviousData` for seamless pagination. Code splitting unaffected.

### Post-Design Re-Check

- **Code Quality**: ✅ Confirmed. Hook standardization reduces cognitive overhead. JSDoc comments improve maintainability.
- **Data and State**: ✅ Confirmed. Mock endpoints use pure-mock pattern (no API call attempted). Live endpoints propagate errors to React Query.
- **UX Consistency**: ✅ Confirmed. Shared state components ensure identical error/loading/empty visuals across all pages.
- **Performance**: ✅ Confirmed. No new dependencies added. Fixture file removal reduces bundle size.

## Project Structure

### Documentation (this feature)

```text
specs/011-backend-integration-polish/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: architecture & endpoint research
├── data-model.md        # Phase 1: entity mapping documentation
├── quickstart.md        # Phase 1: setup and convention guide
├── contracts/
│   └── api-contracts.md # Phase 1: consumed API endpoint contracts
└── tasks.md             # Phase 2: task breakdown (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── shared/
│   │   ├── PageError.tsx          # [NEW] Shared error state with retry
│   │   ├── PageEmpty.tsx          # [NEW] Shared empty state with icon
│   │   ├── TableSkeleton.tsx      # [NEW] Skeleton for table pages
│   │   ├── CardSkeleton.tsx       # [NEW] Skeleton for card layouts
│   │   ├── NotFound.tsx           # [EXISTING] 404 page
│   │   ├── PageHeader.tsx         # [EXISTING] Page title header
│   │   └── index.ts               # [MODIFY] Re-export new components
│   ├── analytics/                 # [EXISTING]
│   ├── dashboard/                 # [EXISTING]
│   ├── help-requests/             # [EXISTING]
│   ├── moderation/                # [EXISTING]
│   ├── notifications/             # [EXISTING]
│   ├── providers/                 # [EXISTING]
│   ├── reports/                   # [EXISTING]
│   ├── settings/                  # [EXISTING]
│   ├── users/                     # [EXISTING]
│   ├── layouts/                   # [EXISTING]
│   ├── auth/                      # [EXISTING]
│   └── ui/                        # [EXISTING] Shadcn primitives
├── hooks/
│   ├── users/useUsers.ts          # [MODIFY] Add data mappers, JSDoc, remove console
│   ├── reports/useReports.ts      # [MODIFY] Add data mappers, JSDoc, remove console
│   ├── providers/useProviders.ts  # [MODIFY] Add data mappers, JSDoc
│   ├── dashboard/useDashboard.ts  # [MODIFY] Remove fixture fallback, add mappers, JSDoc
│   ├── help-requests/useHelpRequests.ts # [MODIFY] Add data mappers, JSDoc
│   ├── moderation/useModeration.ts     # [MODIFY] Remove fixture fallback + console.warn, add mappers, JSDoc
│   ├── notifications/useNotifications.ts # [MODIFY] Add JSDoc, clean comments
│   ├── analytics/useAnalytics.ts  # [MODIFY] Inline mock fetch from services/api, JSDoc
│   ├── settings/useSettings.ts    # [MODIFY] Inline mock logic from services/api, JSDoc
│   └── auth/useAuth.ts            # [MODIFY] JSDoc, clean comments
├── lib/
│   ├── axios.ts                   # [MODIFY] Remove console.log on line 14
│   ├── analytics-fixtures.ts     # [RETAIN] No backend endpoint
│   ├── dashboard-links.ts        # [RETAIN] Static nav config
│   ├── utils.ts                   # [RETAIN] Utility functions
│   ├── users-fixtures.ts         # [DELETE]
│   ├── reports-fixtures.ts       # [DELETE]
│   ├── providers-fixtures.ts     # [DELETE]
│   ├── dashboard-fixtures.ts     # [DELETE]
│   ├── help-requests-fixtures.ts # [DELETE]
│   ├── moderation-fixtures.ts    # [DELETE]
│   └── notifications-fixtures.ts # [DELETE]
├── services/
│   └── api/                       # [DELETE ENTIRE DIRECTORY]
│       ├── analytics.ts           # → inlined into useAnalytics.ts
│       └── settings.ts            # → inlined into useSettings.ts
├── pages/                         # [MODIFY ALL] Integrate shared state components
├── types/                         # [NO CHANGES] Remain as source of truth
├── store/                         # [MODIFY] JSDoc, clean comments
├── providers/                     # [NO CHANGES]
├── App.tsx                        # [MODIFY] Clean comments if needed
├── main.tsx                       # [NO CHANGES]
└── index.css                      # [NO CHANGES]
```

**Structure Decision**: The existing single-project SPA structure is preserved. No new directories beyond `src/components/shared/` (which already exists). The `src/services/api/` directory is eliminated as its contents are inlined into hook files.

## Complexity Tracking

No constitution violations. No complexity tracking entries needed.
