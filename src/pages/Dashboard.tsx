import {
  FlaggedContentPanel,
  InteractiveMap,
  RecentActivity,
  StatsCards,
} from '@/components/dashboard';
import { PageHeader } from '@/components/shared';
import { useDashboardOverview } from '@/hooks/dashboard/useDashboard';
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

const Dashboard = () => {
  const { data, isLoading, error, approveFlaggedContent, removeFlaggedContent, flagRelatedUser } =
    useDashboardOverview();

  const mapEvents = data?.mapEvents ?? [];
  const activityEvents = data?.activityEvents ?? [];
  const mapEventsEmpty = !isLoading && mapEvents.length === 0;
  const activityEventsEmpty = !isLoading && activityEvents.length === 0;

  return (
    <section className="py-7 space-y-5">
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." />

      <StatsCards metrics={data?.metrics ?? []} isLoading={isLoading} error={error} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InteractiveMap
            events={mapEvents}
            isLoading={isLoading}
            error={error}
            isEmpty={mapEventsEmpty}
          />
        </div>
        <RecentActivity
          events={activityEvents}
          isLoading={isLoading}
          error={error}
          isEmpty={activityEventsEmpty}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Suspense
          fallback={
            <div className="h-62.5 rounded-xl border border-border bg-card p-6 animate-pulse" />
          }>
          <ReportsTrendChart
            data={data?.reportsTrend ?? []}
            isLoading={isLoading}
            error={error}
            targetRoute="/reports"
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-62.5 rounded-xl border border-border bg-card p-6 animate-pulse" />
          }>
          <HelpRequestsCategoryChart
            data={data?.helpRequestCategories ?? []}
            isLoading={isLoading}
            error={error}
            targetRoute="/help-requests"
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-62.5 rounded-xl border border-border bg-card p-6 animate-pulse" />
          }>
          <UserDistributionChart
            data={data?.userDistribution ?? []}
            isLoading={isLoading}
            error={error}
            targetRoute="/users"
          />
        </Suspense>
      </div>

      <FlaggedContentPanel
        items={data?.flaggedContent ?? []}
        pendingCount={data?.flaggedContentPendingCount ?? 0}
        isLoading={isLoading}
        error={error}
        onApprove={(id) => approveFlaggedContent.mutate(id)}
        onRemove={(id) => removeFlaggedContent.mutate(id)}
        onFlagUser={(id) => flagRelatedUser.mutate(id)}
        approveLoading={approveFlaggedContent.isPending}
        removeLoading={removeFlaggedContent.isPending}
        flagUserLoading={flagRelatedUser.isPending}
      />
    </section>
  );
};

export default memo(Dashboard);
