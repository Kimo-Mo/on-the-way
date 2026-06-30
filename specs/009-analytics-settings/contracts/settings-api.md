# API Contract: Settings

> **Note**: During Phase 9 all endpoints are mocked in `frontend/src/services/api/settings.ts`. These contracts define the interface that will be connected to the live .NET backend in Phase 10.

---

## Profile Settings

### `GET /api/settings/profile`

Fetch the authenticated administrator's profile.

**Success Response `200 OK`**:
```json
{
  "id": "uuid",
  "fullName": "Admin User",
  "email": "admin@ontheway.com",
  "phoneNumber": "+1 (555) 123-4567",
  "role": "Administrator"
}
```

---

### `PUT /api/settings/profile`

Update the authenticated administrator's profile. `role` is excluded from the request body (read-only).

**Request Body**:
```json
{
  "fullName": "Admin User",
  "email": "admin@ontheway.com",
  "phoneNumber": "+1 (555) 123-4567"
}
```

**Success Response `200 OK`**: Updated `AdminProfile` object.

| Status | Condition |
|--------|-----------|
| `400` | Validation failure (invalid email, missing required field) |
| `401` | Session expired |

---

## Notification Preferences

### `GET /api/settings/notification-preferences`

Fetch the current administrator's notification opt-in flags.

**Success Response `200 OK`**:
```json
{
  "emailNotifications": true,
  "urgentReportAlerts": true,
  "moderationAlerts": true,
  "weeklyReports": false
}
```

---

### `PATCH /api/settings/notification-preferences`

Update a single notification preference flag (called per toggle flip — auto-save pattern).

**Request Body**:
```json
{
  "key": "weeklyReports",
  "value": true
}
```

Where `key` is one of: `emailNotifications | urgentReportAlerts | moderationAlerts | weeklyReports`.

**Success Response `200 OK`**: Updated `NotificationPreferences` object.

| Status | Condition |
|--------|-----------|
| `400` | Invalid `key` value |
| `401` | Session expired |

---

## System Settings

### `GET /api/settings/system`

Fetch platform-wide system settings. Accessible to all authenticated admins (read). Write restricted to `SuperAdministrator` role (enforced server-side on PUT).

**Success Response `200 OK`**:
```json
{
  "autoApproveReports": false,
  "autoApproveThreshold": 80,
  "providerApprovalMode": "Manual",
  "trustScoreThreshold": 60,
  "maxActiveHelpRequests": 100
}
```

---

### `PUT /api/settings/system`

Save platform-wide system settings. **Requires `SuperAdministrator` role**.

**Request Body**: Full `SystemSettings` object (all fields required).

**Success Response `200 OK`**: Updated `SystemSettings` object.

| Status | Condition |
|--------|-----------|
| `400` | Validation failure (values out of range) |
| `401` | Session expired |
| `403` | Caller is not a `SuperAdministrator` |

---

## Display Preferences

### `GET /api/settings/display-preferences`

Fetch the current administrator's display preferences.

**Success Response `200 OK`**:
```json
{
  "language": "en",
  "timezone": "Africa/Cairo"
}
```

---

### `PUT /api/settings/display-preferences`

Save the administrator's display preferences.

**Request Body**:
```json
{
  "language": "en",
  "timezone": "Africa/Cairo"
}
```

**Success Response `200 OK`**: Updated `DisplayPreferences` object.

| Status | Condition |
|--------|-----------|
| `400` | Unsupported language code or invalid timezone string |
| `401` | Session expired |

---

## React Query Hook Contracts Summary

```typescript
// Queries
function useGetAdminProfile(): UseQueryResult<AdminProfile>
function useGetNotificationPreferences(): UseQueryResult<NotificationPreferences>
function useGetSystemSettings(): UseQueryResult<SystemSettings>
function useGetDisplayPreferences(): UseQueryResult<DisplayPreferences>

// Mutations
function useSaveAdminProfile(): UseMutationResult<AdminProfile, Error, Omit<AdminProfile, 'id' | 'role'>>
function useUpdateNotificationPreference(): UseMutationResult<NotificationPreferences, Error, { key: keyof NotificationPreferences; value: boolean }>
function useSaveSystemSettings(): UseMutationResult<SystemSettings, Error, SystemSettings>
function useSaveDisplayPreferences(): UseMutationResult<DisplayPreferences, Error, DisplayPreferences>
```

All mutations invalidate their corresponding query keys on success. `useUpdateNotificationPreference` additionally uses **optimistic updates** (`onMutate` → set cache → `onError` → rollback).
