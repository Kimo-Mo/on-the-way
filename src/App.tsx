import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from './components/layouts';
import {
  Dashboard,
  UsersManagement,
  UserDetails,
  ReportsManagement,
  ReportDetails,
  ProvidersManagement,
  ProviderDetails,
  ModerationPanel,
  NotificationsPage,
  AnalyticsPage,
  SettingsPage,
  HelpRequestsPage,
  HelpRequestDetailsPage,
} from './pages';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { NotFound } from './components/shared';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/users', element: <UsersManagement /> },
      { path: '/users/:id', element: <UserDetails /> },
      { path: '/reports', element: <ReportsManagement /> },
      { path: '/reports/:id', element: <ReportDetails /> },
      { path: '/help-requests', element: <HelpRequestsPage /> },
      { path: '/help-requests/:id', element: <HelpRequestDetailsPage /> },
      { path: '/providers', element: <ProvidersManagement /> },
      { path: '/providers/:id', element: <ProviderDetails /> },
      { path: '/moderation', element: <ModerationPanel /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
