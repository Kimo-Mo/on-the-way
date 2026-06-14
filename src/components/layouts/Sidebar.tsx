import { ChevronLeft, Road } from 'lucide-react';
import SidebarContent from './SidebarContent';
import { Button } from '../ui';
import type { Dispatch, SetStateAction } from 'react';

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={`hidden lg:flex bg-card border-e border-border fixed inset-0 z-10 flex-col overflow-y-auto overflow-x-hidden ${collapsed ? 'w-20' : 'w-65'}`}>
      {/* header */}
      <div className="p-3 border-b border-border min-h-16 flex items-center justify-between">
        {collapsed ? (
          <Road className="text-accent-foreground" size={30} />
        ) : (
          <h2 className="text-accent-foreground text-3xl capitalize font-extrabold">on the way</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="w-7.5 h-7.5"
          onClick={() => setCollapsed(!collapsed)}>
          <ChevronLeft className={collapsed ? 'rotate-180' : ''} />
        </Button>
      </div>
      <SidebarContent collapsed={collapsed} />
    </div>
  );
};

export default Sidebar;
