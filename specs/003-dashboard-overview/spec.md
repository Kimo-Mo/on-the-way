# Feature Specification: Dashboard Overview

**Feature Branch**: `003-dashboard-overview`  
**Created**: 2026-06-15  
**Status**: Draft  
**Input**: User description: "Phase 3: Dashboard Overview (`/`) from PLAN.md, matching the provided dashboard screenshot."

## Clarifications

### Session 2026-06-15

- Q: How should dashboard data stay current after the admin opens the overview? -> A: Periodic auto-refresh for dashboard metrics, map events, recent activity, and flagged content.
- Q: Which dashboard moderation actions should require confirmation? -> A: All moderation actions require confirmation.
- Q: How often should the dashboard auto-refresh while the admin is viewing it? -> A: Every 5 minutes.
- Q: How should dashboard panels connect to deeper workflows? -> A: Summary cards, charts, map items, and activity items link to relevant full sections.
- Q: How many recent activity and flagged-content items should the overview show? -> A: 5 activity events and 3 flagged items.

## User Scenarios *(mandatory)*

### User Story 1 - Monitor Platform Status (Priority: P1)

As an administrator, I want the dashboard home page to summarize the platform's key
operational metrics so that I can understand overall activity immediately after
signing in.

**Why this priority**: The overview is the first screen after authentication and
sets the operational context for all management actions.

**Acceptance Scenarios**:

1. **Given** I am an authenticated administrator, **When** I open `/`, **Then** I see
   summary cards for total users, total reports, active help requests, service
   providers, reports today, and urgent incidents.
2. **Given** summary metrics have changed since the prior comparison period,
   **When** I view the cards, **Then** each card displays the current value and a
   clear positive or negative trend indicator.
3. **Given** dashboard metrics are unavailable, **When** I open `/`, **Then** I see a
   clear unavailable state without losing access to the rest of the dashboard shell.
4. **Given** I need to investigate a dashboard metric, **When** I select the related
   card, **Then** I am taken to the relevant full management section.

---

### User Story 2 - Prioritize Live Operational Events (Priority: P1)

As an administrator, I want to see recent activity and live incident locations so
that I can quickly identify urgent reports, help requests, and provider activity.

**Why this priority**: The dashboard supports real-time decisions about safety,
moderation, and service operations.

**Acceptance Scenarios**:

1. **Given** urgent reports, help requests, or provider locations exist, **When** I
   view the interactive map, **Then** pins are visually distinguished by category and
   the legend explains each category.
2. **Given** recent system events exist, **When** I view the recent activity panel,
   **Then** the 5 newest events are listed in newest-first order with type, actor or
   source, and relative time.
3. **Given** there are no recent events or map pins, **When** I view the dashboard,
   **Then** the panels show clear empty states instead of blank areas.
4. **Given** I need more context for a map or activity item, **When** I select the
   item, **Then** I am taken to the relevant full management section.

---

### User Story 3 - Review Trends and Distribution (Priority: P2)

As an administrator, I want visual summaries of reports, help request categories,
and user distribution so that I can spot patterns without opening detailed analytics.

**Why this priority**: Trend and distribution summaries help admins notice changes
early while keeping detailed analysis in the analytics section.

**Acceptance Scenarios**:

1. **Given** historical report counts are available, **When** I view the dashboard,
   **Then** I see a reports-over-time chart with understandable labels.
2. **Given** help requests are grouped by category, **When** I view the dashboard,
   **Then** I see the relative volume of each help request category.
3. **Given** user role or segment data is available, **When** I view the dashboard,
   **Then** I see a user distribution summary with distinguishable segments.
4. **Given** I select a chart or distribution segment, **When** a relevant full
   section exists, **Then** I am taken to that section for deeper review.

---

### User Story 4 - Act on Flagged Content (Priority: P2)

As an administrator, I want the dashboard to surface pending flagged content so that
I can quickly approve, remove, or flag users without navigating away from the
overview.

**Why this priority**: Moderation backlogs can directly affect data quality and user
trust, but they are secondary to the primary operational status view.

**Acceptance Scenarios**:

1. **Given** flagged content is pending, **When** I view the dashboard, **Then** I see
   the pending count and the 3 most recent flagged items with concise context.
2. **Given** I choose an available moderation action, **When** I confirm the action,
   **Then** the item status updates and the pending count reflects the change.
3. **Given** a moderation action fails, **When** the failure is returned, **Then** I
   see a recoverable error and the original item state is preserved.

### Edge Cases

- Dashboard data is partially available: available panels must render while failed
  panels show targeted error states.
- Metrics are zero: cards and charts must show valid zero states instead of appearing
  broken or hidden.
- Large activity or flagged-content volume: the overview must show the 5 newest
  activity events and 3 most recent flagged items, then provide a clear path to the
  full section.
- The map has no location data: the map panel must display a helpful empty state.
- Trend comparisons are unavailable: cards must show current values without a false
  trend indicator.
- An administrator has keyboard-only or narrow-screen access: all dashboard content
  and actions must remain reachable and readable.
- Remote data is loading, empty, unauthorized, or failed: the dashboard must show
  distinct states for each condition.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide `/` as the authenticated dashboard overview.
- **FR-002**: The dashboard MUST display summary metric cards for total users, total
  reports, active help requests, service providers, reports today, and urgent
  incidents.
- **FR-003**: Each summary metric card MUST show the current value and, when
  available, a comparison trend with clear positive or negative meaning.
- **FR-004**: The dashboard MUST include a map-oriented incident panel showing urgent
  reports, help requests, and provider locations with a visible legend.
- **FR-005**: The dashboard MUST include a recent activity feed showing the event
  type, actor or source, and relative timestamp for the 5 newest platform events.
- **FR-006**: The dashboard MUST include a reports-over-time trend visualization.
- **FR-007**: The dashboard MUST include a help-requests-by-category visualization.
- **FR-008**: The dashboard MUST include a user distribution summary.
- **FR-009**: The dashboard MUST include a flagged content section showing pending
  count, the 3 most recent flagged items, reason or context, and available moderation
  actions.
- **FR-010**: Dashboard panels MUST provide clear loading, empty, error, and
  unauthorized states without blocking unrelated panels that have usable data.
- **FR-011**: All dashboard actions that change moderation state MUST require
  confirmation before execution and provide success or failure feedback.
- **FR-012**: The dashboard MUST preserve the existing admin navigation shell,
  including sidebar navigation, top search, notification access, and profile access.
- **FR-013**: The dashboard MUST be readable and usable on common desktop and smaller
  viewport sizes without overlapping text, clipped actions, or hidden critical
  information.
- **FR-014**: The dashboard MUST expose enough labels, names, and ordering for screen
  reader and keyboard users to understand and operate all interactive areas.
- **FR-015**: Dashboard metrics, map events, recent activity, and flagged content
  MUST refresh every 5 minutes while the overview remains open.
- **FR-016**: Summary cards, charts, map items, and activity items MUST link to the
  relevant full management sections when deeper review is available.

### Key Entities *(include if feature involves data)*

- **Dashboard Metric**: A summarized operational count with label, value, optional
  comparison period, trend direction, and trend amount.
- **Map Event**: A location-based item representing an urgent report, active help
  request, or provider with category, coordinates, status, and timestamp.
- **Activity Event**: A recent platform event with event type, actor or source,
  timestamp, and short description.
- **Trend Series**: A time-based sequence of counts used for overview charts.
- **Help Request Category Count**: A category label and count used to summarize help
  request distribution.
- **User Distribution Segment**: A user segment or role with count and proportion.
- **Flagged Content Item**: A moderation item with title, location or source,
  reason, reported age, pending status, and available actions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of administrators can identify the current urgent incident count
  and active help request count within 10 seconds of opening the dashboard.
- **SC-002**: 90% of administrators can identify the newest recent activity event
  within 10 seconds of opening the dashboard.
- **SC-003**: Administrators can distinguish map categories for urgent reports, help
  requests, and providers without external instructions.
- **SC-004**: At least 95% of dashboard loads show all available panel data or a
  panel-specific state within 3 seconds under normal operating conditions.
- **SC-005**: Administrators can complete a flagged-content action from the overview
  in no more than two intentional steps after selecting the item.
- **SC-006**: The dashboard remains usable with keyboard navigation and at common
  small-screen widths, with no critical action or metric hidden from view.
- **SC-007**: Administrators see refreshed operational metrics, map events, recent
  activity, and flagged-content status within 5 minutes without manually reloading
  the page.
- **SC-008**: Administrators can navigate from any linked dashboard panel to the
  relevant full management section in one selection.

## Assumptions

- Authenticated access and protected-route behavior are provided by the Phase 2
  feature.
- The dashboard uses the same admin shell already established for the application.
- The first version shows recent and high-priority slices of activity, not exhaustive
  lists; detailed management remains in the dedicated sections.
- If live backend data is not ready, representative data may be used during
  development, but the dashboard states and user-facing behavior must match the final
  data contract.
- Map precision is sufficient for administrative triage, not turn-by-turn navigation.
