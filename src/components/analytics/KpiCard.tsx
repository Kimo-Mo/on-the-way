import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KpiCardProps {
  title: string;
  value: string | number | undefined;
  delta: number | undefined;
  icon: React.ReactNode;
}

export function KpiCard({ title, value, delta, icon }: KpiCardProps) {
  const displayValue = value ?? 'N/A';
  const displayDelta = delta ?? 0;
  const isPositive = displayDelta >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-primary bg-primary/10 p-3 rounded-xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {delta !== undefined && (
          <p className={cn('text-sm', isPositive ? 'text-success' : 'text-destructive')}>
            {isPositive ? '+' : '-'} {Math.abs(displayDelta)}%{' '}
            <span className="text-sm ml-1">from last period</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
