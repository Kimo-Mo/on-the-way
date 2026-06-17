# UI Contracts: Core Layout

## Sidebar Interface
- **Props**: None (Phase 1 items are hardcoded).
- **Behavior**: Must render a list of `NavItem` entities. Must be responsive (Desktop fixed, Mobile Sheet).

## Header Interface
- **Props**: None.
- **Components**:
  - `SearchInput`: A search bar (UI only).
  - `NotificationsPanel`: Triggers a dropdown/popover showing `Notification` entities.
  - `ProfileMenu`: Triggers a dropdown with "Profile", "Settings", "Logout".

## Global Axios Contract
- **Base URL**: Set from `VITE_API_BASE_URL`.
- **Headers**: Standard `Content-Type: application/json`.
- **Interceptors**:
  - Request: No-op for now (Phase 2 adds Auth).
  - Response: Catch all non-2xx errors. If network error or 5xx, trigger global Toast.
