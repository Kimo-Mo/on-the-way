import { Badge } from '@/components/ui/badge';

interface ReportStatusBadgeProps {
  status: string;
}

const statusVariants: Record<string, string> = {
  // Backend status strings (IncidentStatus enum names)
  Open: 'bg-amber-500/15 text-amber-700 border-amber-200 dark:text-amber-400',
  Resolved: 'bg-green-500/15 text-green-700 border-green-200 dark:text-green-400',
  Cancelled: 'bg-muted text-muted-foreground border-border',
  // Legacy UI-only statuses (kept for backward compat)
  pending: 'bg-amber-500/15 text-amber-700 border-amber-200 dark:text-amber-400',
  urgent: 'bg-destructive/10 text-destructive border-destructive/20',
  approved: 'bg-green-500/15 text-green-700 border-green-200 dark:text-green-400',
  removed: 'bg-muted text-muted-foreground border-border',
};

export const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
  const variantClass = statusVariants[status] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <Badge variant="outline" className={variantClass}>
      {status}
    </Badge>
  );
};
