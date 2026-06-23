# Quickstart: Service Providers

**Feature**: `006-service-providers`  
**Date**: 2026-06-21

This guide provides the implementation context for Phase 6 of the On The Way Admin Dashboard.

---

## What is Being Built

1. **`/providers` page** - A paginated, searchable, filterable providers table categorized by service type and status.
2. **`/providers/:id` page** - A details view with business info, verification documents, customer rating summary, recent reviews, and provider status actions.
3. **Status action dialogs** - Approve, Reject, and Suspend flows. Reject/Suspend require preset reasons and optional notes. Approve is blocked until required documents are present.

---

## Key Files to Create / Modify

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/App.tsx` | Register `/providers` and `/providers/:id`; reconcile existing `/service-providers` stub |
| Modify | `src/lib/dashboard-links.ts` | Point service provider navigation to `/providers` |
| Create | `src/types/providers.ts` | Domain/API types and Zod schemas |
| Modify | `src/types/index.ts` | Re-export provider types |
| Create | `src/lib/providers-fixtures.ts` | Typed fallback data matching contracts |
| Create | `src/hooks/useProviders.ts` | React Query hook for paginated provider list |
| Create | `src/hooks/useProviderDetails.ts` | React Query hook for provider details |
| Create | `src/hooks/useUpdateProviderStatus.ts` | Mutation hook for approve/reject/suspend |
| Create | `src/pages/ProvidersManagement.tsx` | Providers list page |
| Create | `src/pages/ProviderDetails.tsx` | Provider details and actions page |
| Modify | `src/pages/index.ts` | Export provider pages |
| Create | `src/components/providers/ProvidersToolbar.tsx` | Search + type/status filters |
| Create | `src/components/providers/ProvidersTable.tsx` | Provider table with row navigation |
| Create | `src/components/providers/ProviderStatusBadge.tsx` | Status badge |
| Create | `src/components/providers/ProviderVerificationBadge.tsx` | Verification readiness badge |
| Create | `src/components/providers/ProviderRating.tsx` | Rating or unrated state |
| Create | `src/components/providers/ProviderDetailsSummary.tsx` | Business/contact/operating area panel |
| Create | `src/components/providers/VerificationDocumentsPanel.tsx` | Documents and missing required docs |
| Create | `src/components/providers/CustomerReviewsPanel.tsx` | Rating summary + recent reviews |
| Create | `src/components/providers/ProviderStatusActionDialog.tsx` | Approve/Reject/Suspend dialog |
| Create | `src/components/providers/index.ts` | Component exports |

---

## Route Handling

Use `/providers` as canonical. The existing `/service-providers` stub in `src/App.tsx` and dashboard/sidebar links should be updated to avoid split navigation. If preserving old links is useful during rollout, redirect `/service-providers` to `/providers`.

---

## React Query Pattern

Mirror the existing Users and Reports hooks.

```typescript
export const useProviders = (params: ProvidersQueryParams) => {
  return useQuery({
    queryKey: ['providers', params],
    queryFn: () => fetchProviders(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
```

Mutation hook:

```typescript
export const useUpdateProviderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ providerId, payload }: UpdateProviderStatusVariables) =>
      api.post(`/admin/providers/${providerId}/status`, payload),
    onSuccess: (_, { providerId }) => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', providerId] });
    },
  });
};
```

---

## Provider List State

Use URL search params as the source of truth:

```typescript
const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get('page') ?? '1');
const type = searchParams.get('type') as ProviderServiceType | null;
const status = searchParams.get('status') as ProviderStatus | null;
const search = searchParams.get('search') ?? '';
```

Reset `page` to `1` whenever `search`, `type`, or `status` changes.

---

## Required Approval Documents

Approval is available only when these required document types are present and available:

- `businessLicense`
- `providerIdentity`
- `serviceEligibilityProof`

Render missing required documents in `VerificationDocumentsPanel` and disable/block the Approve action with a clear explanation.

---

## Status Dialog Behavior

### Approve

- Confirmation-only dialog.
- No reason field.
- Disabled/blocked when required documents are missing.
- On success: provider becomes `approved` and immediately available to drivers.

### Reject

- Allowed for `pending` providers.
- Requires preset reason.
- Optional notes field, max 500 characters.

### Suspend

- Allowed for `approved` providers.
- Requires preset reason.
- Optional notes field, max 500 characters.

Use React Hook Form + Zod for Reject/Suspend:

```typescript
const form = useForm<RejectProviderFormValues>({
  resolver: zodResolver(rejectProviderSchema),
});
```

---

## Fixture Data Guidelines

Create at least 12 provider fixtures covering:

- All statuses: pending, approved, rejected, suspended
- Service types: towing, medical, fuel, mechanic, other
- One unrated provider (`averageRating: null`, `reviewCount: 0`)
- One pending provider missing each required document type
- One provider with an unavailable document preview
- One provider with no reviews
- One suspended provider with a latest suspension decision and notes

The fixture shape must match `contracts/api-contracts.md`.

---

## API Endpoints

| Hook | Method | Endpoint |
|------|--------|----------|
| `useProviders` | GET | `/admin/providers` |
| `useProviderDetails` | GET | `/admin/providers/:id` |
| `useUpdateProviderStatus` | POST | `/admin/providers/:id/status` |

See `contracts/api-contracts.md` for full request and response shapes.

---

## Constitution Compliance Reminders

- No `useEffect` for fetching. Use React Query hooks only.
- Keep list pagination/filter state in URL search params.
- Use explicit TypeScript interfaces and discriminated union payloads.
- Use Shadcn/Radix/Tailwind components and existing dashboard styling.
- Use React Hook Form + Zod for Reject/Suspend forms.
- Render loading, empty, unavailable, authorization, validation, and remote failure states explicitly.
- Keep `/providers` and `/providers/:id` usable at 768px+ without horizontal page scrolling or overlapping controls.
