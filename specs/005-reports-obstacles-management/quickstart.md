# Quickstart: Reports & Obstacles Management

**Feature**: `005-reports-obstacles-management`
**Date**: 2026-06-19

This guide provides the essential context a developer needs to begin implementing Phase 5 of the On The Way Admin Dashboard.

---

## What is Being Built

A fully functional Reports & Obstacles Management module consisting of:

1. **`/reports` page** — A paginated, searchable, filterable card list of road obstacle reports, replacing the current stub in `App.tsx`.
2. **`/reports/:id` page** — A full details view showing the report description, image gallery, Leaflet map, metadata sidebar, and four moderation action buttons (Approve, Mark as Urgent, Remove, Flag User).

---

## Key Files to Create / Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/App.tsx` | Register `/reports` and `/reports/:id` routes |
| Create | `src/types/reports.ts` | All domain types from `data-model.md` |
| Modify | `src/types/index.ts` | Re-export reports types |
| Create | `src/lib/reports-fixtures.ts` | Typed mock data for fixture fallback |
| Create | `src/hooks/useReports.ts` | React Query hook for paginated reports list |
| Create | `src/hooks/useReportDetails.ts` | React Query hook for single report details |
| Create | `src/hooks/useApproveReport.ts` | Mutation hook: POST approve |
| Create | `src/hooks/useMarkUrgent.ts` | Mutation hook: POST mark-urgent |
| Create | `src/hooks/useRemoveReport.ts` | Mutation hook: DELETE with reason |
| Create | `src/hooks/useFlagUser.ts` | Mutation hook: POST flag-user |
| Create | `src/pages/ReportsManagement.tsx` | Full reports list page |
| Create | `src/pages/ReportDetails.tsx` | Report details + moderation page |
| Modify | `src/pages/index.ts` | Export new pages |
| Create | `src/components/reports/ReportsToolbar.tsx` | Search + type/status filter controls |
| Create | `src/components/reports/ReportCard.tsx` | Report card with badges, votes, "View" button |
| Create | `src/components/reports/ReportCardSkeleton.tsx` | Skeleton placeholder during load |
| Create | `src/components/reports/ReportStatusBadge.tsx` | Pending/Urgent/Approved/Removed badge |
| Create | `src/components/reports/ObstacleTypeBadge.tsx` | Obstacle type tag |
| Create | `src/components/reports/ReportsPagination.tsx` | Page navigation footer |
| Create | `src/components/reports/ReportImageGallery.tsx` | Image grid or "No images" empty state |
| Create | `src/components/reports/ReportMap.tsx` | Leaflet map widget (conditional render) |
| Create | `src/components/reports/ReportMetaSidebar.tsx` | Votes, submitter link, coordinates panel |
| Create | `src/components/reports/RemoveReportDialog.tsx` | Shadcn Dialog + RHF + Zod reason dropdown |
| Create | `src/components/reports/FlagUserDialog.tsx` | Shadcn Dialog confirm + mutation |

---

## Architectural Patterns to Follow

### 1. URL State for List Filters
Use React Router's `useSearchParams` — the **only** source of truth for pagination and filter state.

```typescript
const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get('page') ?? '1');
const status = searchParams.get('status') as ReportStatus | null;
const obstacleType = searchParams.get('obstacleType') as ObstacleType | null;
```

### 2. React Query Hook with Fixture Fallback
Mirror the established pattern from `src/hooks/useUsers.ts`:

```typescript
const fetchReports = async (params: ReportsQueryParams): Promise<ReportsListResponse> => {
  try {
    const { data } = await api.get<ReportsListResponse>('/admin/reports', { params });
    return data;
  } catch (error) {
    console.warn('[reports] API unavailable, using fixture data:', error);
    return reportsListFixture;
  }
};

export const useReports = (params: ReportsQueryParams) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => fetchReports(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
```

### 3. Mutation Hooks with Cache Invalidation
Use `useMutation` and invalidate the relevant query keys on success:

```typescript
export const useApproveReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/admin/reports/${id}/approve`),
    onSuccess: (_, id) => {
      toast.success('Report approved successfully.');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', id] });
    },
  });
};
```

### 4. Removal Dialog with React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { removeReportSchema, RemoveReportFormValues } from '@/types/reports';

const form = useForm<RemoveReportFormValues>({
  resolver: zodResolver(removeReportSchema),
});
```

The dialog renders a Shadcn `Select` for the reason dropdown. The confirm button is disabled until a valid reason is selected.

### 5. Component Hierarchy on `/reports` Page

```
ReportsManagement (page)
├── PageHeader
├── ReportsToolbar
│   ├── Search Input (Shadcn Input)
│   ├── Type Filter (Shadcn Select)
│   └── Status Filter (Shadcn Select)
├── Report card grid (CSS grid, 1–2 columns)
│   ├── ReportCard (×N)
│   └── ReportCardSkeleton (×N while loading)
└── ReportsPagination
```

### 6. Component Hierarchy on `/reports/:id` Page

```
ReportDetails (page)
├── Back button (navigate(-1))
├── PageHeader (title + badges)
├── Two-column layout (main + sidebar)
│   ├── Main column
│   │   ├── Description
│   │   ├── ReportImageGallery (or "No images" placeholder)
│   │   └── ReportMap (or "Location unavailable" placeholder)
│   └── Sidebar (ReportMetaSidebar)
│       ├── Submitter name (Link or "Deleted User" span)
│       ├── GPS coordinates
│       └── CommunityVotes (upvotes / downvotes)
└── Action buttons row
    ├── Approve Report (Button, disabled if already approved)
    ├── Mark as Urgent (Button, disabled if already urgent)
    ├── Remove Report (triggers RemoveReportDialog)
    └── Flag User (triggers FlagUserDialog)
```

---

## Leaflet Map Usage

The `react-leaflet` package is already installed. In `ReportMap.tsx`:

```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Render only when gpsCoordinates is non-null
<MapContainer center={[lat, lng]} zoom={15} style={{ height: '300px', width: '100%' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <Marker position={[lat, lng]}>
    <Popup>{locationAddress}</Popup>
  </Marker>
</MapContainer>
```

**Important**: Leaflet requires the CSS import and a fixed height on the map container. The default Leaflet icon requires a workaround — apply the same fix used in the Phase 3 Dashboard implementation.

---

## API Endpoints

| Hook | Method | Endpoint |
|------|--------|----------|
| `useReports` | GET | `/admin/reports` |
| `useReportDetails` | GET | `/admin/reports/:id` |
| `useApproveReport` | POST | `/admin/reports/:id/approve` |
| `useMarkUrgent` | POST | `/admin/reports/:id/mark-urgent` |
| `useRemoveReport` | DELETE | `/admin/reports/:id` |
| `useFlagUser` | POST | `/admin/reports/:id/flag-user` |

See `contracts/api-contracts.md` for full request/response shapes.

---

## Fixture Data Guidelines

Create `src/lib/reports-fixtures.ts` with at least 12 mock reports covering:
- All `ObstacleType` values
- All `ReportStatus` values (pending, urgent, approved, removed)
- At least one report with no images (`imageUrls: []`)
- At least one report with `gpsCoordinates: null`
- At least one report with `submitter.isDeleted: true`

Ensure the mock response matches `ReportsListResponse` exactly.

---

## Constitution Compliance Reminders

- ✅ No `useEffect` for data fetching — use React Query hooks only.
- ✅ All types must be explicit — no `any` or implicit `{}`.
- ✅ All UI components must use Shadcn/Radix/Tailwind — no custom CSS outside of the Leaflet map container height.
- ✅ Loading (skeleton cards), empty (empty state with clear filters), and error (Alert + Retry) states must be rendered explicitly.
- ✅ List must use server-side pagination — do not fetch all reports at once.
- ✅ Removal form must be validated with Zod + React Hook Form before submission.
- ✅ All moderation action buttons must have accessible labels and visible disabled/loading states.
