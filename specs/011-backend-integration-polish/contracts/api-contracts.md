# API Contracts: Consumed Backend Endpoints

**Date**: 2026-07-07  
**Direction**: Frontend → .NET Backend (consumed, not exposed)

## Overview

This frontend application does not expose APIs to external consumers. It consumes the .NET backend REST API. The contracts below document the endpoints consumed by each hook module and the expected response shapes.

## Live Endpoints

### Users
| Method | Endpoint | Hook | Response Shape |
|--------|----------|------|----------------|
| GET | `/api/admin/users` | `useUsers` | `User[]` or `{ data: User[], total }` |
| GET | `/api/admin/users/{id}` | `useUserDetails` | `UserDetails` |
| PUT | `/api/admin/users/{id}/status` | `useUpdateUserStatus` | `void` |

### Reports
| Method | Endpoint | Hook | Response Shape |
|--------|----------|------|----------------|
| GET | `/api/admin/reports` | `useReports` | `Report[]` or `{ data: Report[], total }` |
| GET | `/api/admin/reports/{id}` | `useReportDetails` | `ReportDetails` |
| POST | `/api/admin/reports/{id}/approve` | `useApproveReport` | `void` (stub) |
| POST | `/api/admin/reports/{id}/mark-urgent` | `useMarkUrgent` | `void` (stub) |
| DELETE | `/api/admin/reports/{id}` | `useRemoveReport` | `void` (stub) |

### Providers
| Method | Endpoint | Hook | Response Shape |
|--------|----------|------|----------------|
| GET | `/api/admin/providers` | `useProviders` | `Provider[]` or paginated |
| GET | `/api/admin/providers/{id}` | `useProviderDetails` | `ProviderDetails` |
| PUT | `/api/admin/providers/{id}/status` | `useUpdateProviderStatus` | `void` |

### Dashboard
| Method | Endpoint | Hook | Response Shape |
|--------|----------|------|----------------|
| GET | `/api/admin/dashboard` | `useDashboardOverview` | `DashboardOverview` |

### Help Requests
| Method | Endpoint | Hook | Response Shape |
|--------|----------|------|----------------|
| GET | `/api/admin/help-requests` | `useHelpRequests` | `HelpRequest[]` or paginated |
| GET | `/api/admin/help-requests/{id}` | `useHelpRequestDetails` | `HelpRequestDetails` |
| PUT | `/api/admin/help-requests/{id}/status` | `useUpdateHelpRequestStatus` | `void` (stub) |
| PUT | `/api/admin/help-requests/{id}/provider` | `useReassignProvider` | `void` (stub) |

### Moderation
| Method | Endpoint | Hook | Response Shape |
|--------|----------|------|----------------|
| GET | `/api/admin/moderation/flagged-reports` | `useGetFlaggedReports` | `{ data: FlaggedReport[] }` |
| GET | `/api/admin/moderation/suspicious-users` | `useGetSuspiciousUsers` | `{ data: SuspiciousUser[] }` |
| GET | `/api/admin/moderation/pending-items` | `useGetPendingModerationItems` | `{ data: PendingModerationItem[] }` |
| GET | `/api/admin/moderation/summary` | `useGetModerationSummary` | `ModerationSummary` |
| POST | `/api/admin/moderation/{type}/{id}/actions` | `useModerationAction` | `void` |

### Notifications
| Method | Endpoint | Hook | Response Shape |
|--------|----------|------|----------------|
| GET | `/api/admin/notifications` | `useGetNotifications` | `AdminNotification[]` or paginated |
| GET | `/api/admin/notifications/{id}` | `useGetNotificationById` | `AdminNotification` |
| POST | `/api/admin/notifications` | `useCreateNotification` | `AdminNotification` |
| DELETE | `/api/admin/notifications/{id}` | `useDeleteNotification` | `void` (stub) |

### Settings
| Method | Endpoint | Hook | Response Shape |
|--------|----------|------|----------------|
| GET | `/api/admin/settings/profile` | `useGetAdminProfile` | `AdminProfile` |
| PUT | `/api/admin/settings/profile` | `useSaveAdminProfile` | `AdminProfile` |

## Mock Endpoints (No Backend)

| Domain | Hook | Mock Strategy |
|--------|------|---------------|
| Analytics | `useGetAnalytics` | Fixture data from `analytics-fixtures.ts` |
| Settings: Notification Prefs | `useGetNotificationPreferences` | In-memory mock inline in hook |
| Settings: System Settings | `useGetSystemSettings` | In-memory mock inline in hook |
| Settings: Display Preferences | `useGetDisplayPreferences` | In-memory mock inline in hook |
