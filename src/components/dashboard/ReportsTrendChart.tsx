import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { TrendPoint } from '@/types/dashboard';
import { DashboardPanel } from './DashboardPanel';
import { Link } from 'react-router';

interface ReportsTrendChartProps {
  data: TrendPoint[];
  isLoading?: boolean;
  error?: Error | null;
  targetRoute?: string;
}

export const ReportsTrendChart = ({
  data,
  isLoading,
  error,
  targetRoute,
}: ReportsTrendChartProps) => {
  const action = targetRoute ? (
    <Link to={targetRoute} className="text-xs text-primary hover:underline">
      View Details
    </Link>
  ) : undefined;
  if (isLoading) {
    return (
      <DashboardPanel title="Reports Trend" isLoading={true} action={action}>
        <></>
      </DashboardPanel>
    );
  }

  if (error) {
    return (
      <DashboardPanel title="Reports Trend" isError={true} errorMessage="Unable to load trend data">
        <></>
      </DashboardPanel>
    );
  }

  if (data.length === 0) {
    return (
      <DashboardPanel title="Reports Trend" isEmpty={true} emptyMessage="No trend data available">
        <></>
      </DashboardPanel>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    value: d.value,
  }));

  return (
    <DashboardPanel title="Reports Trend" action={action}>
      <div className="h-48 w-full">
        <LineChart
          responsive
          style={{
            width: '100%',
            minWidth: '0',
            height: '100%',
          }}
          data={chartData}
          margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </div>
    </DashboardPanel>
  );
};
