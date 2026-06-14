import { useState } from 'react';
import { Activity, CircleUserRound, LifeBuoy, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui';

const accountLinks = [
  {
    icon: CircleUserRound,
    label: 'Profile',
  },
  {
    icon: Settings,
    label: 'Account Settings',
  },
  {
    icon: Activity,
    label: 'Activity Log',
  },
  {
    icon: LifeBuoy,
    label: 'Help / Support',
  },
];

const AdminUserMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="default"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="bg-primary shadow-md shadow-primary/25 rounded-full text-primary-foreground size-8 flex items-center justify-center cursor-pointer font-semibold">
        A
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute inset-e-0 top-11 z-50 w-64 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
          <div className="flex items-center gap-3 p-4">
            <div className="bg-primary shadow-md shadow-primary/25 rounded-full text-primary-foreground size-12 flex items-center justify-center text-lg font-semibold">
              A
            </div>
            <div className="min-w-0">
              <p className="font-semibold leading-5 text-foreground">Admin User</p>
              <p className="text-sm leading-5 text-muted-foreground">Admin</p>
            </div>
          </div>

          <div className="border-t border-border">
            {accountLinks.map((item) => (
              <button
                type="button"
                role="menuitem"
                key={item.label}
                className="flex w-full items-center gap-3 px-4 py-3 text-start text-[15px] transition-colors hover:bg-muted text-foreground cursor-pointer">
                <item.icon
                  className="size-5 text-foreground hover:text-foreground"
                  strokeWidth={1.8}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-border">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-3 px-4 py-3 text-start text-[15px] text-destructive transition-colors hover:bg-destructive/5 cursor-pointer">
              <LogOut className="size-5" strokeWidth={1.8} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserMenu;
