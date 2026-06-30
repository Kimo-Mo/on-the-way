import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import { useState } from 'react';
import Header from './Header';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="main-container flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
