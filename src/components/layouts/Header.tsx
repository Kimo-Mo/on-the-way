import { useState } from 'react';
import { ModeToggle, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui';
import SidebarContent from './SidebarContent';
import ProfileMenu from './ProfileMenu';
import NotificationsPanel from './NotificationsPanel';
import { Menu } from 'lucide-react';
import { useGetHeaderNotifications } from '@/hooks/useGetHeaderNotifications';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: headerNotifications = [], isLoading: notificationsLoading } = useGetHeaderNotifications();

  return (
    <header className="min-h-16 border-b border-border flex items-center">
      <div className="main-container py-3 flex items-center justify-between lg:justify-end">
        {/* logo & mobile drawer */}
        <div className="flex items-center gap-3 lg:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Menu className="cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="left" aria-describedby={undefined}>
              <SheetHeader>
                <SheetTitle className="text-accent-foreground text-2xl capitalize font-extrabold">
                  on the way
                </SheetTitle>
              </SheetHeader>
              <SidebarContent collapsed={false} setMenuOpen={setMenuOpen} />
            </SheetContent>
          </Sheet>

          <h2 className="text-accent-foreground text-2xl capitalize font-extrabold">on the way</h2>
        </div>
        {/* notification icon & user menu */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <NotificationsPanel isLoading={notificationsLoading} notifications={headerNotifications} />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
