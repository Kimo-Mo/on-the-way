import { Route, Routes } from 'react-router';
import MainLayout from './components/layouts';
import { Dashboard, UsersManagement } from './pages';
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
        <Route path="/reports" element={<h1>Reports</h1>} />
        <Route path="/help-requests" element={<h1>Help Requests</h1>} />
        <Route path="/service-providers" element={<h1>Service Providers</h1>} />
        <Route path="/moderation" element={<h1>Moderation</h1>} />
        <Route path="/notifications" element={<h1>Notifications</h1>} />
        <Route path="/analytics" element={<h1>Analytics</h1>} />
        <Route path="/settings" element={<h1>Settings</h1>} />
      </Route>
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;
