import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import type { Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useState } from 'react';

interface NotificationsPanelProps {
  isLoading: boolean;
  notifications: Notification[];
}

const NotificationsPanel = ({ isLoading, notifications }: NotificationsPanelProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute top-2 inset-e-2 flex size-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        <div className="max-h-75 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3" data-testid="notification-skeleton">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 hover:bg-muted transition-colors ${!n.isRead ? 'bg-muted/50' : ''}`}>
                  <h4 className="font-medium text-sm">{n.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    {n.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
        <div className="border-t text-center">
          <Link to="/notifications" onClick={() => setOpen(!open)}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary w-full text-xs">
              View all
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
