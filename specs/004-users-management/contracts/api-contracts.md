# API Contracts: Users Management

**Feature**: `004-users-management`
**Date**: 2026-06-18
**Note**: These contracts describe the expected backend interface. All endpoints are prefixed with `/admin`. The frontend will use the shared Axios client configured with the base URL and auth interceptors.

---

## GET `/admin/users`

Fetch a paginated, filtered list of users.

### Query Parameters

| Parameter  | Type    | Required | Default | Description                              |
|------------|---------|----------|---------|------------------------------------------|
| `page`     | integer | No       | 1       | Page number (1-indexed)                  |
| `pageSize` | integer | No       | 10      | Records per page                         |
| `search`   | string  | No       | —       | Full-text search on `name` and `email`   |
| `role`     | string  | No       | —       | Filter by role: `admin`, `driver`, `serviceProvider` |
| `status`   | string  | No       | —       | Filter by status: `active`, `suspended`, `pending`   |

### Success Response `200 OK`

```json
{
  "data": [
    {
      "id": "usr_abc123",
      "name": "Ahmed Hassan",
      "email": "ahmed.hassan@example.com",
      "role": "driver",
      "status": "active",
      "trustScore": 87,
      "joinedAt": "2025-03-15T10:22:00Z",
      "avatarUrl": "https://cdn.example.com/avatars/usr_abc123.jpg"
    }
  ],
  "total": 243,
  "page": 1,
  "pageSize": 10,
  "totalPages": 25
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

## GET `/admin/users/:id`

Fetch the full profile and activity history for a single user.

### Path Parameters

| Parameter | Type   | Description                  |
|-----------|--------|------------------------------|
| `id`      | string | Canonical user ID            |

### Success Response `200 OK`

```json
{
  "id": "usr_abc123",
  "name": "Ahmed Hassan",
  "email": "ahmed.hassan@example.com",
  "role": "driver",
  "status": "active",
  "trustScore": 87,
  "joinedAt": "2025-03-15T10:22:00Z",
  "avatarUrl": "https://cdn.example.com/avatars/usr_abc123.jpg",
  "phone": "+20 100 000 0000",
  "address": "Cairo, Egypt",
  "vehicleInfo": "Toyota Corolla 2020",
  "activityHistory": [
    {
      "id": "act_xyz789",
      "userId": "usr_abc123",
      "type": "reportSubmitted",
      "description": "Submitted a pothole report on Ring Road.",
      "timestamp": "2025-04-01T08:10:00Z",
      "relatedEntityId": "rpt_001",
      "relatedEntityRoute": "/reports/rpt_001"
    }
  ]
}
```

### Error Responses

| Status | Condition                                     |
|--------|-----------------------------------------------|
| `401`  | Unauthenticated request                       |
| `403`  | Non-admin role                                |
| `404`  | User not found or has been deleted            |
| `500`  | Internal server error                         |
