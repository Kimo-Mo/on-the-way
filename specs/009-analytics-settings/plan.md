# Implementation Plan: Analytics & Settings

**Branch**: `009-analytics-settings` | **Date**: 2026-06-25 | **Spec**: [spec.md](file:///c:/iProjects/on-the-way/specs/009-analytics-settings/spec.md)  
**Input**: Feature specification from `/specs/009-analytics-settings/spec.md`

## Summary

This feature implements two new admin routes: `/analytics` and `/settings`. The Analytics page surfaces platform health through four KPI summary cards (with preceding-equivalent-window delta), three chart types (area, grouped bar, line), a Key Metrics Summary, and a date range picker capped at 90 days. The Settings page provides four scrollable sections: Profile Settings (form with unsaved-changes guard), Notification Preferences (auto-save toggles), System Settings (super-admin restricted), and Display Preferences. All data access follows the TanStack React Query + Axios mock pattern established by prior phases; forms use React Hook Form + Zod; charts use Recharts.

## Technical Context

**Language/Version**: TypeScript ~6.0 (strict mode)  
**Primary Dependencies**: React 19, Vite, TanStack React Query v5, React Router v7, Axios, Shadcn UI, Radix UI, React Hook Form, Zod, Recharts, Sonner, Lucide React  
**Storage**: Client-side fetching via Axios (mock service layer; .NET backend connected in Phase 10)  
**Target Platform**: Web browsers (Admin Dashboard)  
**Project Type**: Web Application  
**Performance Goals**: Analytics page fully rendered (KPI + charts) within 3 seconds; Settings save confirmation within 5 seconds; date range refresh with no full-page reload  
**Constraints**: 90-day date range cap (FR-006); System Settings write-restricted to super-admins (FR-012); unsaved-changes confirmation dialog on navigation (FR-016); auto-save notification toggles (FR-010)  
**Scale/Scope**: Single-admin view; analytics data pre-aggregated by backend; no virtualization required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: ✅ Strict TypeScript throughout. Explicit interfaces for `AnalyticsSnapshot`, `AdminProfile`, `NotificationPreferences`, `SystemSettings`, `DisplayPreferences`. Components kept small and single-purpose (e.g., `KpiCard`, `ReportsTrendsChart`, `ProfileSettingsForm`). Shared logic in custom hooks only.
- **Data and State**: ✅ All server data via TanStack React Query custom hooks (`useGetAnalytics`, `useGetAdminProfile`, etc.). Axios mock service layer. React Hook Form + Zod for Profile Settings and System Settings forms. Auto-save toggle mutations use `useMutation` directly — no `useEffect` for data fetching.
- **UX Consistency**: ✅ Shadcn `Switch` for toggles, `DatePickerWithRange` for analytics filter, `Dialog` for unsaved-changes guard, `Skeleton` for loading states, `Toast` (Sonner) for save feedback. Recharts for all charts. Accessible labels and keyboard behaviour on all interactive elements.
- **Performance**: ✅ Analytics route uses `React.lazy` / route-level code splitting. Recharts series data memoized with `useMemo`. 90-day cap prevents unbounded queries. KPI delta computation delegated to backend (frontend displays pre-computed value).

## Project Structure

### Documentation (this feature)

```text
specs/009-analytics-settings/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── analytics-api.md
│   └── settings-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── types/
│   │   ├── analytics.ts          # AnalyticsSnapshot, KpiCardData, ChartDataPoint
│   │   └── settings.ts           # AdminProfile, NotificationPreferences, SystemSettings, DisplayPreferences
│   ├── services/
│   │   └── api/
│   │       ├── analytics.ts      # getAnalytics(dateRange) mock
│   │       └── settings.ts       # getAdminProfile, saveAdminProfile, getNotifPrefs,
│   │                             #   updateNotifPref, getSystemSettings, saveSystemSettings,
│   │                             #   getDisplayPrefs, saveDisplayPrefs mocks
│   ├── hooks/
│   │   ├── useGetAnalytics.ts
│   │   ├── useGetAdminProfile.ts
│   │   ├── useSaveAdminProfile.ts
│   │   ├── useGetNotificationPreferences.ts
│   │   ├── useUpdateNotificationPreference.ts
│   │   ├── useGetSystemSettings.ts
│   │   ├── useSaveSystemSettings.ts
│   │   ├── useGetDisplayPreferences.ts
│   │   └── useSaveDisplayPreferences.ts
│   ├── components/
│   │   ├── analytics/
│   │   │   ├── KpiCard.tsx
│   │   │   ├── KpiCardGrid.tsx
│   │   │   ├── ReportsTrendsChart.tsx
│   │   │   ├── HelpRequestsByTypeChart.tsx
│   │   │   ├── UserGrowthChart.tsx
│   │   │   ├── KeyMetricsSummary.tsx
│   │   │   └── AnalyticsDateRangePicker.tsx
│   │   └── settings/
│   │       ├── ProfileSettingsForm.tsx
│   │       ├── NotificationPreferencesSection.tsx
│   │       ├── SystemSettingsForm.tsx
│   │       ├── DisplayPreferencesForm.tsx
│   │       └── UnsavedChangesDialog.tsx
│   └── pages/
│       ├── analytics/
│       │   └── index.tsx          # /analytics route
│       └── settings/
│           └── index.tsx          # /settings route
```

**Structure Decision**: Feature follows the established `frontend/src/{types,services/api,hooks,components,pages}` pattern from prior phases. Analytics and Settings each get their own component subdirectory to keep concerns cleanly separated.

## Complexity Tracking

> No Constitution violations. No entry required.
