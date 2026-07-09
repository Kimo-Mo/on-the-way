import { useSearchParams, useNavigate } from 'react-router';
import { PageHeader, PageError, PageEmpty, TableSkeleton } from '@/components/shared';
import { UsersTable, UsersTableToolbar } from '@/components/users';
import { ClientPagination } from '@/components/ui';
import { useClientPagination } from '@/hooks/useClientPagination';
import { useUsers } from '@/hooks/users/useUsers';
import type { UserRole, UsersQueryParams, UserStatus } from '@/types/users';
import { Users } from 'lucide-react';

const UsersManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get('search') ?? '';
  const role = searchParams.get('role') ?? '';
  const status = searchParams.get('status') ?? '';

  const queryParams: UsersQueryParams = {
    page: 1,
    pageSize: 10,
    search: search || undefined,
    role: (role as UserRole) || undefined,
    status: (status as UserStatus) || undefined,
  };

  const { data, isLoading, isError, refetch } = useUsers(queryParams);

  const { paginatedData, currentPage, totalPages, goToPage } = useClientPagination(
    data?.data ?? [],
    10,
    [search, role, status]
  );
  const isFiltered = !!(search || role || status);

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      return next;
    });
  };

  const handleRoleChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('role', value);
      else next.delete('role');
      return next;
    });
  };

  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('status', value);
      else next.delete('status');
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <section className="py-7 space-y-4">
      <PageHeader title="Users Management" subtitle="Manage and monitor all system users" />

      {isError && (
        <PageError message="Failed to load users. Please try again." onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && (data?.data ?? []).length === 0 && (
        <PageEmpty
          title="No users found"
          description={isFiltered ? 'Try clearing your filters' : undefined}
          icon={Users}
        />
      )}

      <UsersTableToolbar
        search={search}
        role={role}
        status={status}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      {isLoading && <TableSkeleton columns={6} />}

      {!isLoading && !isError && (data?.data ?? []).length > 0 && (
        <>
          <UsersTable users={paginatedData} onViewDetails={handleViewDetails} />

          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </section>
  );
};

export default UsersManagement;
