# API Contracts: Reports & Obstacles Management

**Feature**: `005-reports-obstacles-management`
**Date**: 2026-06-19
**Note**: These contracts describe the expected backend interface. All endpoints are prefixed with `/admin`. The frontend uses the shared Axios client configured with the base URL and auth interceptors in `src/lib/axios.ts`.

---

## GET `/admin/reports`

Fetch a paginated, filtered list of road obstacle reports.

### Query Parameters

| Parameter      | Type    | Required | Default | Description                                                        |
|----------------|---------|----------|---------|--------------------------------------------------------------------|
| `page`         | integer | No       | 1       | Page number (1-indexed)                                            |
| `pageSize`     | integer | No       | 10      | Records per page                                                   |
| `search`       | string  | No       | —       | Full-text search on `location` and `description`                   |
| `obstacleType` | string  | No       | —       | Filter by type: `pothole`, `roadDebris`, `trafficLight`, `accident`, `roadClosure`, `fog` |
| `status`       | string  | No       | —       | Filter by status: `pending`, `urgent`, `approved`, `removed`       |

### Success Response `200 OK`

```json
{
  "data": [
    {
      "id": "rpt_abc123",
      "title": "Large pothole on Ring Road",
      "obstacleType": "pothole",
      "status": "pending",
      "location": "Ring Road, near Exit 7, Cairo",
      "submittedAt": "2026-05-10T08:30:00Z",
      "votes": {
        "upvotes": 14,
        "downvotes": 2
      },
      "submitter": {
        "id": "usr_xyz789",
        "name": "Ahmed Hassan",
        "isDeleted": false
      }
    }
  ],
  "total": 87,
  "page": 1,
  "pageSize": 10,
  "totalPages": 9
}
```

### Error Responses

| Status | Condition                    |
|--------|------------------------------|
| `400`  | Invalid query param values   |
| `401`  | Unauthenticated request      |
| `403`  | Non-admin role               |
| `500`  | Internal server error        |

---

## GET `/admin/reports/:id`

Fetch the full details of a single report.

### Path Parameters

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| `id`      | string | Canonical report ID       |

### Success Response `200 OK`

```json
{
  "id": "rpt_abc123",
  "title": "Large pothole on Ring Road",
  "obstacleType": "pothole",
  "status": "pending",
  "location": "Ring Road, near Exit 7, Cairo",
  "submittedAt": "2026-05-10T08:30:00Z",
  "description": "There is a very large pothole causing damage to vehicles. It has been there for two weeks.",
  "imageUrls": [
    "https://cdn.example.com/reports/rpt_abc123/img_1.jpg",
    "https://cdn.example.com/reports/rpt_abc123/img_2.jpg"
  ],
  "gpsCoordinates": {
    "lat": 30.0444,
    "lng": 31.2357
  },
  "votes": {
    "upvotes": 14,
    "downvotes": 2
  },
  "submitter": {
    "id": "usr_xyz789",
    "name": "Ahmed Hassan",
    "isDeleted": false
  },
  "removalReason": null
}
```

**Notes**:
- `imageUrls` may be an empty array `[]`; the frontend renders a "No images attached" placeholder.
- `gpsCoordinates` may be `null`; the frontend hides the map and shows "Location unavailable".
- `submitter.isDeleted: true` → frontend renders `"Deleted User"` with no link.
- `removalReason` is populated only when `status === "removed"`.

### Error Responses

| Status | Condition                                      |
|--------|------------------------------------------------|
| `401`  | Unauthenticated request                        |
| `403`  | Non-admin role                                 |
| `404`  | Report not found (deleted or never existed)    |
| `500`  | Internal server error                          |

---

## POST `/admin/reports/:id/approve`

Approve a report, updating its status to `approved`.

### Request Body

None.

### Success Response `200 OK`

```json
{ "id": "rpt_abc123", "status": "approved" }
```

### Error Responses

| Status | Condition                                           |
|--------|-----------------------------------------------------|
| `404`  | Report not found                                    |
| `409`  | Report already approved (no-op or conflict)         |
| `401`  | Unauthenticated                                     |
| `403`  | Non-admin role                                      |

---

## POST `/admin/reports/:id/mark-urgent`

Escalate a report's priority to `urgent`.

### Request Body

None.

### Success Response `200 OK`

```json
{ "id": "rpt_abc123", "status": "urgent" }
```

### Error Responses

| Status | Condition                                           |
|--------|-----------------------------------------------------|
| `404`  | Report not found                                    |
| `409`  | Report already urgent (no-op or conflict)           |
| `401`  | Unauthenticated                                     |
| `403`  | Non-admin role                                      |

---

## DELETE `/admin/reports/:id`

Remove a report. A mandatory removal reason must be provided.

### Request Body

```json
{
  "reason": "spam"
}
```

| Field    | Type   | Required | Values                                  |
|----------|--------|----------|-----------------------------------------|
| `reason` | string | Yes      | `spam`, `inaccurate`, `inappropriate`   |

### Success Response `200 OK`

```json
{ "id": "rpt_abc123", "status": "removed", "removalReason": "spam" }
```

### Error Responses

| Status | Condition                                     |
|--------|-----------------------------------------------|
| `400`  | Missing or invalid `reason`                   |
| `404`  | Report not found                              |
| `401`  | Unauthenticated                               |
| `403`  | Non-admin role                                |

---

## POST `/admin/reports/:id/flag-user`

Flag the submitting user for further moderation review.

### Request Body

None. The backend derives the target user from the report's submitter reference.

### Success Response `200 OK`

```json
{ "reportId": "rpt_abc123", "flaggedUserId": "usr_xyz789" }
```

### Error Responses

| Status | Condition                                                  |
|--------|------------------------------------------------------------|
| `404`  | Report not found, or submitter account already deleted     |
| `409`  | User already flagged                                       |
| `401`  | Unauthenticated                                            |
| `403`  | Non-admin role                                             |
