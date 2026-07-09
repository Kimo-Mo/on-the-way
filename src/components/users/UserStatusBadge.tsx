import { Badge } from '@/components/ui/badge';

interface UserStatusBadgeProps {
  status: string;
}

const statusVariants: Record<string, string> = {
  Active: 'bg-green-500/15 text-green-700 border-green-200 dark:text-green-400',
  Suspended: 'bg-destructive/10 text-destructive border-destructive/20',
  Banned: 'bg-red-900/10 text-red-800 border-red-300 dark:text-red-400',
};

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  const variantClass =
    statusVariants[status] ?? 'bg-muted/50 text-muted-foreground border-border';

  return (
    <Badge variant="outline" className={variantClass}>
      {status}
    </Badge>
  );
};