import {
  Building2,
  ChartColumn,
  Info,
  LayoutDashboard,
  Megaphone,
  Settings,
  Shield,
  TriangleAlert,
  Users,
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { Link, useLocation } from 'react-router';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/',
  },
  {
    icon: Users,
    label: 'Users',
    path: '/users',
  },
  {
    icon: TriangleAlert,
    label: 'Reports',
    path: '/reports',
  },
  {
    icon: Info,
    label: 'Help Requests',
    path: '/help-requests',
  },
  {
    icon: Building2,
    label: 'Service Providers',
    path: '/providers',
  },
  {
    icon: Shield,
    label: 'Moderation',
    path: '/moderation',
  },
  {
    icon: Megaphone,
    label: 'Notifications',
    path: '/notifications',
  },
  {
    icon: ChartColumn,
    label: 'Analytics',
    path: '/analytics',
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
  },
];
const SidebarContent = ({
  collapsed,
  setMenuOpen,
}: {
  collapsed: boolean;
  setMenuOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { pathname } = useLocation();
  return (
    <div className={`flex flex-col gap-1 p-3 ${collapsed ? 'w-fit' : ''}`}>
      {menuItems.map((item) => (
        <Link
          to={item.path}
          key={item.path}
          onClick={() => setMenuOpen && setMenuOpen(false)}
          className={`flex items-center transition-all duration-150 py-2 px-3 rounded-xl ${!collapsed && 'gap-3'} ${pathname === item.path ? 'bg-primary/10 text-primary border-s-4 border-primary' : 'hover:text-primary hover:bg-primary/10'}`}>
          <item.icon />
          <span className={`capitalize ${collapsed && 'hidden'}`}>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default SidebarContent;
