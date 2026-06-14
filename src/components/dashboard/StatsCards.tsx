import {
  Activity,
  Building2,
  CircleHelp,
  TriangleAlert,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Users',
    value: '12,458',
    change: '12%',
    trend: 'up',
    icon: Users,
    iconClassName: 'bg-info/10 text-info',
  },
  {
    label: 'Total Reports',
    value: '3,247',
    change: '5%',
    trend: 'down',
    icon: TriangleAlert,
    iconClassName: 'bg-warning/10 text-warning',
  },
  {
    label: 'Active Help Requests',
    value: '42',
    change: '8%',
    trend: 'up',
    icon: CircleHelp,
    iconClassName: 'bg-destructive/10 text-destructive',
  },
  {
    label: 'Service Providers',
    value: '156',
    change: '15%',
    trend: 'up',
    icon: Building2,
    iconClassName: 'bg-success/10 text-success',
  },
  {
    label: 'Reports Today',
    value: '87',
    change: '22%',
    trend: 'up',
    icon: Activity,
    iconClassName: 'bg-info/10 text-info',
  },
  {
    label: 'Urgent Incidents',
    value: '12',
    change: '18%',
    trend: 'down',
    icon: TriangleAlert,
    iconClassName: 'bg-destructive/10 text-destructive',
  },
];
export const StatsCards = () => {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const isPositive = stat.trend === 'up';
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <article
            key={stat.label}
            className="min-h-36 rounded-xl border border-border bg-card px-6 py-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <h2 className="text-sm font-normal leading-5 text-muted-foreground">
                  {stat.label}
                </h2>
                <p className="mt-1 text-[28px] leading-9 font-bold tracking-normal">{stat.value}</p>
              </div>

              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.iconClassName}`}>
                <stat.icon className="size-5" strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-4 flex items-center text-sm leading-5">
              <span
                className={`inline-flex items-center gap-0.5 ${isPositive ? 'text-success' : 'text-destructive'}`}>
                <TrendIcon className="size-4" strokeWidth={2} />
                {stat.change}
              </span>
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
