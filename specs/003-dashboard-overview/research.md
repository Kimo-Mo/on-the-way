# Research: Dashboard Overview

## Decision: Use a Single Dashboard Overview Query

**Decision**: Fetch dashboard overview data through one typed React Query hook,
`useDashboardOverview`, backed by the shared Axios client. The response groups data
by panel: metrics, map events, activity events, trend series, category counts, user
distribution, and flagged content.

**Rationale**: The dashboard needs multiple panels to become visible together and
show targeted panel states when part of the payload is missing. A single overview
contract reduces duplicate requests, keeps 5-minute refresh behavior centralized, and
matches the dashboard's role as an aggregated home page.

**Alternatives considered**:

- Separate query per panel: simpler isolated failures, but more request overhead and
  duplicated refresh/error orchestration.
- Static local data: useful for development only, but cannot satisfy refresh,
  unauthorized, and moderation-state requirements.

## Decision: 5-Minute Background Refresh

**Decision**: Configure dashboard overview data to refresh every 5 minutes while the
overview remains open.

**Rationale**: This cadence was clarified in the spec. It keeps operational status
current enough for an overview while avoiding noisy chart and panel churn.

**Alternatives considered**:

- 15- or 30-second refresh: more current but unnecessary for a non-dispatch console.
- Manual refresh only: lower request volume but violates the clarified requirement.
- Real-time streaming: stronger freshness but not required for Phase 3 and would
  increase backend and UI complexity.

## Decision: Lightweight Overview Map

**Decision**: Implement the Phase 3 map as an overview incident panel with category
pins, a legend, empty/error states, and drill-through links. Full route planning,
turn-by-turn navigation, clustering, and advanced GIS controls are out of scope.

**Rationale**: The spec requires administrative triage, not navigation. The provided
screenshot shows a simple static map-style panel with category pins and legend.
Keeping this panel lightweight limits performance risk and avoids introducing a map
library unless needed during implementation.

**Alternatives considered**:

- Full map library integration: useful later, but heavier than this overview needs.
- No map visualization: would fail the operational event scenario.

## Decision: Drill-Through Links Instead of In-Place Detail Views

**Decision**: Summary cards, charts, map items, and activity items link to the
relevant full management sections when deeper review is available.

**Rationale**: This was clarified in the spec and keeps `/` focused on scanning.
Detailed tables, filters, and item pages belong to dedicated sections such as users,
reports, help requests, service providers, moderation, and analytics.

**Alternatives considered**:

- View-only panels: less useful for investigation.
- In-place drilldowns: increases route complexity and duplicates dedicated sections.

## Decision: Bounded Activity and Moderation Lists

**Decision**: Show the 5 newest activity events and the 3 most recent flagged content
items on the overview.

**Rationale**: The clarified limits preserve scanability, match the screenshot, and
avoid internal scrolling in the dashboard overview. Full lists remain accessible via
drill-through links.

**Alternatives considered**:

- Show all items: harms performance and scanability.
- Smaller lists: may hide useful context from the first screen.

## Decision: Use Recharts for Overview Charts

**Decision**: Use Recharts for the reports-over-time, help-requests-by-category, and
user distribution panels, adding the dependency if it is not already installed.

**Rationale**: The project plan names Recharts for analytics dashboards and it fits
the required line, bar, and distribution summaries without custom chart
infrastructure. Using one charting library keeps the visual language and accessibility
work consistent across dashboard and analytics phases.

**Alternatives considered**:

- Hand-built SVG charts: avoids a dependency but increases maintenance and
  accessibility work.
- Full analytics/grid library: too heavy for the overview scope.

## Decision: Confirmation for Every Dashboard Moderation Action

**Decision**: Require confirmation before executing approve, remove, or flag-user
actions from the flagged-content panel.

**Rationale**: The clarified requirement reduces accidental moderation changes and
creates one consistent action pattern.

**Alternatives considered**:

- Immediate approve only: faster but inconsistent with the user's chosen behavior.
- Link only to moderation details: safer but does not satisfy inline action scope.
