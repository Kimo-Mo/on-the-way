import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from './components/layouts';
import {
  Dashboard,
  UsersManagement,
  UserDetails,
  ReportsManagement,
  ReportDetails,
  NotificationsPage,
  AnalyticsPage,
  SettingsPage,
  HelpRequestsPage,
  HelpRequestDetailsPage,
  ForgotPassword,
  ResetPassword,
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
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
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
