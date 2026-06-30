import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle } from 'lucide-react';
import { useGetSuspiciousUsers, useModerationAction } from '@/hooks/moderation/useModeration';
import { SuspiciousUserCard } from './SuspiciousUserCard';

export function SuspiciousUsersSection() {
  const { data, isLoading, isError, refetch } = useGetSuspiciousUsers();
  const { mutate: handleAction, isPending } = useModerationAction();

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border border-border shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Suspicious Users</h2>
        <Badge variant="destructive">{data?.length ?? 0} flagged</Badge>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center space-y-2 py-8">
          <p className="text-sm text-muted-foreground">Failed to load suspicious users.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="h-8 w-8 mx-auto text-success mb-2" />
          <p className="text-sm text-muted-foreground">No suspicious users — all clear.</p>
        </div>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((user) => (
            <SuspiciousUserCard
              key={user.id}
              user={user}
              onAction={handleAction}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
