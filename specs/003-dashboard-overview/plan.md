# Implementation Plan: Dashboard Overview

**Branch**: `master` | **Date**: 2026-06-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-dashboard-overview/spec.md`

## Summary

Build the authenticated `/` dashboard overview so administrators can scan platform
status, live operational events, trends, user distribution, and pending moderation
work from one screen. The implementation will replace static summary-card data with
a typed dashboard data hook, add the map/activity/chart/moderation panels shown in
the target screenshot, refresh overview data every 5 minutes, and make summary cards,
charts, map items, and activity items link to the relevant full management sections.

## Technical Context

**Language/Version**: TypeScript 6.0.2, React 19.2.6, Vite 8.0.12  
**Primary Dependencies**: React Router 7.17.0, TanStack React Query 5.101.0, Axios 1.17.0, Tailwind CSS 4.3.0, Radix UI/Shadcn components, Lucide React 1.18.0, Sonner 2.0.7, Recharts for dashboard charts  
**Storage**: No new client persistence; dashboard data comes from backend or representative development data through the shared Axios/React Query layer  
**Target Platform**: Authenticated browser-based admin dashboard  
**Project Type**: Single React/Vite web application  
**Performance Goals**: Initial dashboard content or targeted panel state visible
within 3 seconds under normal conditions; linked panel navigation in one selection;
5-minute background refresh without blocking UI interactions  
**Constraints**: Strict TypeScript types for dashboard data; no `useEffect` API
fetching; use shared Axios client and React Query custom hook; all moderation actions
require confirmation; overview shows 5 activity events and 3 flagged items; preserve
existing admin shell and responsive layout  
**Scale/Scope**: One route (`/`) with six metric cards, incident map panel, 5-item
activity feed, reports trend chart, help-request category chart, user distribution
summary, and 3-item flagged-content panel

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: PASS. Plan adds explicit dashboard domain types, keeps panel
  components small, and scopes shared logic to a dashboard data hook plus focused
  helpers.
- **Data and State**: PASS. Server data is read through TanStack React Query and the
  shared Axios client. No dashboard API fetching will use `useEffect`; local state is
  limited to confirmation dialog/UI state.
- **UX Consistency**: PASS. Plan uses the existing admin shell, Tailwind utilities,
  Shadcn/Radix-style controls, Lucide icons, keyboard-accessible links/actions, and
  explicit loading/empty/error states.
- **Performance**: PASS. Plan defines visible-state timing, 5-minute refresh,
  bounded item counts, lightweight map rendering for overview triage, and memoized
  chart-ready transforms.

## Project Structure

### Documentation (this feature)

```text
specs/003-dashboard-overview/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardGrid.tsx
│   │   ├── DashboardPanel.tsx
│   │   ├── StatsCards.tsx
│   │   ├── InteractiveMap.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── ReportsTrendChart.tsx
│   │   ├── HelpRequestsCategoryChart.tsx
│   │   ├── UserDistributionChart.tsx
│   │   ├── FlaggedContentPanel.tsx
│   │   └── index.ts
│   └── ui/
├── hooks/
│   └── useDashboardOverview.ts
├── lib/
│   ├── axios.ts
│   └── dashboard-links.ts
├── pages/
│   └── Dashboard.tsx
└── types/
    └── dashboard.ts
```

**Structure Decision**: Keep the feature in the existing single React app. Dashboard
UI components stay under `src/components/dashboard/`, the route remains
`src/pages/Dashboard.tsx`, server-state access lives in `src/hooks/`, route-link
mapping lives in `src/lib/`, and dashboard contracts/types live in `src/types/`.

## Complexity Tracking

No constitution violations or complexity exceptions are required.

## Phase 0: Research Summary

Completed in [research.md](./research.md). Key decisions:

- Use one dashboard overview query with typed panel payloads and a 5-minute refetch
  interval.
- Render the map as a lightweight overview panel for triage, deferring full GIS
  behavior to later dedicated map/report features.
- Keep dashboard drill-through behavior as links to dedicated management routes.
- Use bounded overview lists to protect scanability and performance.
- Use Recharts for dashboard chart panels, adding the dependency if it is not
  already present in `package.json`.

## Phase 1: Design Summary

Design artifacts produced:

- [data-model.md](./data-model.md): dashboard entities, fields, validation rules,
  and moderation state transitions.
- [contracts/dashboard-api.yaml](./contracts/dashboard-api.yaml): frontend/backend
  data contract for overview loading and moderation actions.
- [quickstart.md](./quickstart.md): implementation and validation workflow.

## Post-Design Constitution Check

- **Code Quality**: PASS. Data model and API contract define explicit TypeScript
  shapes and panel ownership boundaries.
- **Data and State**: PASS. Contract supports one overview query plus focused
  moderation mutations through shared Axios/React Query.
- **UX Consistency**: PASS. Design requires the existing shell, bounded overview
  panels, confirmation before moderation actions, accessible controls, and responsive
  content.
- **Performance**: PASS. Design enforces 3-second visible panel states, 5-minute
  refresh cadence, bounded activity/moderation lists, and chart/map summary data
  rather than unbounded raw datasets.
