import { useSearchParams, useNavigate } from 'react-router';
import { PageHeader } from '@/components/shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  HelpRequestCard,
  HelpRequestCardSkeleton,
  HelpRequestsPagination,
  HelpRequestsToolbar,
} from '@/components/help-requests';
import { useHelpRequests } from '@/hooks/help-requests/useHelpRequests';
import type {
  HelpRequestsQueryParams,
  HelpRequestCategory,
  HelpRequestStatus,
} from '@/types/help-requests';

const HelpRequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = 10;
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const status = searchParams.get('status') ?? '';

  const queryParams: HelpRequestsQueryParams = {
    page,
    pageSize,
    search: search || undefined,
    category: (category as HelpRequestCategory) || undefined,
    status: (status as HelpRequestStatus) || undefined,
  };

  const { data, isLoading, isError, refetch } = useHelpRequests(queryParams);
  const isFiltered = !!(search || category || status);

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      next.set('page', '1');
      return next;
    });
  };

  const handleCategoryChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('category', value);
      else next.delete('category');
      next.set('page', '1');
      return next;
    });
  };

  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('status', value);
      else next.delete('status');
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

  const handleViewDetails = (id: string) => {
    navigate(`/help-requests/${id}`);
  };

  return (
    <section className="py-7 space-y-4">
      <PageHeader title="Help Requests" subtitle="View and manage incoming assistance requests" />

      {isError && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load help requests.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <HelpRequestsToolbar
        search={search}
        category={category}
        status={status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <HelpRequestCardSkeleton key={i} />)
        ) : data?.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg">
            <span>No help requests found</span>
            {isFiltered && <span className="text-sm">Try clearing your filters</span>}
          </div>
        ) : (
          data?.data.map((req) => (
            <HelpRequestCard key={req.id} request={req} onViewDetails={handleViewDetails} />
          ))
        )}
      </div>

      {!isLoading && data && data.totalPages >= 1 && (
        <HelpRequestsPagination
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

export default HelpRequestsPage;
