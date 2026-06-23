# Feature Specification: Service Providers

**Feature Branch**: `006-service-providers`  
**Created**: 2026-06-21  
**Status**: Draft  
**Input**: User description: "Phase 6: Service Providers (`/providers`) from PLAN.md"

## Clarifications

### Session 2026-06-21

- Q: When a provider is approved, should they become available to drivers immediately, require a separate activation step, or depend on document validity? -> A: Approved providers become visible/available to drivers immediately.
- Q: What reason input should Reject and Suspend actions require? -> A: Preset reason dropdown plus optional notes.
- Q: Should missing mandatory verification documents block provider approval? -> A: Approval is blocked until all mandatory verification documents are present.
- Q: Which verification documents are mandatory for approval? -> A: Business license, provider identity, and service eligibility proof are mandatory.

## User Scenarios *(mandatory)*

### User Story 1 - Browse and Filter Service Providers (Priority: P1)

An administrator opens the Service Providers page and sees a categorized, paginated list of businesses that provide roadside or emergency services to drivers. Each provider is displayed with its name, service type, rating, operational status, and verification status so the administrator can quickly understand which providers need review or action.

**Why this priority**: Provider visibility is the foundation of the module. Administrators must be able to find, compare, and monitor providers before reviewing details or changing status.

**Acceptance Scenarios**:

1. **Given** the admin is on the Service Providers page, **When** the page loads, **Then** a list or table of providers is displayed with provider name, service type, rating, status, and verification state visible for each provider.
2. **Given** the providers list is loaded, **When** the admin filters by service type, **Then** only providers in the selected category are shown.
3. **Given** the providers list is loaded, **When** the admin filters by status, **Then** only providers matching the selected status are shown.
4. **Given** the providers list contains more results than fit on one page, **When** the admin uses pagination controls, **Then** the next or previous set of providers is displayed.
5. **Given** no providers match the active search or filter combination, **When** the list would be empty, **Then** a meaningful empty-state message is displayed.

---

### User Story 2 - Review Provider Details (Priority: P1)

An administrator selects a provider to open the Provider Details page. The page shows the provider's business information, service category, contact details, address or operating area, current status, verification documents, customer rating summary, and recent customer reviews.

**Why this priority**: Administrators need the full provider context before approving, rejecting, or suspending a provider. Missing detail review would make status decisions unreliable.

**Acceptance Scenarios**:

1. **Given** the admin selects a provider from the list, **When** the details page loads, **Then** the provider's business name, type, status, rating, contact information, and operating area are displayed.
2. **Given** the provider has uploaded verification documents, **When** the details page renders, **Then** the documents are listed with names, document types, upload dates, and a way to view each document.
3. **Given** the provider has no uploaded verification documents, **When** the details page renders, **Then** a "No documents uploaded" state is shown.
4. **Given** the provider has customer reviews, **When** the details page renders, **Then** the rating summary and recent reviews are visible.
5. **Given** the provider details fail to load, **When** the error occurs, **Then** an error message is shown with a retry option.

---

### User Story 3 - Approve a Provider (Priority: P2)

An administrator reviews a pending provider, confirms the business license, provider identity document, and service eligibility proof are present, and determines the business is valid. They choose the approve action, confirm the decision in a modal, and the provider becomes approved and immediately available to drivers in the platform.

**Why this priority**: Approval is the primary workflow for onboarding trusted providers and making them available to drivers who need help.

**Acceptance Scenarios**:

1. **Given** a pending provider with a business license, provider identity document, and service eligibility proof present is open, **When** the admin chooses Approve, **Then** a confirmation modal summarizes the action before any status change occurs.
2. **Given** the approval modal is open, **When** the admin confirms, **Then** the provider status changes to Approved, the provider becomes available to drivers immediately, and the details page reflects the updated state.
3. **Given** the approval modal is open, **When** the admin cancels, **Then** the modal closes and no provider data changes.
4. **Given** the approval request fails, **When** the error occurs, **Then** the provider status remains unchanged and a visible error message is shown.
5. **Given** a pending provider is missing a business license, provider identity document, or service eligibility proof, **When** the admin attempts to approve the provider, **Then** approval is blocked and the missing document requirement is shown.

---

### User Story 4 - Reject a Provider (Priority: P2)

An administrator reviews a pending provider and determines that the provider should not be approved. They choose the reject action, select a preset rejection reason, optionally add notes, and the provider is marked as rejected.

**Why this priority**: Rejection protects drivers from unverified or unsuitable providers and gives the business a clear reason for the decision.

**Acceptance Scenarios**:

1. **Given** a pending provider is open, **When** the admin chooses Reject, **Then** a modal appears requiring a preset rejection reason before confirmation and allowing optional notes.
2. **Given** the rejection modal is open, **When** the admin confirms with a valid preset reason, **Then** the provider status changes to Rejected and the reason plus any notes are recorded.
3. **Given** the rejection modal is open, **When** the admin attempts to confirm without selecting a preset reason, **Then** validation feedback prevents submission.
4. **Given** the rejection request fails, **When** the error occurs, **Then** the provider status remains unchanged and a visible error message is shown.

---

### User Story 5 - Suspend an Active Provider (Priority: P2)

An administrator identifies an approved provider that should temporarily stop appearing as available due to policy, service quality, document, or safety concerns. They choose Suspend, select a preset suspension reason, optionally add notes, and the provider is marked as suspended.

**Why this priority**: Suspension gives administrators a controlled response for active providers that require investigation without deleting provider history.

**Acceptance Scenarios**:

1. **Given** an approved provider is open, **When** the admin chooses Suspend, **Then** a modal appears requiring a preset suspension reason before confirmation and allowing optional notes.
2. **Given** the suspension modal is open, **When** the admin confirms with a valid preset reason, **Then** the provider status changes to Suspended and the reason plus any notes are recorded.
3. **Given** the provider is already suspended, **When** the details page renders, **Then** the current suspended status and latest suspension reason are visible.
4. **Given** the suspension request fails, **When** the error occurs, **Then** the provider status remains unchanged and a visible error message is shown.

---

### User Story 6 - Inspect Customer Reviews (Priority: P3)

An administrator reviews customer feedback for a provider to understand service quality and decide whether further action is needed. The administrator can scan recent reviews and rating distribution from the Provider Details page.

**Why this priority**: Reviews support informed decisions, but the core provider management workflow can still function with business data, documents, and status actions.

**Acceptance Scenarios**:

1. **Given** a provider has customer reviews, **When** the details page loads, **Then** recent reviews show reviewer name or anonymized label, rating, date, and review text.
2. **Given** a provider has no reviews, **When** the details page loads, **Then** a "No reviews yet" state is shown.
3. **Given** review data is unavailable, **When** the details page loads, **Then** the business and document sections remain usable and the review section shows an appropriate unavailable state.

---

### Edge Cases

- What happens when a provider has missing optional business information? The details page shows available information and clearly marks missing optional fields without blocking status actions.
- What happens when a verification document cannot be previewed? The document remains listed and the admin sees a clear unavailable or retry message for that document.
- What happens when a pending provider is missing a business license, provider identity document, or service eligibility proof? Approval is blocked and the missing required documents are identified.
- What happens when a provider has no rating yet? The list and details page show an unrated state instead of a numeric score.
- What happens if a provider is updated by another administrator while the current admin is reviewing it? The admin sees a conflict or refreshed status message before taking a conflicting action.
- What happens when an admin attempts an invalid status transition, such as approving an already suspended provider? The action is hidden, disabled, or blocked with a clear explanation.
- What loading, empty, validation, authorization, and remote service failure states must be visible to admins?
  - **Loading**: Skeleton rows or sections appear while provider list, details, documents, and reviews are loading.
  - **Empty**: Helpful empty states appear for no providers, no filtered results, no documents, and no reviews.
  - **Validation**: Reject and Suspend modals require a preset reason before submission and allow optional notes.
  - **Authorization**: Restricted actions are disabled or hidden for admins without permission.
  - **Remote failure**: Visible error messages with retry options appear where recovery is possible.
- What responsive or accessibility constraints could block task completion? Provider tables, document lists, modals, and status actions must remain usable with keyboard navigation and at tablet-sized admin workspaces without overlapping content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a paginated list of service providers on the `/providers` route.
- **FR-002**: Each provider row or card MUST show provider name, service type, rating state, provider status, and verification state.
- **FR-003**: System MUST allow administrators to filter providers by service type, including at minimum Towing, Medical, Fuel, and other supported service categories.
- **FR-004**: System MUST allow administrators to filter providers by status, including Pending, Approved, Rejected, and Suspended.
- **FR-005**: System MUST allow administrators to search providers by business name or relevant contact/location text.
- **FR-006**: System MUST provide a dedicated Provider Details page at `/providers/:id`.
- **FR-007**: Provider Details MUST show business information, service type, contact information, operating area or address, current status, rating state, and verification state.
- **FR-008**: Provider Details MUST show uploaded verification documents with document type, document name, upload date, and document availability.
- **FR-009**: Provider Details MUST show customer rating summary and recent customer reviews when available.
- **FR-010**: System MUST allow administrators to approve a pending provider only when the business license, provider identity document, and service eligibility proof are present and after a confirmation modal is accepted; once approved, the provider MUST become visible and available to drivers immediately.
- **FR-011**: System MUST allow administrators to reject a pending provider only after a preset rejection reason is selected, with optional notes allowed.
- **FR-012**: System MUST allow administrators to suspend an approved provider only after a preset suspension reason is selected, with optional notes allowed.
- **FR-013**: Status action modals MUST support canceling without changing provider state.
- **FR-014**: System MUST display immediate success or failure feedback after every approve, reject, or suspend action.
- **FR-015**: System MUST prevent or clearly block status actions that are not valid for the provider's current state or document readiness.
- **FR-016**: System MUST display loading, empty, unavailable, and error states for provider list, provider details, verification documents, and reviews.
- **FR-017**: System MUST keep the provider list and details page consistent after a status change, so the updated state is visible without requiring the admin to manually find the provider again.

### Key Entities

- **Provider**: A business or individual service operator available to drivers. Key attributes: unique ID, business name, service type, rating state, provider status, verification status, contact information, and operating area.
- **Service Type**: The category of help offered by a provider, such as Towing, Medical, Fuel, or another supported roadside service category.
- **Provider Status**: The administrative lifecycle state of a provider, including Pending, Approved, Rejected, and Suspended. Approved means the provider is immediately visible and available to drivers.
- **Verification Document**: A document uploaded by a provider to prove identity, licensing, business eligibility, or service legitimacy. Key attributes: document type, document name, upload date, availability, and whether it is mandatory for approval. Business license, provider identity document, and service eligibility proof are mandatory approval documents.
- **Customer Review**: Feedback from a driver about a provider. Key attributes: rating, review text, review date, and reviewer display identity or anonymized label.
- **Status Decision**: An administrator action that changes provider state. Key attributes: action type, preset decision reason when required, optional notes, decision date, and acting administrator reference.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can locate a provider by name, service type, or status within 10 seconds when the provider exists in the current data set.
- **SC-002**: Provider list search and filter changes display updated results within 2 seconds under normal network conditions.
- **SC-003**: Administrators can open a provider details page from the list and see business information, status, documents, and reviews within 5 seconds under normal network conditions.
- **SC-004**: 100% of approve, reject, and suspend actions provide visible success or error feedback within 3 seconds of confirmation.
- **SC-005**: 100% of rejection and suspension attempts without a preset reason are blocked with visible validation feedback, while optional notes never block submission.
- **SC-006**: 100% of approval attempts for providers missing a business license, provider identity document, or service eligibility proof are blocked with visible feedback identifying what is missing.
- **SC-007**: Administrators can complete the full provider review workflow (open list, review details, inspect documents, take a status action) without blank states, overlapping content, or undefined values.
- **SC-008**: All provider status actions and modal controls are operable using keyboard navigation alone.
- **SC-009**: The provider list and details views render correctly on screen widths from 768px upwards without horizontal scrolling across the full page.

## Assumptions

- Administrators are already authenticated; this feature does not introduce new sign-in or permission models.
- Service provider categories are provided by the platform and include at minimum Towing, Medical, and Fuel.
- Provider creation and provider self-service onboarding are outside the scope of this phase; this phase focuses on admin review and management.
- Deleting providers is outside the scope of this phase; suspension is the administrative action for temporarily removing an approved provider from active availability.
- Rejection and suspension use preset reason lists for consistent reporting and allow optional notes for additional context.
- Verification documents are already uploaded by providers before they appear in this admin workflow; business license, provider identity document, and service eligibility proof must be present before approval is allowed.
- Customer reviews are read-only in this phase; review moderation, removal, or replies are handled by another moderation workflow.
- Responsive polish below 768px is deferred to the final review phase unless it blocks core admin task completion.
