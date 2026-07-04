# Tasks: Help Requests Management

**Input**: Design documents from `/specs/010-help-requests-mgmt/`
**Prerequisites**: [plan.md](./plan.md) · [spec.md](./spec.md) · [research.md](./research.md) · [data-model.md](./data-model.md) · [quickstart.md](./quickstart.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on each other)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Exact file paths are specified in every task description

## Path Conventions

All source paths are relative to `src/` at the repository root. Use the `@/` alias (e.g. `@/types/help-requests`) which maps to `src/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directories, register routes, and update navigation before any feature code is written.

- [x] T001 Register two new routes in `src/App.tsx`. Import `HelpRequestsPage` from `'./pages/HelpRequestsPage'` and `HelpRequestDetailsPage` from `'./pages/HelpRequestDetailsPage'`. Replace the existing placeholder `{ path: '/help-requests', element: <h1>Help Requests</h1> }` with two entries inside the existing `ProtectedRoute` children array:
  ```tsx
  { path: '/help-requests', element: <HelpRequestsPage /> },
  { path: '/help-requests/:id', element: <HelpRequestDetailsPage /> },
  ```
  Also add both imports at the top of the file alongside the other page imports. Do NOT create the page files yet — they are created in later tasks.

- [x] T002 Update the sidebar navigation to include a "Help Requests" link. Open the existing sidebar component (search for the file containing the navigation links — it is likely `src/components/layouts/index.tsx` or `src/components/layouts/Sidebar.tsx` or similar). Add a nav item for `/help-requests` using the `LifeBuoy` icon from `lucide-react`. Match the exact style and structure of other existing nav items (e.g. Reports, Providers). The label should be `"Help Requests"` and it should use `to="/help-requests"` as the path.

- [x] T003 [P] Update the sidebar's `dashboard-links.ts` (if it exists at `src/lib/dashboard-links.ts`) to add the help-requests entry. If links are defined inline in the sidebar component, update them directly in T002. Check `src/lib/dashboard-links.ts` first — if it exists and contains the nav links array, add `{ to: '/help-requests', label: 'Help Requests', icon: LifeBuoy }` in the appropriate position (after Reports, before Providers, or wherever fits the existing ordering).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TypeScript types, fixture data, and React Query hooks that every user story depends on. Complete this phase before any user story work begins.

**CRITICAL**: No user story implementation can begin until this phase is complete.

- [x] T004 Create `src/types/help-requests.ts`. Export the following TypeScript types and interfaces **exactly** as defined below (do not change field names, types, or structure):

  ```typescript
  // ─── Enums / Unions ──────────────────────────────────────────────────────────

  export type HelpRequestCategory = 'Medical' | 'Towing' | 'Fuel' | 'Repair';

  export type HelpRequestStatus = 'Active' | 'Pending' | 'Completed' | 'Cancelled';

  // Terminal states — no further transitions allowed from these:
  export const TERMINAL_STATUSES: HelpRequestStatus[] = ['Completed', 'Cancelled'];

  // Valid transitions map (source status → allowed target statuses):
  export const VALID_TRANSITIONS: Record<HelpRequestStatus, HelpRequestStatus[]> = {
    Pending: ['Active', 'Completed', 'Cancelled'],
    Active: ['Completed', 'Cancelled'],
    Completed: [],
    Cancelled: [],
  };

  // ─── Sub-entities ─────────────────────────────────────────────────────────────

  export interface HelpRequestUser {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    phone: string | null;
    email: string | null;
  }

  export interface HelpRequestProvider {
    id: string;
    name: string;
    type: HelpRequestCategory;
    rating: number;
    etaMinutes: number;
  }

  export interface TimelineEvent {
    id: string;
    eventLabel: string;
    timestamp: string; // ISO 8601
    description: string | null;
  }

  // ─── Core entity ──────────────────────────────────────────────────────────────

  export interface HelpRequest {
    id: string;
    category: HelpRequestCategory;
    status: HelpRequestStatus;
    locationText: string;
    coordinates: { lat: number; lng: number };
    createdAt: string; // ISO 8601
    user: HelpRequestUser;
    provider: HelpRequestProvider | null;
  }

  // ─── API contracts (mock) ─────────────────────────────────────────────────────

  export interface HelpRequestsQueryParams {
    page: number;
    pageSize: number;
    category?: HelpRequestCategory;
    status?: HelpRequestStatus;
    search?: string;
  }

  export interface HelpRequestsListResponse {
    data: HelpRequest[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }

  export interface HelpRequestDetails {
    request: HelpRequest;
    timeline: TimelineEvent[];
  }

  // ─── Display helpers ──────────────────────────────────────────────────────────

  export const categoryLabels: Record<HelpRequestCategory, string> = {
    Medical: 'Medical',
    Towing: 'Towing',
    Fuel: 'Fuel',
    Repair: 'Repair',
  };

  export const statusLabels: Record<HelpRequestStatus, string> = {
    Active: 'Active',
    Pending: 'Pending',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
  };
  ```

- [x] T005 Create `src/lib/help-requests-fixtures.ts`. This file provides mock data for the entire feature. Export the following (copy verbatim and expand as instructed):

  ```typescript
  import type {
    HelpRequest,
    HelpRequestDetails,
    HelpRequestsListResponse,
    HelpRequestCategory,
    HelpRequestStatus,
  } from '@/types/help-requests';

  // ─── Static seed data ─────────────────────────────────────────────────────────

  const categories: HelpRequestCategory[] = ['Medical', 'Towing', 'Fuel', 'Repair'];
  const statuses: HelpRequestStatus[] = ['Active', 'Pending', 'Completed', 'Cancelled'];

  const egyptianNames = [
    'Ahmed Hassan', 'Fatima Mohamed', 'Omar Ali', 'Aisha Mahmoud',
    'Karim Ibrahim', 'Layla Saeed', 'Youssef Gamal', 'Nour Adel',
    'Hassan Farouk', 'Mariam Khaled', 'Tarek Samir', 'Salma Hany',
    'Mohamed Sherif', 'Dina Essam', 'Khaled Mostafa', 'Rania Adly',
    'Amr Fathy', 'Sara Gamal', 'Bassem Wael', 'Heba Zaki',
  ];

  const cairoLocations = [
    'Ring Road, near Exit 7, Cairo',
    'Corniche El Nile, Zamalek, Cairo',
    'Tahrir Square, Downtown, Cairo',
    'Mohandessin Main Street, Cairo',
    'Maadi Ring Road, Cairo',
    'Heliopolis Square, Cairo',
    'Nasr City 9th District, Cairo',
    '6th October Bridge, Cairo',
    'Dokki Street, Giza',
    'New Cairo Axis, Cairo',
    'Sheikh Zayed Entrance, Giza',
    'Pyramids Road, Giza',
    'Obour City Entrance, Cairo',
    'Ain Shams Street, Cairo',
    'Rehab City Gate, Cairo',
    'Madinaty Roundabout, Cairo',
    'Katameya Highway, Cairo',
    'Salam City District, Cairo',
    'Boulaq Abul Ela, Cairo',
    'Shoubra El Kheima Road, Cairo',
  ];

  const coordinates = [
    { lat: 30.0444, lng: 31.2357 }, { lat: 30.0626, lng: 31.2497 },
    { lat: 29.9772, lng: 31.1325 }, { lat: 30.0581, lng: 31.2037 },
    { lat: 29.9559, lng: 31.2733 }, { lat: 30.0818, lng: 31.3192 },
    { lat: 30.0131, lng: 31.4967 }, { lat: 30.0441, lng: 31.2358 },
    { lat: 30.0514, lng: 31.2298 }, { lat: 30.0234, lng: 31.2145 },
    { lat: 30.0089, lng: 31.2098 }, { lat: 29.9792, lng: 31.1342 },
    { lat: 30.1212, lng: 31.3456 }, { lat: 30.0930, lng: 31.2801 },
    { lat: 30.0672, lng: 31.4123 }, { lat: 30.0219, lng: 31.4987 },
    { lat: 29.9943, lng: 31.3210 }, { lat: 30.1001, lng: 31.2670 },
    { lat: 30.0788, lng: 31.2215 }, { lat: 30.1345, lng: 31.2890 },
  ];

  const providerNames = [
    'Cairo Rescue Services', 'El Nile Medical Response', 'Fast Tow Egypt',
    'Delta Fuel Assistance', 'Omega Repair Team', 'Quick Fix Cairo',
    'National Road Help', 'SafeRoute Providers', 'Al Masry Emergency',
    'Capital Aid Services',
  ];

  // ─── Generator functions ──────────────────────────────────────────────────────

  function generateRequest(index: number): HelpRequest {
    const category = categories[index % categories.length];
    const status = statuses[index % statuses.length];
    const now = new Date();
    const createdAt = new Date(now.getTime() - (index + 1) * 4 * 60 * 60 * 1000).toISOString();
    const hasProvider = status !== 'Pending' && index % 5 !== 0;

    return {
      id: `hr_${String(index + 1).padStart(3, '0')}`,
      category,
      status,
      locationText: cairoLocations[index % cairoLocations.length],
      coordinates: coordinates[index % coordinates.length],
      createdAt,
      user: {
        id: `usr_${String(index + 1).padStart(3, '0')}`,
        fullName: egyptianNames[index % egyptianNames.length],
        avatarUrl: null,
        phone: index % 3 !== 0 ? `+20 10${String(index).padStart(8, '0')}` : null,
        email: index % 4 !== 0 ? `user${index + 1}@example.com` : null,
      },
      provider: hasProvider
        ? {
            id: `pvd_${String((index % 10) + 1).padStart(3, '0')}`,
            name: providerNames[index % providerNames.length],
            type: category,
            rating: 3.5 + ((index * 3) % 15) / 10,
            etaMinutes: 5 + (index % 8) * 5,
          }
        : null,
    };
  }

  // ─── Fixture exports ──────────────────────────────────────────────────────────

  // 20 mock help requests (supports page sizes of 10, 20, 50)
  const allRequests: HelpRequest[] = Array.from({ length: 20 }, (_, i) => generateRequest(i));

  export const helpRequestsListFixture: HelpRequestsListResponse = {
    data: allRequests.slice(0, 10),
    total: 20,
    page: 1,
    pageSize: 10,
    totalPages: 2,
  };

  // ─── Available providers fixture (for Reassign Provider modal) ───────────────
  export const availableProvidersFixture = providerNames.map((name, i) => ({
    id: `pvd_${String(i + 1).padStart(3, '0')}`,
    name,
    type: categories[i % categories.length],
    rating: 3.5 + (i * 3 % 15) / 10,
    etaMinutes: 5 + (i % 8) * 5,
  }));

  // ─── Detail fixtures (keyed by request id) ───────────────────────────────────
  const timelineEventLabels = [
    'Created', 'Provider Notified', 'En Route', 'Arrived', 'Completed', 'Cancelled',
  ];

  function generateTimeline(request: HelpRequest): TimelineEvent[] {
    const created = new Date(request.createdAt);
    const events: TimelineEvent[] = [
      {
        id: `te_${request.id}_1`,
        eventLabel: 'Created',
        timestamp: request.createdAt,
        description: 'Help request submitted by user.',
      },
    ];
    if (request.status !== 'Pending') {
      events.push({
        id: `te_${request.id}_2`,
        eventLabel: 'Provider Notified',
        timestamp: new Date(created.getTime() + 5 * 60 * 1000).toISOString(),
        description: null,
      });
    }
    if (request.status === 'Active' || request.status === 'Completed' || request.status === 'Cancelled') {
      events.push({
        id: `te_${request.id}_3`,
        eventLabel: 'En Route',
        timestamp: new Date(created.getTime() + 10 * 60 * 1000).toISOString(),
        description: `Provider en route. ETA: ${request.provider?.etaMinutes ?? '?'} minutes.`,
      });
    }
    if (request.status === 'Completed') {
      events.push({
        id: `te_${request.id}_4`,
        eventLabel: 'Arrived',
        timestamp: new Date(created.getTime() + 20 * 60 * 1000).toISOString(),
        description: null,
      });
      events.push({
        id: `te_${request.id}_5`,
        eventLabel: 'Completed',
        timestamp: new Date(created.getTime() + 35 * 60 * 1000).toISOString(),
        description: 'Help request resolved successfully.',
      });
    }
    if (request.status === 'Cancelled') {
      events.push({
        id: `te_${request.id}_6`,
        eventLabel: 'Cancelled',
        timestamp: new Date(created.getTime() + 15 * 60 * 1000).toISOString(),
        description: 'Request was cancelled by administrator.',
      });
    }
    return events;
  }

  export const helpRequestDetailsFixtures: Record<string, HelpRequestDetails> = {};
  allRequests.forEach((request) => {
    helpRequestDetailsFixtures[request.id] = {
      request,
      timeline: generateTimeline(request),
    };
  });

  // In-memory mutable state (persists for browser session, resets on reload)
  let _requests: HelpRequest[] = [...allRequests];
  let _availableProviders = [...availableProvidersFixture];

  // ─── Mock service functions ───────────────────────────────────────────────────

  function delay(ms = 500): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  export async function fetchHelpRequests(
    params: import('@/types/help-requests').HelpRequestsQueryParams
  ): Promise<HelpRequestsListResponse> {
    await delay(600);
    let filtered = [..._requests];
    if (params.category) filtered = filtered.filter((r) => r.category === params.category);
    if (params.status) filtered = filtered.filter((r) => r.status === params.status);
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.user.fullName.toLowerCase().includes(q) ||
          r.locationText.toLowerCase().includes(q)
      );
    }
    const total = filtered.length;
    const start = (params.page - 1) * params.pageSize;
    const data = filtered.slice(start, start + params.pageSize);
    return {
      data,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
    };
  }

  export async function fetchHelpRequestDetails(id: string): Promise<HelpRequestDetails> {
    await delay(400);
    const request = _requests.find((r) => r.id === id);
    if (!request) throw new Error(`Help request ${id} not found`);
    return { request, timeline: generateTimeline(request) };
  }

  export async function updateHelpRequestStatus(
    id: string,
    newStatus: import('@/types/help-requests').HelpRequestStatus
  ): Promise<HelpRequest> {
    await delay(500);
    const index = _requests.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Help request ${id} not found`);
    _requests[index] = { ..._requests[index], status: newStatus };
    return _requests[index];
  }

  export async function reassignProvider(
    id: string,
    providerId: string
  ): Promise<HelpRequest> {
    await delay(500);
    const index = _requests.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Help request ${id} not found`);
    const provider = _availableProviders.find((p) => p.id === providerId);
    if (!provider) throw new Error(`Provider ${providerId} not found`);
    _requests[index] = {
      ..._requests[index],
      provider: { ...provider, type: _requests[index].category },
    };
    return _requests[index];
  }

  export function getAvailableProviders(
    category: HelpRequestCategory
  ): typeof availableProvidersFixture {
    return _availableProviders.filter((p) => p.type === category);
  }
  ```

- [x] T006 Create `src/hooks/help-requests/useHelpRequests.ts`. This file exports all React Query hooks for the feature. Copy the pattern from `src/hooks/reports/useReports.ts` (try the API first, fall back to fixture, use `@/lib/axios`). Implement the following exports:

  ```typescript
  import api from '@/lib/axios';
  import {
    fetchHelpRequests,
    fetchHelpRequestDetails,
    updateHelpRequestStatus,
    reassignProvider,
  } from '@/lib/help-requests-fixtures';
  import type {
    HelpRequestsQueryParams,
    HelpRequestsListResponse,
    HelpRequestDetails,
    HelpRequest,
    HelpRequestStatus,
  } from '@/types/help-requests';
  import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
  import { toast } from 'sonner';

  // ─── Query keys ───────────────────────────────────────────────────────────────
  export const HELP_REQUESTS_QUERY_KEY = (params: HelpRequestsQueryParams) =>
    ['help-requests', params] as const;

  export const HELP_REQUEST_DETAILS_QUERY_KEY = (id: string) =>
    ['help-requests', 'details', id] as const;

  // ─── List query ───────────────────────────────────────────────────────────────
  export const useHelpRequests = (params: HelpRequestsQueryParams) => {
    return useQuery({
      queryKey: HELP_REQUESTS_QUERY_KEY(params),
      queryFn: async () => {
        try {
          const { data } = await api.get<HelpRequestsListResponse>('/admin/help-requests', { params });
          return data;
        } catch (error) {
          console.warn('[help-requests] API unavailable, using fixture data:', error);
          return fetchHelpRequests(params);
        }
      },
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    });
  };

  // ─── Details query ────────────────────────────────────────────────────────────
  export const useHelpRequestDetails = (id: string) => {
    return useQuery({
      queryKey: HELP_REQUEST_DETAILS_QUERY_KEY(id),
      queryFn: async () => {
        try {
          const { data } = await api.get<HelpRequestDetails>(`/admin/help-requests/${id}`);
          return data;
        } catch (error) {
          console.warn('[help-request-details] API unavailable, using fixture data:', error);
          return fetchHelpRequestDetails(id);
        }
      },
      enabled: !!id,
      staleTime: 60_000,
      retry: 1,
    });
  };

  // ─── Status mutation ──────────────────────────────────────────────────────────
  export const useUpdateHelpRequestStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, newStatus }: { id: string; newStatus: HelpRequestStatus }) =>
        updateHelpRequestStatus(id, newStatus),
      onSuccess: (_, { id, newStatus }) => {
        toast.success(`Request marked as ${newStatus}.`);
        queryClient.invalidateQueries({ queryKey: ['help-requests'] });
        queryClient.invalidateQueries({ queryKey: HELP_REQUEST_DETAILS_QUERY_KEY(id) });
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to update request status.');
      },
    });
  };

  // ─── Reassign provider mutation ───────────────────────────────────────────────
  export const useReassignProvider = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, providerId }: { id: string; providerId: string }) =>
        reassignProvider(id, providerId),
      onSuccess: (_, { id }) => {
        toast.success('Provider reassigned successfully.');
        queryClient.invalidateQueries({ queryKey: ['help-requests'] });
        queryClient.invalidateQueries({ queryKey: HELP_REQUEST_DETAILS_QUERY_KEY(id) });
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to reassign provider.');
      },
    });
  };
  ```

**Checkpoint**: All types, fixtures, and hooks are ready. User story implementation can now begin.

---

## Phase 3: User Story 1 — Browse and Filter Help Requests (Priority: P1)

**Goal**: Deliver a fully functional `/help-requests` list page with a search toolbar, category/status filters, a paginated card layout, skeleton loading states, and an empty state. URL state is synced for shareability.

**Independent Verification**: Navigate to `/help-requests`. Verify: (1) a toolbar appears with a search input and two dropdowns (Category, Status); (2) 10 cards render with request data; (3) selecting a Category filter narrows the list; (4) typing in the search input narrows the list; (5) skeleton cards appear during load; (6) empty state message appears when no results match; (7) the URL updates with filter/pagination params when any filter changes.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create `src/components/help-requests/HelpRequestStatusBadge.tsx`. This is a small presentational component. Props: `status: HelpRequestStatus`. Render a Shadcn `Badge` with a variant and colour class based on the status value:
  - `Active` → `variant="default"` with `className="bg-green-500 text-white hover:bg-green-600"`
  - `Pending` → `variant="secondary"` with `className="bg-amber-500 text-white hover:bg-amber-600"`
  - `Completed` → `variant="outline"` with `className="text-muted-foreground"`
  - `Cancelled` → `variant="destructive"`

  Import `Badge` from `@/components/ui/badge` and `HelpRequestStatus` from `@/types/help-requests`. Export the component as a named export.

- [x] T008 [P] [US1] Create `src/components/help-requests/HelpRequestCategoryBadge.tsx`. Props: `category: HelpRequestCategory`. Render a Shadcn `Badge` (variant `"outline"`) showing the category label. Use the icon from `lucide-react` alongside the label text:
  - `Medical` → icon `Stethoscope`
  - `Towing` → icon `Truck`
  - `Fuel` → icon `Fuel`
  - `Repair` → icon `Wrench`

  Render as: `<Badge variant="outline" className="gap-1"><Icon className="h-3 w-3" /> {category}</Badge>`. Export as named export.

- [x] T009 [P] [US1] Create `src/components/help-requests/HelpRequestCard.tsx`. This card displays a single help request summary in the list view. Study the existing `src/components/reports/ReportCard.tsx` as a reference for layout. Props:

  ```typescript
  interface HelpRequestCardProps {
    request: HelpRequest;
    onViewDetails: (id: string) => void;
  }
  ```

  The card must render (inside a Shadcn `Card`):
  1. Left side: A coloured icon area. Use the category-appropriate Lucide icon (same icons as T008). Background colour: Medical=`bg-red-50`, Towing=`bg-blue-50`, Fuel=`bg-yellow-50`, Repair=`bg-green-50`.
  2. Main body: 
     - Top row: `<HelpRequestCategoryBadge />` + `<HelpRequestStatusBadge />`
     - User info: User's `fullName` with a circular avatar/initials fallback. Use `user.avatarUrl` if present; otherwise render a `div` with the user's initials (first letter of first and last name). Below the name, display the `locationText` with a `MapPin` icon (from lucide-react) and a `text-muted-foreground` style.
     - Provider row: If `provider` is not null, show `provider.name`. If null, show `"Unassigned"` in muted text.
  3. Right side: A Shadcn `Button` labelled `"View"` with an `Eye` icon. The `onClick` must call `onViewDetails(request.id)`. **Only this button triggers navigation — clicking elsewhere on the card does nothing** (do not make the whole card a link).

  Export as named export. Import all types from `@/types/help-requests`.

- [x] T010 [P] [US1] Create `src/components/help-requests/HelpRequestCardSkeleton.tsx`. This is a skeleton placeholder displayed during loading. Study `src/components/reports/ReportCardSkeleton.tsx` as a reference. Render a `Card` with the same layout as `HelpRequestCard` but replace all content with Shadcn `Skeleton` components (`import { Skeleton } from '@/components/ui/skeleton'`). The skeleton card should have roughly the same height as a real card. Export as named export.

- [x] T011 [P] [US1] Create `src/components/help-requests/HelpRequestsToolbar.tsx`. This is the filter/search bar above the card list. Props:

  ```typescript
  interface HelpRequestsToolbarProps {
    search: string;
    category: string;
    status: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onClearFilters: () => void;
    isFiltered: boolean;
  }
  ```

  Render a `div` with `className="flex flex-col sm:flex-row gap-3"` containing:
  1. A Shadcn `Input` (from `@/components/ui/input`) for text search. Set `placeholder="Search by user name or location..."` and `value={search}` and `onChange={(e) => onSearchChange(e.target.value)}`.
  2. A Shadcn `Select` (from `@/components/ui/select`) for Category. Options: `["all", "Medical", "Towing", "Fuel", "Repair"]`. When value is `"all"`, call `onCategoryChange("")`. Otherwise call `onCategoryChange(value)`. Display `"All Categories"` as the placeholder.
  3. A Shadcn `Select` for Status. Options: `["all", "Active", "Pending", "Completed", "Cancelled"]`. Same pattern as Category. Display `"All Statuses"` as the placeholder.
  4. A `Button` variant `"outline"` labelled `"Clear filters"` with an `X` icon (from lucide-react). Only render this button when `isFiltered === true`. Call `onClearFilters()` on click.

  Study `src/components/reports/ReportsToolbar.tsx` as a structural reference. Export as named export.

- [x] T012 [P] [US1] Create `src/components/help-requests/HelpRequestsPagination.tsx`. This renders the pagination footer below the card list. Study `src/components/reports/ReportsPagination.tsx` as a direct reference. Props:

  ```typescript
  interface HelpRequestsPaginationProps {
    page: number;
    totalPages: number;
    total: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newSize: number) => void;
  }
  ```

  Render:
  - A row showing `"Showing X–Y of Z results"` where X = `(page-1)*pageSize+1`, Y = `Math.min(page*pageSize, total)`, Z = `total`.
  - Previous/Next buttons (disabled appropriately when on first/last page).
  - A `Select` for page size with options `[10, 20, 50]`. Call `onPageSizeChange` and also reset page to 1 when page size changes (this is handled in the parent via `onPageChange(1)`).

  The `onPageSizeChange` prop is called when the user changes the page size selector. The parent page (T013) will handle resetting to page 1. Export as named export.

- [x] T013 [US1] Create `src/components/help-requests/index.ts` to export all help-requests components as barrel exports:
  ```typescript
  export { HelpRequestStatusBadge } from './HelpRequestStatusBadge';
  export { HelpRequestCategoryBadge } from './HelpRequestCategoryBadge';
  export { HelpRequestCard } from './HelpRequestCard';
  export { HelpRequestCardSkeleton } from './HelpRequestCardSkeleton';
  export { HelpRequestsToolbar } from './HelpRequestsToolbar';
  export { HelpRequestsPagination } from './HelpRequestsPagination';
  ```

- [x] T014 [US1] Create `src/pages/HelpRequestsPage.tsx`. This is the `/help-requests` list page. Follow the same pattern as `src/pages/ReportsManagement.tsx` exactly. The page uses `useSearchParams` from `react-router` for URL state. Implement the following:

  1. **Read URL state**:
     ```typescript
     const [searchParams, setSearchParams] = useSearchParams();
     const page = Number(searchParams.get('page') ?? '1');
     const pageSize = Number(searchParams.get('pageSize') ?? '10');
     const search = searchParams.get('search') ?? '';
     const category = searchParams.get('category') ?? '';
     const status = searchParams.get('status') ?? '';
     ```

  2. **Build query params** (pass to the hook):
     ```typescript
     const queryParams: HelpRequestsQueryParams = {
       page,
       pageSize,
       search: search || undefined,
       category: (category as HelpRequestCategory) || undefined,
       status: (status as HelpRequestStatus) || undefined,
     };
     ```

  3. **Call the hook**: `const { data, isLoading, isError, refetch } = useHelpRequests(queryParams);`

  4. **URL update handlers** — each handler resets page to 1 when filter changes (same pattern as `ReportsManagement.tsx`):
     - `handleSearchChange(value: string)` — sets `search` param, resets `page` to `'1'`
     - `handleCategoryChange(value: string)` — sets or removes `category` param, resets `page` to `'1'`
     - `handleStatusChange(value: string)` — sets or removes `status` param, resets `page` to `'1'`
     - `handleClearFilters()` — calls `setSearchParams(new URLSearchParams({ page: '1' }))`
     - `handlePageChange(newPage: number)` — sets `page` param
     - `handlePageSizeChange(newSize: number)` — sets `pageSize` param, resets `page` to `'1'`
     - `handleViewDetails(id: string)` — calls `navigate('/help-requests/' + id)`

  5. **Derived state**: `const isFiltered = !!(search || category || status);`

  6. **Render** (inside a `<section className="py-7 space-y-4">`):
     - `<PageHeader title="Help Requests" subtitle="View and manage incoming assistance requests" />` (import `PageHeader` from `@/components/shared`)
     - Error state: A Shadcn `Alert` (variant `"destructive"`) with message `"Failed to load help requests."` and a `Retry` button that calls `refetch()`. Only shown when `isError`.
     - `<HelpRequestsToolbar .../>` passing all state and handlers
     - Card list: A `div` with `className="flex flex-col gap-4"`. When `isLoading`, render `Array.from({ length: 6 }).map((_, i) => <HelpRequestCardSkeleton key={i} />)`. When `data?.data.length === 0`, render a `div` with class `"flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg"` containing `<span>No help requests found</span>` and (if `isFiltered`) `<span className="text-sm">Try clearing your filters</span>`. Otherwise render `data?.data.map((req) => <HelpRequestCard key={req.id} request={req} onViewDetails={handleViewDetails} />)`.
     - Pagination: Render `<HelpRequestsPagination .../>` only when `!isLoading && data && data.totalPages >= 1`.

  All imports use `@/` alias. Export as default export. Import types from `@/types/help-requests` and hooks from `@/hooks/help-requests/useHelpRequests`.

- [x] T015 [US1] Add `HelpRequestsPage` to the pages barrel export. Open `src/pages/index.ts` and add:
  ```typescript
  export { default as HelpRequestsPage } from './HelpRequestsPage';
  ```
  Also ensure T001 (App.tsx route registration) is complete — if it used a placeholder that blocked the import, update it now that the file exists.

- [x] T016 [US1] Verify User Story 1 in the browser. Navigate to `/help-requests`. Check each item: (1) toolbar visible with search, category, and status controls; (2) 10 cards show on first load; (3) selecting "Medical" from Category shows only medical requests; (4) typing a partial name in search narrows results; (5) skeleton cards appear during the 600ms mock delay (you can observe on first load or by throttling network in DevTools); (6) empty state message appears when search yields no results; (7) URL updates correctly (check address bar while filtering); (8) pagination footer shows correct count. No TypeScript errors — run `npx tsc --noEmit` to check.

**Checkpoint**: `/help-requests` list page is fully functional and independently verifiable.

---

## Phase 4: User Story 3 — View Help Request Details (Priority: P1)

**Goal**: Deliver the `/help-requests/:id` detail page with all six sections: Request Description, User Information card, Assigned Provider card, Location on Map, Request Timeline, and Action Panel with four buttons.

**Independent Verification**: Navigate to `/help-requests/hr_001`. Verify: (1) all six sections render with data; (2) map shows a pin at the correct coordinates; (3) timeline shows events in chronological order; (4) Action Panel shows four buttons; (5) for a Completed request (`hr_003`), the Mark as Completed, Cancel Request, and Reassign Provider buttons are disabled with tooltips; Contact User is still clickable; (6) skeleton sections appear during data load.

### Implementation for User Story 3

- [x] T017 [P] [US3] Create `src/components/help-requests/HelpRequestMap.tsx`. This reuses the exact Leaflet setup from `src/components/reports/ReportMap.tsx`. Props:

  ```typescript
  interface HelpRequestMapProps {
    coordinates: { lat: number; lng: number } | null;
    locationText: string;
  }
  ```

  Copy the implementation from `ReportMap.tsx` but adapt the types. The fallback when `coordinates` is null or the map can't render should show a `Card` with `"Map unavailable"` message and display `locationText` as a text string below it. Include the same Leaflet default marker icon fix that is in `ReportMap.tsx`. Export as named export.

- [x] T018 [P] [US3] Create `src/components/help-requests/RequestTimeline.tsx`. Props: `timeline: TimelineEvent[]`. Render a vertical timeline using a plain `div` structure (no third-party library):

  ```tsx
  // Render outermost div with className="relative"
  // For each event, render:
  // - A div with className="flex gap-4 relative"
  //   - Left: A vertical line + dot (position: relative)
  //     - A dot: div with className="w-3 h-3 rounded-full bg-primary mt-1 shrink-0 z-10"
  //     - A line connecting dots: div with className="absolute left-1.5 top-4 bottom-0 w-px bg-border" (skip for the last event)
  //   - Right: event label in bold + timestamp in muted text + description if present
  // Events are ordered oldest-to-newest (they are already in correct order from the fixture)
  ```

  When `timeline.length === 0`, render a `<p className="text-muted-foreground">No timeline events.</p>`. Export as named export. Import `TimelineEvent` from `@/types/help-requests`.

- [x] T019 [P] [US3] Create `src/components/help-requests/ActionPanel.tsx`. This is the most complex component. Props:

  ```typescript
  interface ActionPanelProps {
    request: HelpRequest;
    onMarkCompleted: () => void;
    onCancelRequest: () => void;
    onReassignProvider: () => void;
    onContactUser: () => void;
    isUpdatingStatus: boolean;
    isReassigning: boolean;
  }
  ```

  Import `TERMINAL_STATUSES` from `@/types/help-requests`. Compute: `const isTerminal = TERMINAL_STATUSES.includes(request.status);`

  Render a Shadcn `Card` with header "Action Panel" and a `div` with `className="flex flex-col gap-3"` containing four full-width buttons:

  1. **"Contact User"** — Always enabled. `variant="outline"`, icon `Phone` (lucide). `onClick={onContactUser}`.
  2. **"Mark as Completed"** — `disabled={isTerminal || isUpdatingStatus}`. `variant="default"`, icon `CheckCircle` (lucide). Wrap in Shadcn `Tooltip` (from `@/components/ui/tooltip`). When `isTerminal`, set tooltip content `"This request is already in a terminal state"`. When `isUpdatingStatus`, tooltip = `"Updating…"`. `onClick={onMarkCompleted}`.
  3. **"Reassign Provider"** — `disabled={isTerminal || isReassigning}`. `variant="outline"`, icon `RefreshCw` (lucide). Same `Tooltip` pattern: when disabled due to terminal state, show `"Cannot reassign a completed or cancelled request"`. `onClick={onReassignProvider}`.
  4. **"Cancel Request"** — `disabled={isTerminal || isUpdatingStatus}`. `variant="destructive"`, icon `XCircle` (lucide). Tooltip when terminal: `"This request is already in a terminal state"`. `onClick={onCancelRequest}`.

  To use Shadcn Tooltip, wrap each disabled button inside:
  ```tsx
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span> {/* span wrapper needed for disabled button inside Tooltip */}
          <Button disabled={...} className="w-full" ...>...</Button>
        </span>
      </TooltipTrigger>
      {isDisabled && <TooltipContent>{tooltipMessage}</TooltipContent>}
    </Tooltip>
  </TooltipProvider>
  ```
  Import `Tooltip, TooltipTrigger, TooltipContent, TooltipProvider` from `@/components/ui/tooltip`. Export as named export.

- [x] T020 [P] [US3] Create `src/components/help-requests/ConfirmStatusDialog.tsx`. This is the confirmation dialog shown before "Mark as Completed" or "Cancel Request". Props:

  ```typescript
  interface ConfirmStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    action: 'complete' | 'cancel';
    onConfirm: () => void;
    isLoading: boolean;
  }
  ```

  Render a Shadcn `AlertDialog` (from `@/components/ui/alert-dialog`). When `action === 'complete'`: title `"Mark as Completed"`, description `"Are you sure you want to mark this request as completed? This action cannot be undone."`. When `action === 'cancel'`: title `"Cancel Request"`, description `"Are you sure you want to cancel this help request? This action cannot be undone."`. Two buttons: `AlertDialogCancel` labelled `"Go back"` and `AlertDialogAction` labelled by action (`"Mark as Completed"` or `"Cancel Request"`) with `onClick={onConfirm}` and `disabled={isLoading}`. Export as named export.

- [x] T021 [US3] Add `HelpRequestMap`, `RequestTimeline`, `ActionPanel`, `ConfirmStatusDialog` to the barrel export `src/components/help-requests/index.ts`:
  ```typescript
  export { HelpRequestMap } from './HelpRequestMap';
  export { RequestTimeline } from './RequestTimeline';
  export { ActionPanel } from './ActionPanel';
  export { ConfirmStatusDialog } from './ConfirmStatusDialog';
  ```

- [x] T022 [US3] Create `src/pages/HelpRequestDetailsPage.tsx`. This is the `/help-requests/:id` detail page. Follow the same pattern as `src/pages/ReportDetails.tsx`.

  ```typescript
  import { useParams, useNavigate } from 'react-router';
  import { useHelpRequestDetails, useUpdateHelpRequestStatus, useReassignProvider } from '@/hooks/help-requests/useHelpRequests';
  import { PageHeader } from '@/components/shared';
  import { Alert, AlertDescription } from '@/components/ui/alert';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Skeleton } from '@/components/ui/skeleton';
  import {
    HelpRequestStatusBadge,
    HelpRequestCategoryBadge,
    HelpRequestMap,
    RequestTimeline,
    ActionPanel,
    ConfirmStatusDialog,
    // ContactUserModal and ReassignProviderModal added in later tasks
  } from '@/components/help-requests';
  import { TERMINAL_STATUSES } from '@/types/help-requests';
  import { useState } from 'react';
  ```

  State the component needs:
  ```typescript
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useHelpRequestDetails(id ?? '');
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateHelpRequestStatus();
  const { mutate: doReassign, isPending: isReassigning } = useReassignProvider();

  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: 'complete' | 'cancel' }>({
    open: false,
    action: 'complete',
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);    // used in US5
  const [reassignModalOpen, setReassignModalOpen] = useState(false);  // used in US4
  ```

  Handler functions:
  - `handleMarkCompleted`: sets `confirmDialog({ open: true, action: 'complete' })`
  - `handleCancelRequest`: sets `confirmDialog({ open: true, action: 'cancel' })`
  - `handleConfirmAction`: calls `updateStatus({ id: id!, newStatus: confirmDialog.action === 'complete' ? 'Completed' : 'Cancelled' })` then closes dialog
  - `handleReassignProvider`: sets `reassignModalOpen(true)` (modal built in US4)
  - `handleContactUser`: sets `contactModalOpen(true)` (modal built in US5)

  Render layout:
  ```tsx
  <section className="py-7 space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={() => navigate('/help-requests')}>← Back</Button>
      <PageHeader title="Help Request Details" subtitle={`Request ID: ${id}`} />
    </div>

    {isError && (
      <Alert variant="destructive">
        <AlertDescription>Request not found or failed to load.</AlertDescription>
      </Alert>
    )}

    {isLoading ? (
      // Skeleton layout — render skeleton cards for each section
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    ) : data ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Description */}
          <Card>
            <CardHeader><CardTitle>Request Description</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <HelpRequestCategoryBadge category={data.request.category} />
                <HelpRequestStatusBadge status={data.request.status} />
              </div>
              <p className="text-sm"><span className="font-medium">Location:</span> {data.request.locationText}</p>
              <p className="text-sm text-muted-foreground">
                Coordinates: {data.request.coordinates.lat}, {data.request.coordinates.lng}
              </p>
              <p className="text-sm text-muted-foreground">
                Submitted: {new Date(data.request.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{data.request.user.fullName}</p>
              <p className="text-sm text-muted-foreground">
                Phone: {data.request.user.phone ?? 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {data.request.user.email ?? 'N/A'}
              </p>
            </CardContent>
          </Card>

          {/* Assigned Provider */}
          <Card>
            <CardHeader><CardTitle>Assigned Provider</CardTitle></CardHeader>
            <CardContent>
              {data.request.provider ? (
                <div className="space-y-2">
                  <p className="font-medium">{data.request.provider.name}</p>
                  <p className="text-sm text-muted-foreground">Type: {data.request.provider.type}</p>
                  <p className="text-sm text-muted-foreground">Rating: {data.request.provider.rating.toFixed(1)} ★</p>
                  <p className="text-sm text-muted-foreground">ETA: {data.request.provider.etaMinutes} minutes</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Unassigned</p>
              )}
            </CardContent>
          </Card>

          {/* Location on Map */}
          <HelpRequestMap
            coordinates={data.request.coordinates}
            locationText={data.request.locationText}
          />

          {/* Request Timeline */}
          <Card>
            <CardHeader><CardTitle>Request Timeline</CardTitle></CardHeader>
            <CardContent>
              <RequestTimeline timeline={data.timeline} />
            </CardContent>
          </Card>
        </div>

        {/* Right column — action panel */}
        <div className="space-y-6">
          <ActionPanel
            request={data.request}
            onMarkCompleted={handleMarkCompleted}
            onCancelRequest={handleCancelRequest}
            onReassignProvider={handleReassignProvider}
            onContactUser={handleContactUser}
            isUpdatingStatus={isUpdatingStatus}
            isReassigning={isReassigning}
          />
        </div>
      </div>
    ) : null}

    {/* Confirmation dialog */}
    <ConfirmStatusDialog
      open={confirmDialog.open}
      onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      action={confirmDialog.action}
      onConfirm={handleConfirmAction}
      isLoading={isUpdatingStatus}
    />

    {/* ContactUserModal placeholder — rendered in US5 (T028) */}
    {/* ReassignProviderModal placeholder — rendered in US4 (T025) */}
  </section>
  ```

  Export as default export.

- [x] T023 [US3] Add `HelpRequestDetailsPage` to the pages barrel export. Open `src/pages/index.ts` and add:
  ```typescript
  export { default as HelpRequestDetailsPage } from './HelpRequestDetailsPage';
  ```
  Verify the route in `src/App.tsx` now correctly points to this component (T001 should already have registered the route).

- [x] T024 [US3] Verify User Story 3 in the browser. Click the "View" button on any card from the list page. Verify: (1) all six sections render — Description, User Info, Provider, Map, Timeline, Action Panel; (2) the Leaflet map shows a pin at the coordinates; (3) the timeline shows events for the request; (4) navigate to `hr_003` (a Completed request) — verify "Mark as Completed", "Cancel Request", and "Reassign Provider" are disabled with tooltips; "Contact User" is clickable; (5) on an Active request (`hr_001`), click "Mark as Completed" — verify confirmation dialog appears; confirm — verify status updates to Completed and a success toast appears; (6) Back button navigates to list. No TypeScript errors.

**Checkpoint**: `/help-requests/:id` detail page is fully functional with data, map, timeline, and action buttons.

---

## Phase 5: User Story 4 — Reassign Provider (Priority: P2)

**Goal**: When the administrator clicks "Reassign Provider" on the Action Panel (for a non-terminal request), a modal opens listing available providers filtered to the request's category. Selecting one and confirming updates the assigned provider.

**Independent Verification**: On the detail page for an Active request, click "Reassign Provider". Verify: (1) a modal opens listing providers that match the request's category; (2) selecting a provider and clicking "Reassign" closes the modal and updates the provider card with the new name and ETA; (3) a success toast appears; (4) closing the modal without selecting makes no change.

### Implementation for User Story 4

- [x] T025 [US4] Create `src/components/help-requests/ReassignProviderModal.tsx`. Props:

  ```typescript
  interface ReassignProviderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requestId: string;
    requestCategory: HelpRequestCategory;
    currentProviderId: string | null;
    onReassign: (providerId: string) => void;
    isLoading: boolean;
  }
  ```

  Import `getAvailableProviders` from `@/lib/help-requests-fixtures`. Call it synchronously inside the component: `const providers = getAvailableProviders(requestCategory);`

  State: `const [selectedProviderId, setSelectedProviderId] = useState<string | null>(currentProviderId);`

  Render a Shadcn `Dialog` (from `@/components/ui/dialog`). Structure:
  - `DialogHeader`: Title `"Reassign Provider"`, description `"Select a new provider for this help request. Only providers matching the request category are shown."`
  - `DialogContent`: A scrollable list of providers. For each provider in `providers`, render a clickable row (a `div` or Shadcn `Button` variant `"ghost"`) showing provider name, rating, and ETA. When a row is clicked, set `selectedProviderId` to that provider's id. Highlight the selected row with a distinct background (e.g., `bg-primary/10`).
  - `DialogFooter`: A `Button` labelled `"Reassign"` that calls `onReassign(selectedProviderId!)` and is disabled when `selectedProviderId === null || isLoading`. A `Button` variant `"outline"` labelled `"Cancel"` that calls `onOpenChange(false)`.

  Export as named export.

- [x] T026 [US4] Add `ReassignProviderModal` to the barrel export `src/components/help-requests/index.ts`:
  ```typescript
  export { ReassignProviderModal } from './ReassignProviderModal';
  ```

- [x] T027 [US4] Wire `ReassignProviderModal` into `src/pages/HelpRequestDetailsPage.tsx`. In `HelpRequestDetailsPage`:
  1. Import `ReassignProviderModal` from `@/components/help-requests`.
  2. After the `ConfirmStatusDialog` JSX at the bottom, add:
     ```tsx
     {data && (
       <ReassignProviderModal
         open={reassignModalOpen}
         onOpenChange={setReassignModalOpen}
         requestId={id!}
         requestCategory={data.request.category}
         currentProviderId={data.request.provider?.id ?? null}
         onReassign={(providerId) => {
           doReassign({ id: id!, providerId });
           setReassignModalOpen(false);
         }}
         isLoading={isReassigning}
       />
     )}
     ```
  3. The `handleReassignProvider` function is already in place from T022 — it opens the modal.

- [x] T028 [US4] Verify User Story 4 in the browser. On the detail page for `hr_001` (Active), click "Reassign Provider". Verify: (1) modal opens with a list of providers matching the Medical category (or whatever category hr_001 has); (2) selecting a provider highlights the row; (3) clicking "Reassign" closes the modal and updates the Provider card with the new name/ETA; (4) success toast shows; (5) closing without selecting keeps the original provider. No TypeScript errors.

**Checkpoint**: Provider reassignment modal is fully functional.

---

## Phase 6: User Story 5 — Contact User (Priority: P2)

**Goal**: When the administrator clicks "Contact User" on the Action Panel, a modal opens showing the user's name, phone, and email — each with a copy-to-clipboard button.

**Independent Verification**: On any detail page, click "Contact User". Verify: (1) a modal opens with the user's name, phone, and email; (2) each field has a copy button; (3) clicking a copy button copies the value to the clipboard; (4) if phone or email is null, the field shows "N/A" and the copy button is disabled; (5) clicking "Close" dismisses the modal.

### Implementation for User Story 5

- [x] T029 [US5] Create `src/components/help-requests/ContactUserModal.tsx`. Props:

  ```typescript
  interface ContactUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: HelpRequestUser;
  }
  ```

  State: `const [copied, setCopied] = useState<string | null>(null);` — tracks which field was last copied (for displaying a checkmark).

  Copy handler:
  ```typescript
  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };
  ```

  Render a Shadcn `Dialog`. Structure:
  - `DialogHeader`: Title `"Contact User"`, description `"User contact details for this help request. No email or call is triggered automatically."`
  - `DialogContent`: Three rows, one for each field:
    - **Name**: label `"Name"`, value `user.fullName`. Show a copy button (icon `Copy` from lucide-react) that copies `user.fullName`. When `copied === 'name'`, show a `Check` icon instead of `Copy`.
    - **Phone**: label `"Phone"`, value `user.phone ?? 'N/A'`. Copy button `disabled={!user.phone}`. When `copied === 'phone'`, show `Check` icon.
    - **Email**: label `"Email"`, value `user.email ?? 'N/A'`. Copy button `disabled={!user.email}`. When `copied === 'email'`, show `Check` icon.

    Each row renders as a `div` with `className="flex items-center justify-between py-2 border-b last:border-0"`. Left side: label in muted small text, value in normal text below. Right side: icon button.

    If all three of `user.phone` and `user.email` are null, also render a Shadcn `Alert` (info-style) at the top of the content: `"No contact information is available for this user."`.
  - `DialogFooter`: A `Button` variant `"outline"` labelled `"Close"` that calls `onOpenChange(false)`.

  Export as named export.

- [x] T030 [US5] Add `ContactUserModal` to the barrel export `src/components/help-requests/index.ts`:
  ```typescript
  export { ContactUserModal } from './ContactUserModal';
  ```

- [x] T031 [US5] Wire `ContactUserModal` into `src/pages/HelpRequestDetailsPage.tsx`. In `HelpRequestDetailsPage`:
  1. Import `ContactUserModal` from `@/components/help-requests`.
  2. After the `ReassignProviderModal` JSX, add:
     ```tsx
     {data && (
       <ContactUserModal
         open={contactModalOpen}
         onOpenChange={setContactModalOpen}
         user={data.request.user}
       />
     )}
     ```
  3. The `handleContactUser` function is already in place from T022 — it opens the modal.

- [x] T032 [US5] Verify User Story 5 in the browser. Click "Contact User" on the detail page. Verify: (1) modal opens with name, phone, email; (2) clicking copy button on phone copies value (check clipboard in DevTools or paste somewhere); (3) `Check` icon appears briefly after copy; (4) request where user has no phone/email shows "N/A" and disabled copy button; (5) modal with all null contact info shows the "No contact information" alert. No TypeScript errors.

**Checkpoint**: Contact User modal is fully functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive layout, error/empty states, linting, and build verification across the feature.

- [x] T033 [P] Accessibility audit for `/help-requests` list page. In the browser DevTools (Accessibility tab), verify: (1) `<h1>Help Requests</h1>` exists on the page (from `PageHeader`); (2) every `HelpRequestCard` has a meaningful accessible "View" button — check that the button has an `aria-label` that includes the request category and user name (e.g., `aria-label="View Medical request from Ahmed Hassan"`); update `HelpRequestCard.tsx` to add this `aria-label`; (3) toolbar controls (Input, Selects) have accessible labels — wrap them in `<label>` or add `aria-label` props if missing; (4) pagination buttons have `aria-label` props (e.g., `"Previous page"`, `"Next page"`).

- [x] T034 [P] Accessibility audit for `/help-requests/:id` detail page. Verify: (1) `<h1>Help Request Details</h1>` exists; (2) disabled Action Panel buttons are wrapped in a `<span>` with `aria-disabled="true"` (the current `<span>` wrapper from T019 satisfies this but confirm the tooltip is accessible via keyboard focus on the span); (3) all dialog components (ConfirmStatusDialog, ReassignProviderModal, ContactUserModal) trap focus correctly when open; (4) copy buttons in ContactUserModal have `aria-label` (e.g., `aria-label="Copy phone number"`).

- [x] T035 [P] Responsive layout verification. Resize browser to 375px width. Verify: (1) list page — cards stack in single column; toolbar controls stack vertically; pagination footer wraps correctly; (2) detail page — left/right grid collapses to single column; map section is full-width; Action Panel appears below content sections. Fix any Tailwind classes that cause overflow or clipping.

- [x] T036 Run `npm run lint` from the project root. Fix any lint errors in the new files under `src/types/help-requests.ts`, `src/lib/help-requests-fixtures.ts`, `src/hooks/help-requests/`, `src/components/help-requests/`, and `src/pages/HelpRequestsPage.tsx` + `src/pages/HelpRequestDetailsPage.tsx`.

- [x] T037 Run `npx tsc --noEmit` from the project root. Fix any TypeScript compilation errors in the new files. Common issues: missing imports, `any` types (prohibited by Constitution), wrong prop types, missing `return` type on exported functions.

- [x] T038 End-to-end walkthrough. Open the running dev server and do the following in sequence: (1) Navigate to `/help-requests`. Confirm cards load. (2) Filter by "Towing" — only towing requests show. (3) Search for "Cairo" — list narrows. (4) Clear filters. (5) Change page size to 20 — list shows 20 cards (or all available). (6) Click "View" on a Pending request — detail page loads. (7) Click "Mark as Completed" — confirm dialog shows — confirm — status updates and toast shows. (8) Verify action buttons are now disabled. (9) Click "Contact User" — modal shows with contact details. (10) Go back to list. Confirm no console errors or React warnings throughout.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user story phases**.
- **Phase 3 (US1 — List Page)**: Depends on Phase 2.
- **Phase 4 (US3 — Detail Page)**: Depends on Phase 2. Can start in parallel with Phase 3.
- **Phase 5 (US4 — Reassign Provider)**: Depends on Phase 4 (detail page must exist).
- **Phase 6 (US5 — Contact User)**: Depends on Phase 4 (detail page must exist). Can run in parallel with Phase 5.
- **Phase 7 (Polish)**: Depends on all story phases being complete.

### User Story Dependencies

- **US1 (List page)**: Independent after Phase 2. Does not depend on US3.
- **US3 (Detail page)**: Independent after Phase 2. Does not depend on US1 (but the list's "View" button navigates here).
- **US4 (Reassign Provider)**: Depends on US3 (detail page shell with `reassignModalOpen` state).
- **US5 (Contact User)**: Depends on US3 (detail page shell with `contactModalOpen` state).

### Within Each User Story

- Types/fixtures (T004, T005) before hooks (T006)
- Hooks (T006) before page components
- Smaller sub-components before the parent page
- Barrel index.ts updated before the page imports from it

### Parallel Opportunities

- T007, T008, T009, T010, T011, T012 (US1 sub-components) can all run in parallel
- T017, T018, T019, T020 (US3 sub-components) can all run in parallel
- T033, T034, T035, T036, T037 (Polish) can all run in parallel

---

## Implementation Strategy

### MVP First (List Page Only)

1. Complete Phase 1 (Setup — T001–T003)
2. Complete Phase 2 (Foundational — T004–T006)
3. Complete Phase 3 (US1 — T007–T016)
4. **STOP and VALIDATE**: `/help-requests` list page works independently
5. Proceed to Phase 4

### Incremental Delivery

1. Setup → Foundational → List page (MVP)
2. + Detail page (US3)
3. + Reassign Provider modal (US4)
4. + Contact User modal (US5)
5. + Polish

---

## Notes

- All file paths use the `@/` alias which maps to `src/`. Example: `@/types/help-requests` → `src/types/help-requests.ts`.
- The `src/lib/help-requests-fixtures.ts` file maintains **in-memory mutable state** via module-level `let` variables. This means mutations (status updates, reassignments) persist across navigation within a single browser session but reset on page reload. This is intentional for mock mode.
- The existing `src/components/reports/ReportMap.tsx` contains the Leaflet default icon fix. **Copy it exactly** into `HelpRequestMap.tsx` — without it, map markers will not render.
- The `[P]` annotation on tasks means those tasks operate on **different files** and have no code dependency on each other. They can be implemented simultaneously by different agents or in any order.
- The `src/pages/index.ts` barrel file must be updated (T015, T023) before any lazy-loaded or named imports from `./pages` will resolve in `App.tsx`.
- Confirm `<Toaster />` is already mounted in `src/main.tsx` or `src/App.tsx` (it was added in Phase 9). If not, add `import { Toaster } from 'sonner'` and render `<Toaster />` inside the root component — without this, no toast notifications will appear.
