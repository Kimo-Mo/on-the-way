# Research: Backend Integration, Refactoring & Final Polish

**Date**: 2026-07-07  
**Feature**: [spec.md](file:///c:/iProjects/on-the-way/specs/011-backend-integration-polish/spec.md)

## 1. Current Hook Architecture Patterns

### Decision: Standardize on the "direct Axios" hook pattern

**Rationale**: 8 out of 10 hook modules already follow this pattern (Users, Reports, Providers, Help Requests, Dashboard, Moderation, Notifications, Auth). Only Analytics and Settings deviate by routing through `services/api/` intermediary files. Standardizing eliminates the indirection layer.

**Standard pattern** (from `useUsers.ts`, `useReports.ts`):
```
imports (axios, types, react-query, sonner)
→ exported fetchX function (calls api.get/post directly)
→ exported QUERY_KEY constant
→ exported useX hook (wraps useQuery)
→ exported mutation hooks (wrap useMutation)
```

**Alternatives considered**:
- Service layer pattern (current Analytics/Settings) — rejected: adds unnecessary file indirection, breaks co-location, already minority pattern.
- Shared mapper utility — rejected per clarification Q1: mappers stay co-located in hook files.

---

## 2. Backend Endpoint Availability Audit

### Decision: Classify endpoints as LIVE or MOCK based on swagger.json references in codebase

| Domain | List Endpoint | Detail Endpoint | Mutations | Status |
|--------|--------------|-----------------|-----------|--------|
| Users | `/admin/users` | `/admin/users/{id}` | PUT status | **LIVE** |
| Reports | `/admin/reports` | `/admin/reports/{id}` | Approve/Urgent/Remove stubs | **LIVE** (list/detail); mutations TBD |
| Providers | `/admin/providers` | `/admin/providers/{id}` | Status update | **LIVE** |
| Dashboard | `/admin/dashboard` | — | Moderation stubs | **LIVE** (main); moderation stubs TBD |
| Help Requests | `/admin/help-requests` | `/admin/help-requests/{id}` | Status/Reassign stubs | **LIVE** (list/detail); mutations TBD |
| Moderation | `/admin/moderation/*` | — | Action endpoint | **LIVE** (attempted, fallback to fixtures) |
| Notifications | `/admin/notifications` | `/admin/notifications/{id}` | Create/Delete | **LIVE** |
| Analytics | `/admin/analytics` | — | — | **MOCK** (no confirmed endpoint) |
| Settings Profile | `/admin/settings/profile` | — | PUT profile | **LIVE** |
| Settings (other) | — | — | — | **MOCK** (notif prefs, system, display) |

**Rationale**: Based on actual Axios calls found in hooks and swagger references in type comments. Live endpoints use direct `api.get()`; mock endpoints use `try/catch` with fixture fallback or in-memory state.

---

## 3. Fixture Files Removal Plan

### Decision: Remove fixture files for LIVE domains, retain for MOCK domains

**Files to REMOVE** (connected to live endpoints):
- `src/lib/users-fixtures.ts`
- `src/lib/reports-fixtures.ts`
- `src/lib/providers-fixtures.ts`
- `src/lib/dashboard-fixtures.ts`
- `src/lib/help-requests-fixtures.ts`
- `src/lib/moderation-fixtures.ts`
- `src/lib/notifications-fixtures.ts`

**Files to RETAIN** (no live backend):
- `src/lib/analytics-fixtures.ts`

**Files to MOVE inline** (mock logic currently in services/api):
- `src/services/api/settings.ts` — mock logic for notif prefs, system settings, display prefs moves into `useSettings.ts`
- `src/services/api/analytics.ts` — mock fallback logic moves into `useAnalytics.ts`

**Post-cleanup**: `src/services/api/` directory is deleted entirely.

---

## 4. Console Statement Audit

### Decision: Remove ALL console.log and console.warn statements

**Locations identified**:
- `src/lib/axios.ts` line 14: `console.log('[api] Request interceptor:', ...)`
- `src/hooks/dashboard/useDashboard.ts` line 30: `console.warn('[dashboard] API unavailable...')`
- `src/services/api/analytics.ts` line 10: `console.warn('[analytics] API unavailable...')`
- `src/hooks/moderation/useModeration.ts` lines 45, 65, 85, 103: `console.warn('[moderation] ... unavailable...')`

**Rationale**: Per clarification Q3, all console output is removed. Mock status is documented via JSDoc comments only.

---

## 5. Shared UI State Components Design

### Decision: Create 4 reusable components in `src/components/shared/`

| Component | Props | Purpose |
|-----------|-------|---------|
| `PageError` | `message?: string`, `onRetry?: () => void` | Full-page error state with retry button |
| `PageEmpty` | `title: string`, `description?: string`, `icon?: LucideIcon` | Empty list/table state |
| `TableSkeleton` | `columns: number`, `rows?: number` | Skeleton for table-based pages |
| `CardSkeleton` | `count?: number` | Skeleton for card-based layouts |

**Rationale**: Per clarification Q4, shared components ensure visual consistency, reduce duplication, and demonstrate architectural maturity. The `src/components/shared/` directory already exists with `NotFound.tsx` and `PageHeader.tsx`.

**Alternatives considered**:
- Inline per-page states — rejected: creates duplication, visual inconsistency, harder to maintain.
- Shadcn UI Skeleton primitive — used internally by TableSkeleton/CardSkeleton, but wrapped for domain-specific sizing.

---

## 6. Data Mapper Strategy

### Decision: Co-locate mapper functions in each hook file

**Pattern**:
```typescript
// Defined in the hook file, above the fetch function
const mapBackendUser = (raw: BackendUserResponse): User => ({
  id: raw.Id,
  name: raw.FullName,
  email: raw.Email,
  // ...transform PascalCase → camelCase, map enums, add defaults
});

// Used inside the fetch function
export const fetchUsers = async (params): Promise<UsersListResponse> => {
  const { data } = await api.get('/admin/users', { params });
  return { ...data, data: data.map(mapBackendUser) };
};
```

**Rationale**: Per clarification Q1, co-location keeps the anti-corruption layer next to the query that uses it. Unknown fields from the backend are simply not mapped (ignored). Unknown enum values map to a documented fallback string.

---

## 7. Error Propagation Strategy

### Decision: Live endpoints propagate errors; mock endpoints use silent fallback

**Live endpoint pattern** (Users, Reports, etc.):
```typescript
export const fetchUsers = async (params): Promise<UsersListResponse> => {
  const { data } = await api.get('/admin/users', { params });
  return normalizeResponse(data);
  // No try/catch — errors propagate to React Query → PageError component
};
```

**Mock endpoint pattern** (Analytics, some Settings):
```typescript
/** @mock Backend endpoint not yet available. Uses fixture data. */
export const fetchAnalytics = async (params): Promise<AnalyticsSnapshot> => {
  await delay(400);
  return analyticsFixtures[params.dateRange] ?? analyticsFixtures['7d'];
  // No API call attempted — purely mock
};
```

**Rationale**: Per clarification Q2, silent fallback masks real production issues for live endpoints. Mock endpoints don't attempt an API call at all (no try/catch needed).
