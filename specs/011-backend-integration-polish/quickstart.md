# Quickstart: Backend Integration, Refactoring & Final Polish

**Date**: 2026-07-07  
**Feature**: [spec.md](file:///c:/iProjects/on-the-way/specs/011-backend-integration-polish/spec.md)

## Prerequisites

1. Node.js and npm installed
2. `.env` file with `VITE_API_BASE_URL` pointing to the live .NET backend
3. Backend server running and accessible at the configured URL
4. `swagger.json` or Postman collection available for endpoint reference

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Key Directories

| Path | Purpose |
|------|---------|
| `src/hooks/<domain>/` | React Query hooks with co-located data mappers (one file per domain) |
| `src/types/` | TypeScript interfaces — source of truth for frontend data shapes |
| `src/lib/axios.ts` | Shared Axios instance with auth interceptor |
| `src/lib/*-fixtures.ts` | Mock data files (only `analytics-fixtures.ts` remains post-integration) |
| `src/components/shared/` | Shared UI components: `PageError`, `PageEmpty`, `TableSkeleton`, `CardSkeleton` |
| `src/pages/` | Page components consuming hooks and shared UI state components |

## Hook File Convention

Every hook file in `src/hooks/<domain>/use<Domain>.ts` follows this structure:

```typescript
import api from '@/lib/axios';
import type { ... } from '@/types/<domain>';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

// ─── Mapper ───────────────────────────────────────────────────────────────────
/** Maps backend PascalCase response to frontend camelCase interface. */
const mapBackendEntity = (raw: any): FrontendType => ({ ... });

// ─── Fetch Function ───────────────────────────────────────────────────────────
/** Fetches entities from GET /api/admin/<domain>. */
export const fetchEntities = async (params: QueryParams): Promise<ListResponse> => {
  const { data } = await api.get('/admin/<domain>', { params });
  // Normalize and map...
};

// ─── Query Key ────────────────────────────────────────────────────────────────
export const ENTITY_QUERY_KEY = (params: QueryParams) => ['<domain>', params] as const;

// ─── Query Hook ───────────────────────────────────────────────────────────────
/** React Query hook for fetching <domain> list. */
export const useEntities = (params: QueryParams) => {
  return useQuery({ queryKey: ENTITY_QUERY_KEY(params), queryFn: () => fetchEntities(params), ... });
};

// ─── Mutation Hooks ───────────────────────────────────────────────────────────
/** Mutation for updating <entity> status. */
export const useUpdateEntityStatus = () => { ... };
```

## Verification Commands

```bash
# Type check (strict mode)
npx tsc --noEmit

# Lint
npm run lint

# Verify no console statements remain
npx grep -r "console\.\(log\|warn\)" src/ --include="*.ts" --include="*.tsx"

# Dev server
npm run dev
```
