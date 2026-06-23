import { useNavigate, useSearchParams } from 'react-router';
import { useProviders } from '@/hooks/useProviders';
import { useUpdateProviderStatus } from '@/hooks/useUpdateProviderStatus';
import {
  ProvidersToolbar,
  ProvidersPagination,
  ProviderTableSkeleton,
  ProvidersTable,
} from '@/components/providers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import type {
  ProviderServiceType,
  ProviderStatus,
  UpdateProviderStatusPayload,
} from '@/types/providers';
import { PageHeader } from '@/components/shared';

export default function ProvidersManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const search = searchParams.get('search') || '';
  const type = (searchParams.get('type') as ProviderServiceType | 'all') || 'all';
  const status = (searchParams.get('status') as ProviderStatus | 'all') || 'all';

  const updateFilters = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 on filter change
    if ('search' in updates || 'type' in updates || 'status' in updates) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const { data, isLoading, isError, refetch } = useProviders({
    page,
    pageSize,
    search: search || undefined,
    type: type !== 'all' ? type : undefined,
    status: status !== 'all' ? status : undefined,
  });

  const { mutate: updateStatus } = useUpdateProviderStatus();

  const handleApprove = (id: string) => {
    updateStatus({ id, payload: { action: 'approve' } });
  };

  const handleReject = (id: string, payload: UpdateProviderStatusPayload) => {
    updateStatus({ id, payload });
  };

  return (
    <div className="py-7">
      <PageHeader title="Service Providers" subtitle="Manage and approve service providers" />

      {/* <div className="bg-card border rounded-md shadow-sm"> */}
      {/* <div className="border-b px-6"> */}
      <ProvidersToolbar
        search={search}
        onSearchChange={(val) => updateFilters({ search: val })}
        type={type}
        onTypeChange={(val) => updateFilters({ type: val })}
        status={status}
        onStatusChange={(val) => updateFilters({ status: val })}
        onClearFilters={() => updateFilters({ search: null, type: null, status: null })}
      />
      {/* </div> */}

      {isError ? (
        <div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load service providers. Please try again.</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      ) : isLoading ? (
        <div>
          <ProviderTableSkeleton />
        </div>
      ) : (
        <>
          <ProvidersTable
            providers={data?.data || []}
            onViewDetails={(id) => navigate(`/providers/${id}`)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          {!isLoading && data && data.totalPages > 1 && (
            <div className="border-t">
              <ProvidersPagination
                page={page}
                pageSize={pageSize}
                total={data.total}
                totalPages={data.totalPages}
                onPageChange={(newPage) => updateFilters({ page: newPage.toString() })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
