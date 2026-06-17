import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { CategoryCount } from '@/types/dashboard';
import { DashboardPanel } from './DashboardPanel';

interface HelpRequestsCategoryChartProps {
  data: CategoryCount[];
  isLoading?: boolean;
  error?: Error | null;
  targetRoute?: string;
}

const barColors = ['var(--primary)', 'var(--info)', 'var(--warning)', 'var(--success)'];

export const HelpRequestsCategoryChart = ({
  data,
  isLoading,
  error,
  targetRoute,
}: HelpRequestsCategoryChartProps) => {
  const action = targetRoute ? (
    <Link to={targetRoute} className="text-xs text-primary hover:underline">
      View Details
    </Link>
  ) : undefined;

  if (isLoading) {
    return (
      <DashboardPanel title="Help Requests by Category" isLoading={true}>
        <></>
      </DashboardPanel>
    );
  }

  if (error) {
    return (
      <DashboardPanel
        title="Help Requests by Category"
        isError={true}
        errorMessage="Unable to load category data">
        <></>
      </DashboardPanel>
    );
  }

  if (data.length === 0) {
    return (
      <DashboardPanel
        title="Help Requests by Category"
        isEmpty={true}
        emptyMessage="No category data available">
        <></>
      </DashboardPanel>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    name: d.category,
    count: d.count,
  }));

  return (
    <DashboardPanel title="Help Requests by Category" action={action}>
      <div className="h-48 w-full">
        <BarChart
          responsive
          style={{ width: '100%', height: '100%', minWidth: 0 }}
          data={chartData}
          margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
          <XAxis dataKey="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </DashboardPanel>
  );
};
