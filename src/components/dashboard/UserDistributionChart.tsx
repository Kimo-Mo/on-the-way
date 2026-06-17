import { Link } from 'react-router';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { DashboardPanel } from './DashboardPanel';

interface UserDistributionChartProps {
  data: Array<{ label: string; percentage: number; count: number; targetRoute?: string }>;
  isLoading?: boolean;
  error?: Error | null;
  targetRoute?: string;
}

const pieColors = ['var(--primary)', 'var(--info)', 'var(--warning)', 'var(--success)'];

export const UserDistributionChart = ({
  data,
  isLoading,
  error,
  targetRoute,
}: UserDistributionChartProps) => {
  const action = targetRoute ? (
    <Link to={targetRoute} className="text-xs text-primary hover:underline">
      View Details
    </Link>
  ) : undefined;

  if (isLoading) {
    return (
      <DashboardPanel title="User Distribution" isLoading={true}>
        <></>
      </DashboardPanel>
    );
  }

  if (error) {
    return (
      <DashboardPanel
        title="User Distribution"
        isError={true}
        errorMessage="Unable to load distribution data">
        <></>
      </DashboardPanel>
    );
  }

  if (data.length === 0) {
    return (
      <DashboardPanel
        title="User Distribution"
        isEmpty={true}
        emptyMessage="No distribution data available">
        <></>
      </DashboardPanel>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    name: d.label,
    value: d.percentage,
    count: d.count,
  }));

  return (
    <DashboardPanel title="User Distribution" action={action}>
      <div className="h-48 w-full">
        <PieChart responsive style={{ width: '100%', height: '100%', minWidth: 0 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={60}
            dataKey="value"
            label={false}
            labelLine={false}>
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              fontSize: '12px',
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </div>
    </DashboardPanel>
  );
};
