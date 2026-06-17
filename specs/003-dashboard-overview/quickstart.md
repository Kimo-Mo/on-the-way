# Quickstart: Dashboard Overview

## Prerequisites

- Authentication and protected routes from Phase 2 are available.
- `npm install` has been run for the existing project dependencies.
- Recharts is installed before chart panels are implemented if it is not already in
  `package.json`.
- `VITE_API_BASE_URL` is configured when connecting to a backend. Representative
  development data may be used until the live endpoint is available.

## Implementation Steps

1. Add dashboard domain types in `src/types/dashboard.ts` based on
   [data-model.md](./data-model.md).
2. Add `useDashboardOverview` in `src/hooks/useDashboardOverview.ts`.
   - Use the shared Axios client.
   - Use TanStack React Query.
   - Set the overview refresh interval to 5 minutes.
   - Keep panel data typed and expose loading, error, empty, and unauthorized states.
3. Update `src/pages/Dashboard.tsx` so it composes dashboard panels through the
   existing admin shell.
4. Update `src/components/dashboard/StatsCards.tsx` to receive typed metric data
   instead of using static module data.
5. Add the remaining dashboard panels:
   - `InteractiveMap.tsx`
   - `RecentActivity.tsx`
   - `ReportsTrendChart.tsx`
   - `HelpRequestsCategoryChart.tsx`
   - `UserDistributionChart.tsx`
   - `FlaggedContentPanel.tsx`
6. Add confirmation UI for every flagged-content action before executing the
   mutation.
7. Add drill-through links for summary cards, charts, map items, and activity items
   where a relevant full section exists.
8. Verify responsive layouts at desktop and narrow widths.

## Validation

Run:

```bash
npm run lint
npm run build
```

Manual validation:

- `/` shows six metric cards and all dashboard panels.
- Dashboard data refreshes every 5 minutes while the page remains open.
- Recent activity shows exactly 5 newest items when at least 5 exist.
- Flagged content shows exactly 3 most recent items when at least 3 exist.
- All moderation actions require confirmation and preserve original state on failure.
- Summary cards, charts, map items, and activity items link to relevant full
  sections.
- Loading, empty, error, and unauthorized states are visible at panel level.
- Keyboard navigation reaches all dashboard links and moderation controls.
- Narrow viewport layout has no overlapping text or clipped critical actions.
