# Quickstart: Authentication & Protected Routes

## Setup

1. **Add Route Protection**: Wrap your dashboard routes in `App.tsx` with the `ProtectedRoute` component.
2. **Access Auth State**: Use the `useAuth` hook to check if a user is logged in or to trigger a logout.
3. **API Integration**: The Axios instance in `src/lib/axios.ts` automatically handles token injection. Simply call your API as usual.

## Examples

### Checking Authentication in a Component
```tsx
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Manually Protecting a Route
```tsx
<Route path="/secret" element={
  <ProtectedRoute>
    <SecretPage />
  </ProtectedRoute>
} />
```
