import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { ChartPoint } from '@/types/dashboard';

interface UserGrowthChartProps {
  data: ChartPoint[];
  isLoading: boolean;
}

export function UserGrowthChart({ data, isLoading }: UserGrowthChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
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
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full" role="img" aria-label="User growth line chart">
          <LineChart
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
            <Line
              type="monotone"
              dataKey="value"
              name="Users"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
}
