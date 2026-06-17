# Data Model: Dashboard Overview

## DashboardOverview

Aggregate response used by the `/` overview.

**Fields**:

- `metrics`: `DashboardMetric[]`
- `mapEvents`: `MapEvent[]`
- `activityEvents`: `ActivityEvent[]` limited to 5 newest events
- `reportsTrend`: `TrendPoint[]`
- `helpRequestCategories`: `CategoryCount[]`
- `userDistribution`: `DistributionSegment[]`
- `flaggedContent`: `FlaggedContentItem[]` limited to 3 most recent items
- `flaggedContentPendingCount`: number
- `generatedAt`: ISO timestamp

**Validation rules**:

- Counts must be non-negative integers.
- Arrays may be empty and must produce empty states rather than hidden panels.
- `generatedAt` is required so the UI can communicate data freshness if needed.

## DashboardMetric

Summarized operational count for a dashboard card.

**Fields**:

- `id`: stable metric key (`totalUsers`, `totalReports`, `activeHelpRequests`,
  `serviceProviders`, `reportsToday`, `urgentIncidents`)
- `label`: display label
- `value`: non-negative integer
- `trend`: optional `MetricTrend`
- `targetRoute`: optional route for drill-through

## MetricTrend

Comparison against a prior period.

**Fields**:

- `direction`: `up` | `down` | `flat`
- `percentage`: non-negative number
- `periodLabel`: display label such as `vs last month`
- `meaning`: `positive` | `negative` | `neutral`

**Validation rules**:

- Trend is omitted when comparison data is unavailable.
- Direction alone must not determine color; `meaning` controls positive/negative UI.

## MapEvent

Location-based operational item shown on the incident map.

**Fields**:

- `id`: unique event identifier
- `category`: `urgentReport` | `helpRequest` | `provider`
- `title`: short accessible label
- `coordinates`: latitude and longitude
- `status`: current operational status
- `timestamp`: ISO timestamp
- `targetRoute`: optional route for drill-through

**Validation rules**:

- Coordinates are required for map display.
- Events without valid coordinates are excluded from map pins and may appear in
  activity or error metadata.

## ActivityEvent

Recent platform activity item.

**Fields**:

- `id`: unique activity identifier
- `type`: `reportSubmitted` | `reportVerified` | `providerRegistered` |
  `userFlagged` | `announcementPublished` | `system`
- `title`: short event title
- `actorOrSource`: admin, system, provider, user, or service source
- `timestamp`: ISO timestamp
- `targetRoute`: optional route for drill-through
- `tone`: `default` | `success` | `warning` | `danger` | `info`

**Validation rules**:

- Sorted newest first.
- Overview displays at most 5 items.

## TrendPoint

Point in a time-based report-count series.

**Fields**:

- `label`: display period label
- `value`: non-negative integer
- `timestamp`: optional ISO timestamp for precise ordering

**Validation rules**:

- Points must be ordered chronologically for chart display.

## CategoryCount

Help-request count grouped by category.

**Fields**:

- `category`: category label
- `count`: non-negative integer
- `targetRoute`: optional filtered route

## DistributionSegment

User segment or role share for the overview distribution chart.

**Fields**:

- `label`: segment label
- `count`: non-negative integer
- `percentage`: number from 0 to 100
- `targetRoute`: optional filtered route

**Validation rules**:

- Percentages should total approximately 100 when data is available.
- Zero-count segments may be omitted unless needed for consistent labeling.

## FlaggedContentItem

Moderation item surfaced in the dashboard overview.

**Fields**:

- `id`: unique moderation item identifier
- `title`: concise item title
- `locationOrSource`: location, source, or related section label
- `reason`: reason or context for flagging
- `reportedAgeLabel`: human-readable age such as `23 downvotes`
- `status`: `pending` | `approved` | `removed` | `userFlagged`
- `availableActions`: list of `approve`, `remove`, `flagUser`
- `targetRoute`: route to moderation details or relevant section

**Validation rules**:

- Overview displays at most 3 most recent pending items.
- All actions require confirmation before execution.
- On failed action, the item remains in its prior state.

## State Transitions

```text
FlaggedContentItem.pending
  ├── approve confirmed -> approved
  ├── remove confirmed -> removed
  └── flagUser confirmed -> userFlagged

Any failed moderation action -> prior state preserved with recoverable error feedback
```
