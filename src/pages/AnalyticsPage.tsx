import { useState } from 'react';
import { useDashboardOverview } from '@/hooks/dashboard/useDashboard';
import { PageHeader, PageError, CardSkeleton } from '@/components/shared';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  HelpRequestsByTypeChart,
  KpiCardGrid,
  ReportsTrendsChart,
  UserGrowthChart,
} from '@/components/analytics';

export default function AnalyticsPage() {
  const [days, setDays] = useState<number>(30);

  const { data, isLoading, isError } = useDashboardOverview({ days });

  return (
    <div className="py-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Analytics" subtitle="System performance and insights" />
        <Select value={days.toString()} onValueChange={(val) => setDays(Number(val))}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="365">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && <PageError message="Failed to load analytics data. Please try again." />}

      {isLoading && <CardSkeleton count={4} className="lg:grid-cols-4 mt-6 sm:mt-0" />}

      {!isError && !isLoading && data && (
        <div className="space-y-4 mt-6 sm:mt-0">
          <KpiCardGrid data={data} isLoading={isLoading} />
          <ReportsTrendsChart data={data.reportsOverTime} isLoading={isLoading} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HelpRequestsByTypeChart data={data.helpRequestsByCategory} isLoading={isLoading} />
            <UserGrowthChart data={data.userGrowth} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
}
