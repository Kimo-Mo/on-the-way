# Tasks: Analytics & Settings

**Input**: Design documents from `/specs/009-analytics-settings/`  
**Prerequisites**: [plan.md](./plan.md) · [spec.md](./spec.md) · [research.md](./research.md) · [data-model.md](./data-model.md) · [contracts/analytics-api.md](./contracts/analytics-api.md) · [contracts/settings-api.md](./contracts/settings-api.md) · [quickstart.md](./quickstart.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on each other)
- **[Story]**: Which user story this task belongs to (US1–US6)
- Exact file paths are specified in every task description

## Path Conventions

All source paths are relative to `frontend/src/` at the repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create all directories and register the two new routes before any feature code is written.

- [X] T001 Create the following empty directories (all under `frontend/src/`): `types/`, `services/api/`, `hooks/`, `components/analytics/`, `components/settings/`, `pages/analytics/`, `pages/settings/` — only create directories that do not already exist.
- [X] T002 Register two new lazy-loaded routes inside the existing React Router v7 router config (likely `frontend/src/main.tsx` or `frontend/src/router.tsx`): `{ path: '/analytics', element: <React.lazy(() => import('./pages/analytics')) /> }` and `{ path: '/settings', element: <React.lazy(() => import('./pages/settings')) /> }`. Both routes must sit inside the existing `ProtectedRoute` wrapper. Add `<React.Suspense fallback={<div>Loading…</div>}>` around each lazy element.
- [X] T003 [P] Add `analytics` and `settings` sidebar navigation links to the existing sidebar component (check `frontend/src/components/` for the sidebar file). The Analytics link should use the `BarChart2` Lucide icon and point to `/analytics`. The Settings link should use the `Settings` Lucide icon and point to `/settings`. Match the style of existing sidebar links exactly.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TypeScript types, Zod schemas, and mock service functions that every user story depends on. Complete this phase before any user story work begins.

**CRITICAL**: No user story implementation can begin until this phase is complete.

- [X] T004 Create `frontend/src/types/analytics.ts`. Export the following TypeScript interfaces **exactly** as defined below:

  ```typescript
  export interface KpiData {
    avgResponseTimeMinutes: number;
    avgResponseTimeDelta: number;
    userSatisfactionRate: number;
    userSatisfactionDelta: number;
    resolutionRate: number;
    resolutionRateDelta: number;
    activeHelpRequests: number;
    activeHelpRequestsDelta: number;
  }

  export interface ReportsTrendPoint {
    date: string;
    reports: number;
    resolved: number;
  }

  export interface HelpRequestsByTypePoint {
    date: string;
    medical: number;
    towing: number;
    fuel: number;
    repair: number;
  }

  export interface UserGrowthPoint {
    month: string;
    users: number;
  }

  export interface KeyMetricsSummary {
    totalReportsThisMonth: number;
    totalReportsDelta: number;
    helpRequestsCompleted: number;
    helpRequestsDelta: number;
    newUsersThisMonth: number;
    newUsersDelta: number;
  }

  export interface AnalyticsSnapshot {
    dateRange: { from: string; to: string };
    kpi: KpiData;
    reportsTrends: ReportsTrendPoint[];
    helpRequestsByType: HelpRequestsByTypePoint[];
    userGrowth: UserGrowthPoint[];
    keyMetrics: KeyMetricsSummary;
  }

  export interface AnalyticsQueryParams {
    from: string; // YYYY-MM-DD
    to: string;   // YYYY-MM-DD; max 90 days from `from`
  }
  ```

- [X] T005 Create `frontend/src/types/settings.ts`. Export the following TypeScript types/interfaces **exactly** as defined below:

  ```typescript
  export type AdminRole = 'Administrator' | 'SuperAdministrator';

  export interface AdminProfile {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: AdminRole; // read-only — never included in save payload
  }

  export interface NotificationPreferences {
    emailNotifications: boolean;
    urgentReportAlerts: boolean;
    moderationAlerts: boolean;
    weeklyReports: boolean;
  }

  export type NotificationPreferenceKey = keyof NotificationPreferences;

  export interface SystemSettings {
    autoApproveReports: boolean;
    autoApproveThreshold: number;       // 0–100
    providerApprovalMode: 'Manual' | 'Automatic';
    trustScoreThreshold: number;         // 0–100, integer
    maxActiveHelpRequests: number;       // 1–10000, integer
  }

  export interface DisplayPreferences {
    language: string;  // IETF tag e.g. 'en'
    timezone: string;  // IANA e.g. 'Africa/Cairo'
  }
  ```

- [X] T006 Create `frontend/src/services/api/analytics.ts`. Implement one exported async mock function:

  ```typescript
  import type { AnalyticsSnapshot, AnalyticsQueryParams } from '../../types/analytics';

  export async function getAnalytics(params: AnalyticsQueryParams): Promise<AnalyticsSnapshot> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      dateRange: { from: params.from, to: params.to },
      kpi: {
        avgResponseTimeMinutes: 8.5, avgResponseTimeDelta: 12,
        userSatisfactionRate: 94,    userSatisfactionDelta: 3,
        resolutionRate: 87,          resolutionRateDelta: 5,
        activeHelpRequests: 42,      activeHelpRequestsDelta: -8,
      },
      reportsTrends: [
        { date: 'Apr 18', reports: 42, resolved: 38 },
        { date: 'Apr 19', reports: 55, resolved: 50 },
        { date: 'Apr 20', reports: 48, resolved: 44 },
        { date: 'Apr 21', reports: 60, resolved: 55 },
        { date: 'Apr 22', reports: 65, resolved: 60 },
        { date: 'Apr 23', reports: 70, resolved: 65 },
        { date: 'Apr 24', reports: 78, resolved: 72 },
      ],
      helpRequestsByType: [
        { date: 'Apr 18', medical: 10, towing: 8,  fuel: 5,  repair: 7  },
        { date: 'Apr 20', medical: 12, towing: 10, fuel: 8,  repair: 9  },
        { date: 'Apr 22', medical: 9,  towing: 15, fuel: 11, repair: 13 },
        { date: 'Apr 24', medical: 14, towing: 18, fuel: 12, repair: 16 },
      ],
      userGrowth: [
        { month: 'Jan', users: 7200  },
        { month: 'Feb', users: 8500  },
        { month: 'Mar', users: 10200 },
        { month: 'Apr', users: 11500 },
        { month: 'May', users: 13228 },
      ],
      keyMetrics: {
        totalReportsThisMonth: 3247, totalReportsDelta: 15,
        helpRequestsCompleted: 1892, helpRequestsDelta: 22,
        newUsersThisMonth: 1228,     newUsersDelta: 18,
      },
    };
  }
  ```

- [X] T007 Create `frontend/src/services/api/settings.ts`. Implement the following exported async mock functions (all add a 400ms artificial delay via `await new Promise((r) => setTimeout(r, 400))`):

  ```typescript
  import type { AdminProfile, NotificationPreferences, NotificationPreferenceKey, SystemSettings, DisplayPreferences } from '../../types/settings';

  // Shared in-memory state so mutations persist for the session
  let _profile: AdminProfile = { id: '1', fullName: 'Admin User', email: 'admin@ontheway.com', phoneNumber: '+1 (555) 123-4567', role: 'Administrator' };
  let _notifPrefs: NotificationPreferences = { emailNotifications: true, urgentReportAlerts: true, moderationAlerts: true, weeklyReports: false };
  let _systemSettings: SystemSettings = { autoApproveReports: false, autoApproveThreshold: 80, providerApprovalMode: 'Manual', trustScoreThreshold: 60, maxActiveHelpRequests: 100 };
  let _displayPrefs: DisplayPreferences = { language: 'en', timezone: 'Africa/Cairo' };

  export async function getAdminProfile(): Promise<AdminProfile> { await delay(); return { ..._profile }; }
  export async function saveAdminProfile(data: Omit<AdminProfile, 'id' | 'role'>): Promise<AdminProfile> { await delay(); _profile = { ..._profile, ...data }; return { ..._profile }; }
  export async function getNotificationPreferences(): Promise<NotificationPreferences> { await delay(); return { ..._notifPrefs }; }
  export async function updateNotificationPreference(key: NotificationPreferenceKey, value: boolean): Promise<NotificationPreferences> { await delay(); _notifPrefs = { ..._notifPrefs, [key]: value }; return { ..._notifPrefs }; }
  export async function getSystemSettings(): Promise<SystemSettings> { await delay(); return { ..._systemSettings }; }
  export async function saveSystemSettings(data: SystemSettings): Promise<SystemSettings> { await delay(); _systemSettings = { ...data }; return { ..._systemSettings }; }
  export async function getDisplayPreferences(): Promise<DisplayPreferences> { await delay(); return { ..._displayPrefs }; }
  export async function saveDisplayPreferences(data: DisplayPreferences): Promise<DisplayPreferences> { await delay(); _displayPrefs = { ...data }; return { ..._displayPrefs }; }

  function delay() { return new Promise((r) => setTimeout(r, 400)); }
  ```

- [X] T008 [P] Create `frontend/src/hooks/useGetAnalytics.ts`:

  ```typescript
  import { useQuery } from '@tanstack/react-query';
  import { getAnalytics } from '../services/api/analytics';
  import type { AnalyticsQueryParams } from '../types/analytics';

  export function useGetAnalytics(params: AnalyticsQueryParams) {
    return useQuery({
      queryKey: ['analytics', params.from, params.to],
      queryFn: () => getAnalytics(params),
      enabled: Boolean(params.from && params.to),
    });
  }
  ```

- [X] T009 [P] Create `frontend/src/hooks/useGetAdminProfile.ts`, `useGetNotificationPreferences.ts`, `useGetSystemSettings.ts`, and `useGetDisplayPreferences.ts` — four separate files, each following the same pattern:

  Each file imports the matching service function from `../services/api/settings` and calls `useQuery` with a stable query key:
  - `useGetAdminProfile` → queryKey `['settings', 'profile']`
  - `useGetNotificationPreferences` → queryKey `['settings', 'notification-preferences']`
  - `useGetSystemSettings` → queryKey `['settings', 'system']`
  - `useGetDisplayPreferences` → queryKey `['settings', 'display-preferences']`

  All four queries have no `enabled` condition (always run when mounted).

- [X] T010 [P] Create `frontend/src/hooks/useSaveAdminProfile.ts`:

  ```typescript
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import { saveAdminProfile } from '../services/api/settings';
  import type { AdminProfile } from '../types/settings';
  import { toast } from 'sonner';

  export function useSaveAdminProfile() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<AdminProfile, 'id' | 'role'>) => saveAdminProfile(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
        toast.success('Profile saved successfully.');
      },
      onError: () => { toast.error('Failed to save profile. Please try again.'); },
    });
  }
  ```

- [X] T011 [P] Create `frontend/src/hooks/useUpdateNotificationPreference.ts`. This mutation uses **optimistic update**:

  ```typescript
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import { updateNotificationPreference } from '../services/api/settings';
  import type { NotificationPreferences, NotificationPreferenceKey } from '../types/settings';
  import { toast } from 'sonner';

  export function useUpdateNotificationPreference() {
    const queryClient = useQueryClient();
    const QK = ['settings', 'notification-preferences'];
    return useMutation({
      mutationFn: ({ key, value }: { key: NotificationPreferenceKey; value: boolean }) =>
        updateNotificationPreference(key, value),
      onMutate: async ({ key, value }) => {
        await queryClient.cancelQueries({ queryKey: QK });
        const previous = queryClient.getQueryData<NotificationPreferences>(QK);
        queryClient.setQueryData<NotificationPreferences>(QK, (old) =>
          old ? { ...old, [key]: value } : old
        );
        return { previous };
      },
      onError: (_err, _vars, context) => {
        if (context?.previous) queryClient.setQueryData(QK, context.previous);
        toast.error('Failed to update preference. Please try again.');
      },
      onSuccess: () => { toast.success('Preference updated.'); },
    });
  }
  ```

- [X] T012 [P] Create `frontend/src/hooks/useSaveSystemSettings.ts` and `frontend/src/hooks/useSaveDisplayPreferences.ts`:

  `useSaveSystemSettings` → calls `saveSystemSettings`, invalidates `['settings', 'system']`, shows `toast.success('System settings saved.')` on success and `toast.error('Failed to save system settings.')` on error.

  `useSaveDisplayPreferences` → calls `saveDisplayPreferences`, invalidates `['settings', 'display-preferences']`, shows `toast.success('Display preferences saved.')` on success and `toast.error('Failed to save display preferences.')` on error.

  Both follow the same useMutation pattern as T010 (no optimistic update needed).

**Checkpoint**: All types, services, and hooks are ready. User story implementation can now begin.

---

## Phase 3: User Story 1 — View Analytics Dashboard (Priority: P1)

**Goal**: Deliver a fully functional `/analytics` page with KPI cards, three charts, key metrics summary, and skeleton loading states.

**Independent Verification**: Navigate to `/analytics`. Verify: (1) four KPI cards render with values and delta percentages; (2) Reports Trends area chart renders with two data series (reports, resolved); (3) Help Requests by Type grouped bar chart renders with four coloured series (medical, towing, fuel, repair); (4) User Growth line chart renders with a single line; (5) Key Metrics Summary shows three stat cards with deltas; (6) While loading, skeleton placeholders appear in place of each chart/card.

### Implementation for User Story 1

- [X] T013 [P] [US1] Create `frontend/src/components/analytics/KpiCard.tsx`. The component accepts these props:
  - `title: string` — label (e.g., "Avg Response Time")
  - `value: string | number` — the main displayed value
  - `delta: number` — signed float percentage (positive = up, negative = down)
  - `icon: React.ReactNode` — Lucide icon element
  
  Render a Shadcn `Card` with: icon top-right, `title` in muted small text, `value` in large bold text, and `delta` as a small coloured badge — green with `↑` if positive, red with `↓` if negative (use `cn()` from `lib/utils` for conditional classes). Show `"N/A"` for value and `"—"` for delta when either is undefined/null.

- [X] T014 [P] [US1] Create `frontend/src/components/analytics/ReportsTrendsChart.tsx`. The component accepts `data: ReportsTrendPoint[]` and `isLoading: boolean` props (import `ReportsTrendPoint` from `../../types/analytics`).

  When `isLoading` is true, render a Shadcn `Skeleton` with `className="h-[300px] w-full"`.

  When loaded, render inside a Shadcn `Card`:
  - Title: `"Reports Trends"` (card header)
  - A Recharts `ResponsiveContainer` (width `100%`, height `300`)
  - Inside: `AreaChart` with `data={data}`
  - Two `Area` elements: `dataKey="reports"` (stroke `#8884d8`, fill `#8884d8` at 30% opacity) and `dataKey="resolved"` (stroke `#82ca9d`, fill `#82ca9d` at 30% opacity)
  - Add `XAxis dataKey="date"`, `YAxis`, `Tooltip`, `Legend`, `CartesianGrid strokeDasharray="3 3"`
  - The `data` prop MUST be memoized with `useMemo` at the call site (enforced in T020).

- [X] T015 [P] [US1] Create `frontend/src/components/analytics/HelpRequestsByTypeChart.tsx`. Props: `data: HelpRequestsByTypePoint[]`, `isLoading: boolean`.

  Same loading skeleton pattern as T014. When loaded, render inside a Shadcn `Card`:
  - Title: `"Help Requests by Type"`
  - Recharts `ResponsiveContainer` (width `100%`, height `300`)
  - `BarChart` with `data={data}`
  - Four `Bar` elements: `dataKey="medical"` fill `#ff6b6b`, `dataKey="towing"` fill `#4ecdc4`, `dataKey="fuel"` fill `#45b7d1`, `dataKey="repair"` fill `#96ceb4`
  - Add `XAxis dataKey="date"`, `YAxis`, `Tooltip`, `Legend`, `CartesianGrid strokeDasharray="3 3"`

- [X] T016 [P] [US1] Create `frontend/src/components/analytics/UserGrowthChart.tsx`. Props: `data: UserGrowthPoint[]`, `isLoading: boolean`.

  Same loading skeleton pattern. When loaded, render inside a Shadcn `Card`:
  - Title: `"User Growth"`
  - Recharts `ResponsiveContainer` (width `100%`, height `300`)
  - `LineChart` with `data={data}`
  - One `Line` element: `dataKey="users"` stroke `#8884d8`, `type="monotone"`, `dot={{ r: 4 }}`
  - Add `XAxis dataKey="month"`, `YAxis`, `Tooltip`, `Legend`, `CartesianGrid strokeDasharray="3 3"`

- [X] T017 [P] [US1] Create `frontend/src/components/analytics/KeyMetricsSummary.tsx`. Props: `data: KeyMetricsSummary | undefined`, `isLoading: boolean` (import `KeyMetricsSummary` from `../../types/analytics`).

  When `isLoading`, render three skeleton cards side-by-side.

  When loaded, render a `div` with `className="grid grid-cols-1 md:grid-cols-3 gap-4"` containing three Shadcn `Card` components:
  1. "Total Reports This Month" — value: `data.totalReportsThisMonth`, delta: `data.totalReportsDelta`, accent colour blue
  2. "Help Requests Completed" — value: `data.helpRequestsCompleted`, delta: `data.helpRequestsDelta`, accent colour green
  3. "New Users This Month" — value: `data.newUsersThisMonth`, delta: `data.newUsersDelta`, accent colour purple

  Each card shows the count in large bold text and delta as a small percentage label (e.g., `"↑ 15% from last month"` for positive, `"↓ 8% from last month"` for negative).

- [X] T018 [US1] Create `frontend/src/components/analytics/KpiCardGrid.tsx`. Props: `kpi: KpiData | undefined`, `isLoading: boolean` (import `KpiData` from `../../types/analytics`).

  When `isLoading`, render four `Skeleton` placeholders in a grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`).

  When loaded, render four `KpiCard` components (import from `./KpiCard`) in the same grid:
  1. title `"Avg Response Time"`, value `` `${kpi.avgResponseTimeMinutes} min` ``, delta `kpi.avgResponseTimeDelta`, icon `<Clock className="h-5 w-5" />`
  2. title `"User Satisfaction"`, value `` `${kpi.userSatisfactionRate}%` ``, delta `kpi.userSatisfactionDelta`, icon `<Users className="h-5 w-5" />`
  3. title `"Resolution Rate"`, value `` `${kpi.resolutionRate}%` ``, delta `kpi.resolutionRateDelta`, icon `<CheckCircle className="h-5 w-5" />`
  4. title `"Active Help Requests"`, value `kpi.activeHelpRequests`, delta `kpi.activeHelpRequestsDelta`, icon `<HelpCircle className="h-5 w-5" />`

  All icons from `lucide-react`.

- [X] T019 [US1] Create `frontend/src/pages/analytics/index.tsx`. This is the `/analytics` page component.

  Structure:
  1. Page header: `<h1>Analytics</h1>` with subtitle `"System performance and insights"`.
  2. Call `useGetAnalytics({ from, to })` where `from`/`to` come from `dateRange` state (see step 4).
  3. Render `<KpiCardGrid kpi={data?.kpi} isLoading={isLoading} />`.
  4. Hold date range state: `const [dateRange, setDateRange] = useState({ from: format(subDays(new Date(), 6), 'yyyy-MM-dd'), to: format(new Date(), 'yyyy-MM-dd') })`. Use `date-fns` functions `format` and `subDays` (these are already available as Shadcn peer dependencies).
  5. Render `<AnalyticsDateRangePicker value={dateRange} onChange={setDateRange} />` (top-right of the page header area — create this component in T021).
  6. Memoize each chart data array:
     ```typescript
     const reportsTrends = useMemo(() => data?.reportsTrends ?? [], [data]);
     const helpRequestsByType = useMemo(() => data?.helpRequestsByType ?? [], [data]);
     const userGrowth = useMemo(() => data?.userGrowth ?? [], [data]);
     ```
  7. Render charts in a `div.space-y-6`: `<ReportsTrendsChart data={reportsTrends} isLoading={isLoading} />`, then a `div.grid.grid-cols-1.md:grid-cols-2.gap-6` containing `<HelpRequestsByTypeChart>` and `<UserGrowthChart>`.
  8. Render `<KeyMetricsSummary data={data?.keyMetrics} isLoading={isLoading} />`.
  9. If `isError`, render a Shadcn `Alert` with variant `"destructive"` and message `"Failed to load analytics data. Please try again."`.

- [X] T020 [US1] Create `frontend/src/components/analytics/AnalyticsDateRangePicker.tsx`. Props:
  - `value: { from: string; to: string }`
  - `onChange: (range: { from: string; to: string }) => void`

  Use the Shadcn `Calendar`/`DatePickerWithRange` pattern (Radix + `react-day-picker`). Display the selected range as a formatted string (e.g., `"Apr 18, 2026 – Apr 24, 2026"`). When the user selects a new range, enforce the 90-day cap: if the selected span exceeds 90 days, do NOT call `onChange` and instead display an inline error message: `"Maximum range is 90 days"`. Convert the `Date` objects from the picker to `yyyy-MM-dd` strings before calling `onChange`.

- [X] T021 [US1] Verify the Analytics page in the browser. Check: all four KPI cards display values and coloured delta badges; all three charts render with data and legends; Key Metrics Summary shows three cards; skeleton loaders appear during the simulated 600ms network delay; the page layout is responsive (stacks correctly on smaller screens); no TypeScript errors on `npm run build`.

**Checkpoint**: `/analytics` is fully functional and independently verifiable.

---

## Phase 4: User Story 3 — Edit Profile Settings (Priority: P1)

**Goal**: Deliver the `/settings` page shell with the Profile Settings section — a pre-populated editable form with client-side validation, a save mutation, and the unsaved-changes navigation guard.

**Independent Verification**: Navigate to `/settings`. Verify: (1) Profile Settings section renders with Full Name, Email, Phone Number pre-filled, and Role as a disabled/read-only field; (2) editing a field and clicking "Save Changes" shows a success toast; (3) submitting an invalid email shows an inline validation error and blocks submission; (4) editing a field then clicking a sidebar link shows the "You have unsaved changes. Leave anyway?" dialog; (5) confirming the dialog navigates away; dismissing keeps the user on Settings.

### Implementation for User Story 3

- [X] T022 [US3] Create `frontend/src/components/settings/UnsavedChangesDialog.tsx`. This component uses Shadcn `AlertDialog`. Props:
  - `open: boolean`
  - `onConfirm: () => void`  — called when user clicks "Leave"
  - `onCancel: () => void`   — called when user clicks "Stay"

  Render a Shadcn `AlertDialog` with:
  - Title: `"You have unsaved changes"`
  - Description: `"If you leave, your changes will be lost. Do you want to continue?"`
  - Two buttons: `AlertDialogAction` labelled `"Leave"` (calls `onConfirm`), `AlertDialogCancel` labelled `"Stay on page"` (calls `onCancel`).

- [X] T023 [US3] Create `frontend/src/components/settings/ProfileSettingsForm.tsx`. This component:

  1. Calls `useGetAdminProfile()` to populate form defaults.
  2. Calls `useSaveAdminProfile()` for the save mutation.
  3. Uses `useForm<Omit<AdminProfile, 'id' | 'role'>>` from `react-hook-form` with a Zod resolver. The Zod schema must be:
     ```typescript
     const profileSchema = z.object({
       fullName: z.string().min(1, 'Full name is required').max(100),
       email: z.string().email('Invalid email address'),
       phoneNumber: z.string().min(7, 'Phone number too short').max(20),
     });
     ```
  4. Uses `reset(data)` when profile data loads to populate defaults.
  5. On submit, calls `mutation.mutate(values)` and calls `form.reset(values)` on success to clear dirty state.
  6. Renders inside a Shadcn `Card` with header "Profile Settings" (use a `User` Lucide icon next to the heading):
     - `FormField` for Full Name → `Input`
     - `FormField` for Email Address → `Input type="email"`
     - `FormField` for Phone Number → `Input type="tel"`
     - A disabled `Input` showing `profile.role` labelled "Role" (not registered with RHF — purely display)
     - A `Button type="submit"` labelled "Save Changes" with `loading` state while mutation is pending.
  7. Export `isDirty` from this component so the parent page can use it for the navigation guard. Export it via a `ref` or expose `formState.isDirty` through a prop callback `onDirtyChange?: (dirty: boolean) => void`. Use the `onDirtyChange` prop approach: call `onDirtyChange(formState.isDirty)` inside a `useEffect` that watches `formState.isDirty`.

- [X] T024 [US3] Create `frontend/src/pages/settings/index.tsx` — the `/settings` page shell. This page:

  1. Maintains a `isDirty` state: `const [isDirty, setIsDirty] = useState(false)`.
  2. Uses React Router v7's `useBlocker` to intercept navigation when `isDirty` is true:
     ```typescript
     const blocker = useBlocker(isDirty);
     ```
  3. Renders `<UnsavedChangesDialog open={blocker.state === 'blocked'} onConfirm={() => blocker.proceed()} onCancel={() => blocker.reset()} />`.
  4. Renders the page heading: `<h1>Settings</h1>` with subtitle `"Manage your account and system preferences"`.
  5. Renders the following sections in order, each separated by vertical space (`space-y-8`):
     - `<ProfileSettingsForm onDirtyChange={setIsDirty} />`
     - `{/* Notification Preferences — T030 */}`
     - `{/* System Settings — T035 */}`
     - `{/* Display Preferences — T041 */}`
  6. Only the `ProfileSettingsForm` and its placeholder comments are needed at this stage.

- [X] T025 [US3] Verify the Profile Settings section in the browser. Check: form is pre-filled; save button shows loading state during mutation; success toast appears after save; inline validation error appears for bad email without submitting; editing a field and clicking a sidebar nav item triggers the unsaved-changes dialog; confirming navigates away; cancelling stays on page. No TypeScript errors on `npm run build`.

**Checkpoint**: `/settings` page shell and Profile Settings section are fully functional.

---

## Phase 5: User Story 4 — Manage Notification Preferences (Priority: P2)

**Goal**: Add the Notification Preferences section to `/settings` with auto-save toggles (optimistic update + toast) and no separate Save button.

**Independent Verification**: Navigate to `/settings` and scroll to Notification Preferences. Verify: (1) four toggle switches render with correct initial states (emailNotifications: on, urgentReportAlerts: on, moderationAlerts: on, weeklyReports: off); (2) toggling any switch immediately updates the UI (optimistic) and shows a "Preference updated." toast; (3) the toggle switch has an accessible label; (4) the section does not affect the ProfileSettingsForm dirty state and does not trigger the unsaved-changes guard.

### Implementation for User Story 4

- [X] T026 [US4] Create `frontend/src/components/settings/NotificationPreferencesSection.tsx`. This component:

  1. Calls `useGetNotificationPreferences()` to load current state.
  2. Calls `useUpdateNotificationPreference()` for mutations.
  3. Renders inside a Shadcn `Card` with header "Notification Preferences" (use a `Bell` Lucide icon).
  4. When loading, render four `Skeleton` rows.
  5. When loaded, render four rows, each containing:
     - A `div` with the preference label (bold, e.g., `"Email Notifications"`) and a description below it in muted text (see descriptions below)
     - A Shadcn `Switch` on the right side, `checked={prefs.emailNotifications}`, `onCheckedChange={(v) => mutate({ key: 'emailNotifications', value: v })}`, with `aria-label="Toggle email notifications"`

  Preference rows:
  | Key | Label | Description |
  |-----|-------|-------------|
  | `emailNotifications` | Email Notifications | Receive email updates for important events |
  | `urgentReportAlerts` | Urgent Report Alerts | Get notified when urgent reports are submitted |
  | `moderationAlerts` | Moderation Alerts | Notifications for content requiring moderation |
  | `weeklyReports` | Weekly Reports | Receive weekly analytics and summary reports |

  The Switch is `disabled` while the mutation is pending (`mutation.isPending`).

- [X] T027 [US4] Add `<NotificationPreferencesSection />` to the settings page (`frontend/src/pages/settings/index.tsx`) immediately after `<ProfileSettingsForm>`. Replace the `{/* Notification Preferences — T030 */}` comment with the actual component import and render.

- [X] T028 [US4] Verify the Notification Preferences section in the browser. Check: toggles render with correct initial states; toggling shows optimistic update immediately; success toast appears after simulated delay; error rollback works (not easily testable with mock but confirm no TypeScript errors); switches have accessible labels (inspect with browser DevTools → Accessibility). No TypeScript errors on `npm run build`.

**Checkpoint**: Notification Preferences section is fully functional with auto-save.

---

## Phase 6: User Story 5 — Configure System Settings (Priority: P2)

**Goal**: Add the System Settings section to `/settings` with an "Admin Only" badge. Fields are editable for SuperAdministrator role only — disabled/read-only for standard Administrator role. Saving triggers a toast.

**Independent Verification**: Navigate to `/settings` and scroll to System Settings. Verify: (1) section shows "Admin Only" badge; (2) if role is `'Administrator'`, all input fields are disabled and a read-only notice is displayed; (3) if role is `'SuperAdministrator'`, fields are editable and "Save System Settings" button works; (4) invalid values (e.g., Trust Score > 100) show inline validation errors.

### Implementation for User Story 6

- [X] T029 [US5] Create `frontend/src/components/settings/SystemSettingsForm.tsx`. This component:

  1. Reads the current user's role from the existing auth store (look for `useAuthStore` or similar in `frontend/src/` — if not found, read from `localStorage` key `'user'` or use a hardcoded `'Administrator'` for mock purposes, leaving a `// TODO Phase 10: use real auth store` comment).
  2. Calls `useGetSystemSettings()` to load values.
  3. Calls `useSaveSystemSettings()` for the mutation.
  4. Uses `useForm<SystemSettings>` with this Zod schema:
     ```typescript
     const systemSchema = z.object({
       autoApproveReports: z.boolean(),
       autoApproveThreshold: z.number().int().min(0).max(100),
       providerApprovalMode: z.enum(['Manual', 'Automatic']),
       trustScoreThreshold: z.number().int().min(0).max(100),
       maxActiveHelpRequests: z.number().int().min(1).max(10000),
     });
     ```
  5. `const isSuperAdmin = role === 'SuperAdministrator'`.
  6. Renders inside a Shadcn `Card` with header: `"System Settings"` (use `Shield` Lucide icon) and a `Badge variant="destructive"` with text `"Admin Only"` next to the title.
  7. If `isLoading`, render skeleton inputs.
  8. When loaded, renders a two-column grid (`grid grid-cols-1 md:grid-cols-2 gap-4`) with these fields — all with `disabled={!isSuperAdmin}`:
     - Auto-Approve Reports: `Switch` (boolean)
     - Provider Approval: `Select` with options `Manual` and `Automatic`
     - Trust Score Threshold: `Input type="number"` min=0 max=100
     - Max Active Help Requests: `Input type="number"` min=1 max=10000
  9. If `!isSuperAdmin`, render a notice above the form: `"System settings are read-only. Contact a Super Administrator to make changes."` (use Shadcn `Alert` with info variant).
  10. A `Button type="submit"` labelled "Save System Settings" — hidden or disabled if `!isSuperAdmin`. Shows loading state while mutation is pending.
  11. Exposes `onDirtyChange?: (dirty: boolean) => void` prop (same pattern as ProfileSettingsForm in T023 step 7), calling it in a `useEffect` watching `formState.isDirty`.

- [X] T030 [US5] Add `<SystemSettingsForm onDirtyChange={(dirty) => setIsDirty((prev) => prev || dirty)} />` to the settings page (`frontend/src/pages/settings/index.tsx`) replacing the `{/* System Settings — T035 */}` comment. Update the `isDirty` logic: use `useCallback` or combine dirty flags so that EITHER ProfileSettings OR SystemSettings being dirty triggers the navigation guard.

  Recommended approach — replace single `isDirty` state with:
  ```typescript
  const [dirtyForms, setDirtyForms] = useState<Record<string, boolean>>({});
  const isAnyDirty = Object.values(dirtyForms).some(Boolean);
  const blocker = useBlocker(isAnyDirty);
  ```
  Pass `onDirtyChange={(dirty) => setDirtyForms((prev) => ({ ...prev, profile: dirty }))}` to ProfileSettingsForm and `onDirtyChange={(dirty) => setDirtyForms((prev) => ({ ...prev, system: dirty }))}` to SystemSettingsForm.

- [X] T031 [US5] Verify the System Settings section in the browser. Check: "Admin Only" badge displays; all fields are disabled (mock role is `'Administrator'` by default per T007); read-only notice shows; change mock role to `'SuperAdministrator'` in `services/api/settings.ts` temporarily and verify fields become editable and Save works with success toast; revert mock role. No TypeScript errors.

**Checkpoint**: System Settings section renders correctly with role-based access control.

---

## Phase 7: User Story 2 — Filter Analytics by Date Range (Priority: P2)

**Goal**: Make the date range picker on `/analytics` functional — changing the range refreshes all charts and KPI cards. The 90-day cap is enforced by the picker.

**Independent Verification**: On `/analytics`, use the date range picker to select a custom range. Verify: (1) all charts and KPI cards re-fetch and re-render with new data; (2) selecting a range wider than 90 days shows the "Maximum range is 90 days" inline error and does NOT trigger a fetch; (3) clearing the selection resets to the default 7-day window; (4) skeleton loaders appear during refetch.

> **Note**: The `AnalyticsDateRangePicker` component was already created in T020. This phase verifies it integrates correctly with the page and enforces the 90-day cap end-to-end.

### Implementation for User Story 2

- [X] T032 [US2] Verify the `AnalyticsDateRangePicker` component (created in T020) correctly: (a) enforces the 90-day cap with an inline error message when exceeded; (b) converts picker `Date` objects to `yyyy-MM-dd` strings before calling `onChange`; (c) the selected range is passed to `useGetAnalytics` causing a re-fetch (the `queryKey` changes so React Query fires a new request); (d) clearing the selection resets `dateRange` state to the default last-7-days window. If any of these are not working, fix the component now.

- [X] T033 [US2] Verify responsive layout of the analytics page header (KPI card grid + date picker). On small screens (< 768px), the date picker should stack below the page title (not overflow the viewport). Adjust Tailwind classes in `pages/analytics/index.tsx` if needed (e.g., wrap header in a `flex flex-col sm:flex-row` container).

**Checkpoint**: Date range filtering works end-to-end, 90-day cap enforced.

---

## Phase 8: User Story 6 — Update Display Preferences (Priority: P3)

**Goal**: Add the Display Preferences section to `/settings` with Language and Timezone dropdowns.

**Independent Verification**: Navigate to `/settings` and scroll to Display Preferences. Verify: (1) Language and Timezone dropdowns render with current values (`en` / `Africa/Cairo`); (2) changing a value and clicking "Save Preferences" shows a success toast; (3) the section participates in the dirty/unsaved-changes guard.

### Implementation for User Story 6

- [X] T034 [US6] Create `frontend/src/components/settings/DisplayPreferencesForm.tsx`. This component:

  1. Calls `useGetDisplayPreferences()`.
  2. Calls `useSaveDisplayPreferences()`.
  3. Uses `useForm<DisplayPreferences>` with Zod schema:
     ```typescript
     const displaySchema = z.object({
       language: z.string().min(1, 'Language is required'),
       timezone: z.string().min(1, 'Timezone is required'),
     });
     ```
  4. Renders inside a Shadcn `Card` with header "Preferences" (use `Globe` Lucide icon).
  5. Two `FormField` components using Shadcn `Select`:
     - Language: options `[{ value: 'en', label: 'English' }, { value: 'ar', label: 'Arabic' }, { value: 'fr', label: 'French' }]`
     - Timezone: options `[{ value: 'Africa/Cairo', label: 'Cairo (UTC+3)' }, { value: 'UTC', label: 'UTC' }, { value: 'America/New_York', label: 'New York (UTC-5)' }, { value: 'Europe/London', label: 'London (UTC+0)' }]`
  6. A `Button type="submit"` labelled "Save Preferences" with loading state.
  7. Exposes `onDirtyChange?: (dirty: boolean) => void` (same pattern as T023 and T029).

- [X] T035 [US6] Add `<DisplayPreferencesForm onDirtyChange={(dirty) => setDirtyForms((prev) => ({ ...prev, display: dirty }))} />` to the settings page replacing the `{/* Display Preferences — T041 */}` comment. Import the component.

- [X] T036 [US6] Verify Display Preferences section in the browser. Check: dropdowns show correct initial values; saving shows success toast; changing a value triggers the unsaved-changes guard when navigating away. No TypeScript errors.

**Checkpoint**: All four settings sections are now complete and functional.

---

## Phase 9: User Stories 1 & 3 — KPI Card Grid (Priority: P1 refinement)

> These tasks were deferred from Phase 3 to ensure chart components were complete before the grid was assembled.

- [X] T037 [US1] Verify the `KpiCardGrid` (T018) renders correctly with all four cards. Check: delta badges show correct colours (green for positive, red for negative); `"N/A"` fallback renders when data is undefined (test by temporarily disabling the query); icons render from Lucide. Fix any issues.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive layout, loading/error/empty states, lint, and build verification across both routes.

- [X] T038 Run `npm run lint` and fix any reported errors in the newly created files under `frontend/src/types/`, `frontend/src/services/api/`, `frontend/src/hooks/`, `frontend/src/components/analytics/`, `frontend/src/components/settings/`, `frontend/src/pages/analytics/`, and `frontend/src/pages/settings/`.

- [X] T039 Run `npm run build` (or `tsc --noEmit` if build script is unavailable). Fix any TypeScript compilation errors in the new files. Common issues to check: missing imports, `any` types (prohibited by Constitution), unused variables, wrong prop types.

- [X] T040 [P] Accessibility audit for the Analytics page. Using browser DevTools (Accessibility tab), verify: `<h1>Analytics</h1>` exists; all chart containers have `role="img"` and `aria-label` attributes (add them to the `ResponsiveContainer` wrapper divs if missing, e.g., `aria-label="Reports trends area chart"`); date range picker is keyboard-accessible; KPI cards have meaningful text readable by screen readers (value + delta as text, not just colour).

- [X] T041 [P] Accessibility audit for the Settings page. Verify: `<h1>Settings</h1>` exists; all `Switch` elements have `aria-label` attributes (check T026); all form fields have associated `<label>` elements or `aria-label`; `AlertDialog` (unsaved-changes guard) traps focus when open; all buttons have descriptive accessible names.

- [X] T042 [P] Responsive layout verification. Resize browser to 375px width (mobile). Verify: Analytics page — KPI cards stack in a single column; charts don't overflow viewport; date picker does not break layout. Settings page — all form sections stack vertically; inputs are full-width; buttons are accessible and not clipped.

- [X] T043 Empty-state and error-state verification for Analytics. Temporarily modify `getAnalytics` in `services/api/analytics.ts` to return empty arrays (`reportsTrends: []`, etc.) and verify: each chart shows a meaningful empty state (no blank white box; verify the Recharts components handle empty arrays gracefully — if not, add a conditional render: `if (data.length === 0) return <p className="text-muted-foreground text-center py-8">No data for selected period</p>`). Restore original mock data after verification.

- [X] T044 Verify the Sonner `<Toaster>` component is mounted in the app root (typically `frontend/src/main.tsx` or `frontend/src/App.tsx`). If it is not already present, add `import { Toaster } from 'sonner'` and render `<Toaster />` inside the root layout. Without this, no toast notifications will appear.

- [X] T045 Final end-to-end walkthrough: open the app, navigate to `/analytics`, verify the full page renders with mock data and date range picker works; navigate to `/settings`, verify all four sections render, edit the profile and verify the unsaved-changes guard, save the profile, toggle a notification preference, verify System Settings is read-only for the default Administrator role, save display preferences. Confirm no console errors or warnings.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user story phases**.
- **Phase 3 (US1 — Analytics Dashboard)**: Depends on Phase 2.
- **Phase 4 (US3 — Profile Settings)**: Depends on Phase 2.
- **Phase 5 (US4 — Notification Prefs)**: Depends on Phase 4 (settings page shell must exist).
- **Phase 6 (US5 — System Settings)**: Depends on Phase 4.
- **Phase 7 (US2 — Date Range Filter)**: Depends on Phase 3 (date picker created in T020 during US1).
- **Phase 8 (US6 — Display Prefs)**: Depends on Phase 4.
- **Phase 9 (Polish US1)**: Depends on Phase 3.
- **Phase 10 (Polish)**: Depends on all story phases being complete.

### Parallel Opportunities Within Phases

- **Phase 2**: T004, T005, T006, T007 can start in parallel; T008–T012 can start after T004+T005 complete (need types).
- **Phase 3**: T013, T014, T015, T016, T017 are all parallel (different files); T018 needs T013; T019 needs T014–T018; T020 is parallel to T013–T017.
- **Phase 10**: T038, T039, T040, T041, T042, T043 can all run in parallel.

---

## Implementation Strategy

### MVP First (Analytics Page Only)

1. Complete Phase 1 (Setup — T001–T003)
2. Complete Phase 2 Foundational, analytics subset only (T004, T006, T008)
3. Complete Phase 3 (US1 — T013–T021)
4. **STOP and VALIDATE**: `/analytics` page works independently
5. Then proceed to Settings phases

### Incremental Delivery

1. Setup → Foundational → Analytics page (MVP)
2. + Profile Settings form
3. + Notification Preferences toggles
4. + System Settings form
5. + Display Preferences form
6. + Date Range Filter verification
7. + Polish

---

## Notes

- All file paths are relative to `frontend/src/` unless prefixed with `frontend/`.
- `[P]` tasks operate on different files — they have no dependency on each other and can be executed simultaneously.
- Every settings form uses `onDirtyChange` to contribute to the global dirty state — do not skip this wiring.
- The mock service in `services/api/settings.ts` (T007) uses module-level `let` variables so state persists within a browser session but resets on page reload — this is intentional for mock-only mode.
- Recharts requires `recharts` in `package.json` (already listed in PLAN.md). Verify it is installed before starting T014.
- `react-day-picker` is a peer dependency of Shadcn date picker components — verify it is installed before starting T020.
- All `toast()` calls require `<Toaster />` mounted in the app root (verified in T044).
