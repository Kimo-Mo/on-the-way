import { useSearchParams, useNavigate } from 'react-router';
import { PageHeader } from '@/components/shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  ReportCard,
  ReportCardSkeleton,
  ReportsPagination,
  ReportsToolbar,
} from '@/components/reports';
import { useReports } from '@/hooks/reports/useReports';
import type { ReportsQueryParams, ReportStatus, ObstacleType } from '@/types/reports';

const ReportsManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');
  const search = searchParams.get('search') ?? '';
  const obstacleType = searchParams.get('obstacleType') ?? '';
  const status = searchParams.get('status') ?? '';

  const queryParams: ReportsQueryParams = {
    page,
    pageSize,
    search: search || undefined,
    obstacleType: (obstacleType as ObstacleType) || undefined,
    status: (status as ReportStatus) || undefined,
  };

  const { data, isLoading, isError, refetch } = useReports(queryParams);
  const isFiltered = !!(search || obstacleType || status);

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      next.set('page', '1');
      return next;
    });
  };

  const handleObstacleTypeChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') next.set('obstacleType', value);
      else next.delete('obstacleType');
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
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load reports. Please try again.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <ReportsToolbar
        search={search}
        obstacleType={obstacleType}
        status={status}
        onSearchChange={handleSearchChange}
        onObstacleTypeChange={handleObstacleTypeChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <ReportCardSkeleton key={i} />)
        ) : data?.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg">
            <span>No reports found</span>
            {isFiltered && <span className="text-sm">Try clearing your filters</span>}
          </div>
        ) : (
          data?.data.map((report) => (
            <ReportCard key={report.id} report={report} onViewDetails={handleViewDetails} />
          ))
        )}
      </div>

      {!isLoading && data && data.totalPages > 1 && (
        <ReportsPagination
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

export default ReportsManagement;
