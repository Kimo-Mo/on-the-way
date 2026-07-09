import { Badge } from '@/components/ui/badge';

interface HelpRequestStatusBadgeProps {
  status: string;
}

const statusVariantMap: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; className?: string }> = {
  // Backend status strings (AssistanceStatus enum names)
  Pending: { variant: 'destructive', className: 'bg-destructive text-white hover:bg-destructive/90' },
  Accepted: { variant: 'default', className: 'bg-primary hover:bg-primary/90' },
  Completed: { variant: 'secondary', className: 'text-white bg-success hover:bg-success/90' },
  Cancelled: { variant: 'outline' },
  // Legacy statuses
  Active: { variant: 'destructive', className: 'bg-destructive text-white hover:bg-destructive/90' },
  Assigned: { variant: 'default', className: 'bg-primary hover:bg-primary/90' },
};

export const HelpRequestStatusBadge = ({ status }: HelpRequestStatusBadgeProps) => {
  const config = statusVariantMap[status] ?? { variant: 'outline' as const };

  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
};
