import { useGetNotifications, useDeleteNotification } from '@/hooks/notifications/useNotifications';
import { NotificationsList } from '@/components/notifications';
import { PageHeader } from '@/components/shared';

export function NotificationsPage() {
  const { data = [], isLoading, isError, refetch } = useGetNotifications();
  const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();

  return (
    <div className="py-7 space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Manage and broadcast communications to app users"
      />
      <NotificationsList
        data={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        onDelete={deleteNotification}
        isDeleting={isDeleting}
      />
    </div>
  );
}
