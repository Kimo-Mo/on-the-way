# Project: On The Way - Admin Dashboard
## 1. Project Overview
A comprehensive web-based dashboard for managing the "On The Way" mobile application. The app assists drivers by identifying road obstacles (fog, potholes, radars, etc.) and provides access to emergency services (towing, medical, etc.). The dashboard allows administrators to manage users, reports, service providers, moderation, Notification, and view platform analytics.

## 2. Tech Stack & AI Conventions
**Primary Stack:**
- React.js (Vite)
- TypeScript (Strict mode enabled)
- Tailwind CSS
- Shadcn UI & Radix UI (For accessible components)
- React Router DOM (v7)
- React Query (@tanstack/react-query) & Axios (Data fetching & state)
- Zustand (For global client state if needed, e.g., UI toggles)
- React Hook Form + Zod (Form validation)
- Recharts (For analytics dashboards)
- Lucide React (Icons)

**AI Coding Conventions:**
1. **Component Structure:** Use functional components with hooks. Prefer small, reusable components.
2. **Styling:** Strictly use Tailwind CSS utility classes. Avoid custom CSS unless absolutely necessary.
3. **Data Fetching:** Do not use `useEffect` for data fetching. ALWAYS use React Query custom hooks (e.g., `useGetUsers`, `useUpdateReport`).
4. **Types:** Define explicit TypeScript interfaces/types for all API responses and component props.
5. **UI Components:** Default to Shadcn UI components. When prompted to create a button, table, or modal, initialize the Shadcn component structure.

---

## 3. Execution Phases

### Phase 1: Architecture Setup & Core Layout (Completed/In Progress)
- [x] Initialize React + TypeScript + Tailwind project.
- [x] Setup Shadcn UI and add base styling.
- [x] Build core layout (Sidebar, Header).
- [ ] Create Global `Axios` instance with base URL and interceptors (Request/Response).
- [x] Setup `QueryClientProvider` for React Query.
- [ ] Implement Top Header Dropdowns (Notifications Panel, Profile Menu).

### Phase 2: Authentication & Protected Routes (`/login`)
- [ ] Create authentication state management (using `Zustand` or React Context) to manage user session and tokens.
- [ ] Build `Login` page layout using Shadcn UI forms.
- [ ] Implement `useLogin` React Query mutation to handle API authentication and error mapping.
- [ ] Create a `ProtectedRoute` (or `RequireAuth`) wrapper component to restrict access to authenticated admins only.
- [ ] Configure Axios interceptors to automatically attach the `Authorization: Bearer <token>` to all outgoing requests and handle 401 Unauthorized responses (e.g., token refresh or forced logout).

### Phase 3: Dashboard Overview (`/`)
- [ ] Create `useGetDashboardStats` React Query hook to fetch aggregated data for the home page.
- [ ] Build `StatsCards` grid (Total Users, Total Reports, Active Help Requests, etc.) with percentage trend indicators.
- [ ] Implement `InteractiveMap` widget displaying real-time pins for urgent reports, help requests, and providers (using a library like `react-leaflet` or `google-map-react`).
- [ ] Build `RecentActivity` feed component showcasing a chronological list of system events.
- [ ] Integrate `recharts` to build the "Reports Over Time" line chart and "Help Requests by Category" bar chart.

### Phase 4: Users Management (`/users`)
- [ ] Define TypeScript interfaces for User (id, name, email, role, status, trustScore).
- [ ] Create `useGetUsers` React Query hook with pagination and filtering params.
- [ ] Build `UsersTableToolbar` (Search input, Role/Status filters).
- [ ] Build `UsersTable` using Shadcn Table components.
- [ ] Build Pagination footer.
- [ ] Build `UserDetails` page (`/users/:id`) to display full profile and activity history.

### Phase 5: Reports & Obstacles Management (`/reports`)
- [ ] Define TypeScript interfaces for Reports (id, location, coordinates, type, status, upvotes, downvotes).
- [ ] Create `useGetReports` React Query hook.
- [ ] Build `ReportsList` view with standard layout (Toolbar + Table/List).
- [ ] Build `ReportDetails` page (`/reports/:id`) showing:
    - Report description and attached images.
    - Map View (integrating basic map component displaying coordinates).
    - Quick action buttons (Approve, Mark as Urgent, Remove).

### Phase 6: Service Providers (`/providers`)
- [ ] Define TypeScript interfaces for Providers (id, name, type, rating, status).
- [ ] Create `useGetProviders` and `useUpdateProviderStatus` hooks.
- [ ] Build `ProvidersTable` (categorized by Towing, Medical, Fuel, etc.).
- [ ] Build `ProviderDetails` page (`/providers/:id`) showcasing business info, uploaded verification documents, and customer reviews.
- [ ] Implement Approve/Reject/Suspend action modals.

### Phase 7: Moderation Panel (`/moderation`)
- [ ] Create hooks for fetching flagged content (`useGetFlaggedReports`, `useGetSuspiciousUsers`).
- [ ] Build `ModerationDashboard` layout with split sections (Flagged Reports vs. Suspicious Users).
- [ ] Implement quick-action cards for moderation (Warn, Suspend, Remove).

### Phase 8: Notification & Communications (`/notification`)
- [ ] Create standard CRUD hooks for Notification.
- [ ] Build Notification list displaying status (Published, Draft, Scheduled).
- [ ] Build `CreateNotification` form utilizing `react-hook-form` and `zod` for validation.

### Phase 9: Analytics & Settings (`/analytics`, `/settings`)
- [ ] Integrate `recharts` for visual data.
- [ ] Build `Analytics` page with Reports Trends (Area Chart), Requests by Type (Bar Chart), and User Growth (Line Chart).
- [ ] Build `Settings` page with sections (Profile Settings, Notification Preferences, System Settings). Implement forms with save functionality.

### Phase 10: Final Review & Integration
- [ ] Connect all mock React Query hooks to the live .NET backend endpoints.
- [ ] Comprehensive testing for loading states, error boundaries, and empty states.
- [ ] Polish responsive design for smaller screens (if required).