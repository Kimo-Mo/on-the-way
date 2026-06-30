# Data Model: Analytics & Settings

## Entities

---

### `AnalyticsSnapshot`
Aggregated platform metrics returned by the backend for a given date range. The backend computes all deltas against the preceding equivalent window (same number of days immediately before the selected start date).

**Fields**:
- `dateRange`: `{ from: string; to: string }` — ISO 8601 dates representing the queried window
- `kpi`: `KpiData` — four KPI card values with deltas
- `reportsTrends`: `ReportsTrendPoint[]` — time-series for area chart
- `helpRequestsByType`: `HelpRequestsByTypePoint[]` — grouped bar chart data per category
- `userGrowth`: `UserGrowthPoint[]` — cumulative user registrations over time
- `keyMetrics`: `KeyMetricsSummary` — three monthly highlight figures

**Sub-types**:

```typescript
interface KpiData {
  avgResponseTimeMinutes: number;
  avgResponseTimeDelta: number;         // percentage change vs preceding window
  userSatisfactionRate: number;         // 0–100
  userSatisfactionDelta: number;
  resolutionRate: number;               // 0–100
  resolutionRateDelta: number;
  activeHelpRequests: number;
  activeHelpRequestsDelta: number;
}

interface ReportsTrendPoint {
  date: string;       // e.g. "Apr 18"
  reports: number;
  resolved: number;
}

interface HelpRequestsByTypePoint {
  date: string;
  medical: number;
  towing: number;
  fuel: number;
  repair: number;
}

interface UserGrowthPoint {
  month: string;      // e.g. "Jan"
  users: number;
}

interface KeyMetricsSummary {
  totalReportsThisMonth: number;
  totalReportsDelta: number;            // percentage change vs previous month
  helpRequestsCompleted: number;
  helpRequestsDelta: number;
  newUsersThisMonth: number;
  newUsersDelta: number;
}
```

**Validation Rules**:
- `dateRange.from` must not be after `dateRange.to`.
- The span between `from` and `to` must not exceed 90 days (enforced by the picker; backend also validates).
- All delta values are signed floats (positive = improvement vs previous period; sign convention follows domain: lower avgResponseTime is good → negative delta is positive signal, but the spec does not require colour inversion — implementation detail for tasks).

---

### `AdminProfile`
The authenticated administrator's personal details, loaded on `/settings` page mount.

**Fields**:
- `id`: `string` (UUID)
- `fullName`: `string`
- `email`: `string` (valid email format)
- `phoneNumber`: `string`
- `role`: `'Administrator' | 'SuperAdministrator'` (read-only)

**Validation Rules** (Zod schema, applied to the editable save payload):
- `fullName`: required, min 1 char, max 100 chars.
- `email`: required, valid email format.
- `phoneNumber`: required, min 7 chars, max 20 chars (accepts international formats).
- `role`: excluded from the save payload (read-only, never submitted).

---

### `NotificationPreferences`
Per-administrator opt-in flags for system alerts. Each flag auto-saves immediately on toggle.

**Fields**:
- `emailNotifications`: `boolean`
- `urgentReportAlerts`: `boolean`
- `moderationAlerts`: `boolean`
- `weeklyReports`: `boolean`

**State Transitions**:
- Each field transitions `true ↔ false` independently via individual mutation calls.
- On mutation failure: optimistic update is rolled back; error toast displayed.

---

### `SystemSettings`
Platform-wide operational configuration. Write-access restricted to `SuperAdministrator` role.

**Fields**:
- `autoApproveReports`: `boolean`
- `autoApproveThreshold`: `number` (min 0, max 100 — trust score threshold for auto-approval)
- `providerApprovalMode`: `'Manual' | 'Automatic'`
- `trustScoreThreshold`: `number` (integer, min 0, max 100)
- `maxActiveHelpRequests`: `number` (integer, min 1, max 10000)

**Validation Rules** (Zod schema):
- `autoApproveThreshold`: integer 0–100.
- `trustScoreThreshold`: integer 0–100.
- `maxActiveHelpRequests`: integer 1–10000.
- Form fields are `disabled` when `role !== 'SuperAdministrator'` (frontend enforcement); backend also enforces on save.

---

### `DisplayPreferences`
Per-administrator display customisation for language and timezone.

**Fields**:
- `language`: `string` — IETF language tag (e.g., `'en'`, `'ar'`, `'fr'`)
- `timezone`: `string` — IANA timezone identifier (e.g., `'Africa/Cairo'`, `'UTC'`)

**Validation Rules**:
- `language`: required; must be one of the supported language codes (list provided by mock/backend).
- `timezone`: required; must be a valid IANA timezone string.

---

## Query Parameters

### `AnalyticsQueryParams`
Passed to `getAnalytics()` to scope the response.

```typescript
interface AnalyticsQueryParams {
  from: string;   // ISO 8601 date (YYYY-MM-DD)
  to: string;     // ISO 8601 date (YYYY-MM-DD); max 90 days from `from`
}
```

---

## Key Relationships

- `AdminProfile.role` drives `SystemSettings` editability — the same role value is read from the auth session, not fetched separately.
- `AnalyticsSnapshot` is stateless per request — no entity persists between queries; each `useGetAnalytics` call produces a fresh snapshot.
- `NotificationPreferences` and `DisplayPreferences` are scoped to the authenticated admin (`id` inferred from session; not in the request body).
