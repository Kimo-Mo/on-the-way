import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminNotification, NotificationStatus } from '@/types/notifications';
import { NotificationsListToolbar } from './NotificationsListToolbar';
import { NotificationRow } from './NotificationRow';
import { CreateNotificationForm } from './CreateNotificationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NotificationPagination } from './NotificationPagination';

type FilterOption = NotificationStatus | 'All';

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
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    if (activeFilter === 'All') return data;
    return data.filter((n) => n.status === activeFilter);
  }, [data, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

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
      <NotificationsListToolbar
        activeFilter={activeFilter}
        onFilterChange={(filter) => {
          setActiveFilter(filter);
          setPage(1);
        }}
        onCreateNew={() => setShowCreateForm(true)}
      />
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl p-0 border-0 bg-transparent shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>New Notification</DialogTitle>
          </DialogHeader>
          <CreateNotificationForm onClose={() => setShowCreateForm(false)} />
        </DialogContent>
      </Dialog>
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No notifications found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedData.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
          <NotificationPagination
            page={page}
            totalPages={totalPages}
            total={filteredData.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
