# Quickstart: Analytics & Settings (Phase 9)

## Overview

Phase 9 adds two new routes to the admin dashboard:
- **`/analytics`** — platform analytics with KPI cards, three chart types, and a 90-day date range picker.
- **`/settings`** — admin self-service settings across four scrollable sections.

All data is mocked at the service layer. Live backend connection happens in Phase 10.

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `frontend/src/types/analytics.ts` | `AnalyticsSnapshot` and all chart sub-types |
| `frontend/src/types/settings.ts` | `AdminProfile`, `NotificationPreferences`, `SystemSettings`, `DisplayPreferences` |
| `frontend/src/services/api/analytics.ts` | Mock `getAnalytics(params)` function |
| `frontend/src/services/api/settings.ts` | All mock settings service functions |
| `frontend/src/hooks/useGetAnalytics.ts` | React Query hook for analytics data |
| `frontend/src/hooks/useUpdateNotificationPreference.ts` | Mutation with optimistic update for toggle auto-save |
| `frontend/src/components/analytics/KpiCard.tsx` | Individual KPI stat card component |
| `frontend/src/components/analytics/AnalyticsDateRangePicker.tsx` | Date range picker capped at 90 days |
| `frontend/src/components/settings/UnsavedChangesDialog.tsx` | Navigation guard dialog (Shadcn AlertDialog) |
| `frontend/src/pages/analytics/index.tsx` | `/analytics` page — assembles all chart components |
| `frontend/src/pages/settings/index.tsx` | `/settings` page — assembles all settings sections |

---

## Critical Patterns

### 1. Date Range State (Analytics page)
The selected date range is held in `useState` at the page level and passed to `useGetAnalytics`. Default is last 7 days. The `AnalyticsDateRangePicker` enforces the 90-day cap by disabling dates beyond the allowed window.

```tsx
const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
const { data, isLoading, isError } = useGetAnalytics({ from: dateRange.from, to: dateRange.to });
```

### 2. Auto-save Toggle (Notification Preferences)
No form — each `Switch` fires a mutation directly:

```tsx
const { mutate } = useUpdateNotificationPreference();
<Switch
  checked={prefs.emailNotifications}
  onCheckedChange={(value) => mutate({ key: 'emailNotifications', value })}
/>
```

### 3. Unsaved Changes Guard (Settings forms)
Use React Router v7's `useBlocker` with RHF `formState.isDirty`:

```tsx
const { formState: { isDirty } } = useForm<AdminProfile>(...);
const blocker = useBlocker(isDirty);
// Render <UnsavedChangesDialog> when blocker.state === 'blocked'
```

### 4. Super-Admin Gate (System Settings)
Read role from the auth store:

```tsx
const { user } = useAuthStore();
const isSuperAdmin = user?.role === 'SuperAdministrator';
<Input disabled={!isSuperAdmin} ... />
```

### 5. Recharts Pattern (all charts)
All charts use `ResponsiveContainer` for flex-width sizing, `<Tooltip>`, and `<Legend>`:

```tsx
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={memoizedData}>
    <Area dataKey="reports" ... />
    <Area dataKey="resolved" ... />
    <Tooltip /><Legend />
  </AreaChart>
</ResponsiveContainer>
```
Data series arrays MUST be memoized with `useMemo` to prevent Recharts from re-rendering on every parent render.

---

## Routing

Add to the app router (React Router v7):

```tsx
{ path: '/analytics', element: <React.lazy(() => import('./pages/analytics')) /> }
{ path: '/settings',  element: <React.lazy(() => import('./pages/settings')) /> }
```

Both routes sit inside the existing `ProtectedRoute` wrapper.

---

## Replacing Mocks (Phase 10)

1. In `services/api/analytics.ts`, replace the mock function body with: `return axiosClient.get('/api/analytics', { params })`.
2. In `services/api/settings.ts`, replace each mock function body with the appropriate Axios call (GET/PUT/PATCH as per `contracts/settings-api.md`).
3. No changes required to hooks, components, or pages.
