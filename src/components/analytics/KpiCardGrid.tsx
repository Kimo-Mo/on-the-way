import { Skeleton } from '@/components/ui/skeleton';
import { KpiCard } from './KpiCard';
import { Users, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import type { DashboardAnalyticsResponse } from '@/types/dashboard';

interface KpiCardGridProps {
  data: DashboardAnalyticsResponse | undefined;
  isLoading: boolean;
}

export function KpiCardGrid({ data, isLoading }: KpiCardGridProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Total Users"
        value={data.totalUsers.value}
        delta={data.totalUsers.growthPercentage}
        icon={<Users className="h-5 w-5" />}
      />
      <KpiCard
        title="Total Reports"
        value={data.totalReports.value}
        delta={data.totalReports.growthPercentage}
        icon={<FileText className="h-5 w-5" />}
      />
      <KpiCard
        title="Resolution Rate"
        value={`${data.resolutionRate.value}%`}
        delta={data.resolutionRate.growthPercentage}
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <KpiCard
        title="Active Help Requests"
        value={data.activeHelpRequests.value}
        delta={data.activeHelpRequests.growthPercentage}
        icon={<HelpCircle className="h-5 w-5" />}
      />
    </div>
  );
}
