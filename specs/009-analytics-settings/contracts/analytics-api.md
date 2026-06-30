# API Contract: Analytics

> **Note**: During Phase 9 all endpoints are mocked in `frontend/src/services/api/analytics.ts`. These contracts define the interface that will be connected to the live .NET backend in Phase 10.

---

## `GET /api/analytics`

Fetch an aggregated analytics snapshot for a given date range.

### Query Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `from`    | string | Yes      | Start date, ISO 8601 (`YYYY-MM-DD`) |
| `to`      | string | Yes      | End date, ISO 8601 (`YYYY-MM-DD`); max 90 days from `from` |

### Success Response `200 OK`

```json
{
  "dateRange": { "from": "2026-04-18", "to": "2026-04-24" },
  "kpi": {
    "avgResponseTimeMinutes": 8.5,
    "avgResponseTimeDelta": 12.0,
    "userSatisfactionRate": 94,
    "userSatisfactionDelta": 3.0,
    "resolutionRate": 87,
    "resolutionRateDelta": 5.0,
    "activeHelpRequests": 42,
    "activeHelpRequestsDelta": -8.0
  },
  "reportsTrends": [
    { "date": "Apr 18", "reports": 42, "resolved": 38 }
  ],
  "helpRequestsByType": [
    { "date": "Apr 18", "medical": 10, "towing": 8, "fuel": 5, "repair": 7 }
  ],
  "userGrowth": [
    { "month": "Jan", "users": 7200 }
  ],
  "keyMetrics": {
    "totalReportsThisMonth": 3247,
    "totalReportsDelta": 15.0,
    "helpRequestsCompleted": 1892,
    "helpRequestsDelta": 22.0,
    "newUsersThisMonth": 1228,
    "newUsersDelta": 18.0
  }
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| `400 Bad Request` | Date range exceeds 90 days, or `from` > `to` |
| `401 Unauthorized` | Session expired or missing |

---

## React Query Hook Contract

```typescript
// hooks/useGetAnalytics.ts
function useGetAnalytics(params: AnalyticsQueryParams): UseQueryResult<AnalyticsSnapshot>
```

- Query key: `['analytics', params.from, params.to]`
- Enabled when both `from` and `to` are present.
- On error: displays an error state with retry option (no toast — inline error per chart area).
