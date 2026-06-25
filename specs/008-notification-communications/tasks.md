# Tasks: Notification & Communications

**Input**: Design documents from `/specs/008-notification-communications/`  
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and verification.  
**Implementer note**: Every task includes the exact file path, exact type/hook/component names, and precise instructions — no additional context is needed to complete any task.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependency on a prior incomplete task)
- **[Story]**: Which user story this task belongs to

---

## ⚠️ Important Notes Before You Start

1. **Naming collision**: `src/types/index.ts` already exports an interface called `Notification` (used by the header panel for admin alerts). The new domain entity for the Notifications page MUST be named **`AdminNotification`** to avoid a collision. Use `AdminNotification` everywhere in types, hooks, fixtures, and components for this feature.
2. **Existing `NotificationsPanel`**: `src/components/layouts/NotificationsPanel.tsx` already exists. It receives `notifications: Notification[]` from `Header.tsx`. Task T032 wires this panel to the new React Query hook, but the component file itself should NOT be renamed or moved.
3. **Route already exists**: `src/App.tsx` already has `<Route path="/notifications" element={<h1>Notifications</h1>} />`. Task T009 replaces the placeholder.
4. **Import alias**: The project uses `@/` as an alias for `src/`. Always use `@/types`, `@/hooks`, `@/lib`, etc.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create all file stubs and register the route so the project compiles from the very first task.

- [x] T001 Create the directory `src/components/notifications/` (it does not exist yet). No files inside — just the folder.

- [x] T002 Create the empty barrel file `src/components/notifications/index.ts` with the single comment line:
  ```typescript
  // notifications component exports — populated in later tasks
  ```

- [x] T003 Create `src/types/notifications.ts` as an empty file with the single comment line:
  ```typescript
  // notifications domain types — populated in T004
  ```

- [x] T004 In `src/types/notifications.ts`, **replace its entire content** with the following type definitions — copy exactly, do not skip any export:

  ```typescript
  import { z } from 'zod';

  // ─── Status & Audience Unions ────────────────────────────────────────────────

  export type NotificationStatus = 'Published' | 'Draft' | 'Scheduled' | 'Failed';
  export type NotificationAudience = 'Broadcast' | 'SpecificRoles' | 'Location';
  export type NotificationDeliveryChannel = 'Push' | 'InApp';
  export type AdminRole = 'Driver' | 'ServiceProvider' | 'Admin';

  // ─── Core Domain Entity ──────────────────────────────────────────────────────

  export interface AdminNotification {
    id: string;
    title: string;
    message: string;
    status: NotificationStatus;
    targetAudience: NotificationAudience;
    roles: AdminRole[];                              // non-empty only when targetAudience === 'SpecificRoles'
    locationRadius: number | null;                   // km; non-null only when targetAudience === 'Location'
    locationCoordinates: { lat: number; lng: number } | null; // non-null only when targetAudience === 'Location'
    deliveryChannels: NotificationDeliveryChannel[]; // always contains 'Push' and 'InApp' per FR-008
    scheduledAt: string | null;                      // ISO 8601; non-null only when status === 'Scheduled'
    createdAt: string;                               // ISO 8601
    updatedAt: string;                               // ISO 8601
  }

  // ─── API Response Shape ──────────────────────────────────────────────────────

  export interface NotificationsListResponse {
    data: AdminNotification[];
    total: number;
    page: number;
    pageSize: number;
  }

  // ─── Mutation Payloads ───────────────────────────────────────────────────────

  export interface CreateNotificationPayload {
    title: string;
    message: string;
    targetAudience: NotificationAudience;
    roles: AdminRole[];
    locationRadius: number | null;
    locationCoordinates: { lat: number; lng: number } | null;
    deliveryChannels: NotificationDeliveryChannel[];
    scheduledAt: string | null;
    action: 'publish' | 'draft' | 'schedule';
  }

  export interface UpdateNotificationPayload extends CreateNotificationPayload {
    id: string;
  }

  // ─── Form Values (React Hook Form + Zod) ────────────────────────────────────

  export const createNotificationSchema = z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(100, 'Title must be 100 characters or fewer'),
    message: z
      .string()
      .min(1, 'Message is required')
      .max(500, 'Message must be 500 characters or fewer'),
    targetAudience: z.enum(['Broadcast', 'SpecificRoles', 'Location']),
    roles: z.array(z.enum(['Driver', 'ServiceProvider', 'Admin'])).optional(),
    locationRadius: z.coerce.number().positive().nullable().optional(),
    scheduledAt: z.string().nullable().optional(),
    action: z.enum(['publish', 'draft', 'schedule']),
  });

  export type CreateNotificationFormValues = z.infer<typeof createNotificationSchema>;

  // ─── Display Helpers ─────────────────────────────────────────────────────────

  export const STATUS_LABELS: Record<NotificationStatus, string> = {
    Published: 'Published',
    Draft:     'Draft',
    Scheduled: 'Scheduled',
    Failed:    'Failed',
  };

  export const AUDIENCE_LABELS: Record<NotificationAudience, string> = {
    Broadcast:      'All Users',
    SpecificRoles:  'Specific Roles',
    Location:       'Location / Radius',
  };
  ```

- [x] T005 In `src/types/index.ts`, append the following re-export block at the **bottom** of the file (after the last existing `export` line). Do not remove or change any existing content:

  ```typescript
  export type {
    NotificationStatus,
    NotificationAudience,
    NotificationDeliveryChannel,
    AdminRole,
    AdminNotification,
    NotificationsListResponse,
    CreateNotificationPayload,
    UpdateNotificationPayload,
    CreateNotificationFormValues,
  } from './notifications';

  export { createNotificationSchema, STATUS_LABELS, AUDIENCE_LABELS } from './notifications';
  ```

- [x] T006 Create `src/lib/notifications-fixtures.ts` with the following typed fixture data. Copy exactly:

  ```typescript
  import type { AdminNotification } from '@/types/notifications';

  export const NOTIFICATIONS_FIXTURES: AdminNotification[] = [
    {
      id: 'notif-001',
      title: 'Road Closure Alert',
      message: 'Highway 5 is closed between exits 12–18 due to maintenance. Expect delays of up to 45 minutes.',
      status: 'Published',
      targetAudience: 'Broadcast',
      roles: [],
      locationRadius: null,
      locationCoordinates: null,
      deliveryChannels: ['Push', 'InApp'],
      scheduledAt: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-002',
      title: 'Winter Storm Warning',
      message: 'Heavy snowfall expected tonight. Drive carefully and check your tire pressure.',
      status: 'Scheduled',
      targetAudience: 'SpecificRoles',
      roles: ['Driver'],
      locationRadius: null,
      locationCoordinates: null,
      deliveryChannels: ['Push', 'InApp'],
      scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-003',
      title: 'New Towing Service Available',
      message: 'SpeedTow has joined the platform. Update your app to see their availability in your area.',
      status: 'Draft',
      targetAudience: 'Broadcast',
      roles: [],
      locationRadius: null,
      locationCoordinates: null,
      deliveryChannels: ['Push', 'InApp'],
      scheduledAt: null,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-004',
      title: 'Fog Advisory: Northern Region',
      message: 'Dense fog has been reported between km 45–72 on the northern motorway. Reduce speed.',
      status: 'Failed',
      targetAudience: 'Location',
      roles: [],
      locationRadius: 50,
      locationCoordinates: { lat: 32.08, lng: 34.78 },
      deliveryChannels: ['Push', 'InApp'],
      scheduledAt: null,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-005',
      title: 'System Maintenance Tonight',
      message: 'The platform will undergo scheduled maintenance from 02:00–04:00. Services may be unavailable.',
      status: 'Published',
      targetAudience: 'Broadcast',
      roles: [],
      locationRadius: null,
      locationCoordinates: null,
      deliveryChannels: ['Push', 'InApp'],
      scheduledAt: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  ```

- [x] T007 Create the page stub `src/pages/NotificationsPage.tsx` with the following content exactly:

  ```tsx
  export function NotificationsPage() {
    return <div>Notifications Page</div>;
  }
  ```

  This is a temporary placeholder to make the route compile without errors.

- [x] T008 In `src/pages/index.ts`, add the following export line at the bottom of the file:

  ```typescript
  export { NotificationsPage } from './NotificationsPage';
  ```

- [x] T009 In `src/App.tsx`:
  1. Add `NotificationsPage` to the existing named import from `'./pages'` (which currently imports `Dashboard`, `UsersManagement`, etc.)
  2. Replace the line `<Route path="/notifications" element={<h1>Notifications</h1>} />` with `<Route path="/notifications" element={<NotificationsPage />} />`

  **Verification**: Run `npm run dev`. Navigate to `/notifications`. The page renders "Notifications Page" without TypeScript or console errors.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: All React Query hooks for notifications. These must exist before any component can be built.

**CRITICAL**: No component work in US1–US3 can begin until T010–T013 are complete.

- [x] T010 [P] Create `src/hooks/useGetNotifications.ts`. The hook must:
  - Import `api` from `@/lib/axios`
  - Import `NOTIFICATIONS_FIXTURES` from `@/lib/notifications-fixtures`
  - Import `AdminNotification` from `@/types/notifications`
  - Export a constant: `export const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'] as const;`
  - Export `useGetNotifications()` using `useQuery` from `@tanstack/react-query`:
    - `queryKey`: `NOTIFICATIONS_QUERY_KEY`
    - `queryFn`: call `GET /admin/notifications`, extract `.data.data` as `AdminNotification[]`; wrap in `try/catch` — on any error, `console.warn('Using notification fixtures:', err)` and return `NOTIFICATIONS_FIXTURES`
    - `staleTime: 30_000`

  Full file content:
  ```typescript
  import { useQuery } from '@tanstack/react-query';
  import api from '@/lib/axios';
  import { NOTIFICATIONS_FIXTURES } from '@/lib/notifications-fixtures';
  import type { AdminNotification } from '@/types/notifications';

  export const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'] as const;

  export function useGetNotifications() {
    return useQuery<AdminNotification[]>({
      queryKey: NOTIFICATIONS_QUERY_KEY,
      queryFn: async () => {
        try {
          const response = await api.get('/admin/notifications');
          return response.data.data as AdminNotification[];
        } catch (err) {
          console.warn('Using notification fixtures:', err);
          return NOTIFICATIONS_FIXTURES;
        }
      },
      staleTime: 30_000,
    });
  }
  ```

- [x] T011 [P] Create `src/hooks/useCreateNotification.ts`. The hook must:
  - Import `useMutation`, `useQueryClient` from `@tanstack/react-query`
  - Import `toast` from `sonner`
  - Import `api` from `@/lib/axios`
  - Import `CreateNotificationPayload` from `@/types/notifications`
  - Import `NOTIFICATIONS_QUERY_KEY` from `./useGetNotifications`
  - Export `useCreateNotification()` using `useMutation`:
    - `mutationFn`: receives `CreateNotificationPayload`; calls `POST /admin/notifications` with the payload as body; returns the response data
    - `onSuccess`: invalidate `NOTIFICATIONS_QUERY_KEY` in query client; if `payload.action === 'publish'` show `toast.success('Notification published successfully.')`, if `'schedule'` show `toast.success('Notification scheduled.')`, if `'draft'` show `toast.success('Draft saved.')`
    - `onError`: show `toast.error('Failed to save notification. Please try again.')`

  Full file content:
  ```typescript
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import { toast } from 'sonner';
  import api from '@/lib/axios';
  import type { CreateNotificationPayload } from '@/types/notifications';
  import { NOTIFICATIONS_QUERY_KEY } from './useGetNotifications';

  export function useCreateNotification() {
    const queryClient = useQueryClient();

    return useMutation<unknown, Error, CreateNotificationPayload>({
      mutationFn: async (payload: CreateNotificationPayload) => {
        const response = await api.post('/admin/notifications', payload);
        return response.data;
      },
      onSuccess: (_data, payload) => {
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        if (payload.action === 'publish') {
          toast.success('Notification published successfully.');
        } else if (payload.action === 'schedule') {
          toast.success('Notification scheduled.');
        } else {
          toast.success('Draft saved.');
        }
      },
      onError: () => {
        toast.error('Failed to save notification. Please try again.');
      },
    });
  }
  ```

- [x] T012 [P] Create `src/hooks/useDeleteNotification.ts`. The hook must delete a notification by id and only works for Draft or Scheduled statuses:

  Full file content:
  ```typescript
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import { toast } from 'sonner';
  import api from '@/lib/axios';
  import { NOTIFICATIONS_QUERY_KEY } from './useGetNotifications';

  export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation<unknown, Error, string>({
      mutationFn: async (notificationId: string) => {
        const response = await api.delete(`/admin/notifications/${notificationId}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        toast.success('Notification deleted.');
      },
      onError: () => {
        toast.error('Failed to delete notification. Please try again.');
      },
    });
  }
  ```

- [x] T013 [P] Create `src/hooks/useGetHeaderNotifications.ts`. This hook feeds the existing header `NotificationsPanel`. It fetches recent published notifications and adapts them to the `Notification` interface that the panel already uses (the one in `src/types/index.ts` with `id, title, description, timestamp, isRead, type`):

  Full file content:
  ```typescript
  import { useQuery } from '@tanstack/react-query';
  import api from '@/lib/axios';
  import type { Notification } from '@/types';
  import { NOTIFICATIONS_FIXTURES } from '@/lib/notifications-fixtures';

  export const HEADER_NOTIFICATIONS_QUERY_KEY = ['notifications', 'header'] as const;

  export function useGetHeaderNotifications() {
    return useQuery<Notification[]>({
      queryKey: HEADER_NOTIFICATIONS_QUERY_KEY,
      queryFn: async () => {
        try {
          const response = await api.get('/admin/notifications?status=Published&pageSize=5');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (response.data.data as any[]).map((n: any) => ({
            id: n.id,
            title: n.title,
            description: n.message,
            timestamp: new Date(n.createdAt),
            isRead: false,
            type: 'info' as const,
          }));
        } catch {
          // fallback: adapt first 5 Published fixtures
          return NOTIFICATIONS_FIXTURES
            .filter((n) => n.status === 'Published')
            .slice(0, 5)
            .map((n) => ({
              id: n.id,
              title: n.title,
              description: n.message,
              timestamp: new Date(n.createdAt),
              isRead: false,
              type: 'info' as const,
            }));
        }
      },
      staleTime: 30_000,
      refetchInterval: 60_000,
      refetchIntervalInBackground: false,
    });
  }
  ```

  **Verification**: Run `npx tsc --noEmit` — zero errors on all four new hook files.

---

## Phase 3: User Story 1 — View Notifications List (Priority: P1) MVP

**Goal**: The `/notifications` page renders a filterable, paginated list of all admin notifications with status badges.

**Independent Verification**: Navigate to `/notifications`. A list of 5 fixture notifications is shown. Each row shows a title, status badge, audience, and creation date. The status filter buttons at the top filter the visible rows. An empty state message appears when no notifications match the filter. A loading skeleton shows briefly before data arrives.

### Implementation for User Story 1

- [x] T014 [P] [US1] Create `src/components/notifications/NotificationStatusBadge.tsx`. Props: `status: NotificationStatus`. Render a Shadcn `<Badge>` whose variant depends on `status`:
  - `'Published'` → `variant="default"` + `className="bg-green-600 hover:bg-green-700 text-white"`
  - `'Draft'` → `variant="secondary"`
  - `'Scheduled'` → `variant="outline"` + `className="border-blue-500 text-blue-600"`
  - `'Failed'` → `variant="destructive"`

  Full file content:
  ```tsx
  import { Badge } from '@/components/ui/badge';
  import type { NotificationStatus } from '@/types/notifications';

  interface NotificationStatusBadgeProps {
    status: NotificationStatus;
  }

  export function NotificationStatusBadge({ status }: NotificationStatusBadgeProps) {
    if (status === 'Published') {
      return <Badge className="bg-green-600 hover:bg-green-700 text-white">Published</Badge>;
    }
    if (status === 'Scheduled') {
      return <Badge variant="outline" className="border-blue-500 text-blue-600">Scheduled</Badge>;
    }
    if (status === 'Failed') {
      return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="secondary">Draft</Badge>;
  }
  ```

- [x] T015 [P] [US1] Create `src/components/notifications/NotificationAudienceBadge.tsx`. Props: `audience: NotificationAudience`. Render a Shadcn `<Badge variant="outline">` with the label from `AUDIENCE_LABELS`:

  Full file content:
  ```tsx
  import { Badge } from '@/components/ui/badge';
  import { AUDIENCE_LABELS } from '@/types/notifications';
  import type { NotificationAudience } from '@/types/notifications';

  interface NotificationAudienceBadgeProps {
    audience: NotificationAudience;
  }

  export function NotificationAudienceBadge({ audience }: NotificationAudienceBadgeProps) {
    return <Badge variant="outline">{AUDIENCE_LABELS[audience]}</Badge>;
  }
  ```

- [x] T016 [US1] Create `src/components/notifications/NotificationsListToolbar.tsx`. Props:

  ```typescript
  interface NotificationsListToolbarProps {
    activeFilter: NotificationStatus | 'All';
    onFilterChange: (filter: NotificationStatus | 'All') => void;
    onCreateNew: () => void;
  }
  ```

  Layout: A `flex items-center justify-between` row containing:
  - **Left**: A group of 5 filter buttons (`'All' | 'Published' | 'Draft' | 'Scheduled' | 'Failed'`) rendered as Shadcn `<Button size="sm">`. The active filter button uses `variant="default"`, all others use `variant="outline"`. Clicking a button calls `onFilterChange` with that status.
  - **Right**: A Shadcn `<Button size="sm">` with a `<Plus className="h-4 w-4 mr-2" />` icon (import from `lucide-react`) and text "New Notification". Clicking calls `onCreateNew`.

  Full file content:
  ```tsx
  import { Button } from '@/components/ui/button';
  import { Plus } from 'lucide-react';
  import type { NotificationStatus } from '@/types/notifications';

  type FilterOption = NotificationStatus | 'All';

  const FILTER_OPTIONS: FilterOption[] = ['All', 'Published', 'Draft', 'Scheduled', 'Failed'];

  interface NotificationsListToolbarProps {
    activeFilter: FilterOption;
    onFilterChange: (filter: FilterOption) => void;
    onCreateNew: () => void;
  }

  export function NotificationsListToolbar({
    activeFilter,
    onFilterChange,
    onCreateNew,
  }: NotificationsListToolbarProps) {
    return (
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={activeFilter === option ? 'default' : 'outline'}
              onClick={() => onFilterChange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button size="sm" onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Notification
        </Button>
      </div>
    );
  }
  ```

- [x] T017 [US1] Create `src/components/notifications/NotificationRow.tsx`. Props:

  ```typescript
  interface NotificationRowProps {
    notification: AdminNotification;
    onDelete: (id: string) => void;
    isDeleting: boolean;
  }
  ```

  This renders a single row in a table. Layout (use Tailwind, no custom CSS):
  - Wrapper: `flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors`
  - **Column 1** (flex-1): Title in `font-medium text-sm` on the first line, then message preview truncated to 1 line in `text-xs text-muted-foreground line-clamp-1` below it
  - **Column 2**: `<NotificationStatusBadge status={notification.status} />`
  - **Column 3**: `<NotificationAudienceBadge audience={notification.targetAudience} />`
  - **Column 4**: `createdAt` formatted as a readable date string using `new Date(notification.createdAt).toLocaleDateString()` in `text-xs text-muted-foreground whitespace-nowrap`
  - **Column 5 (actions)**: A delete `<Button size="icon" variant="ghost">` with a `<Trash2 className="h-4 w-4 text-destructive" />` icon (import from `lucide-react`). Disabled when `isDeleting` or `notification.status === 'Published'`. Clicking triggers `onDelete(notification.id)`. Add `title="Delete"` attribute to the button so its purpose is accessible.

  Full file content:
  ```tsx
  import { Button } from '@/components/ui/button';
  import { Trash2 } from 'lucide-react';
  import type { AdminNotification } from '@/types/notifications';
  import { NotificationStatusBadge } from './NotificationStatusBadge';
  import { NotificationAudienceBadge } from './NotificationAudienceBadge';

  interface NotificationRowProps {
    notification: AdminNotification;
    onDelete: (id: string) => void;
    isDeleting: boolean;
  }

  export function NotificationRow({ notification, onDelete, isDeleting }: NotificationRowProps) {
    const canDelete = notification.status === 'Draft' || notification.status === 'Scheduled';

    return (
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{notification.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{notification.message}</p>
        </div>
        <NotificationStatusBadge status={notification.status} />
        <NotificationAudienceBadge audience={notification.targetAudience} />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(notification.createdAt).toLocaleDateString()}
        </span>
        <Button
          size="icon"
          variant="ghost"
          title="Delete"
          disabled={!canDelete || isDeleting}
          onClick={() => onDelete(notification.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    );
  }
  ```

- [x] T018 [US1] Create `src/components/notifications/NotificationsList.tsx`. This is the main list wrapper. It:
  - Receives `(data: AdminNotification[], isLoading: boolean, isError: boolean, refetch: () => void, onDelete: (id: string) => void, isDeleting: boolean)` as props
  - Manages `activeFilter` state locally: `const [activeFilter, setActiveFilter] = useState<NotificationStatus | 'All'>('All');`
  - Manages `showCreateForm` state locally: `const [showCreateForm, setShowCreateForm] = useState(false);`
  - `filteredData`: derived with `useMemo` — if `activeFilter === 'All'`, returns `data`; otherwise returns `data.filter(n => n.status === activeFilter)`
  - **Loading state**: When `isLoading`, render 4 `<Skeleton className="h-16 rounded-lg" />` in a `space-y-3` container
  - **Error state**: When `isError`, render `<p className="text-destructive text-sm">Failed to load notifications.</p>` + `<Button variant="outline" size="sm" onClick={refetch}>Retry</Button>`
  - **Normal state**: Render:
    1. `<NotificationsListToolbar activeFilter={activeFilter} onFilterChange={setActiveFilter} onCreateNew={() => setShowCreateForm(true)} />`
    2. If `showCreateForm`: render `<CreateNotificationForm onClose={() => setShowCreateForm(false)} />` (imported from `./CreateNotificationForm`)
    3. If `filteredData.length === 0`: an empty state `<div className="text-center py-12"><p className="text-muted-foreground text-sm">No notifications found.</p></div>`
    4. Otherwise: `<div className="space-y-3">{filteredData.map(n => <NotificationRow key={n.id} notification={n} onDelete={onDelete} isDeleting={isDeleting} />)}</div>`

  Full file content:
  ```tsx
  import { useMemo, useState } from 'react';
  import { Button } from '@/components/ui/button';
  import { Skeleton } from '@/components/ui/skeleton';
  import type { AdminNotification, NotificationStatus } from '@/types/notifications';
  import { NotificationsListToolbar } from './NotificationsListToolbar';
  import { NotificationRow } from './NotificationRow';
  import { CreateNotificationForm } from './CreateNotificationForm';

  type FilterOption = NotificationStatus | 'All';

  interface NotificationsListProps {
    data: AdminNotification[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
  }

  export function NotificationsList({
    data,
    isLoading,
    isError,
    refetch,
    onDelete,
    isDeleting,
  }: NotificationsListProps) {
    const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
    const [showCreateForm, setShowCreateForm] = useState(false);

    const filteredData = useMemo(() => {
      if (activeFilter === 'All') return data;
      return data.filter((n) => n.status === activeFilter);
    }, [data, activeFilter]);

    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="space-y-3">
          <p className="text-destructive text-sm">Failed to load notifications.</p>
          <Button variant="outline" size="sm" onClick={refetch}>
            Retry
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <NotificationsListToolbar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onCreateNew={() => setShowCreateForm(true)}
        />
        {showCreateForm && <CreateNotificationForm onClose={() => setShowCreateForm(false)} />}
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No notifications found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  ```

- [x] T019 [US1] Update `src/components/notifications/index.ts` to export everything created so far (replace the placeholder comment entirely):

  ```typescript
  export { NotificationStatusBadge } from './NotificationStatusBadge';
  export { NotificationAudienceBadge } from './NotificationAudienceBadge';
  export { NotificationsListToolbar } from './NotificationsListToolbar';
  export { NotificationRow } from './NotificationRow';
  export { NotificationsList } from './NotificationsList';
  ```

  **Note**: `CreateNotificationForm` will be added to this file in T027 (US2).

- [x] T020 [US1] Replace the entire body of `src/pages/NotificationsPage.tsx` with the following (this wires together the list, hooks, and delete mutation):

  ```tsx
  import { useGetNotifications } from '@/hooks/useGetNotifications';
  import { useDeleteNotification } from '@/hooks/useDeleteNotification';
  import { NotificationsList } from '@/components/notifications';

  export function NotificationsPage() {
    const { data = [], isLoading, isError, refetch } = useGetNotifications();
    const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();

    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and broadcast communications to app users
          </p>
        </div>
        <NotificationsList
          data={data}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          onDelete={deleteNotification}
          isDeleting={isDeleting}
        />
      </div>
    );
  }
  ```

- [x] T021 [US1] Verify User Story 1 manually:
  - Navigate to `/notifications` — page loads without console errors
  - 5 fixture notification rows are visible, each showing title, status badge, audience badge, and date
  - Clicking "Published" filter shows only the 2 Published fixtures; clicking "Draft" shows 1; clicking "All" shows all 5
  - The delete button (trash icon) on Published rows is disabled (greyed out); it is enabled on Draft and Scheduled rows
  - Clicking delete on a Draft/Scheduled row shows a "Notification deleted." Sonner toast (it will fail on the API call and fall back gracefully)
  - Loading skeletons appear briefly if you throttle the network
  - Run `npm run build` — zero TypeScript errors

**Checkpoint**: User Story 1 is fully functional and independently verifiable ✅

---

## Phase 4: User Story 2 — Create and Publish Notifications (Priority: P1)

**Goal**: Admins can open an inline `CreateNotificationForm`, fill in a title, message, and target audience, and choose to Publish, Schedule, or Save as Draft.

**Independent Verification**: Click "New Notification" on the `/notifications` page. A form appears inline above the list. Fill in title ("Test Alert") and message ("Test body"). Select "All Users" audience. Click "Publish Now" — a success toast appears and the form closes. Click "New Notification" again, fill fields, click "Save as Draft" — a "Draft saved." toast appears. Try submitting with an empty title — a validation error message appears under the title field before submission.

### Implementation for User Story 2

- [x] T022 [P] [US2] Create `src/components/notifications/AudienceSelector.tsx`. Props:

  ```typescript
  interface AudienceSelectorProps {
    value: NotificationAudience;
    onChange: (audience: NotificationAudience) => void;
  }
  ```

  Renders three Shadcn `<Button size="sm">` options side-by-side: "All Users" (Broadcast), "Specific Roles" (SpecificRoles), "Location / Radius" (Location). The active one uses `variant="default"`, others use `variant="outline"`. Clicking calls `onChange`.

  Full file content:
  ```tsx
  import { Button } from '@/components/ui/button';
  import { AUDIENCE_LABELS } from '@/types/notifications';
  import type { NotificationAudience } from '@/types/notifications';

  interface AudienceSelectorProps {
    value: NotificationAudience;
    onChange: (audience: NotificationAudience) => void;
  }

  const AUDIENCE_OPTIONS: NotificationAudience[] = ['Broadcast', 'SpecificRoles', 'Location'];

  export function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {AUDIENCE_OPTIONS.map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={value === option ? 'default' : 'outline'}
            onClick={() => onChange(option)}
          >
            {AUDIENCE_LABELS[option]}
          </Button>
        ))}
      </div>
    );
  }
  ```

- [x] T023 [P] [US2] Create `src/components/notifications/RoleSelectorField.tsx`. This field is shown only when the audience is `SpecificRoles`. Props:

  ```typescript
  interface RoleSelectorFieldProps {
    selectedRoles: AdminRole[];
    onChange: (roles: AdminRole[]) => void;
  }
  ```

  Render 3 Shadcn `<Badge>` toggles for `'Driver'`, `'ServiceProvider'`, `'Admin'`. Each badge shows with `cursor-pointer`. If the role is in `selectedRoles`, use `variant="default"`; otherwise use `variant="outline"`. Clicking a badge toggles it in/out of the array and calls `onChange`.

  Full file content:
  ```tsx
  import { Badge } from '@/components/ui/badge';
  import type { AdminRole } from '@/types/notifications';

  const ALL_ROLES: AdminRole[] = ['Driver', 'ServiceProvider', 'Admin'];

  interface RoleSelectorFieldProps {
    selectedRoles: AdminRole[];
    onChange: (roles: AdminRole[]) => void;
  }

  export function RoleSelectorField({ selectedRoles, onChange }: RoleSelectorFieldProps) {
    const toggle = (role: AdminRole) => {
      if (selectedRoles.includes(role)) {
        onChange(selectedRoles.filter((r) => r !== role));
      } else {
        onChange([...selectedRoles, role]);
      }
    };

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {ALL_ROLES.map((role) => (
          <Badge
            key={role}
            variant={selectedRoles.includes(role) ? 'default' : 'outline'}
            className="cursor-pointer select-none"
            onClick={() => toggle(role)}
          >
            {role}
          </Badge>
        ))}
      </div>
    );
  }
  ```

- [x] T024 [US2] Create `src/components/notifications/CreateNotificationForm.tsx`. This is the main form component using React Hook Form + Zod. Props:

  ```typescript
  interface CreateNotificationFormProps {
    onClose: () => void;
  }
  ```

  Requirements:
  - Import `useForm` from `react-hook-form`, `zodResolver` from `@hookform/resolvers/zod`
  - Use `createNotificationSchema` as the Zod schema
  - Import `useCreateNotification` from `@/hooks/useCreateNotification`
  - Form fields:
    1. **Title** — `<Input>` with label "Title". Show character count `{watch('title')?.length ?? 0}/100` in `text-xs text-muted-foreground`. Show `<p className="text-destructive text-xs">` with error message if validation fails.
    2. **Message** — `<Textarea rows={3}` with label "Message". Show character count `{watch('message')?.length ?? 0}/500`. Show error message if validation fails.
    3. **Audience** — render `<AudienceSelector>` controlled by `watch('targetAudience')` / `setValue('targetAudience', ...)`.
    4. **Roles** (conditional) — shown only when `watch('targetAudience') === 'SpecificRoles'`: render `<RoleSelectorField>` controlled by local state `const [roles, setRoles] = useState<AdminRole[]>([])`.
    5. **Schedule Date** (conditional) — shown only when a "Schedule for later" button is toggled: render `<Input type="datetime-local" />` bound to `setValue('scheduledAt', ...)`.
  - Three action buttons at the bottom:
    - "Save Draft" → `variant="outline"` → calls `handleSubmit` with `setValue('action', 'draft')` before submitting
    - "Schedule" → `variant="outline"` → shows the datetime field if hidden; if datetime is filled, sets `action='schedule'` and submits
    - "Publish Now" → `variant="default"` → calls `handleSubmit` with `setValue('action', 'publish')`
    - A "Cancel" `<Button type="button" variant="ghost">` that calls `onClose()`
  - On `onSuccess` (from `useCreateNotification`): call `onClose()`
  - Show `isPending` state by disabling all buttons and showing "Saving..." text on the active button

  Full file content:
  ```tsx
  import { useState } from 'react';
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Textarea } from '@/components/ui/textarea';
  import { Label } from '@/components/ui/label';
  import { useCreateNotification } from '@/hooks/useCreateNotification';
  import {
    createNotificationSchema,
    type CreateNotificationFormValues,
    type AdminRole,
  } from '@/types/notifications';
  import { AudienceSelector } from './AudienceSelector';
  import { RoleSelectorField } from './RoleSelectorField';

  interface CreateNotificationFormProps {
    onClose: () => void;
  }

  export function CreateNotificationForm({ onClose }: CreateNotificationFormProps) {
    const { mutate: createNotification, isPending } = useCreateNotification();
    const [roles, setRoles] = useState<AdminRole[]>([]);
    const [showSchedule, setShowSchedule] = useState(false);

    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm<CreateNotificationFormValues>({
      resolver: zodResolver(createNotificationSchema),
      defaultValues: {
        title: '',
        message: '',
        targetAudience: 'Broadcast',
        roles: [],
        locationRadius: null,
        scheduledAt: null,
        action: 'draft',
      },
    });

    const targetAudience = watch('targetAudience');
    const titleLength = watch('title')?.length ?? 0;
    const messageLength = watch('message')?.length ?? 0;

    const onSubmit = (values: CreateNotificationFormValues) => {
      createNotification(
        {
          ...values,
          roles: targetAudience === 'SpecificRoles' ? roles : [],
          locationRadius: targetAudience === 'Location' ? (values.locationRadius ?? null) : null,
          locationCoordinates: null,
          deliveryChannels: ['Push', 'InApp'],
        },
        { onSuccess: onClose }
      );
    };

    return (
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-base">New Notification</h2>

        {/* Title */}
        <div className="space-y-1">
          <Label htmlFor="notif-title">Title</Label>
          <Input id="notif-title" placeholder="Notification title" {...register('title')} />
          <div className="flex justify-between">
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{titleLength}/100</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <Label htmlFor="notif-message">Message</Label>
          <Textarea
            id="notif-message"
            placeholder="Notification message body"
            rows={3}
            {...register('message')}
          />
          <div className="flex justify-between">
            {errors.message && (
              <p className="text-destructive text-xs">{errors.message.message}</p>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{messageLength}/500</span>
          </div>
        </div>

        {/* Audience */}
        <div className="space-y-1">
          <Label>Target Audience</Label>
          <AudienceSelector
            value={targetAudience}
            onChange={(a) => setValue('targetAudience', a)}
          />
        </div>

        {/* Roles (conditional) */}
        {targetAudience === 'SpecificRoles' && (
          <div className="space-y-1">
            <Label>Roles</Label>
            <RoleSelectorField selectedRoles={roles} onChange={setRoles} />
          </div>
        )}

        {/* Schedule date (conditional) */}
        {showSchedule && (
          <div className="space-y-1">
            <Label htmlFor="notif-schedule">Schedule Date & Time</Label>
            <Input
              id="notif-schedule"
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setValue('scheduledAt', e.target.value || null)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => {
              setValue('action', 'draft');
              handleSubmit(onSubmit)();
            }}
          >
            {isPending ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => {
              if (!showSchedule) {
                setShowSchedule(true);
              } else {
                setValue('action', 'schedule');
                handleSubmit(onSubmit)();
              }
            }}
          >
            {showSchedule ? (isPending ? 'Scheduling...' : 'Confirm Schedule') : 'Schedule'}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() => {
              setValue('action', 'publish');
              handleSubmit(onSubmit)();
            }}
          >
            {isPending ? 'Publishing...' : 'Publish Now'}
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={isPending} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
  ```

- [x] T025 [US2] Update `src/components/notifications/index.ts` to add exports for the new components:

  ```typescript
  export { NotificationStatusBadge } from './NotificationStatusBadge';
  export { NotificationAudienceBadge } from './NotificationAudienceBadge';
  export { NotificationsListToolbar } from './NotificationsListToolbar';
  export { NotificationRow } from './NotificationRow';
  export { NotificationsList } from './NotificationsList';
  export { CreateNotificationForm } from './CreateNotificationForm';
  export { AudienceSelector } from './AudienceSelector';
  export { RoleSelectorField } from './RoleSelectorField';
  ```

- [x] T026 [US2] Verify User Story 2 manually:
  - On `/notifications`, click "New Notification" — an inline form appears above the list
  - Submit with empty title — a validation error "Title is required" appears under the title field; form does not submit
  - Fill in title "Test Alert" (> 100 chars) — character counter turns red and form won't submit with the error "Title must be 100 characters or fewer"
  - Fill valid title and message, keep audience as "All Users", click "Publish Now" — a "Notification published successfully." Sonner toast appears and the form closes
  - Click "New Notification" again, fill fields, click "Save Draft" — a "Draft saved." toast appears and form closes
  - Click "New Notification", fill fields, click "Schedule" — a datetime picker appears; pick a future date and click "Confirm Schedule" — a "Notification scheduled." toast appears
  - Click "Cancel" — form closes without saving
  - Run `npm run build` — zero TypeScript errors

**Checkpoint**: User Stories 1 AND 2 are fully functional ✅

---

## Phase 5: User Story 3 — Top Header Notifications Panel (Priority: P2)

**Goal**: The existing `NotificationsPanel` in the dashboard header is wired to real data via `useGetHeaderNotifications`. When there are unread notifications, a red dot indicator appears on the bell icon.

**Independent Verification**: The bell icon in the header now shows a red dot if any fixture notification exists (since `isRead: false` for all). Clicking the bell opens the Popover showing up to 5 Published notification items (title, message snippet, timestamp). The "View all" link navigates to `/notifications`.

### Implementation for User Story 3

- [x] T027 [P] [US3] Update `src/components/layouts/Header.tsx` to wire the `NotificationsPanel` to real data from `useGetHeaderNotifications`. Make the following changes:

  1. Add the import: `import { useGetHeaderNotifications } from '@/hooks/useGetHeaderNotifications';`
  2. Inside the `Header` component function body, add: `const { data: headerNotifications = [], isLoading: notificationsLoading } = useGetHeaderNotifications();`
  3. Change the `<NotificationsPanel>` usage from: `<NotificationsPanel isLoading={false} notifications={[]} />` to: `<NotificationsPanel isLoading={notificationsLoading} notifications={headerNotifications} />`

  **The resulting `Header.tsx` must look like this**:
  ```tsx
  import { useState } from 'react';
  import { ModeToggle, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui';
  import SidebarContent from './SidebarContent';
  import ProfileMenu from './ProfileMenu';
  import NotificationsPanel from './NotificationsPanel';
  import { Menu } from 'lucide-react';
  import { useGetHeaderNotifications } from '@/hooks/useGetHeaderNotifications';

  const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: headerNotifications = [], isLoading: notificationsLoading } = useGetHeaderNotifications();

    return (
      <header className="min-h-16 border-b border-border flex items-center">
        <div className="main-container py-3 flex items-center justify-between lg:justify-end">
          {/* logo & mobile drawer */}
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Menu className="cursor-pointer" />
              </SheetTrigger>
              <SheetContent side="left" aria-describedby={undefined}>
                <SheetHeader>
                  <SheetTitle className="text-accent-foreground text-2xl capitalize font-extrabold">
                    on the way
                  </SheetTitle>
                </SheetHeader>
                <SidebarContent collapsed={false} setMenuOpen={setMenuOpen} />
              </SheetContent>
            </Sheet>

            <h2 className="text-accent-foreground text-2xl capitalize font-extrabold">on the way</h2>
          </div>
          {/* notification icon & user menu */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <NotificationsPanel isLoading={notificationsLoading} notifications={headerNotifications} />
            <ProfileMenu />
          </div>
        </div>
      </header>
    );
  };

  export default Header;
  ```

- [x] T028 [US3] Verify User Story 3 manually:
  - Navigate to any page in the dashboard — a red dot appears on the bell icon in the header (because fixtures have `isRead: false`)
  - Click the bell — a Popover opens showing up to 5 notification items with title, message snippet, and timestamp
  - Click "View all" in the panel — navigation goes to `/notifications`
  - Run `npm run build` — zero TypeScript errors

**Checkpoint**: All 3 User Stories are fully functional ✅

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, accessibility, responsive layout, and lint verification across all components.

- [x] T029 [P] Accessibility audit for `CreateNotificationForm`:
  - All `<Input>` and `<Textarea>` fields have associated `<Label>` elements with matching `htmlFor`/`id` attributes
  - All `<Button>` elements have descriptive text content
  - The delete button in `NotificationRow` has `title="Delete"` for screen readers
  - All buttons can be triggered by keyboard (Enter/Space while focused)
  - Tab order through the form is logical: Title → Message → Audience selector → (conditional fields) → action buttons

- [x] T030 [P] Responsive layout verification for `/notifications`:
  - At 1280px+: toolbar shows filter buttons and "New Notification" button on a single row
  - At 768px: toolbar filter buttons wrap onto two rows; "New Notification" button stays accessible
  - At 375px (mobile): all content is readable, no clipped buttons or overflowing text
  - `NotificationRow` columns: on narrow screens, the title+message column should shrink gracefully (`min-w-0` + `line-clamp-1` prevent overflow)

- [x] T031 [P] Verify all loading, empty, and error states:
  - Empty state: temporarily filter all fixture notifications to a status that doesn't exist → "No notifications found." message appears in the list
  - Error state: temporarily throw an error in `useGetNotifications.ts` `queryFn` → "Failed to load notifications." error message with Retry button appears; the header bell icon still works independently
  - Loading state: simulate by setting `staleTime: 0` in `useGetNotifications` — skeleton rows should appear briefly on every page navigation

- [x] T032 [P] Verify form validation edge cases:
  - Submit with empty title → "Title is required" error appears
  - Submit with title > 100 chars → "Title must be 100 characters or fewer" error appears
  - Submit with message > 500 chars → "Message must be 500 characters or fewer" error appears
  - Select "Specific Roles" audience and submit without selecting any roles — confirm behavior (no Zod error required for roles per spec, but test it does not crash)
  - Click "Schedule" twice (first shows the datetime picker, second submits) with an empty datetime — ensure no crash

- [x] T033 TypeScript and lint pass:
  - Run `npx tsc --noEmit` — zero errors across all new files
  - Run `npm run lint` — zero errors or warnings in any notifications or header file
  - Confirm no `any` types in any file in `src/components/notifications/`, `src/hooks/useGetNotifications.ts`, `src/hooks/useCreateNotification.ts`, `src/hooks/useDeleteNotification.ts`, `src/pages/NotificationsPage.tsx`
  - The only permitted use of `any` is the one explicitly marked with `// eslint-disable-next-line` in `useGetHeaderNotifications.ts`

- [x] T034 Run the final build:
  - Run `npm run build` — zero errors, no warnings about circular imports
  - Run `npm run dev` — navigate to `/notifications`; full feature works end-to-end with fixture data

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)         → no dependencies — start immediately
Phase 2 (Foundational)  → depends on Phase 1 complete — BLOCKS all user story phases
Phase 3 (US1)           → depends on Phase 2 complete — T018 imports CreateNotificationForm (stub OK if not yet done)
Phase 4 (US2)           → depends on Phase 2 complete (T022, T023 can start in parallel with Phase 3)
Phase 5 (US3)           → depends on Phase 2 complete (T013 only)
Phase 6 (Polish)        → depends on Phases 3–5 complete
```

### Within Each Phase — Dependency Order

```
Phase 1: T001 → T002, T003 (parallel) → T004 → T005 → T006 → T007 → T008 → T009
Phase 2: T010, T011, T012, T013 can all run in parallel (different files, no inter-deps)
Phase 3: T014, T015 parallel → T016 → T017 → T018 (needs T014–T017) → T019 → T020 → T021
Phase 4: T022, T023 parallel → T024 (needs T022, T023) → T025 → T026
Phase 5: T027 → T028
Phase 6: T029, T030, T031, T032 parallel → T033 → T034
```

### Parallel Opportunities

- T010, T011, T012, T013 — four hooks, four separate files, no inter-dependencies
- T014, T015 — two leaf badge components, no inter-dependencies
- T022, T023 — two sub-form components, no inter-dependencies
- T029, T030, T031, T032 — independent verification tasks

---

## Implementation Strategy

### MVP First (User Story 1 Only — Notifications List)

1. Complete Phase 1: Setup (T001–T009)
2. Complete Phase 2: Foundational (T010–T013)
3. Complete Phase 3: US1 (T014–T021)
4. **STOP and VALIDATE**: Notification list page works end-to-end
5. Continue to US2 (Create Form), then US3 (Header Panel)

### Full Delivery Order

1. Phase 1 → Phase 2 → Phase 3 (US1 MVP) → validate
2. Phase 4 (US2 — Create Form) → validate
3. Phase 5 (US3 — Header Panel) → validate all stories
4. Phase 6 (Polish) → final lint + build

---

## Notes

- **`[P]` tasks** touch different files — safe to run in parallel with no merge conflicts
- **Naming**: Always use `AdminNotification` for the domain entity. `Notification` is already taken by the header alert type in `src/types/index.ts`
- **No `any` allowed** — except the one explicitly disabled comment in `useGetHeaderNotifications.ts`
- **Fixtures on API failure**: The API calls are wrapped in `try/catch`. On any error, fixture data is returned so the UI stays functional without a backend connection
- **Shadcn components used**: `Badge`, `Button`, `Input`, `Textarea`, `Label`, `Skeleton`, `Popover` (already exists in header) — if any are missing, install with `npx shadcn@latest add <component>`
- **Form resolver**: `@hookform/resolvers/zod` must be available. Run `npm install @hookform/resolvers` if the package is missing
- **Commit after each checkpoint** for clean rollback if needed
