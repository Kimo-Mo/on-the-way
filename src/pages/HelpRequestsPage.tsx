import { useSearchParams, useNavigate } from 'react-router';
import { PageHeader, PageError, PageEmpty } from '@/components/shared';
import {
  HelpRequestCard,
  HelpRequestCardSkeleton,
  HelpRequestsToolbar,
} from '@/components/help-requests';
import { ClientPagination } from '@/components/ui';
import { useClientPagination } from '@/hooks/useClientPagination';
import { useHelpRequests } from '@/hooks/help-requests/useHelpRequests';
import type { HelpRequestsQueryParams } from '@/types/help-requests';
import { HelpCircle } from 'lucide-react';

const HelpRequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const status = searchParams.get('status') ?? '';
  const sortOrder = searchParams.get('sortOrder') ?? '';

  const queryParams: HelpRequestsQueryParams = {
    page: 1,
    pageSize: 10,
    search: search || undefined,
    type: category || undefined,
    sortOrder: sortOrder || undefined,
    status: status || undefined,
  };

  const { data, isLoading, isError, refetch } = useHelpRequests(queryParams);

  const { paginatedData, currentPage, totalPages, goToPage } = useClientPagination(
    data?.data ?? [],
    10,
    [search, category, status, sortOrder]
  );
  const isFiltered = !!(search || category || status);

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      return next;
    });
  };

  const handleCategoryChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('category', value);
      else next.delete('category');
      return next;
    });
  };

    const handleSortOrderChange = (value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('sortOrder', value);
        else next.delete('sortOrder');
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

  const handleViewDetails = (id: string) => {
    navigate(`/help-requests/${id}`);
  };

  return (
    <section className="py-7 space-y-4">
      <PageHeader title="Help Requests" subtitle="View and manage incoming assistance requests" />

      {isError && (
        <PageError message="Failed to load help requests." onRetry={() => refetch()} />
      )}

      <HelpRequestsToolbar
        search={search}
        category={category}
        status={status}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        onSortOrderChange={handleSortOrderChange}
        isFiltered={isFiltered}
      />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <HelpRequestCardSkeleton key={i} />)
        ) : (data?.data ?? []).length === 0 ? (
          <PageEmpty
            title="No help requests found"
            description={isFiltered ? 'Try clearing your filters' : undefined}
            icon={HelpCircle}
          />
        ) : (
          paginatedData.map((req) => (
            <HelpRequestCard key={req.id} request={req} onViewDetails={handleViewDetails} />
          ))
        )}
      </div>

      {!isLoading && !isError && (data?.data ?? []).length > 0 && (
        <ClientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </section>
  );
};

export default HelpRequestsPage;
