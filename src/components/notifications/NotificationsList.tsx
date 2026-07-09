import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminNotification } from '@/types/notifications';
import { NotificationRow } from './NotificationRow';

interface NotificationsListProps {
  data: AdminNotification[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function NotificationsList({
  data,
  isLoading,
  isError,
  refetch,
  onDelete,
  isDeleting,
}: NotificationsListProps) {

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-destructive text-sm">Failed to load notifications.</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No notifications found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
