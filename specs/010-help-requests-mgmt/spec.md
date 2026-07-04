# Feature Specification: Help Requests Management

**Feature Branch**: `010-help-requests-mgmt`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: User description: "Phase 10: Help Requests Management (`/help-requests`) from @[PLAN.md]"

## Clarifications

### Session 2026-07-01

- Q: Should Action Panel buttons change (be disabled/hidden) based on the current request status? → A: Selective disable — "Mark as Completed", "Cancel Request", and "Reassign Provider" are **disabled** (not hidden) when the request is in a terminal state (Completed or Cancelled); "Contact User" remains always enabled. A tooltip on each disabled button MUST explain why the action is unavailable (e.g., "This request is already completed").
- Q: How should the help-requests card list handle a large number of results? → A: Standard pagination — the list is paginated with a selectable page size (10 / 20 / 50 cards per page, defaulting to 10) and a page-navigation footer. The current page number and page size MUST be included in the URL query parameters alongside filter state.
- Q: When an administrator clicks "Contact User", what is the exact interaction? → A: A small modal opens displaying all available contact details (user name, phone number, email address) with a copy-to-clipboard button next to each field. No browser `mailto:` or `tel:` link is triggered automatically. If no contact details are available, the modal still opens but shows an informational message instead.
- Q: Which status transitions are permitted through the Action Panel? → A: Strict one-way transitions only — Active → Completed or Cancelled; Pending → Active, Completed, or Cancelled; Completed and Cancelled are terminal states (no further transitions permitted from either). Administrators cannot re-activate a Completed or Cancelled request.
- Q: What is the clickable area on a help-request card that navigates to the detail page? → A: Only the explicit "View" button triggers navigation. Clicking the rest of the card body does nothing; the card is not a link.

## User Scenarios *(mandatory)*

### User Story 1 - Browse and Filter Help Requests (Priority: P1)

Administrators need a dedicated page at `/help-requests` that lists all incoming help requests in a card-based layout, with filtering controls for category and status, so they can quickly identify requests that require attention.

**Why this priority**: This is the primary entry point to the feature. Without being able to view and filter the full list, no downstream management action is possible.

**Acceptance Scenarios**:

1. **Given** the administrator navigates to `/help-requests`, **When** the page loads, **Then** they see a toolbar with a search input and two dropdown filters (Category: Medical, Towing, Fuel, Repair; Status: Active, Completed, Cancelled, Pending), followed by a paginated card-based list defaulting to 10 cards per page and a page-navigation footer.
2. **Given** the list is displayed, **When** the administrator selects "Towing" from the Category filter, **Then** only help-request cards matching the "Towing" category are shown.
3. **Given** the list is displayed, **When** the administrator selects "Active" from the Status filter, **Then** only cards with an "Active" status are shown.
4. **Given** filters are active, **When** the administrator types a partial user name or location into the search input, **Then** the card list narrows further to entries matching the search term.
5. **Given** no help requests match the applied filters, **When** the filtered list is empty, **Then** a clear empty-state message is shown (e.g., "No help requests match your filters").
6. **Given** the backend is loading data, **When** the page is in a loading state, **Then** skeleton placeholder cards are shown in place of real cards until data arrives.
7. **Given** more help requests exist than the current page size, **When** the administrator views the bottom of the list, **Then** a pagination footer is visible showing the current page, total pages, and navigation controls (previous / next / page numbers); changing page size resets to page 1.

---

### User Story 2 - View Help Request Summary Cards (Priority: P1)

Administrators need each help request displayed as an informative card on the list page, so they can assess a request at a glance without navigating to a detail page.

**Why this priority**: The card layout is the central UI deliverable of the list view. A poorly designed card forces admins to open every detail page to gather basic information, reducing efficiency.

**Acceptance Scenarios**:

1. **Given** the help-requests list is visible, **When** a card is rendered, **Then** it displays: a category icon, category label, status badge (color-coded), a location text summary, the requesting user's name and avatar/initials, the assigned provider's name (or "Unassigned"), and a "View" button. Only the "View" button is a navigation trigger; clicking anywhere else on the card has no effect.
2. **Given** a help request has an "Active" status, **When** its card is rendered, **Then** the status badge uses a visually distinct active color (e.g., green or amber).
3. **Given** a help request has a "Completed" status, **When** its card is rendered, **Then** the status badge uses a muted/neutral color to distinguish it from active requests.
4. **Given** no provider has been assigned to a request, **When** the card is rendered, **Then** the provider field displays "Unassigned" rather than being blank.
5. **Given** the administrator clicks anywhere on the card body (outside the "View" button), **When** the click registers, **Then** nothing happens — no navigation or modal is triggered.

---

### User Story 3 - View Help Request Details (Priority: P1)

Administrators need a detail page for each help request at `/help-requests/:id` that presents the full context of the request including location, user, provider, a map pin, a timeline, and action buttons, so they can make informed management decisions.

**Why this priority**: Without detail visibility — especially the timeline and map — administrators cannot meaningfully oversee or intervene in an active request.

**Acceptance Scenarios**:

1. **Given** the administrator clicks "View" on a help-request card, **When** the detail page loads, **Then** they see the Request Description section with the exact location text and coordinate pair.
2. **Given** the detail page is open, **When** the administrator views the page, **Then** they see a User Information card showing the requesting user's name, contact details, and profile summary.
3. **Given** the detail page is open, **When** the administrator views the page, **Then** they see an Assigned Provider card showing the provider's name, type, rating, and estimated time of arrival (ETA).
4. **Given** the detail page is open, **When** the administrator views the Location on Map section, **Then** a map renders with a single pin placed at the exact coordinates of the help request.
5. **Given** the detail page is open, **When** the administrator views the Request Timeline, **Then** they see a vertical chronological timeline of status events (e.g., "Created", "Provider Notified", "En Route", "Completed") with timestamps and connected dot markers.
6. **Given** the detail page is open, **When** the administrator views the Action Panel, **Then** they see four full-width action buttons: "Contact User", "Mark as Completed", "Reassign Provider", and "Cancel Request".
7. **Given** the administrator clicks "Mark as Completed", **When** the action is confirmed and succeeds, **Then** the request status updates to "Completed" and a success notification is displayed.
8. **Given** the administrator clicks "Cancel Request", **When** the action is confirmed and succeeds, **Then** the request status updates to "Cancelled" and a success notification is displayed.
9. **Given** a help request is in a terminal state (Completed or Cancelled), **When** the administrator views the Action Panel, **Then** "Mark as Completed", "Cancel Request", and "Reassign Provider" are visually disabled; hovering each disabled button reveals a tooltip explaining the action is unavailable (e.g., "This request is already completed"); "Contact User" remains active and clickable.
10. **Given** a help request has a "Pending" status, **When** the administrator views the Action Panel, **Then** all four buttons are enabled; "Mark as Completed" and "Cancel Request" are actionable directly from Pending state; there is no mandatory intermediate step to Active.

---

### User Story 4 - Reassign Provider for a Help Request (Priority: P2)

Administrators need to reassign a different service provider to an existing help request, so that service continuity is maintained when the original provider is unavailable.

**Why this priority**: Provider reassignment is a critical intervention tool for active requests where the original provider cannot fulfill the job, but it is secondary to viewing and basic status management (P1 stories).

**Acceptance Scenarios**:

1. **Given** the administrator clicks "Reassign Provider" on the detail page, **When** the action is triggered, **Then** a modal or panel opens listing available providers filtered by the request's category.
2. **Given** the reassignment modal is open, **When** the administrator selects a new provider and confirms, **Then** the assigned provider on the detail page updates to the new provider's name and ETA, and a success notification is shown.
3. **Given** the reassignment modal is open, **When** the administrator closes the modal without selecting a provider, **Then** the current provider assignment remains unchanged.

---

### User Story 5 - Contact User from Help Request (Priority: P2)

Administrators need a quick way to initiate contact with the user who submitted a help request, so that they can gather additional information or communicate updates.

**Why this priority**: Direct contact is a secondary operational tool; the primary value of the feature lies in visibility (P1 stories), but contact capability is frequently needed in real operations.

**Acceptance Scenarios**:

1. **Given** the administrator clicks "Contact User" on the detail page, **When** the action triggers, **Then** a modal opens displaying the requesting user's name, phone number, and email address — each with a copy-to-clipboard button. No browser link (mailto/tel) is triggered automatically.
2. **Given** the requesting user has no contact details on record, **When** the administrator clicks "Contact User", **Then** the modal still opens but displays an informational message such as "No contact information available for this user" instead of field values.

---

### Edge Cases

- What happens when a help request's detail page is loaded but the request no longer exists? → A 404 / "Request not found" empty state is shown with a link back to the list.
- What happens when the map component fails to load (e.g., network issue or invalid coordinates)? → A placeholder is shown with a message such as "Map unavailable" and the coordinate values are displayed as text.
- What happens when the assigned provider is deleted from the system while the request is still active? → The provider field falls back to "Unassigned" and the ETA field is hidden.
- What happens when an action button (Mark as Completed / Cancel Request) fails on the backend? → An error toast is shown; the request status does not change in the UI.
- What happens if an administrator attempts to trigger a status transition that is not valid for the current state (e.g., re-activating a Cancelled request via a direct API call)? → This path is not exposed in the UI (buttons are disabled for terminal states); if the backend rejects an invalid transition, the UI treats it as an action failure and shows an error toast.
- What loading state is shown on the detail page? → Section-level skeleton loaders are shown while individual data blocks (User Info, Provider Info, Timeline) are fetching.
- What happens when the request timeline has only one event? → A single dot with its timestamp is displayed; the vertical connector line above/below is absent.
- What happens when the administrator applies multiple filters and the URL is shared? → The filter state is encoded in URL query parameters, so sharing the URL reproduces the exact filtered view.
- What responsive layout applies? → The list page stacks cards in a single column on narrow viewports; the detail page stacks sections vertically.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a Help Requests list page at `/help-requests` showing all help requests as individual summary cards in a card-based layout (not a table).
- **FR-002**: The list page MUST include a toolbar with a text search input, a Category dropdown filter (options: Medical, Towing, Fuel, Repair), and a Status dropdown filter (options: Active, Completed, Cancelled, Pending).
- **FR-003**: Applying any filter or search term MUST narrow the displayed card list in real time (or on each input change) without requiring a full page reload.
- **FR-004**: Active filter/search state, current page number, and selected page size MUST be reflected in the page URL as query parameters so that paginated and filtered views can be shared or bookmarked.
- **FR-005**: Each help-request card MUST display: a category icon, category label, color-coded status badge, location text, requesting user's name and avatar/initials, assigned provider name (or "Unassigned"), and a "View" button.
- **FR-006**: Only the "View" button on a help-request card MUST trigger navigation to the Help Request Detail page at `/help-requests/:id`. Clicking the card body outside the "View" button MUST NOT trigger any navigation or interaction.
- **FR-007**: The list page MUST display skeleton placeholder cards while data is loading and a descriptive empty-state message when no requests match the active filters.
- **FR-008**: The Help Request Detail page at `/help-requests/:id` MUST display a "Request Description" section containing the exact location text and coordinate pair.
- **FR-009**: The detail page MUST display a "User Information" card with the requesting user's name, avatar/initials, and contact details.
- **FR-010**: The detail page MUST display an "Assigned Provider" card with the provider's name, category/type, rating, and ETA. When no provider is assigned, the card MUST indicate "Unassigned" and hide the ETA field.
- **FR-011**: The detail page MUST embed a map component displaying a marker pin placed at the exact coordinates of the help request. When the map cannot be rendered, a fallback placeholder with coordinate text MUST be shown.
- **FR-012**: The detail page MUST display a "Request Timeline" component presenting status events in chronological order from oldest to newest, using a vertical layout with connected dot markers and timestamps for each event.
- **FR-013**: The detail page MUST include an "Action Panel" containing four full-width action buttons: "Contact User", "Mark as Completed", "Reassign Provider", and "Cancel Request". When the request is in a terminal state (Completed or Cancelled), "Mark as Completed", "Cancel Request", and "Reassign Provider" MUST be rendered as disabled (not hidden); each disabled button MUST display a tooltip explaining the action is unavailable. "Contact User" MUST remain enabled in all states.
- **FR-014**: "Mark as Completed" and "Cancel Request" actions MUST require a confirmation step before executing, and MUST display a success or error notification upon completion. The permitted status transitions are: Active → Completed or Cancelled; Pending → Active, Completed, or Cancelled. Completed and Cancelled are terminal states — no further transitions are available from either. The Action Panel MUST enforce these rules by disabling irrelevant buttons per the current status.
- **FR-015**: "Reassign Provider" MUST open a modal listing available providers filtered to the request's category; selecting and confirming a provider MUST update the assigned provider on the detail page.
- **FR-016**: "Contact User" MUST open a modal displaying the requesting user's name, phone number, and email address. Each field MUST have a copy-to-clipboard button. No `mailto:` or `tel:` link is triggered automatically. When no contact details exist for the user, the modal MUST open and display an informational message (e.g., "No contact information available") instead of blank fields.
- **FR-017**: The detail page MUST display section-level skeleton loaders for each data block (User Info, Provider Info, Timeline) while data is being fetched.
- **FR-018**: Navigating to a non-existent help request ID MUST render a "Request not found" empty state with a back-navigation link to the list.
- **FR-019**: All data on the list and detail pages MUST be provided via React Query custom hooks (`useGetHelpRequests`, `useGetHelpRequestDetails`) backed by mock data; the same hooks will be connected to the live backend in Phase 11.
- **FR-020**: The help-requests list page MUST implement pagination. The default page size MUST be 10 cards. The administrator MUST be able to change the page size to 10, 20, or 50 using a selector in the pagination footer. The pagination footer MUST display the current page number, total number of pages, total result count, and navigation controls (previous page, next page, and direct page-number buttons). Changing any filter or search term MUST reset the list to page 1.

### Key Entities

- **HelpRequest**: A single assistance request submitted by a mobile app user. Contains: id, category (Medical | Towing | Fuel | Repair), status (Active | Pending | Completed | Cancelled), location text, coordinates (latitude + longitude), timestamp of creation, and a reference to the requesting user and assigned provider. Valid lifecycle transitions: Pending → Active | Completed | Cancelled; Active → Completed | Cancelled; Completed and Cancelled are terminal (no outbound transitions).
- **HelpRequestUser**: Summary of the user who submitted the request. Contains: id, full name, avatar URL or initials, contact details (phone / email).
- **HelpRequestProvider**: Summary of the assigned service provider. Contains: id, name, type/category, rating, and ETA in minutes. Nullable when no provider has been assigned.
- **TimelineEvent**: A single status update in the request lifecycle. Contains: event label (e.g., "Created", "Provider Notified", "En Route", "Completed"), timestamp, and optional description.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can navigate to `/help-requests` and see the full card list (or a meaningful loading state) within 2 seconds under a normal data load.
- **SC-002**: Applying any Category or Status filter updates the displayed card list without a full page reload, and the result is visible within 500 ms of filter selection.
- **SC-003**: Each help-request card renders all required fields (icon, status badge, location, user, provider) — zero cards are displayed with missing or broken field areas.
- **SC-004**: Administrators can navigate from the list to a detail page and see all sections (Description, User Info, Provider, Map, Timeline, Action Panel) fully rendered within 3 seconds.
- **SC-005**: The Request Timeline correctly renders all status events in chronological order for 100% of detail pages loaded during testing.
- **SC-006**: All four action buttons on the Action Panel trigger the correct outcome (confirmation dialog, status update, provider reassignment modal, or contact action) with 100% reliability across test scenarios.
- **SC-007**: The map component renders the correct pin location for 100% of requests with valid coordinates; requests with invalid or missing coordinates always display the fallback text state.
- **SC-008**: Filter state, page number, and page size encoded in the URL accurately reproduce the exact paginated and filtered view when the URL is pasted into a new browser session.
- **SC-009**: The pagination footer correctly reflects the total result count and available pages for any combination of active filters; navigating to a page beyond the available range redirects to the last valid page.

## Assumptions

- Mock data will be used for all API interactions during Phase 10 development; live backend connection is deferred to Phase 11.
- The map component reuses the existing `react-leaflet` integration established in Phase 5 (Reports Management).
- The category taxonomy is fixed for this phase: Medical, Towing, Fuel, Repair — no dynamic category loading from the backend.
- Status transitions are strictly one-way and enforced by the Action Panel: Pending → Active | Completed | Cancelled; Active → Completed | Cancelled; Completed and Cancelled are terminal states with no further transitions. Administrators cannot re-activate a request once it has reached a terminal state.
- Provider reassignment only lists providers that are currently approved and active in the system.
- "Contact User" does not open an in-app messaging interface; it opens a modal displaying contact details with copy-to-clipboard buttons (no automatic mailto/tel link).
- The Route for this feature is `/help-requests` and the detail page is `/help-requests/:id`, consistent with the routing conventions of other phases.
- The feature is accessible to all authenticated administrators — no role restriction beyond standard login is required.
- ETA is stored as a pre-computed value from the backend (minutes as an integer); the frontend displays it as-is without recalculation.
- The timeline event types are: "Created", "Provider Notified", "En Route", "Arrived", "Completed", "Cancelled" — a fixed set for mock data purposes.
