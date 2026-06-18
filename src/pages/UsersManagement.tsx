import { useSearchParams, useNavigate } from 'react-router';
import { PageHeader } from '@/components/shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/components/users/UsersTable';
import { UsersTableToolbar } from '@/components/users/UsersTableToolbar';
import { UsersPagination } from '@/components/users/UsersPagination';
import { useUsers } from '@/hooks/useUsers';
import type { UserRole, UsersQueryParams, UserStatus } from '@/types/users';

const UsersManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');
  const search = searchParams.get('search') ?? '';
  const role = searchParams.get('role') ?? '';
  const status = searchParams.get('status') ?? '';

  const queryParams: UsersQueryParams = {
    page,
    pageSize,
    search: search || undefined,
    role: (role as UserRole) || undefined,
    status: (status as UserStatus) || undefined,
  };

  const { data, isLoading, isError, refetch } = useUsers(queryParams);
  const isFiltered = !!(search || role || status);

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value); else next.delete('search');
      next.set('page', '1');
      return next;
    });
  };

  const handleRoleChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('role', value); else next.delete('role');
      next.set('page', '1');
      return next;
    });
  };

  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('status', value); else next.delete('status');
      next.set('page', '1');
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams({ page: '1' }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <section className="py-7 space-y-4">
      <PageHeader title="Users Management" subtitle="Manage and monitor all system users" />

      {isError && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load users. Please try again.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
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

      <UsersTable
        users={data?.data ?? []}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      {!isLoading && data && data.totalPages > 1 && (
        <UsersPagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          pageSize={data.pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default UsersManagement;
