# Research: Authentication & Protected Routes

## Decision: Zustand for Auth State Management
**Decision**: Use Zustand with `persist` middleware to manage authentication state (user, token, isAuthenticated).
**Rationale**: Zustand provides a lightweight, performant way to manage global state without the boilerplate of Redux or the context-re-render issues of React Context. The `persist` middleware handles synchronization with `localStorage` automatically, ensuring the 8-hour session requirement can be monitored easily.
**Alternatives considered**: 
- **React Context**: Rejected because it often leads to unnecessary re-renders of the entire component tree when auth state changes.
- **Redux Toolkit**: Rejected as overkill for simple session management.

## Decision: Axios Interceptor for 401 Handling
**Decision**: Enhance the existing `src/lib/axios.ts` response interceptor to specifically catch 401 Unauthorized errors.
**Rationale**: Centralizing 401 handling ensures that any expired session or revoked token triggers a consistent logout flow (clearing state and redirecting to `/login`) regardless of where the request originated.
**Alternatives considered**: 
- **Manual 401 checking in hooks**: Rejected as it would duplicate logic across every React Query hook.

## Decision: React Router 7 Protected Route Wrapper
**Decision**: Implement a `ProtectedRoute` component that checks the Zustand auth state and uses the `<Navigate />` component from `react-router` for redirection.
**Rationale**: This is the standard pattern in React Router 7 (v7) for declaratively guarding routes. It allows wrapping the entire dashboard layout or individual routes easily in `App.tsx`.
**Alternatives considered**: 
- **Loader-based protection**: While v7 supports loaders, a component-based approach is more flexible for the current `App.tsx` structure and works better with client-side state like Zustand.

## Decision: Shadcn UI for Login Form
**Decision**: Use `react-hook-form` + `zod` + Shadcn UI components (`Form`, `Input`, `Button`) for the login page.
**Rationale**: Aligns with the project's Constitution and existing UI patterns. Provides robust validation and accessible components.
