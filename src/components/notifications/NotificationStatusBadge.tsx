import { Badge } from '@/components/ui/badge';
import type { NotificationStatus } from '@/types/notifications';

interface NotificationStatusBadgeProps {
  status: NotificationStatus;
}

export function NotificationStatusBadge({ status }: NotificationStatusBadgeProps) {
  if (status === 'Published') {
    return <Badge className="bg-success hover:bg-success/80">Published</Badge>;
  }
  if (status === 'Scheduled') {
    return (
      <Badge variant="outline" className="border-primary text-primary bg-primary/10">
        Scheduled
      </Badge>
    );
  }
  if (status === 'Failed') {
    return <Badge variant="destructive">Failed</Badge>;
  }
  return <Badge variant="warning">Draft</Badge>;
}
