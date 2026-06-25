# Feature Specification: Moderation Panel

**Feature Branch**: `007-moderation-panel`  
**Created**: 2026-06-23  
**Status**: Draft  
**Input**: User description: "Phase 7: Moderation Panel (`/moderation`) from PLAN.md"

## Clarifications

### Session 2026-06-23

- Q: Should Remove and Suspend require a one-click confirmation step before executing, while Warn / Approve / Flag to Admin remain instant? → A: Confirmation only for Remove and Suspend — a single confirmation step before irreversible actions; all other actions execute instantly.
- Q: How should the panel keep its data up to date while an administrator is actively using it? → A: Periodic background polling — panel data auto-refreshes on a fixed interval (~30–60 seconds) while the page is open; no real-time push infrastructure required.
- Q: After a "Warn User" action is taken on a flagged report, what happens to that report in the queue? → A: The report stays in the queue but is visually marked as "Warned" so subsequent admins can see the warning was already issued before deciding to Approve or Remove.
- Q: Can a suspended user's account be reinstated, and if so, from where? → A: Reinstatement is possible but handled from the User Details page (`/users/:id`), not the Moderation Panel; the panel only triggers the suspension.
- Q: When an admin clicks "Flag to Admin" on a suspicious user, does the super-administrator receive an active notification? → A: Yes, the system sends an active notification to super-administrator(s) when a "Flag to Admin" escalation is submitted.

## User Scenarios *(mandatory)*

### User Story 1 - Review Flagged Reports (Priority: P1)

An administrator opens the Moderation Panel and sees a dedicated section for **Flagged Reports** — road reports that other users or the system have flagged as false, duplicate, or misleading. Each flagged report shows the report title, location, the number of downvotes it received, which user submitted it, and a tag indicating why it was flagged (e.g., "High downvotes", "Reported as spam", "Duplicate content"). The administrator can immediately take one of three quick actions: **Approve** the report (keep it visible on the platform), **Remove** it (take it down permanently), or **Warn User** (send a warning to the report's author).

**Why this priority**: Flagged reports that remain visible to drivers can cause dangerous confusion on the road. Resolving them is the most safety-critical part of the moderation workflow.

**Acceptance Scenarios**:

1. **Given** the admin opens `/moderation`, **When** the page loads, **Then** a "Flagged Reports" section is visible showing all pending flagged reports with their title, location, downvote count, submitting user, and flag reason tag.
2. **Given** a flagged report is visible, **When** the admin clicks "Approve", **Then** the report is restored to active status, removed from the flagged queue, and a success notification is shown.
3. **Given** a flagged report is visible, **When** the admin clicks "Remove", **Then** the report is removed from the platform, removed from the flagged queue, and a success notification is shown.
4. **Given** a flagged report is visible, **When** the admin clicks "Warn User", **Then** a warning is issued to the report's author, the report remains in the flagged queue marked as "Warned", and a success notification is shown.
5. **Given** a flagged report is already marked as "Warned", **When** an administrator views the entry, **Then** the "Warned" state is clearly visible so the admin can decide to Approve or Remove without issuing a duplicate warning.
6. **Given** an action fails due to a network or server error, **When** the error occurs, **Then** the flagged report remains in the queue and a visible error message is shown.
7. **Given** there are no flagged reports, **When** the section loads, **Then** an empty state message is shown.

---

### User Story 2 - Manage Suspicious Users (Priority: P1)

An administrator reviews a **Suspicious Users** section on the Moderation Panel. Each entry shows the user's name, current Trust Score, number of reports they have submitted, number of warnings already on their account, and a brief summary of the suspicious activity (e.g., "Multiple fake reports", "Spam activity", "Unusual voting pattern"). The administrator can apply one of three quick actions: **Warn** the user (increase warning count), **Suspend** the account, or **Flag to Admin** (escalate to a super-administrator for further review).

**Why this priority**: Users who repeatedly submit false reports or game the voting system undermine platform integrity. Identifying and acting on them is equally critical to keeping road data reliable.

**Acceptance Scenarios**:

1. **Given** the admin opens `/moderation`, **When** the page loads, **Then** a "Suspicious Users" section is visible showing flagged users with their name, Trust Score, report count, warning count, and suspicious activity summary.
2. **Given** a suspicious user is visible, **When** the admin clicks "Warn", **Then** a warning is added to the user's account, the warning count updates in the UI, and a success notification is shown.
3. **Given** a suspicious user is visible, **When** the admin clicks "Suspend", **Then** the user's account is suspended, the user is removed from the suspicious users list, and a success notification is shown.
4. **Given** a suspicious user is visible, **When** the admin clicks "Flag to Admin", **Then** the user is escalated for super-administrator review, an active notification is sent to super-administrator(s), the entry is marked or removed from the list, and a success notification is shown to the acting admin.
5. **Given** an action fails due to a network or server error, **When** the error occurs, **Then** the user entry remains in the list and a visible error message is shown.
6. **Given** there are no suspicious users, **When** the section loads, **Then** an empty state message is shown.

---

### User Story 3 - Monitor Pending Moderation Actions Queue (Priority: P2)

An administrator reviews a **Pending Moderation Actions** queue at the bottom of the Moderation Panel. This queue lists items awaiting review — such as report reviews, user flags, and content removal requests — each showing a priority level (High / Medium / Low), a short description, the time elapsed since submission, and a "Review" button. Clicking "Review" navigates the administrator to the appropriate detail view for that item.

**Why this priority**: The pending queue acts as the administrator's task backlog. It surfaces items that require attention but have not yet been acted on, preventing important moderation tasks from going unnoticed.

**Acceptance Scenarios**:

1. **Given** the admin opens `/moderation`, **When** the page loads, **Then** a "Pending Moderation Actions" queue is shown listing pending items with priority badge, description, time elapsed, and a "Review" button.
2. **Given** pending items exist, **When** the admin clicks "Review" on a Report Review item, **Then** the admin is navigated to the relevant report's detail view.
3. **Given** pending items exist, **When** the admin clicks "Review" on a User Flag item, **Then** the admin is navigated to the relevant user's detail view.
4. **Given** there are no pending items, **When** the queue loads, **Then** an empty state message is shown.
5. **Given** the queue fails to load, **When** the error occurs, **Then** the flagged reports and suspicious users sections remain usable and the queue section shows an error state with retry option.

---

### User Story 4 - See Moderation Summary at a Glance (Priority: P2)

An administrator sees a header badge or counter on the Moderation Panel page indicating the total number of items currently awaiting attention (e.g., "6 items pending"). This count updates to reflect newly resolved or newly arrived items without requiring a full page refresh.

**Why this priority**: A summary counter helps the administrator assess the urgency and volume of the moderation backlog without scrolling through every section.

**Acceptance Scenarios**:

1. **Given** the admin opens `/moderation`, **When** the page loads, **Then** a badge or counter showing the total number of pending items is visible in the page header area.
2. **Given** the admin resolves a flagged report or takes action on a suspicious user, **When** the action succeeds, **Then** the pending count decreases to reflect the resolved item.
3. **Given** the count is zero, **When** the page loads, **Then** the badge shows "0 items pending" or an equivalent all-clear indicator.

---

### Edge Cases

- What happens when a flagged report or suspicious user entry is acted on by another administrator simultaneously? The acting admin sees a conflict or stale-data message and the entry refreshes to its latest state.
- What happens when an administrator tries to Warn User on a report already marked as "Warned"? The Warn User action remains available (a second warning may still be warranted), but the "Warned" badge on the entry makes the prior warning visible so the admin can make an informed choice.
- What happens when the Trust Score for a suspicious user is at or near a critical threshold (e.g., 0)? The interface still allows Warn, Suspend, or Flag to Admin actions without error; the score displays its current value.
- What happens when all flagged reports or suspicious users are resolved in a single session? Each section transitions to its empty state immediately after the last item is resolved.
- What happens when an administrator wants to reinstate a previously suspended user? Reinstatement is not available from the Moderation Panel; the admin must navigate to the User Details page (`/users/:id`) where the account lifecycle controls, including unsuspend, are managed.
- What loading, empty, validation, authorization, and remote API failure states must be visible to admins?
  - **Loading**: Skeleton cards or placeholder rows appear while flagged reports, suspicious users, and the pending queue load.
  - **Empty**: Each section shows a distinct empty state message when no items require attention.
  - **Validation**: No required form input is needed for quick-action buttons. **Remove** and **Suspend** require a single confirmation step before executing (irreversible actions). All other actions (Approve, Warn User, Warn, Flag to Admin) execute instantly without a confirmation modal.
  - **Authorization**: Moderation actions are hidden or disabled for admin accounts without moderation permission.
  - **Remote failure**: Each section displays a visible error state with a retry option independently, so a failure in one section does not disable the others.
- What responsive or accessibility constraints could block task completion? Flagged report cards, suspicious user entries, action buttons, and the pending queue must remain usable with keyboard navigation and at typical admin workstation screen widths (1024px and above) without overlapping content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Moderation Panel at the `/moderation` route accessible to authenticated administrators with moderation permissions.
- **FR-002**: The Moderation Panel MUST display a "Flagged Reports" section showing all pending flagged reports.
- **FR-003**: Each flagged report entry MUST show report title, location, downvote count, submitting user's name, the reason it was flagged (e.g., high downvotes, spam, duplicate content), and a "Warned" status badge when a Warn User action has previously been taken on that report.
- **FR-004**: System MUST allow administrators to **Approve** a flagged report, which restores it to active status and removes it from the flagged queue.
- **FR-005**: System MUST allow administrators to **Remove** a flagged report; because this action permanently deletes the report from the platform, the system MUST present a single confirmation step before executing; upon confirmation the report is deleted and removed from the flagged queue.
- **FR-006**: System MUST allow administrators to **Warn User** on a flagged report, which issues a warning to the report's author; the report MUST remain in the flagged queue and MUST be visually marked as "Warned" so subsequent administrators can see the warning was already issued.
- **FR-007**: The Moderation Panel MUST display a "Suspicious Users" section listing users flagged by the system or by other admins.
- **FR-008**: Each suspicious user entry MUST show the user's name, Trust Score, total report count, current warning count, and a brief suspicious activity summary.
- **FR-009**: System MUST allow administrators to **Warn** a suspicious user, incrementing the user's warning count.
- **FR-010**: System MUST allow administrators to **Suspend** a suspicious user's account; because this action deactivates account access, the system MUST present a single confirmation step before executing; upon confirmation the account is deactivated and the user is removed from the suspicious list. Reinstatement of a suspended account is out of scope for this panel and is handled from the User Details page.
- **FR-011**: System MUST allow administrators to **Flag to Admin** a suspicious user, escalating the case to a super-administrator; upon escalation, the system MUST send an active notification to all super-administrators alerting them to the new escalation.
- **FR-012**: The Moderation Panel MUST display a "Pending Moderation Actions" queue listing items awaiting review with priority level (High / Medium / Low), description, elapsed time, and a "Review" navigation button.
- **FR-013**: The "Review" button for a Report Review item MUST navigate the administrator to the relevant report detail view.
- **FR-014**: The "Review" button for a User Flag item MUST navigate the administrator to the relevant user detail view.
- **FR-015**: System MUST display a total pending item count badge or counter in the Moderation Panel header area.
- **FR-016**: The pending count MUST decrease immediately in the UI after an administrator successfully resolves a flagged report or takes action on a suspicious user.
- **FR-017**: System MUST display loading, empty, and error states independently for the Flagged Reports section, Suspicious Users section, and Pending Moderation Actions queue.
- **FR-018**: System MUST display an immediate success or error notification after every moderation action.
- **FR-019**: Moderation actions (Approve, Remove, Warn User, Warn, Suspend, Flag to Admin) MUST be hidden or disabled for administrators without moderation permissions.
- **FR-020**: While the Moderation Panel page is open, all three sections (Flagged Reports, Suspicious Users, Pending Queue) and the pending count badge MUST automatically refresh in the background on a fixed interval of approximately 30–60 seconds without any administrator interaction.

### Key Entities

- **Flagged Report**: A road report that has been marked for review by user downvotes or by the automated system. Key attributes: report ID, report title, location, downvote count, submitting user reference, flag reason, current moderation status, and warned state (whether a Warn User action has been applied, displayed as a "Warned" badge on the entry).
- **Flag Reason**: The categorized reason a report was escalated for review (e.g., "High downvotes", "Reported as spam", "Duplicate content").
- **Suspicious User**: A user account identified as potentially gaming the platform, submitting false data, or exhibiting unusual behavioral patterns. Key attributes: user ID, display name, Trust Score, report count, warning count, and activity summary.
- **Trust Score**: A numeric indicator of a user's reliability on the platform. Lower scores indicate more suspicious or unreliable behavior.
- **Moderation Action**: An administrator decision applied to a flagged report or suspicious user. Types: Approve, Remove, Warn User (on reports); Warn, Suspend, Flag to Admin (on users).
- **Pending Moderation Item**: A queued task awaiting administrator review. Key attributes: item type (report review, user flag, content removal), priority level, description, submission time, and a reference to the target entity.
- **Priority Level**: The urgency classification of a pending moderation item: High, Medium, or Low.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can open the Moderation Panel and see all three sections (Flagged Reports, Suspicious Users, Pending Queue) within 3 seconds under normal network conditions. Each section refreshes automatically in the background every 30–60 seconds; new items appear without a manual page reload.
- **SC-002**: 100% of moderation quick actions (Approve, Remove, Warn User, Warn, Suspend, Flag to Admin) provide visible success or error feedback within 3 seconds of the button click.
- **SC-003**: The pending item count badge updates within 1 second of a successful moderation action without requiring a full page reload.
- **SC-004**: Administrators can scan a flagged report entry and identify its title, location, submitter, downvote count, and flag reason without opening any additional view.
- **SC-005**: Administrators can scan a suspicious user entry and identify name, Trust Score, report count, warnings, and activity summary without opening any additional view.
- **SC-006**: 100% of "Review" button clicks for pending queue items navigate the administrator to the correct detail view.
- **SC-007**: Administrators can complete the full moderation triage workflow (review flagged report, take action, review suspicious user, take action, check pending queue) without encountering blank states, overlapping content, or undefined values.
- **SC-008**: All moderation action buttons and navigation controls are operable using keyboard navigation alone.
- **SC-009**: Each of the three panel sections fails and recovers independently — a data error in one section does not prevent the other sections from loading or functioning.

## Assumptions

- Administrators are already authenticated; this feature does not introduce new sign-in or permission models.
- The system already produces flagged reports and suspicious user entries through automated scoring and user downvote thresholds; this panel is the review and action interface, not the detection mechanism.
- Reversible moderation actions (Approve, Warn User, Warn, Flag to Admin) execute instantly without a confirmation modal, prioritizing triage speed. Irreversible actions (Remove a report, Suspend a user) require a single confirmation step before executing to prevent accidental data loss.
- "Flag to Admin" escalates a suspicious user to super-administrator review and triggers an active notification to all super-administrators; the super-admin workflow for handling escalations is outside the scope of this phase, but the notification delivery itself is in scope.
- The Trust Score is computed by the backend and displayed read-only in the UI; this panel does not allow manual Trust Score editing.
- The "Warn User" action on a flagged report issues a platform warning to the report's author; the specific warning message content is managed by the backend and is outside the scope of this phase.
- The pending moderation queue surfaces items from all moderation categories (report reviews, user flags, content removal requests); filtering or sorting the queue is out of scope for this phase.
- Panel data is kept fresh via periodic background polling on an interval of approximately 30–60 seconds while the page is open; no WebSocket or server-sent-event infrastructure is required for this phase.
- Responsive polish below 1024px is deferred to the final review phase unless it blocks core admin task completion.
- Deleting a user account is outside the scope of this phase; suspension is the strongest user action available from this panel. Reinstatement of a suspended user is handled from the User Details page (`/users/:id`) in the Users Management module, not from the Moderation Panel.
