import { Badge } from '@/components/ui/badge';
import type { FlagReason } from '@/types/moderation';
import { FLAG_REASON_LABELS } from '@/types/moderation';

interface FlagReasonBadgeProps {
  reason: FlagReason;
}

const VARIANT_MAP: Record<FlagReason, { variant: 'destructive' | 'outline' | 'secondary'; className?: string }> = {
  highDownvotes:    { variant: 'destructive' },
  reportedAsSpam:   { variant: 'outline', className: 'border-orange-500 text-orange-600' },
  duplicateContent: { variant: 'secondary' },
  other:            { variant: 'outline' },
};

export function FlagReasonBadge({ reason }: FlagReasonBadgeProps) {
  const { variant, className } = VARIANT_MAP[reason];
  return (
    <Badge variant={variant} className={className}>
      {FLAG_REASON_LABELS[reason]}
    </Badge>
  );
}
