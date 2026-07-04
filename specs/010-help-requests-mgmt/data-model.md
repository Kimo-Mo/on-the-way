# Data Model: Help Requests Management

## Overview
This document defines the data structures and state transitions for the Help Requests Management feature.

## Core Entities

### `HelpRequest`
Represents a single assistance request submitted by a mobile app user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `category` | `enum` | Type of assistance: `'Medical' | 'Towing' | 'Fuel' | 'Repair'` |
| `status` | `enum` | Current state: `'Active' | 'Pending' | 'Completed' | 'Cancelled'` |
| `locationText` | `string` | Human-readable address or description of location |
| `coordinates` | `object` | `{ lat: number, lng: number }` |
| `createdAt` | `string (ISO Date)` | Timestamp of creation |
| `user` | `HelpRequestUser` | Summary object of the requesting user |
| `provider` | `HelpRequestProvider | null` | Summary object of the assigned provider, or null if unassigned |

#### Valid State Transitions
Enforced by both the UI Action Panel and the mock service layer:
- **`Pending`** → `Active`, `Completed`, `Cancelled`
- **`Active`** → `Completed`, `Cancelled`
- **`Completed`** → *(Terminal state - no outbound transitions)*
- **`Cancelled`** → *(Terminal state - no outbound transitions)*

### `HelpRequestUser`
Summary of the user who submitted the request.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Reference to the full User record |
| `fullName` | `string` | User's display name |
| `avatarUrl` | `string | null` | Profile picture URL |
| `phone` | `string | null` | Contact phone number |
| `email` | `string | null` | Contact email address |

### `HelpRequestProvider`
Summary of the assigned service provider.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Reference to the full Provider record |
| `name` | `string` | Provider's business name |
| `type` | `string` | Provider category (should map to HelpRequest category) |
| `rating` | `number` | Average rating (e.g., 4.5) |
| `etaMinutes` | `number` | Pre-computed ETA in minutes |

### `TimelineEvent`
A single status update in the request lifecycle.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `helpRequestId` | `string` | Reference to parent request |
| `eventLabel` | `string` | Standardized event (e.g., "Created", "Provider Notified", "En Route", "Arrived", "Completed", "Cancelled") |
| `timestamp` | `string (ISO Date)` | When the event occurred |
| `description` | `string | null` | Optional additional context |

## API Contracts (Mock)

Since we are using a mock service layer, these represent the interfaces for the Axios service functions:

```typescript
// Fetch List with Pagination & Filters
interface GetHelpRequestsParams {
  page: number; // default 1
  pageSize: number; // 10 | 20 | 50, default 10
  category?: string;
  status?: string;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  }
}

// Service Functions
type GetHelpRequests = (params: GetHelpRequestsParams) => Promise<PaginatedResponse<HelpRequestSummary>>;
type GetHelpRequestDetails = (id: string) => Promise<{ request: HelpRequest, timeline: TimelineEvent[] }>;
type UpdateHelpRequestStatus = (id: string, newStatus: 'Completed' | 'Cancelled') => Promise<HelpRequest>;
type ReassignProvider = (id: string, providerId: string) => Promise<HelpRequest>;
```
