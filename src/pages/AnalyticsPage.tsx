import { useState, useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui';
import { useGetAnalytics } from '@/hooks/analytics/useAnalytics';
import { PageHeader } from '@/components/shared';
import type { AnalyticsDateRange } from '@/types/analytics';
import {
  AnalyticsRangeSelect,
  HelpRequestsByTypeChart,
  KeyMetricsSummary,
  KpiCardGrid,
  ReportsTrendsChart,
  UserGrowthChart,
} from '@/components/analytics';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('7d');

  const { data, isLoading, isError } = useGetAnalytics(dateRange);

  const reportsTrends = useMemo(() => data?.reportsTrends ?? [], [data]);
  const helpRequestsByType = useMemo(() => data?.helpRequestsByType ?? [], [data]);
  const userGrowth = useMemo(() => data?.userGrowth ?? [], [data]);

  return (
    <div className="py-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Analytics" subtitle="System performance and insights" />
        <AnalyticsRangeSelect value={dateRange} onChange={setDateRange} />
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>Failed to load analytics data. Please try again.</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        <KpiCardGrid kpi={data?.kpi} isLoading={isLoading} />

        <ReportsTrendsChart data={reportsTrends} isLoading={isLoading} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HelpRequestsByTypeChart data={helpRequestsByType} isLoading={isLoading} />
          <UserGrowthChart data={userGrowth} isLoading={isLoading} />
        </div>

        <KeyMetricsSummary data={data?.keyMetrics} isLoading={isLoading} />
      </div>
    </div>
  );
}
