import { Badge } from '@/components/ui/badge';
import type { ProviderStatus } from '@/types/providers';

interface ProviderStatusBadgeProps {
  status: ProviderStatus;
}

export function ProviderStatusBadge({ status }: ProviderStatusBadgeProps) {
  const config = {
    pending: { label: 'Pending', variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300' },
    approved: { label: 'Approved', variant: 'secondary' as const, className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300' },
    rejected: { label: 'Rejected', variant: 'destructive' as const, className: '' },
    suspended: { label: 'Suspended', variant: 'secondary' as const, className: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300' },
  };

  const { label, variant, className } = config[status] || config.pending;

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
