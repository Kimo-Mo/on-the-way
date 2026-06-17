import type { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
}

export const DashboardGrid = ({ children }: DashboardGridProps) => {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
};