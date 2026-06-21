import { Badge } from '@/components/ui/badge';
import type { ReportStatus } from '@/types/reports';

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

export const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
  const capitalized = status.charAt(0).toUpperCase() + status.slice(1);

  const variants: Record<ReportStatus, string> = {
    pending: 'bg-amber-500/15 text-amber-700 border-amber-200 dark:text-amber-400',
    urgent: 'bg-destructive/10 text-destructive border-destructive/20',
    approved: 'bg-green-500/15 text-green-700 border-green-200 dark:text-green-400',
    removed: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {capitalized}
    </Badge>
  );
};
