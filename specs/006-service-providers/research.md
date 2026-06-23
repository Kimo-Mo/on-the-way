# Research: Service Providers

**Feature**: `006-service-providers`  
**Date**: 2026-06-21  
**Status**: Complete - all unknowns resolved

---

## Decision 1: Canonical Provider Route

- **Decision**: Use `/providers` and `/providers/:id` as the canonical routes. Update existing dashboard/sidebar references that currently point at `/service-providers` to route to `/providers` or redirect the old path if needed during implementation.
- **Rationale**: The active spec and PLAN phase explicitly name `/providers`. Keeping two active route names would split navigation, links, and acceptance tests.
- **Alternatives considered**: Keep `/service-providers` as canonical - rejected because it contradicts the current feature spec. Support only the existing stub path - rejected because downstream Spec Kit artifacts and tests should follow the spec.

---

## Decision 2: URL Search Parameter Strategy

- **Decision**: Use React Router `useSearchParams` for list state: `page`, `pageSize`, `search`, `type`, and `status`.
- **Rationale**: This matches the existing Users and Reports management patterns, enables shareable filtered URLs, and avoids adding global state for page-local controls.
- **Alternatives considered**: Zustand global store - unnecessary for page-local filter state. Component-only state - not shareable and harder to restore on navigation.

---

## Decision 3: React Query Provider Data Pattern

- **Decision**: Implement `useProviders(params)` with query key `['providers', params]`, `placeholderData: keepPreviousData`, and a short stale time. Implement `useProviderDetails(id)` with key `['providers', id]`. Implement `useUpdateProviderStatus()` for approve/reject/suspend mutations and invalidate both list and detail provider queries on success.
- **Rationale**: This preserves the data/state discipline required by the constitution and follows the established reports/users pattern. Cache invalidation keeps list and detail views consistent after actions.
- **Alternatives considered**: Optimistic status updates - deferred because provider status actions are low-frequency administrative decisions where server confirmation should remain the source of truth.

---

## Decision 4: Mock-to-Live API Bridge

- **Decision**: Use a typed `src/lib/providers-fixtures.ts` fallback during backend integration, matching the live contract shapes in `contracts/api-contracts.md`.
- **Rationale**: Existing features use typed fixtures while the live .NET endpoints are not fully connected. The fallback keeps the UI implementable and easy to remove later.
- **Alternatives considered**: MSW - broader setup than needed for this phase. Hardcoded component data - rejected because it leaks data shape into UI components and makes replacement harder.

---

## Decision 5: Provider List Layout

- **Decision**: Use a table-based list with a toolbar for search/type/status filters, status badges, verification badges, rating display, and row action to open provider details.
- **Rationale**: Providers are operational records that benefit from dense comparison across business name, type, status, verification readiness, and rating. This aligns with the admin-dashboard style and PLAN requirement for a `ProvidersTable`.
- **Alternatives considered**: Card grid - less efficient for scanning provider state across many records.

---

## Decision 6: Status Action Dialogs

- **Decision**: Use one reusable `ProviderStatusActionDialog` configured for approve, reject, and suspend. Approve uses confirmation only and is disabled/blocked when required documents are missing. Reject and Suspend require a preset reason and allow optional notes. Forms use React Hook Form + Zod.
- **Rationale**: Clarification established the reason model and document gate. One configurable dialog keeps interaction patterns consistent while preserving distinct validation per action.
- **Alternatives considered**: Separate bespoke dialogs for each action - more duplication. Free-text-only reasons - rejected by clarification.

---

## Decision 7: Required Verification Documents

- **Decision**: Treat business license, provider identity document, and service eligibility proof as mandatory approval documents. Approval is blocked until all three are present.
- **Rationale**: Clarification established this baseline. It gives the UI, contracts, and tests a concrete approval gate.
- **Alternatives considered**: Vary mandatory documents by service type - deferred to a future enhancement because it adds policy complexity not required by the current spec.

---

## Decision 8: Customer Reviews Scope

- **Decision**: Display a bounded rating summary and recent reviews on the Provider Details page. Review moderation, deletion, replies, and full review pagination are out of scope.
- **Rationale**: The spec asks admins to inspect reviews for provider decisions and explicitly keeps customer reviews read-only in this phase. A bounded section avoids unbounded list performance work.
- **Alternatives considered**: Full review-management module - rejected as scope creep and belongs in moderation.

---

## Decision 9: Action Feedback

- **Decision**: Use Sonner toasts for success/error feedback and inline validation/disabled states inside dialogs. On success, invalidate `['providers']` and `['providers', id]` query keys.
- **Rationale**: Sonner is already installed and used in the project. Toast plus query invalidation satisfies the 3-second visible feedback success criterion and keeps reflected state server-driven.
- **Alternatives considered**: Inline-only feedback - less visible for completed mutations. Optimistic UI - unnecessary risk for admin decisions.
