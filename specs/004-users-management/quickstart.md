# Quickstart: Users Management

**Feature**: `004-users-management`
**Date**: 2026-06-18

This guide provides the essential context a developer needs to begin implementing Phase 4 of the On The Way Admin Dashboard.

---

## What is Being Built

A fully functional Users Management module consisting of:

1. **`/users` page** — A paginated, searchable, filterable table of all system users, replacing the current stub in `src/pages/UsersManagement.tsx`.
2. **`/users/:id` page** — A read-only details view showing a user's full profile and activity history.

---

## Key Files to Create / Modify

| Action   | Path                                        | Purpose                                    |
|----------|---------------------------------------------|--------------------------------------------|
| Modify   | `src/pages/UsersManagement.tsx`             | Replace stub with full table page          |
| Create   | `src/pages/UserDetails.tsx`                 | New user details page                      |
| Modify   | `src/pages/index.ts`                        | Export `UserDetails`                       |
| Modify   | `src/App.tsx`                               | Add `/users/:id` route                     |
| Create   | `src/types/users.ts`                        | All domain types from `data-model.md`      |
| Create   | `src/hooks/useUsers.ts`                     | React Query hook for paginated users list  |
| Create   | `src/hooks/useUserDetails.ts`               | React Query hook for single user + history |
| Create   | `src/lib/users-fixtures.ts`                 | Typed mock data for fallback               |
| Create   | `src/components/users/UsersTableToolbar.tsx`| Search + filter controls                   |
| Create   | `src/components/users/UsersTable.tsx`       | Shadcn Table with data rows                |
| Create   | `src/components/users/UserStatusBadge.tsx`  | Status badge (active/suspended/pending)    |
| Create   | `src/components/users/UserRoleBadge.tsx`    | Role badge display                         |
| Create   | `src/components/users/UsersPagination.tsx`  | Page navigation footer                     |

---

## Architectural Patterns to Follow

### 1. URL State for Table Filters
Use React Router's `useSearchParams` to sync all table state to the URL. This is the **only** source of truth for pagination and filters.

```typescript
const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get('page') ?? '1');
const role = searchParams.get('role') as UserRole | null;
```

### 2. React Query Hook with Fixture Fallback
Mirror the established pattern from `src/hooks/useDashboardOverview.ts`:

```typescript
const fetchUsers = async (params: UsersQueryParams): Promise<UsersListResponse> => {
  try {
    const { data } = await api.get<UsersListResponse>('/admin/users', { params });
    return data;
  } catch (error) {
    console.warn('[users] API unavailable, using fixture data:', error);
    return usersFixtures; // typed mock matching UsersListResponse
  }
};

export const useUsers = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
```

### 3. Component Hierarchy on `/users` Page

```
UsersManagement (page)
├── PageHeader
├── UsersTableToolbar
│   ├── Search Input (Shadcn Input)
│   ├── Role Filter (Shadcn Select)
│   └── Status Filter (Shadcn Select)
├── UsersTable
│   ├── Shadcn Table (with Skeleton rows on loading)
│   ├── UserRoleBadge
│   ├── UserStatusBadge
│   └── Trust Score (numeric %, e.g., "87%")
└── UsersPagination
```

---

## Trust Score Display Rule

`trustScore` is a `number` (0–100) from the API. Always render it as:

```tsx
<span>{user.trustScore}%</span>
```

On the details page, optionally render a progress bar (`Shadcn Progress`) alongside the percentage.

---

## API Endpoints (mock until live)

| Hook                | Method | Endpoint                |
|---------------------|--------|-------------------------|
| `useUsers`          | GET    | `/admin/users`          |
| `useUserDetails`    | GET    | `/admin/users/:id`      |

See `contracts/api-contracts.md` for full request/response shapes.

---

## Fixture Data Guidelines

Create `src/lib/users-fixtures.ts` with at least 15 mock users covering all roles and statuses. Ensure the mock response matches `UsersListResponse` exactly.

---

## Constitution Compliance Reminders

- ✅ No `useEffect` for data fetching — use React Query hooks only.
- ✅ All types must be explicit — no `any` or implicit `{}`.
- ✅ All UI components must use Shadcn/Radix/Tailwind — no custom CSS.
- ✅ Empty, loading, and error states must be rendered explicitly.
- ✅ Table must use server-side pagination — do not fetch all users at once.
