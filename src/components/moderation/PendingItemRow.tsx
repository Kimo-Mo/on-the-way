import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PendingModerationItem } from '@/types/moderation';
import { PRIORITY_LABELS } from '@/types/moderation';

interface PendingItemRowProps {
  item: PendingModerationItem;
}

function getElapsedString(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
}

const PRIORITY_VARIANT: Record<string, 'destructive' | 'warning' | 'default'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'default',
};

export function PendingItemRow({ item }: PendingItemRowProps) {
  const navigate = useNavigate();

  const handleReview = () => {
    if (item.type === 'reportReview') {
      navigate(`/reports/${item.targetEntityId}`);
    } else if (item.type === 'userFlag') {
      navigate(`/users/${item.targetEntityId}`);
    } else {
      toast.info('Content removal — no detail view available in this phase.');
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 hover:border-primary transition-all duration-200">
      <Badge
        variant={PRIORITY_VARIANT[item.priority]}
        className={
          PRIORITY_VARIANT[item.priority] === 'default'
            ? 'bg-primary/10 text-primary border border-primary/20'
            : ''
        }>
        {PRIORITY_LABELS[item.priority]}
      </Badge>
      <div className="flex-1 flex flex-col">
        <span className="text-sm font-medium">{item.description}</span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {getElapsedString(item.submittedAt)}
        </span>
      </div>
      <Button onClick={handleReview}>Review</Button>
    </div>
  );
}
