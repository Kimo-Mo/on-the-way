# API Contracts: Moderation Panel

**Feature**: `007-moderation-panel`  
**Date**: 2026-06-24  
**Note**: These contracts describe the expected backend interface. All endpoints are prefixed with `/admin`. The frontend uses the shared Axios client configured with base URL and auth interceptors in `src/lib/axios.ts`.

---

## GET `/admin/moderation/flagged-reports`

Fetch the list of flagged reports currently awaiting moderation review.

### Query Parameters

None in Phase 7. Future phases may add `page`, `pageSize`, and `flagReason` filters.

### Success Response `200 OK`

```json
{
  "data": [
    {
      "id": "rpt_001",
      "reportTitle": "Fake pothole report",
      "location": "Main St",
      "downvoteCount": 23,
      "flagReason": "highDownvotes",
      "submittingUser": {
        "id": "usr_abc",
        "displayName": "John Doe"
      },
      "warnedAt": null,
      "flaggedAt": "2026-06-23T08:00:00Z"
    },
    {
      "id": "rpt_002",
      "reportTitle": "Spam road closure",
      "location": "Highway 101",
      "downvoteCount": 18,
      "flagReason": "reportedAsSpam",
      "submittingUser": {
        "id": "usr_def",
        "displayName": "Jane Smith"
      },
      "warnedAt": "2026-06-23T09:15:00Z",
      "flaggedAt": "2026-06-23T07:00:00Z"
    }
  ]
}
```

### Notes

- `warnedAt: null` — no Warn User action has been applied.
- `warnedAt: <timestamp>` — a Warn User action was previously applied; the frontend renders a "Warned" badge.
- `flagReason` values: `highDownvotes`, `reportedAsSpam`, `duplicateContent`, `other`.

### Error Responses

| Status | Condition |
|--------|-----------|
| `401` | Unauthenticated request |
| `403` | Non-admin or insufficient moderation permissions |
| `500` | Internal server error |

---

## GET `/admin/moderation/suspicious-users`

Fetch the list of users currently flagged as suspicious and awaiting moderation review.

### Query Parameters

None in Phase 7.

### Success Response `200 OK`

```json
{
  "data": [
    {
      "id": "usr_abc",
      "displayName": "Mike Johnson",
      "trustScore": 32,
      "reportCount": 15,
      "warningCount": 3,
      "activitySummary": "Multiple fake reports",
      "flaggedAt": "2026-06-23T06:00:00Z"
    },
    {
      "id": "usr_def",
      "displayName": "Sarah Williams",
      "trustScore": 45,
      "reportCount": 8,
      "warningCount": 2,
      "activitySummary": "Spam activity",
      "flaggedAt": "2026-06-23T07:30:00Z"
    }
  ]
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| `401` | Unauthenticated request |
| `403` | Non-admin or insufficient moderation permissions |
| `500` | Internal server error |

---

## GET `/admin/moderation/pending-items`

Fetch the queue of pending moderation tasks awaiting administrator review.

### Query Parameters

None in Phase 7.

### Success Response `200 OK`

```json
{
  "data": [
    {
      "id": "pnd_001",
      "type": "reportReview",
      "priority": "high",
      "description": "Traffic light malfunction report",
      "targetEntityId": "rpt_xyz",
      "submittedAt": "2026-06-23T11:00:00Z"
    },
    {
      "id": "pnd_002",
      "type": "userFlag",
      "priority": "medium",
      "description": "Alice Brown — suspicious activity",
      "targetEntityId": "usr_ghi",
      "submittedAt": "2026-06-23T10:00:00Z"
    },
    {
      "id": "pnd_003",
      "type": "contentRemoval",
      "priority": "low",
      "description": "Inappropriate comment",
      "targetEntityId": "cmt_jkl",
      "submittedAt": "2026-06-23T09:00:00Z"
    }
  ]
}
```

### Notes

- `type` values: `reportReview`, `userFlag`, `contentRemoval`.
- `priority` values: `high`, `medium`, `low`.
- `targetEntityId` is a report ID for `reportReview`, a user ID for `userFlag`, and a content entity ID for `contentRemoval`.
- Content removal items have no detail view in Phase 7; the frontend shows a toast instead of navigating.

### Error Responses

| Status | Condition |
|--------|-----------|
| `401` | Unauthenticated request |
| `403` | Non-admin or insufficient moderation permissions |
| `500` | Internal server error |

---

## GET `/admin/moderation/summary`

Fetch the total count of pending moderation items for the header badge.

### Success Response `200 OK`

```json
{
  "totalPendingCount": 6
}
```

### Notes

- `totalPendingCount` is the aggregate count of flagged reports + suspicious users + pending queue items.
- The frontend refetches this endpoint on a ~45-second polling interval and after every successful moderation action (via query invalidation).

### Error Responses

| Status | Condition |
|--------|-----------|
| `401` | Unauthenticated request |
| `403` | Non-admin or insufficient moderation permissions |
| `500` | Internal server error |

---

## POST `/admin/moderation/reports/:id/actions`

Apply a moderation action to a flagged report.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Flagged report ID |

### Request Body: Approve

```json
{
  "action": "approve"
}
```

### Request Body: Remove

```json
{
  "action": "remove"
}
```

### Request Body: Warn User

```json
{
  "action": "warnUser"
}
```

### Field Rules

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `action` | string | Yes | `approve`, `remove`, `warnUser` |

### Success Response `200 OK`

```json
{
  "reportId": "rpt_001",
  "action": "approve",
  "appliedAt": "2026-06-24T02:00:00Z"
}
```

### Notes

- `approve` and `remove` cause the report to leave the flagged queue. The frontend removes the entry from the list and decrements the summary count.
- `warnUser` keeps the report in the queue. The backend sets `warnedAt` on the report; the next polling cycle (or immediate refetch after mutation) returns the updated entry with `warnedAt` populated.
- `remove` is irreversible. The frontend MUST require a confirmation step before dispatching this action.

### Error Responses

| Status | Condition |
|--------|-----------|
| `401` | Unauthenticated request |
| `403` | Non-admin or insufficient moderation permissions |
| `404` | Flagged report not found |
| `409` | Report already acted on by another admin (concurrent edit) |
| `500` | Internal server error |

---

## POST `/admin/moderation/users/:id/actions`

Apply a moderation action to a suspicious user.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Suspicious user ID |

### Request Body: Warn

```json
{
  "action": "warn"
}
```

### Request Body: Suspend

```json
{
  "action": "suspend"
}
```

### Request Body: Flag to Admin

```json
{
  "action": "flagToAdmin"
}
```

### Field Rules

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `action` | string | Yes | `warn`, `suspend`, `flagToAdmin` |

### Success Response `200 OK`

```json
{
  "userId": "usr_abc",
  "action": "suspend",
  "appliedAt": "2026-06-24T02:05:00Z"
}
```

### Notes

- `warn` — the user stays in the suspicious list; `warningCount` increments. The frontend refetches the suspicious users query after mutation.
- `suspend` — the user's account is deactivated and removed from the suspicious list. The frontend removes the entry and decrements the summary count. A toast with a link to `/users/:id` is shown for reinstatement guidance. This action is irreversible from this panel.
- `flagToAdmin` — the backend sends an active notification to all super-administrators. The user is removed from the suspicious list after escalation.
- `suspend` is irreversible from this panel. The frontend MUST require a confirmation step before dispatching this action.

### Error Responses

| Status | Condition |
|--------|-----------|
| `401` | Unauthenticated request |
| `403` | Non-admin or insufficient moderation permissions |
| `404` | Suspicious user not found |
| `409` | User already acted on by another admin (concurrent edit) |
| `500` | Internal server error |
