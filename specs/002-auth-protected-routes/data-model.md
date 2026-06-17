# Data Model: Authentication & Protected Routes

## Entities

### AdminUser
Represents the authenticated administrative user.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the admin |
| email | string | Primary email used for login |
| name | string | Full name of the administrator |
| role | enum | User role (default: "ADMIN") |
| status | enum | Account status (e.g., "ACTIVE", "SUSPENDED") |

### AuthSession
Represents the active security session.

| Field | Type | Description |
|-------|------|-------------|
| token | string | Bearer JWT or session identifier |
| expiresAt | number | ISO timestamp or Unix epoch for session expiration (8 hours from login) |
| user | AdminUser | The user associated with this session |

## State Transitions

- **Unauthenticated**: Initial state; only `/login` is accessible.
- **Authenticating**: Login form submitted; awaiting API response.
- **Authenticated**: Valid token received; user redirected to dashboard; token stored in `localStorage`.
- **Expired/Revoked**: Session exceeds 8 hours or 401 response received; user redirected to `/login`; token cleared.
