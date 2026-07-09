import { useNavigate, useSearchParams } from 'react-router';
import { useProviders, useUpdateProviderStatus } from '@/hooks/providers/useProviders';
import {
  ProvidersToolbar,
  ProviderTableSkeleton,
  ProvidersTable,
} from '@/components/providers';
import { ClientPagination } from '@/components/ui';
import { useClientPagination } from '@/hooks/useClientPagination';
import type {
  ProviderServiceType,
  ProviderStatus,
  UpdateProviderStatusPayload,
} from '@/types/providers';
import { PageHeader, PageError, PageEmpty } from '@/components/shared';
import { Building2 } from 'lucide-react';

export default function ProvidersManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
    setSearchParams(newParams);
  };

  const { data, isLoading, isError, refetch } = useProviders({
    page: 1,
    pageSize: 10,
    search: search || undefined,
    type: type !== 'all' ? type : undefined,
    status: status !== 'all' ? status : undefined,
  });

  const { paginatedData, currentPage, totalPages, goToPage } = useClientPagination(
    data?.data ?? [],
    10,
    [search, type, status]
  );

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

      <ProvidersToolbar
        search={search}
        onSearchChange={(val) => updateFilters({ search: val })}
        type={type}
        onTypeChange={(val) => updateFilters({ type: val })}
        status={status}
        onStatusChange={(val) => updateFilters({ status: val })}
        onClearFilters={() => updateFilters({ search: null, type: null, status: null })}
      />
      {isError && (
        <PageError
          message="Failed to load service providers. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (data?.data ?? []).length === 0 && (
        <PageEmpty
          title="No providers found"
          description={search || type !== 'all' || status !== 'all' ? 'Try clearing your filters' : undefined}
          icon={Building2}
        />
      )}

      {isLoading && (
        <ProviderTableSkeleton />
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <ProvidersTable
            providers={paginatedData}
            onViewDetails={(id) => navigate(`/providers/${id}`)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}
