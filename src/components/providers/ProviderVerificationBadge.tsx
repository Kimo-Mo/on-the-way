import { Badge } from '@/components/ui/badge';
import type { VerificationStatus } from '@/types/providers';

interface ProviderVerificationBadgeProps {
  status: VerificationStatus;
}

export function ProviderVerificationBadge({ status }: ProviderVerificationBadgeProps) {
  const config = {
    missingRequired: { label: 'Missing Required Docs', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20' },
    readyForReview: { label: 'Ready for Review', variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300' },
    verified: { label: 'Verified', variant: 'secondary' as const, className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300' },
  };

  const { label, variant, className } = config[status] || config.missingRequired;

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
