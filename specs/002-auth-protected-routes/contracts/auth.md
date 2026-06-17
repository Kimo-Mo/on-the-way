# UI/API Contract: Authentication

## Login Endpoint

**POST** `/api/auth/login`

### Request Body
```json
{
  "email": "admin@ontheway.app",
  "password": "securepassword123"
}
```

### Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-001",
    "email": "admin@ontheway.app",
    "name": "Super Admin",
    "role": "ADMIN",
    "status": "ACTIVE"
  },
  "expiresIn": 28800
}
```

### Response (401 Unauthorized)
```json
{
  "message": "Invalid credentials"
}
```

## Internal UI Contracts

### `useAuth` Hook
Provides access to authentication state and actions.

```typescript
interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}
```

### `ProtectedRoute` Component
Wraps routes that require authentication.

```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // If not authenticated, redirect to /login
}
```
