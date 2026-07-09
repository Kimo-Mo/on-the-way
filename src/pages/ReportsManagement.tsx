import { useSearchParams, useNavigate } from 'react-router';
import { PageHeader, PageError, PageEmpty } from '@/components/shared';
import {
  ReportCard,
  ReportCardSkeleton,
  ReportsToolbar,
} from '@/components/reports';
import { ClientPagination } from '@/components/ui';
import { useClientPagination } from '@/hooks/useClientPagination';
import { useReports } from '@/hooks/reports/useReports';
import type { ReportsQueryParams } from '@/types/reports';
import { FileWarning } from 'lucide-react';

const ReportsManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get('search') ?? '';
  const obstacleType = searchParams.get('obstacleType') ?? '';
  const sortOrder = searchParams.get('sortOrder') ?? '';

  const queryParams: ReportsQueryParams = {
    page: 1,
    pageSize: 10,
    search: search || undefined,
    type: obstacleType || undefined,
    sortOrder: sortOrder || undefined,
  };

  const { data, isLoading, isError, refetch } = useReports(queryParams);

  const { paginatedData, currentPage, totalPages, goToPage } = useClientPagination(
    data?.data ?? [],
    10,
    [search, obstacleType, sortOrder]
  );
  const isFiltered = !!(search || obstacleType);

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      return next;
    });
  };

  const handleObstacleTypeChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('obstacleType', value);
      else next.delete('obstacleType');
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

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleViewDetails = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  return (
    <section className="py-7 space-y-4">
      <PageHeader
        title="Reports Management"
        subtitle="Browse, filter, and moderate incident reports"
      />

      {isError && (
        <PageError message="Failed to load reports. Please try again." onRetry={() => refetch()} />
      )}

      <ReportsToolbar
        search={search}
        obstacleType={obstacleType}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onObstacleTypeChange={handleObstacleTypeChange}
        onSortOrderChange={handleSortOrderChange}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <ReportCardSkeleton key={i} />)
        ) : (data?.data ?? []).length === 0 ? (
          <PageEmpty
            title="No reports found"
            description={isFiltered ? 'Try clearing your filters' : undefined}
            icon={FileWarning}
          />
        ) : (
          paginatedData.map((report) => (
            <ReportCard key={report.id} report={report} onViewDetails={handleViewDetails} />
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

export default ReportsManagement;
