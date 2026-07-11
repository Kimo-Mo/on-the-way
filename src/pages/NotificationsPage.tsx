import { useState } from 'react';
import { useGetNotifications, useDeleteNotification } from '@/hooks/notifications/useNotifications';
import { NotificationsList, NotificationsListToolbar } from '@/components/notifications';
import { PageHeader } from '@/components/shared';
import { useClientPagination } from '@/hooks/useClientPagination';
import { ClientPagination } from '@/components/ui';

export function NotificationsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data = [], isLoading, isError, refetch } = useGetNotifications({
    search: search || undefined,
    category: category || undefined,
  });
  const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();

  const { paginatedData, currentPage, totalPages, goToPage } = useClientPagination(
    data,
    10,
    [search, category]
  );

  return (
    <div className="py-7 space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Manage and broadcast communications to app users"
      />

      <NotificationsListToolbar
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
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
      {!isLoading && !isError && data.length > 0 && (
        <ClientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
