import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { KeyMetricsSummary as KeyMetricsSummaryType } from '@/types/analytics';

interface KeyMetricsSummaryProps {
  data: KeyMetricsSummaryType | undefined;
  isLoading: boolean;
}

export function KeyMetricsSummary({ data, isLoading }: KeyMetricsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-25 w-full" />
        <Skeleton className="h-25 w-full" />
        <Skeleton className="h-25 w-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 bg-card rounded-lg p-6 border border-border shadow">
      <h2 className="text-2xl font-bold">Key Metrics Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 text-primary gap-0 justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="font-medium">Total Reports This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalReportsThisMonth}</div>
            <p className="text-sm">
              {data.totalReportsDelta >= 0 ? '↑' : '↓'} {Math.abs(data.totalReportsDelta)}% from
              last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-300 gap-0 justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="font-medium">Help Requests Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.helpRequestsCompleted}</div>
            <p className="text-sm">
              {data.helpRequestsDelta >= 0 ? '↑' : '↓'} {Math.abs(data.helpRequestsDelta)}% from
              last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-950/25 text-purple-600 dark:text-purple-300 gap-0 justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="font-medium">New Users This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.newUsersThisMonth}</div>
            <p className="text-sm">
              {data.newUsersDelta >= 0 ? '↑' : '↓'} {Math.abs(data.newUsersDelta)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
