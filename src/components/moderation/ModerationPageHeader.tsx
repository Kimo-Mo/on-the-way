import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../shared';

interface ModerationPageHeaderProps {
  pendingCount: number | undefined;
  isLoading: boolean;
}

export function ModerationPageHeader({ pendingCount, isLoading }: ModerationPageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <PageHeader
          title="Moderation Panel"
          subtitle="Review and moderate flagged content and users"
        />
      </div>
      <div>
        {isLoading && <Skeleton className="h-8 w-32 rounded-full" />}
        {!isLoading && pendingCount === 0 && (
          <Badge variant="outline" className="text-success border-success gap-1">
            <CheckCircle className="h-3 w-3" /> All clear
          </Badge>
        )}
        {!isLoading && pendingCount !== undefined && pendingCount > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" /> {pendingCount} items pending
          </Badge>
        )}
        {!isLoading && pendingCount === undefined && (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <AlertCircle className="h-3 w-3" /> Count unavailable
          </Badge>
        )}
      </div>
    </div>
  );
}
