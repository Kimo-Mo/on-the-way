import { Route, Routes } from 'react-router';
import MainLayout from './components/layouts';
import { Dashboard, UsersManagement } from './pages';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/reports" element={<h1>Reports</h1>} />
        <Route path="/help-requests" element={<h1>Help Requests</h1>} />
        <Route path="/service-providers" element={<h1>Service Providers</h1>} />
        <Route path="/moderation" element={<h1>Moderation</h1>} />
        <Route path="/notification" element={<h1>Notification</h1>} />
        <Route path="/analytics" element={<h1>Analytics</h1>} />
        <Route path="/Settings" element={<h1>Settings</h1>} />
      </Route>
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;
