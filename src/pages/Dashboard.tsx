import { RecentActivity, StatsCards } from '@/components/dashboard';
import { PageHeader, PageError, CardSkeleton } from '@/components/shared';
import { useDashboardOverview } from '@/hooks/dashboard/useDashboard';
import type {
  DashboardMetric,
  ActivityEvent,
  ActivityEventType,
  RecentActivityDto,
  ChartPoint,
  CategoryCount,
  MapEvent,
  MapEventCategory,
} from '@/types/dashboard';
import { lazy, Suspense, memo } from 'react';

const ReportsTrendChart = lazy(() =>
  import('@/components/dashboard/ReportsTrendChart').then((m) => ({ default: m.ReportsTrendChart }))
);
const HelpRequestsCategoryChart = lazy(() =>
  import('@/components/dashboard/HelpRequestsCategoryChart').then((m) => ({
    default: m.HelpRequestsCategoryChart,
  }))
);
const UserDistributionChart = lazy(() =>
  import('@/components/dashboard/UserDistributionChart').then((m) => ({
    default: m.UserDistributionChart,
  }))
);
const InteractiveMap = lazy(() =>
  import('@/components/dashboard/InteractiveMap').then((m) => ({
    default: m.InteractiveMap,
  }))
);

const VALID_ACTIVITY_TYPES: ReadonlySet<string> = new Set<ActivityEventType>(['help', 'report']);

const DEFAULT_ACTIVITY_TYPE: ActivityEventType = 'report';

/** Maps RecentActivityDto (backend) → ActivityEvent (UI) for the activity feed panel. */
function mapRecentActivity(dto: RecentActivityDto): ActivityEvent {
  const mappedType: ActivityEventType = VALID_ACTIVITY_TYPES.has(dto.type)
    ? (dto.type as ActivityEventType)
    : DEFAULT_ACTIVITY_TYPE;

  return {
    id: dto.date,
    type: mappedType,
    title: dto.title,
    actorOrSource: dto.user,
    timestamp: dto.date,
    tone: mappedType === 'help' ? 'danger' : 'info',
  };
}

/** Maps DashboardAnalyticsResponse metric fields → DashboardMetric[] for StatsCards. */
function buildMetrics(data: {
  totalUsers: { value: number; growthPercentage: number };
  totalReports: { value: number; growthPercentage: number };
  activeHelpRequests: { value: number; growthPercentage: number };
  reportsToday: { value: number; growthPercentage: number };
  resolutionRate: { value: number; growthPercentage: number };
}): DashboardMetric[] {
  const toMetric = (
    id: string,
    label: string,
    value: number,
    growthPercentage: number,
    targetRoute?: string
  ): DashboardMetric => ({
    id,
    label,
    value,
    trend: {
      direction: growthPercentage >= 0 ? 'up' : 'down',
      percentage: Math.abs(growthPercentage),
      periodLabel: 'vs last period',
      meaning: growthPercentage >= 0 ? 'positive' : 'negative',
    },
    targetRoute,
  });

  return [
    toMetric(
      'totalUsers',
      'Total Users',
      data.totalUsers.value,
      data.totalUsers.growthPercentage,
      '/users'
    ),
    toMetric(
      'totalReports',
      'Total Reports',
      data.totalReports.value,
      data.totalReports.growthPercentage,
      '/reports'
    ),
    toMetric(
      'activeHelpRequests',
      'Active Help Requests',
      data.activeHelpRequests.value,
      data.activeHelpRequests.growthPercentage,
      '/help-requests'
    ),
    toMetric(
      'reportsToday',
      'Reports Today',
      data.reportsToday.value,
      data.reportsToday.growthPercentage
    ),
    toMetric(
      'resolutionRate',
      'Resolution Rate',
      data.resolutionRate.value,
      data.resolutionRate.growthPercentage
    ),
  ];
}

const Dashboard = () => {
  const { data, isLoading, error } = useDashboardOverview();

  // Map backend response to what each component expects
  const metrics: DashboardMetric[] = data
    ? buildMetrics({
        totalUsers: data.totalUsers,
        totalReports: data.totalReports,
        activeHelpRequests: data.activeHelpRequests,
        reportsToday: data.reportsToday,
        resolutionRate: data.resolutionRate,
      })
    : [];

  const activityEvents: ActivityEvent[] = (data?.recentActivities ?? []).map(mapRecentActivity);

  // ChartPoint[] is already the right shape for the chart components (label + value)
  const reportsOverTime: ChartPoint[] = data?.reportsOverTime ?? [];
  const helpRequestsByCategory: ChartPoint[] = data?.helpRequestsByCategory ?? [];

  // Map ChartPoint[] → CategoryCount[] for the bar chart
  const categoryCounts: CategoryCount[] = helpRequestsByCategory.map((cp) => ({
    category: cp.label,
    count: cp.value,
    targetRoute: '/help-requests',
  }));

  // Map ChartPoint[] → distribution segments for the pie chart
  const userDistribution = (data?.userRoleDistribution ?? []).map((cp) => ({
    label: cp.role,
    count: cp.count,
    percentage: cp.percentage,
    targetRoute: '/users',
  }));

  const mapEvents: MapEvent[] = [
    ...(data?.mapData?.recentIncidents ?? []).map((inc) => ({
      id: inc.id,
      category: 'urgentReport' as MapEventCategory,
      title: inc.type,
      coordinates: { lat: inc.latitude, lng: inc.longitude },
      status: 'active',
      timestamp: inc.createdAt,
      targetRoute: `/reports/${inc.id}`,
    })),
    ...(data?.mapData?.recentHelpRequests ?? []).map((req) => ({
      id: req.id,
      category: 'helpRequest' as MapEventCategory,
      title: req.type,
      coordinates: { lat: req.latitude, lng: req.longitude },
      status: 'active',
      timestamp: req.createdAt,
      targetRoute: `/help-requests/${req.id}`,
    })),
  ];

  const activityEventsEmpty = !isLoading && activityEvents.length === 0;

  return (
    <section className="py-7 space-y-5">
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." />

      {error && (
        <PageError
          message="Failed to load dashboard data. Please try again."
          onRetry={() => window.location.reload()}
        />
      )}

      <StatsCards metrics={metrics} isLoading={isLoading} error={error} />

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<CardSkeleton count={1} className="h-100" />}>
          <div className="md:col-span-1 lg:col-span-2">
            <InteractiveMap
              events={mapEvents}
              isLoading={isLoading}
              error={error}
              isEmpty={!isLoading && mapEvents.length === 0}
            />
          </div>
        </Suspense>
        <RecentActivity
          events={activityEvents}
          isLoading={isLoading}
          error={error}
          isEmpty={activityEventsEmpty}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Suspense fallback={<CardSkeleton count={1} />}>
          {/* Backend returns reportsOverTime as ChartPoint[] (label + value) */}
          <ReportsTrendChart
            data={reportsOverTime}
            isLoading={isLoading}
            error={error}
            targetRoute="/reports"
          />
        </Suspense>
        <Suspense fallback={<CardSkeleton count={1} />}>
          {/* Backend returns helpRequestsByCategory as ChartPoint[] (label + value) */}
          <HelpRequestsCategoryChart
            data={categoryCounts}
            isLoading={isLoading}
            error={error}
            targetRoute="/help-requests"
          />
        </Suspense>
        <Suspense fallback={<CardSkeleton count={1} />}>
          {/* Backend returns userGrowth as ChartPoint[] (label + value) */}
          <UserDistributionChart
            data={userDistribution}
            isLoading={isLoading}
            error={error}
            targetRoute="/users"
          />
        </Suspense>
      </div>
    </section>
  );
};

export default memo(Dashboard);
