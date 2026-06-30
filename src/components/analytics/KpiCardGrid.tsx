import { Skeleton } from '@/components/ui/skeleton';
import { KpiCard } from './KpiCard';
import { Clock, Users, CheckCircle, HelpCircle } from 'lucide-react';
import type { KpiData } from '@/types/analytics';

interface KpiCardGridProps {
  kpi: KpiData | undefined;
  isLoading: boolean;
}

export function KpiCardGrid({ kpi, isLoading }: KpiCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
      </div>
    );
  }

  if (!kpi) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Avg Response Time"
        value={`${kpi.avgResponseTimeMinutes} min`}
        delta={kpi.avgResponseTimeDelta}
        icon={<Clock className="h-5 w-5" />}
      />
      <KpiCard
        title="User Satisfaction"
        value={`${kpi.userSatisfactionRate}%`}
        delta={kpi.userSatisfactionDelta}
        icon={<Users className="h-5 w-5" />}
      />
      <KpiCard
        title="Resolution Rate"
        value={`${kpi.resolutionRate}%`}
        delta={kpi.resolutionRateDelta}
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <KpiCard
        title="Active Help Requests"
        value={kpi.activeHelpRequests}
        delta={kpi.activeHelpRequestsDelta}
        icon={<HelpCircle className="h-5 w-5" />}
      />
    </div>
  );
}
