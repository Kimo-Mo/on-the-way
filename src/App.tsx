import { Route, Routes } from 'react-router';
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
} from './pages';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/reports" element={<ReportsManagement />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/help-requests" element={<h1>Help Requests</h1>} />
        <Route path="/providers" element={<ProvidersManagement />} />
        <Route path="/providers/:id" element={<ProviderDetails />} />
        <Route path="/moderation" element={<ModerationPanel />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/analytics" element={<h1>Analytics</h1>} />
        <Route path="/settings" element={<h1>Settings</h1>} />
      </Route>
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;
