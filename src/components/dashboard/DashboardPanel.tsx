import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

interface DashboardPanelProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  isUnauthorized?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
}

export const DashboardPanel = ({
  title,
  children,
  action,
  isLoading = false,
  isEmpty = false,
  isError = false,
  isUnauthorized = false,
  emptyMessage = 'No data available',
  errorMessage = 'Unable to load data',
}: DashboardPanelProps) => {
  if (isUnauthorized) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Access restricted</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          {action && <Skeleton className="h-8 w-20" />}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-4" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {isEmpty ? <p className="text-sm text-muted-foreground">{emptyMessage}</p> : children}
    </div>
  );
};
