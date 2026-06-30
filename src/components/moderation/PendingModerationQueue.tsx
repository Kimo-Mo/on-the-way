import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPendingModerationItems } from '@/hooks/moderation/useModeration';
import { PendingItemRow } from './PendingItemRow';

export function PendingModerationQueue() {
  const { data, isLoading, isError, refetch } = useGetPendingModerationItems();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Pending Moderation Actions</h2>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-md" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center space-y-2 py-8">
          <p className="text-sm text-muted-foreground">Failed to load pending items.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No pending items — queue is clear.</p>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="space-y-2">
          {data.map((item) => (
            <PendingItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
