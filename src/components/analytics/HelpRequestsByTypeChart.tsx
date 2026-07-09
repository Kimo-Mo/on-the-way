import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { ChartPoint } from '@/types/dashboard';

interface HelpRequestsByTypeChartProps {
  data: ChartPoint[];
  isLoading: boolean;
}

export function HelpRequestsByTypeChart({ data, isLoading }: HelpRequestsByTypeChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Help Requests by Type</CardTitle>
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
        <CardTitle>Help Requests by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="h-75 w-full"
          role="img"
          aria-label="Help requests by type grouped bar chart">
          <BarChart
            data={data}
            responsive
            style={{
              width: '100%',
              minWidth: '0',
              height: '100%',
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                fontSize: '12px',
              }}
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
            />
            <Legend />
            <Bar dataKey="value" name="Requests" fill="#ff6b6b" />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}
