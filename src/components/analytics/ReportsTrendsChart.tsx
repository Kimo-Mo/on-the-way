import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { ReportsTrendPoint } from '@/types/analytics';

interface ReportsTrendsChartProps {
  data: ReportsTrendPoint[];
  isLoading: boolean;
}

export function ReportsTrendsChart({ data, isLoading }: ReportsTrendsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reports Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-75 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full" role="img" aria-label="Reports trends area chart">
          <AreaChart
            data={data}
            responsive
            style={{
              width: '100%',
              minWidth: '0',
              height: '100%',
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="reports"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
            />
          </AreaChart>
        </div>
      </CardContent>
    </Card>
  );
}
