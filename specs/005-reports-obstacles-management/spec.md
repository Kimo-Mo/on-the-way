# Feature Specification: Reports & Obstacles Management

**Feature Branch**: `005-reports-obstacles-management`  
**Created**: 2026-06-18  
**Status**: Draft  
**Input**: User description: "Phase 5: Reports & Obstacles Management (`/reports`) from PLAN.md"

## Clarifications

### Session 2026-06-19
- Q: When an administrator "Removes" a report, should they be required to provide a reason for the removal? → A: Yes, provide a mandatory dropdown of common reasons (e.g., Spam, Inaccurate, Inappropriate).
- Q: If a report's submitting user has had their account deleted, how should the submitter reference be handled? → A: Show "Deleted User" and disable the profile link.

## User Scenarios *(mandatory)*

### User Story 1 - Browse and Filter Incident Reports (Priority: P1)

An administrator opens the Reports page and sees a paginated list of all road obstacle and incident reports submitted by mobile app users. Each report is displayed as a card showing the title, priority level (Urgent/Pending), location, obstacle type tag, date submitted, and community vote counts. The admin can search by location or description and apply filters to narrow results by report type or status.

**Why this priority**: The core responsibility of this module is giving administrators visibility into incoming reports. Without the ability to browse and filter reports efficiently, all downstream moderation actions are impossible.

**Acceptance Scenarios**:

1. **Given** the admin is on the Reports page, **When** the page loads, **Then** a list of report cards is displayed with title, priority badge, location, obstacle type, date, upvote count, and downvote count visible on each card.
2. **Given** the reports list is loaded, **When** the admin types in the search field, **Then** the list filters in real time (or on submit) to show only reports whose location or description matches the query.
3. **Given** the reports list is loaded, **When** the admin applies a type or status filter, **Then** only reports matching that filter criterion are shown.
4. **Given** the reports list contains more results than fit on one page, **When** the admin uses the pagination controls, **Then** the next or previous page of results loads correctly.
5. **Given** no reports match the current search/filter combination, **When** the list would be empty, **Then** a meaningful empty-state message is displayed.

---

### User Story 2 - View Full Report Details (Priority: P1)

An administrator clicks "View" on a report card to open the Report Details page. The page displays the full report description, all attached user-uploaded images, an embedded map showing the exact coordinates of the obstacle, and a sidebar with metadata (location, submitter name, GPS coordinates, community vote totals).

**Why this priority**: Administrators must be able to review the complete report context—including visual evidence and geographic location—before making any moderation decision. This is the primary information-gathering step.

**Acceptance Scenarios**:

1. **Given** the admin clicks "View" on a report card, **When** the details page loads, **Then** the report title, type tag, priority badge, date/time, and full description are displayed.
2. **Given** the report has attached images, **When** the details page renders, **Then** all attached images are shown in a gallery section; **if** no images are attached, **Then** a placeholder or "No images" state is shown.
3. **Given** the report has valid GPS coordinates, **When** the details page renders, **Then** an interactive map widget displays a pin at the reported obstacle's location with the street address label.
4. **Given** the details page is open, **When** the admin views the right sidebar, **Then** the submitter's name (linked to the user profile), GPS coordinates, upvote count, and downvote count are all visible.
5. **Given** the details page fails to load due to a network error, **When** the error occurs, **Then** an error message is shown with a retry option.

---

### User Story 3 - Approve a Report (Priority: P2)

An administrator reviews a report and determines it is valid and accurate. They click "Approve Report" on the Report Details page. The system updates the report's status to approved and provides confirmation feedback.

**Why this priority**: Approving reports is the primary positive moderation action and promotes quality community-submitted content for display in the mobile app.

**Acceptance Scenarios**:

1. **Given** a report with "Pending" status is open, **When** the admin clicks "Approve Report," **Then** the report's status is updated and the button reflects the new state (e.g., disabled or labeled "Approved").
2. **Given** the approval action is in progress, **When** the request completes successfully, **Then** a success notification is shown to the admin.
3. **Given** the approval request fails, **When** the error occurs, **Then** an error message is displayed and the report status remains unchanged.

---

### User Story 4 - Mark a Report as Urgent (Priority: P2)

An administrator identifies a report that represents a critical or immediately dangerous road condition. They click "Mark as Urgent" to escalate the report's priority, making it more prominently displayed to mobile users.

**Why this priority**: Urgency classification directly impacts driver safety in the mobile app, making this a high-value moderation action.

**Acceptance Scenarios**:

1. **Given** a report without the "Urgent" priority is open, **When** the admin clicks "Mark as Urgent," **Then** the report's priority badge updates to "Urgent" and the action is persisted.
2. **Given** a report already marked as "Urgent," **When** the details page renders, **Then** the "Mark as Urgent" button is disabled or replaced with a visual indicator that the report is already urgent.
3. **Given** the mark-as-urgent request fails, **When** the error occurs, **Then** a user-friendly error message is displayed.

---

### User Story 5 - Remove a Report (Priority: P2)

An administrator determines a report is inaccurate, spam, or inappropriate. They click "Remove Report" on the details page. A confirmation dialog appears requiring the admin to select a reason for removal (e.g., Spam, Inaccurate, Inappropriate) before the irreversible action is executed.

**Why this priority**: Removal is a destructive moderation action that must be protected with a confirmation step and audited via the removal reason to prevent accidental deletion and track moderation quality.

**Acceptance Scenarios**:

1. **Given** a report details page is open, **When** the admin clicks "Remove Report," **Then** a confirmation dialog is displayed requiring the admin to select a reason for removal from a dropdown.
2. **Given** the confirmation dialog is open, **When** the admin confirms, **Then** the report is deleted and the admin is redirected back to the reports list.
3. **Given** the confirmation dialog is open, **When** the admin cancels, **Then** the dialog closes and no changes are made.
4. **Given** the removal request fails, **When** the error occurs, **Then** an error message is displayed and the report remains visible.

---

### User Story 6 - Flag the Submitting User (Priority: P3)

An administrator notices the user who submitted a report may be abusing the platform (e.g., repeated false reports). From the Report Details page, they click "Flag User" to mark the submitter for further review by the moderation team.

**Why this priority**: This is a secondary workflow that connects Reports to user-level moderation; it enhances the module but is not required for the core reporting workflow.

**Acceptance Scenarios**:

1. **Given** a report details page is open, **When** the admin clicks "Flag User," **Then** a confirmation or reason-selection prompt appears.
2. **Given** the admin confirms flagging, **When** the action completes, **Then** the submitting user is marked as flagged and a success notification is shown.
3. **Given** the flag action fails, **When** the error occurs, **Then** an error message is displayed.

---

### Edge Cases

- What happens when a report has no attached images? → A placeholder state ("No images attached") is shown in the gallery section.
- What happens if the GPS coordinates are missing or invalid? → The map section is hidden or shows a "Location unavailable" message instead of the map widget.
- What if the submitter's account has been deleted? → The submitter name is displayed as "Deleted User" and the profile link is disabled.
- What if the admin tries to approve a report that was already removed by another admin? → A 404 or conflict error response triggers an error notification and the admin is redirected to the reports list.
- What loading, empty, validation, authorization, and remote API failure states must be visible to admins?
  - **Loading**: Skeleton cards/rows shown during data fetch on both the list and detail pages.
  - **Empty**: A descriptive empty-state with the current filter context is shown when no results match.
  - **Authorization**: If the admin lacks permission for a specific action, the action button is disabled or hidden.
  - **API failure**: Toast/alert error messages with retry where applicable.
- What if pagination returns 0 results on a page beyond page 1 (e.g., due to concurrent deletions)? → The admin is redirected to the last valid page.
- What responsive or accessibility constraints could block task completion? → Action buttons on the details page must be large enough to use on smaller screens; keyboard navigation must reach all action buttons.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a paginated list of road obstacle reports on the `/reports` route, showing title, priority, type, location, date, and vote counts per report.
- **FR-002**: System MUST allow administrators to search reports by location text or description keyword.
- **FR-003**: System MUST allow administrators to filter reports by obstacle type (e.g., Pothole, Road Debris, Traffic Light, Accident, Road Closure) and/or status (Pending, Urgent, Approved, Removed).
- **FR-004**: System MUST display a dedicated Report Details page at `/reports/:id` with full description, attached images, map view, and report metadata.
- **FR-005**: Report Details page MUST show the submitting user's name as a link to their profile on the `/users/:id` page (if the user is deleted, show "Deleted User" and disable the link).
- **FR-006**: Report Details page MUST display an embedded map widget pinned to the report's GPS coordinates, labeled with the street address.
- **FR-007**: Report Details page MUST display community vote totals (upvotes and downvotes) in the information sidebar.
- **FR-008**: System MUST allow administrators to Approve a report, updating its status and providing visual confirmation.
- **FR-009**: System MUST allow administrators to Mark a report as Urgent, updating its priority badge and persisting the change.
- **FR-010**: System MUST allow administrators to Remove a report after presenting a mandatory confirmation dialog that requires selecting a removal reason.
- **FR-011**: System MUST allow administrators to Flag the submitting user from within the Report Details page.
- **FR-012**: All report list data MUST support server-side pagination, and the UI MUST provide Previous/Next (or numbered) pagination controls.
- **FR-013**: The Reports list and detail views MUST display meaningful loading states (skeletons) while data is being fetched.
- **FR-014**: The system MUST display appropriate empty states when no reports match the active search/filter criteria.
- **FR-015**: All moderation actions (Approve, Mark as Urgent, Remove, Flag User) MUST show success or failure feedback to the administrator immediately after the action completes.

### Key Entities

- **Report**: Represents a road obstacle or incident submitted by a mobile app user. Key attributes: unique ID, title/description, obstacle type, priority/status, GPS coordinates, street address, submission date, attached images, submitter reference, removal reason (if removed).
- **Obstacle Type**: A categorical classification of the road hazard (e.g., Pothole, Road Debris, Accident, Traffic Light, Road Closure, Fog). Used for filtering.
- **Report Status / Priority**: The current moderation state and urgency level of a report (Pending, Urgent, Approved, Removed).
- **Community Votes**: Upvote and downvote counts associated with a report, reflecting user-community confidence in its accuracy.
- **User (Submitter)**: The mobile app user who created the report. Referenced on the details page; flagging a user creates a link to the Moderation module.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can navigate from the Reports list to a specific report's detail page and back in under 5 seconds under normal network conditions.
- **SC-002**: Search and filter operations on the reports list return updated results within 2 seconds of input.
- **SC-003**: 100% of moderation actions (Approve, Mark as Urgent, Remove, Flag User) provide visible success or error feedback within 3 seconds of the admin's click.
- **SC-004**: The reports list displays a loading skeleton within 200ms of the page being accessed, preventing blank-screen states.
- **SC-005**: Administrators can complete the full "review and act on a report" workflow (open list → view details → take action) without encountering any blocking UI errors or undefined states.
- **SC-006**: All action buttons on the Report Details page are operable via keyboard navigation alone.
- **SC-007**: The reports list and detail pages render correctly on screen widths from 768px (tablet) upwards without horizontal scrolling or overlapping content.

## Assumptions

- Administrators are already authenticated; this module does not add new authentication logic.
- The backend provides a paginated API endpoint for reports and individual report retrieval endpoints, including all required fields (coordinates, images, votes, submitter reference).
- Obstacle type classifications (Pothole, Road Debris, etc.) are a fixed enumeration provided by the backend; adding new types is out of scope for this phase.
- The embedded map widget reuses the existing Leaflet integration already established in the Dashboard phase (Phase 3).
- "Flagging a user" creates a flag record on the backend; the full moderation workflow for flagged users is handled in Phase 7 (Moderation Panel), not here.
- The "Remove Report" action is a soft or hard delete determined by the backend; the frontend simply triggers the action and removes the report from the list on success.
- Report images are hosted URLs returned by the backend; the frontend renders them directly without upload functionality in this phase.
- Approving a report that is already approved, or marking as urgent a report already urgent, is handled gracefully (no duplicate state changes); the backend may return a no-op success or a conflict response.
- Mobile-first responsive design for screens below 768px is out of scope for this phase (per PLAN.md Phase 10 note on responsive polish).
