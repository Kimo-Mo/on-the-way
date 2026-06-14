import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import { useState } from 'react';
import Header from './Header';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen flex">
      <aside>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>
      <main className={`flex-1 ${collapsed ? 'lg:ms-20!' : 'lg:ms-65!'}`}>
        <Header />
        <div className="main-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
