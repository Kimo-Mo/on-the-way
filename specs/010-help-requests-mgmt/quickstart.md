# Implementation Quickstart: Help Requests Management

## Setup & Scaffolding

1. **Routes & Navigation**
   - Add `/help-requests` route in the main application router.
   - Add `/help-requests/:id` nested route for the detail view.
   - Ensure the Sidebar navigation includes a link to "Help Requests" (icon: `LifeBuoy` or similar from Lucide React).

2. **Mock Service Layer**
   - Create `src/lib/helpRequests-fixtures.ts` to host mock data arrays and the simulated delay Axios functions.
   - Define the TypeScript interfaces mapped in `data-model.md` here.

3. **React Query Hooks**
   - Create `src/hooks/help-requests/useHelpRequests.ts` to wrap the mock service layer functions.
   - Implement `useGetHelpRequests`, `useGetHelpRequestDetails`, `useUpdateHelpRequestStatus`, and `useReassignHelpRequestProvider`.
   - Ensure mutation hooks invalidate the relevant queries on success so the UI updates automatically.

4. **List View Implementation (`/help-requests`)**
   - Create the main `HelpRequestsPage` component.
   - Implement the URL-based state using `useSearchParams` for Category, Status, Search, Page, and Page Size.
   - Build the toolbar with Shadcn `Input` (search) and `Select` (filters).
   - Build the card layout: map over data to render individual `HelpRequestCard` components.
   - Build the `PaginationFooter` component linking to the URL state.

5. **Detail View Implementation (`/help-requests/:id`)**
   - Create `HelpRequestDetailsPage` component.
   - Extract sections into smaller components: `RequestDescription`, `UserInfoCard`, `ProviderCard`, `LocationMap`, `RequestTimeline`, and `ActionPanel`.
   - Integrate `react-leaflet` in `LocationMap`.
   - Implement the Modals/Dialogs for "Contact User", "Reassign Provider", and confirmation dialogs for Status Updates inside or triggered by the `ActionPanel`.
