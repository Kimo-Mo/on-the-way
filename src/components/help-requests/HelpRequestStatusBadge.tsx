import { Badge } from '@/components/ui/badge';
import type { HelpRequestStatus } from '@/types/help-requests';

interface HelpRequestStatusBadgeProps {
  status: HelpRequestStatus;
}

export const HelpRequestStatusBadge = ({ status }: HelpRequestStatusBadgeProps) => {
  const variantMap: Record<
    HelpRequestStatus,
    { variant: 'default' | 'secondary' | 'outline' | 'destructive'; className?: string }
  > = {
    Active: {
      variant: 'destructive',
      className: 'bg-destructive text-white hover:bg-destructive/90',
    },
    Assigned: { variant: 'default', className: 'bg-primary hover:bg-primary/90' },
    Completed: { variant: 'secondary', className: 'text-white bg-success hover:bg-success/90' },
  };

  const { variant, className } = variantMap[status];

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
};
