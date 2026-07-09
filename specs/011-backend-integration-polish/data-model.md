# Data Model: Backend Integration, Refactoring & Final Polish

**Date**: 2026-07-07  
**Feature**: [spec.md](file:///c:/iProjects/on-the-way/specs/011-backend-integration-polish/spec.md)

## Overview

This phase does not introduce new data entities. It transforms how existing entities flow from the backend API into the frontend. The data model here documents the **mapping layer** between backend response shapes and existing frontend TypeScript interfaces.

## Entity Mapping Summary

### Existing Frontend Interfaces (no changes)

All existing TypeScript interfaces in `src/types/` remain the **source of truth** for UI rendering. The backend response is mapped *to* these types, never the other way around.

| Frontend Type File | Key Interfaces | Used By Hook |
|-------------------|----------------|--------------|
| `src/types/users.ts` | `User`, `UserDetails`, `UsersListResponse` | `useUsers.ts` |
| `src/types/reports.ts` | `Report`, `ReportDetails`, `ReportsListResponse` | `useReports.ts` |
| `src/types/providers.ts` | `Provider`, `ProviderDetails` | `useProviders.ts` |
| `src/types/dashboard.ts` | `DashboardOverview` | `useDashboard.ts` |
| `src/types/help-requests.ts` | `HelpRequest`, `HelpRequestDetails`, `HelpRequestsListResponse` | `useHelpRequests.ts` |
| `src/types/moderation.ts` | `FlaggedReport`, `SuspiciousUser`, `ModerationSummary` | `useModeration.ts` |
| `src/types/notifications.ts` | `AdminNotification`, `CreateNotificationPayload` | `useNotifications.ts` |
| `src/types/analytics.ts` | `AnalyticsSnapshot` | `useAnalytics.ts` |
| `src/types/settings.ts` | `AdminProfile`, `SystemSettings`, `DisplayPreferences`, `NotificationPreferences` | `useSettings.ts` |

### Backend Response Normalization Patterns

Each hook file implements a mapper that handles these common transformations:

1. **Case conversion**: Backend PascalCase (`FullName`) → Frontend camelCase (`fullName`)
2. **Response wrapper normalization**: Backend may return `T[]` or `{ data: T[], total: number }` — fetch functions handle both
3. **Enum mapping**: Backend numeric enums → Frontend string literals (e.g., `0` → `'active'`)
4. **Default values**: Missing optional fields get sensible defaults rather than `undefined`
5. **Unknown field filtering**: Extra backend fields not in the frontend interface are silently ignored

### State Transitions

No new state transitions are introduced. Existing entity lifecycle states (e.g., User `active`/`suspended`/`banned`, Report `pending`/`approved`/`urgent`, Help Request `active`/`completed`/`cancelled`) remain unchanged.

## Data Flow Architecture (Post-Integration)

```
Backend .NET API
       │
       ▼
  Axios Instance (src/lib/axios.ts)
  ├── Request interceptor: attaches Bearer token
  └── Response interceptor: handles 401 → logout
       │
       ▼
  Hook File (src/hooks/<domain>/use<Domain>.ts)
  ├── mapBackendX(): transforms raw response → frontend interface
  ├── fetchX(): calls api.get() → mapBackendX() → returns typed data
  ├── QUERY_KEY: exported constant for cache management
  ├── useX(): React Query useQuery wrapping fetchX
  └── useMutateX(): React Query useMutation for write operations
       │
       ▼
  Page Component (src/pages/<Page>.tsx)
  ├── Uses useX() hook for data
  ├── Shows <TableSkeleton> / <CardSkeleton> during loading
  ├── Shows <PageError> on error with retry
  └── Shows <PageEmpty> when data array is empty
```

## Mock Data Retention

| Domain | Mock Strategy | Data Source |
|--------|--------------|-------------|
| Analytics | Pure mock (no API call) | `src/lib/analytics-fixtures.ts` |
| Settings: Notif Prefs | In-memory mock in hook file | Inline `let _notifPrefs` (moved from `services/api/settings.ts`) |
| Settings: System | In-memory mock in hook file | Inline `let _systemSettings` (moved from `services/api/settings.ts`) |
| Settings: Display | In-memory mock in hook file | Inline `let _displayPrefs` (moved from `services/api/settings.ts`) |
| Settings: Profile | **LIVE** — direct Axios call | Backend `/admin/settings/profile` |

## Validation Rules

No new validation rules are introduced. Existing Zod schemas in form components remain unchanged. Data mappers handle type coercion at the API boundary; Zod validation applies at the form submission boundary.
