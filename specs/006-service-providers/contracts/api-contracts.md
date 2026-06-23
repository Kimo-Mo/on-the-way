# API Contracts: Service Providers

**Feature**: `006-service-providers`  
**Date**: 2026-06-21  
**Note**: These contracts describe the expected backend interface. All endpoints are prefixed with `/admin`. The frontend uses the shared Axios client configured with base URL and auth interceptors in `src/lib/axios.ts`.

---

## GET `/admin/providers`

Fetch a paginated, searchable, filtered list of service providers.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number, 1-indexed |
| `pageSize` | integer | No | 10 | Records per page |
| `search` | string | No | - | Searches business name, contact, and location text |
| `type` | string | No | - | Filter by `towing`, `medical`, `fuel`, `mechanic`, `other` |
| `status` | string | No | - | Filter by `pending`, `approved`, `rejected`, `suspended` |

### Success Response `200 OK`

```json
{
  "data": [
    {
      "id": "prv_abc123",
      "businessName": "Cairo Quick Tow",
      "serviceType": "towing",
      "status": "pending",
      "verificationStatus": "readyForReview",
      "rating": {
        "averageRating": 4.6,
        "reviewCount": 28
      },
      "operatingArea": "Nasr City, Cairo",
      "primaryContactName": "Mona Adel",
      "phone": "+20 100 000 0000",
      "email": "dispatch@example.com"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| `400` | Invalid query parameter values |
| `401` | Unauthenticated request |
| `403` | Non-admin role |
| `500` | Internal server error |

---

## GET `/admin/providers/:id`

Fetch full details for a single service provider.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Canonical provider ID |

### Success Response `200 OK`

```json
{
  "id": "prv_abc123",
  "businessName": "Cairo Quick Tow",
  "serviceType": "towing",
  "status": "pending",
  "verificationStatus": "readyForReview",
  "rating": {
    "averageRating": 4.6,
    "reviewCount": 28
  },
  "operatingArea": "Nasr City, Cairo",
  "address": "15 Abbas El Akkad St, Cairo",
  "description": "24/7 towing and roadside assistance.",
  "primaryContactName": "Mona Adel",
  "phone": "+20 100 000 0000",
  "email": "dispatch@example.com",
  "documents": [
    {
      "id": "doc_license",
      "type": "businessLicense",
      "name": "Business License 2026.pdf",
      "uploadedAt": "2026-05-01T10:00:00Z",
      "isMandatory": true,
      "isAvailable": true,
      "previewUrl": "https://cdn.example.com/providers/prv_abc123/license.pdf"
    }
  ],
  "missingRequiredDocumentTypes": [],
  "recentReviews": [
    {
      "id": "rev_001",
      "reviewerName": "Anonymous driver",
      "rating": 5,
      "comment": "Arrived quickly and handled the tow professionally.",
      "reviewedAt": "2026-05-15T16:30:00Z"
    }
  ],
  "latestStatusDecision": null
}
```

### Notes

- `rating.averageRating` may be `null`; the frontend renders an unrated state.
- `documents` may be an empty array.
- `missingRequiredDocumentTypes` contains any of `businessLicense`, `providerIdentity`, `serviceEligibilityProof`.
- `recentReviews` is bounded and read-only for this phase.

### Error Responses

| Status | Condition |
|--------|-----------|
| `401` | Unauthenticated request |
| `403` | Non-admin role |
| `404` | Provider not found |
| `500` | Internal server error |

---

## POST `/admin/providers/:id/status`

Approve, reject, or suspend a provider.

### Request Body: Approve

```json
{
  "action": "approve"
}
```

### Request Body: Reject

```json
{
  "action": "reject",
  "reason": "incompleteDocuments",
  "notes": "Identity document is unreadable."
}
```

### Request Body: Suspend

```json
{
  "action": "suspend",
  "reason": "serviceQualityConcern",
  "notes": "Multiple recent complaints about delayed arrivals."
}
```

### Field Rules

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `action` | string | Yes | `approve`, `reject`, `suspend` |
| `reason` | string | Required for reject/suspend | `incompleteDocuments`, `invalidBusinessInfo`, `policyViolation`, `serviceQualityConcern`, `safetyConcern`, `duplicateProvider` |
| `notes` | string | No | Max 500 characters |

### Success Response `200 OK`

```json
{
  "id": "prv_abc123",
  "status": "approved",
  "verificationStatus": "verified",
  "latestStatusDecision": {
    "id": "dec_001",
    "action": "approve",
    "decidedAt": "2026-06-21T09:00:00Z",
    "decidedByAdminId": "adm_123"
  }
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| `400` | Missing/invalid reason, invalid notes length, or missing approval documents |
| `401` | Unauthenticated request |
| `403` | Non-admin role |
| `404` | Provider not found |
| `409` | Status transition conflict or provider changed since review |
| `500` | Internal server error |

### Transition Rules

| Current Status | Allowed Action | Result |
|----------------|----------------|--------|
| `pending` | `approve` | `approved`, immediately visible to drivers |
| `pending` | `reject` | `rejected` |
| `approved` | `suspend` | `suspended` |

All other transitions are blocked by the UI and may return `409 Conflict` if requested.
