import {
  Activity,
  Building2,
  CircleHelp,
  TriangleAlert,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { Skeleton } from '@/components/ui';
import type { DashboardMetric } from '@/types/dashboard';

const metricIcons: Record<string, typeof Users> = {
  totalUsers: Users,
  totalReports: TriangleAlert,
  activeHelpRequests: CircleHelp,
  serviceProviders: Building2,
  reportsToday: Activity,
  urgentIncidents: TriangleAlert,
};

const iconColors: Record<string, string> = {
  totalUsers: 'bg-info/10 text-info',
  totalReports: 'bg-warning/10 text-warning',
  activeHelpRequests: 'bg-destructive/10 text-destructive',
  serviceProviders: 'bg-success/10 text-success',
  reportsToday: 'bg-info/10 text-info',
  urgentIncidents: 'bg-destructive/10 text-destructive',
};

interface StatsCardsProps {
  metrics: DashboardMetric[];
  isLoading?: boolean;
  error?: Error | null;
}

export const StatsCards = ({ metrics, isLoading = false, error = null }: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <article
            key={i}
            className="min-h-36 rounded-xl border border-border bg-card px-6 py-6 shadow-sm">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="size-9 shrink-0 rounded-lg" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-4 w-32" />
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <p className="text-sm text-destructive">Unable to load dashboard metrics</p>
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <p className="text-sm text-muted-foreground">No metrics available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric, i) => {
        const id = metric.id ?? `unknown-${i}`;
        const isPositive = metric.trend?.direction === 'up';
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        const Icon = metricIcons[id] || Activity;
        const iconColorClass = iconColors[id] || 'bg-muted text-muted-foreground';

        const cardContent = (
          <article
            key={id}
            className="min-h-36 rounded-xl border border-border bg-card px-6 py-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <h2 className="text-sm font-normal leading-5 text-muted-foreground">
                  {metric.label ?? 'Metric'}
                </h2>
                <p className="mt-1 text-[28px] leading-9 font-bold tracking-normal">
                  {(metric.value ?? 0).toLocaleString()}
                </p>
              </div>

              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconColorClass}`}>
                <Icon className="size-5" strokeWidth={2.2} />
              </div>
            </div>

            {metric.trend && (
              <div className="mt-4 flex items-center text-sm leading-5">
                <span
                  className={`inline-flex items-center gap-0.5 ${
                    metric.trend.meaning === 'positive' ? 'text-success' : 
                    metric.trend.meaning === 'negative' ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`}>
                  <TrendIcon className="size-4" strokeWidth={2} />
                  {metric.trend.percentage}%
                </span>
                <span className="ml-1 text-muted-foreground">{metric.trend.periodLabel}</span>
              </div>
            )}
          </article>
        );

        if (metric.targetRoute) {
          return (
            <Link
              key={id}
              to={metric.targetRoute}
              className="focus:outline-none rounded-xl">
              {cardContent}
            </Link>
          );
        }

        return cardContent;
      })}
    </div>
  );
};
