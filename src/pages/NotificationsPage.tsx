import { useSearchParams } from 'react-router';
import { useMemo, useState } from 'react';
import { useGetNotifications, useDeleteNotification } from '@/hooks/notifications/useNotifications';
import { NotificationsList, NotificationsListToolbar } from '@/components/notifications';
import { PageHeader } from '@/components/shared';
import { useClientPagination } from '@/hooks/useClientPagination';
import { ClientPagination } from '@/components/ui';
import type { NotificationStatus } from '@/types/notifications';

type FilterOption = NotificationStatus | 'All';

export function NotificationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data = [], isLoading, isError, refetch } = useGetNotifications();
  const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();

  const activeFilter = (searchParams.get('status') as FilterOption) || 'All';

  const filteredData = useMemo(() => {
    if (activeFilter === 'All') return data;
    return data.filter((n) => n.status === activeFilter);
  }, [data, activeFilter]);

  const { paginatedData, currentPage, totalPages, goToPage } = useClientPagination(
    filteredData,
    10,
    [activeFilter]
  );

  const handleFilterChange = (filter: FilterOption) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (filter !== 'All') next.set('status', filter);
      else next.delete('status');
      return next;
    });
  };

  return (
    <div className="py-7 space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Manage and broadcast communications to app users"
      />

      <NotificationsListToolbar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        showCreateForm={showCreateForm}
        setShowCreateForm={setShowCreateForm}
        onCreateNew={() => setShowCreateForm(true)}
      />
      <NotificationsList
        data={paginatedData}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        onDelete={deleteNotification}
        isDeleting={isDeleting}
      />
      {!isLoading && !isError && filteredData.length > 0 && (
        <ClientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
