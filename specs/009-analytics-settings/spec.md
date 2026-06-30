# Feature Specification: Analytics & Settings

**Feature Branch**: `009-analytics-settings`  
**Created**: 2026-06-25  
**Status**: Draft  
**Input**: User description: "Phase 9: Analytics & Settings (`/analytics`, `/settings`) from @[PLAN.md]"

## Clarifications

### Session 2026-06-25

- Q: When the administrator toggles a notification preference, does the change save immediately (auto-save on toggle) or require an explicit Save button? → A: Auto-save on toggle — each toggle triggers an immediate save; a success/failure toast is shown per change.
- Q: What is the maximum date range span an administrator can select on the Analytics page? → A: 90 days maximum (one quarter); selections beyond this limit are rejected by the date range picker.
- Q: When an administrator has unsaved changes in a Settings form and navigates away, should the system warn them before discarding those changes? → A: Yes — a confirmation dialog must prompt “You have unsaved changes. Leave anyway?” before in-app navigation proceeds.
- Q: Which administrator roles can access the `/analytics` page? → A: All authenticated administrators — no additional role restriction beyond standard login is required.
- Q: What does the KPI "previous period" comparison refer to when a custom date range is active? → A: Preceding equivalent window — "previous period" = the same number of days immediately before the selected start date (e.g., Apr 1–Apr 30 compares against Mar 1–Mar 31).

## User Scenarios _(mandatory)_

### User Story 1 - View Analytics Dashboard (Priority: P1)

Administrators need a dedicated analytics page that presents aggregated platform data through visual charts and summary metrics, so they can quickly assess the health and activity of the "On The Way" platform.

**Why this priority**: Decision-making and operational oversight are impossible without aggregated data visualization. This is the primary deliverable of the `/analytics` route.

**Acceptance Scenarios**:

1. **Given** the administrator navigates to `/analytics`, **When** the page loads, **Then** they see four KPI summary cards: Average Response Time, User Satisfaction rate, Resolution Rate, and Active Help Requests — each showing the current value and a percentage change compared to the preceding equivalent window (the same-length period immediately before the selected date range).
2. **Given** the analytics page is open, **When** the administrator views the "Reports Trends" chart, **Then** they see an area chart plotting the number of submitted reports and resolved reports over a date range (defaulting to the last 7 days).
3. **Given** the analytics page is open, **When** the administrator views the "Help Requests by Type" chart, **Then** they see a grouped bar chart breaking down help requests by category (Medical, Towing, Fuel, Repair) across the same date range.
4. **Given** the analytics page is open, **When** the administrator views the "User Growth" chart, **Then** they see a line chart showing cumulative user registrations over time (month-over-month).
5. **Given** the analytics page is open, **When** the administrator views the "Key Metrics Summary" section, **Then** they see three highlight cards: Total Reports This Month, Help Requests Completed, and New Users This Month — each with a month-over-month percentage change indicator.

---

### User Story 2 - Filter Analytics by Date Range (Priority: P2)

Administrators need to be able to scope the analytics data to a custom time window, so they can analyze trends for specific operational periods.

**Why this priority**: Default date ranges provide an overview, but operational investigations often require narrowing or expanding the window.

**Acceptance Scenarios**:

1. **Given** the analytics page is displayed, **When** the administrator uses the date range picker in the top-right of the page, **Then** all charts and KPI cards refresh to reflect data within the selected range.
2. **Given** a custom date range is selected, **When** the administrator clears the selection, **Then** the page resets to the default 7-day window.

---

### User Story 3 - Edit Profile Settings (Priority: P1)

Administrators need to be able to update their own profile information (full name, email address, phone number) from the Settings page, so that account details remain accurate.

**Why this priority**: Profile settings are a baseline requirement for any authenticated admin panel and directly impact how the system identifies and contacts the administrator.

**Acceptance Scenarios**:

1. **Given** the administrator navigates to `/settings`, **When** the page loads, **Then** they see the Profile Settings section pre-populated with their current Full Name, Email Address, Phone Number, and Role (read-only).
2. **Given** the administrator edits their Full Name and clicks "Save Changes", **When** the save completes successfully, **Then** a success confirmation is displayed and the updated name is reflected in the UI.
3. **Given** the administrator submits the profile form with an invalid email address format, **When** they click "Save Changes", **Then** inline validation errors are displayed and the form is not submitted.

---

### User Story 4 - Manage Notification Preferences (Priority: P2)

Administrators need to configure which types of system events generate alert notifications for them (email, urgent reports, moderation alerts, weekly reports), so they receive only the communications relevant to their role.

**Why this priority**: Notification preference control reduces alert fatigue and improves administrator responsiveness to high-priority events.

**Acceptance Scenarios**:

1. **Given** the administrator is on the Settings page, **When** they view the Notification Preferences section, **Then** they see toggle switches for: Email Notifications, Urgent Report Alerts, Moderation Alerts, and Weekly Reports — each showing the current enabled/disabled state.
2. **Given** the administrator toggles a preference switch, **When** the toggle is flipped, **Then** the change is saved immediately (auto-save) and a transient success or failure toast is shown — no separate Save button is required.

---

### User Story 5 - Configure System Settings (Priority: P2)

Super-administrators need to control platform-wide operational parameters (Auto-Approve Reports threshold, Provider Approval mode, Trust Score Threshold, Max Active Help Requests), so that platform rules can be adjusted without a code deployment.

**Why this priority**: System settings empower administrators to tune platform behavior in response to operational needs; changes must be restricted to authorized roles to prevent misuse.

**Acceptance Scenarios**:

1. **Given** the administrator is on the Settings page, **When** they view the System Settings section, **Then** they see an "Admin Only" badge indicating restricted access and input fields for: Auto-Approve Reports, Provider Approval, Trust Score Threshold, and Max Active Help Requests.
2. **Given** a super-administrator updates the Trust Score Threshold and clicks "Save System Settings", **When** the save succeeds, **Then** a success confirmation is shown and the new value is persisted.
3. **Given** a standard administrator (non-super-admin) views the Settings page, **When** they attempt to interact with System Settings fields, **Then** the fields are disabled or the section is hidden based on their permission level.

---

### User Story 6 - Update Display Preferences (Priority: P3)

Administrators need to choose their preferred display language and timezone, so that dates, times, and interface language reflect their local context.

**Why this priority**: Language and timezone localization are secondary comforts that do not impact core platform operations but improve daily usability.

**Acceptance Scenarios**:

1. **Given** the administrator is on the Settings page, **When** they view the Preferences section, **Then** they see dropdown selectors for Language and Timezone.
2. **Given** the administrator selects a new language, **When** they save the preference, **Then** the UI re-renders in the selected language.

---

### Edge Cases

- What happens when analytics data is unavailable or the backend returns an error? → Charts display an empty-state placeholder with an explanatory message; KPI cards show "N/A".
- What happens when the selected date range returns no data? → Charts render with zero-value axes and a "No data for selected period" label.
- What happens if a user attempts to select a date range exceeding 90 days? → The date range picker prevents the selection and displays an inline constraint notice (e.g., "Maximum range is 90 days").
- What if two administrators edit system settings simultaneously? → The last successful save wins; no conflict resolution UI is required for v1.
- What if the administrator navigates away from a Settings form with unsaved changes? → A confirmation dialog (“You have unsaved changes. Leave anyway?”) is shown; if confirmed, navigation proceeds and changes are discarded; if dismissed, the administrator remains on the page.
- What if the administrator's session expires mid-form on the Settings page? → The form submission fails gracefully, the user is redirected to login, and unsaved changes are discarded (no confirmation dialog — session expiry overrides the guard).
- What loading state is shown for charts? → Skeleton loaders are displayed for each chart area while data is being fetched.
- What happens if a non-super-admin accesses the System Settings section directly? → The section is read-only or hidden and a permission notice is displayed.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST display an Analytics page at `/analytics` containing four KPI summary cards: Average Response Time, User Satisfaction, Resolution Rate, and Active Help Requests. Each card MUST show the value for the selected date range and a percentage change compared to the preceding equivalent window (the same number of days immediately before the selected range start date).
- **FR-002**: The Analytics page MUST include a "Reports Trends" area chart displaying the volume of submitted reports and resolved reports over time.
- **FR-003**: The Analytics page MUST include a "Help Requests by Type" grouped bar chart categorizing requests as Medical, Towing, Fuel, and Repair.
- **FR-004**: The Analytics page MUST include a "User Growth" line chart displaying cumulative user registrations over time.
- **FR-005**: The Analytics page MUST include a "Key Metrics Summary" section showing: Total Reports This Month, Help Requests Completed, and New Users This Month with month-over-month change indicators.
- **FR-006**: The Analytics page MUST provide a date range picker that, when changed, refreshes all charts and KPI cards to the selected time window. The maximum selectable span MUST be capped at 90 days; the picker MUST prevent selection of ranges exceeding this limit.
- **FR-007**: The system MUST display a Settings page at `/settings` with four distinct sections: Profile Settings, Notification Preferences, System Settings (Admin Only), and Preferences.
- **FR-008**: The Profile Settings section MUST display the current administrator's Full Name, Email Address, Phone Number, and Role (read-only), and MUST allow editing of all fields except Role.
- **FR-009**: The Settings page MUST validate all form inputs client-side before submission, displaying inline error messages for invalid values.
- **FR-010**: The Notification Preferences section MUST display toggle switches for: Email Notifications, Urgent Report Alerts, Moderation Alerts, and Weekly Reports. Each toggle MUST auto-save immediately on flip and display a transient success or failure toast — no explicit Save button is required for this section.
- **FR-011**: The System Settings section MUST be labelled as "Admin Only" and MUST include configurable fields for: Auto-Approve Reports, Provider Approval, Trust Score Threshold, and Max Active Help Requests.
- **FR-012**: The System Settings section MUST be restricted so that only super-administrators can modify its fields; standard administrators see the section as read-only.
- **FR-013**: The Preferences section MUST provide dropdown selectors for Language and Timezone.
- **FR-014**: All settings forms MUST display a success or failure notification upon save action completion.
- **FR-015**: Charts on the Analytics page MUST display skeleton loaders while data is being fetched, and empty-state messages when no data is available.
- **FR-016**: The Settings page MUST detect unsaved form changes and display a confirmation dialog (“You have unsaved changes. Leave anyway?”) when the administrator attempts in-app navigation away from any section with pending edits. If the administrator confirms, navigation proceeds and changes are discarded; if dismissed, the administrator stays on the page.
- **FR-017**: The `/analytics` route MUST be accessible to all authenticated administrators regardless of role; no super-admin restriction applies. Unauthenticated users attempting to access the route MUST be redirected to the login page.

### Key Entities

- **AnalyticsSnapshot**: Aggregated platform metrics for a given date range. Contains: KPI values (avg response time, satisfaction rate, resolution rate, active help requests), period-over-period deltas computed against the preceding equivalent window, time-series data points for each chart, and summary counts.
- **AdminProfile**: The authenticated administrator's personal details. Contains: full name, email address, phone number, and role (read-only).
- **NotificationPreferences**: Per-administrator notification opt-in flags. Contains: email notifications enabled, urgent report alerts enabled, moderation alerts enabled, weekly reports enabled.
- **SystemSettings**: Platform-wide operational configuration. Contains: auto-approve reports flag/threshold, provider approval mode, trust score threshold, max active help requests. Write-access restricted to super-administrators.
- **DisplayPreferences**: Per-administrator display customization. Contains: preferred language, preferred timezone.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can navigate to the Analytics page and see fully rendered KPI cards and charts within 3 seconds under a normal data load.
- **SC-002**: All four chart types (area, grouped bar, line, and summary cards) render correctly and update without a full page reload when the date range changes.
- **SC-003**: Administrators can update their profile information and receive a save confirmation in under 5 seconds.
- **SC-004**: 100% of invalid form submissions on the Settings page are blocked client-side with clear error messages before data is sent.
- **SC-005**: Notification preference toggle changes are persisted and reflected in the UI with no page reload required.
- **SC-006**: System Settings fields are inaccessible (read-only or hidden) for 100% of non-super-admin accounts.
- **SC-007**: Analytics charts display an appropriate empty state for any date range that returns zero data points — no broken or blank chart areas.

## Assumptions

- The analytics data is provided by the backend as pre-aggregated values; the frontend does not perform raw data aggregation.
- Mock data will be used during development; actual backend endpoints will be connected in Phase 10.
- The Role field in Profile Settings is always read-only; role changes are performed through the Users Management module.
- Super-administrator status is determined by the authenticated user's role provided in the session/token payload, not re-fetched at the settings page level.
- The `/analytics` route requires only standard admin authentication; it is not restricted to super-admins.
- Language and timezone preferences affect only the current administrator's session view; they do not change the platform locale for end users.
- The date range picker defaults to the last 7 days on initial page load.
- KPI percentage-change deltas are always computed by the backend against the preceding equivalent window; the frontend displays the pre-computed delta value.
- All settings sections appear on a single `/settings` page, scrollable, not tabbed.
