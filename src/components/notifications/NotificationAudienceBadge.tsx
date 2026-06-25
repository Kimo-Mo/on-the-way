import { Badge } from '@/components/ui/badge';
import { AUDIENCE_LABELS } from '@/types/notifications';
import type { NotificationAudience } from '@/types/notifications';

interface NotificationAudienceBadgeProps {
  audience: NotificationAudience;
}

export function NotificationAudienceBadge({ audience }: NotificationAudienceBadgeProps) {
  return <Badge variant="secondary">{AUDIENCE_LABELS[audience]}</Badge>;
}