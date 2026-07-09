import { Button } from '@/components/ui';
import type { FlaggedContentItem, FlaggedContentAction } from '@/types/dashboard';
import { ConfirmModerationAction } from './ConfirmModerationAction';
import { Link } from 'react-router';

interface FlaggedContentPanelProps {
  items: FlaggedContentItem[];
  pendingCount: number;
  isLoading?: boolean;
  error?: Error | null;
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
  onFlagUser: (id: string) => void;
  approveLoading?: boolean;
  removeLoading?: boolean;
  flagUserLoading?: boolean;
}

const actionVariant: Record<FlaggedContentAction, 'default' | 'outline' | 'destructive'> = {
  approve: 'default',
  remove: 'destructive',
  flagUser: 'outline',
};

export const FlaggedContentPanel = ({
  items,
  pendingCount,
  isLoading,
  error,
  onApprove,
  onRemove,
  onFlagUser,
  approveLoading,
  removeLoading,
  flagUserLoading,
}: FlaggedContentPanelProps) => {
  const handleAction = (action: FlaggedContentAction, id: string) => {
    switch (action) {
      case 'approve': return onApprove(id);
      case 'remove': return onRemove(id);
      case 'flagUser': return onFlagUser(id);
    }
  };

  const isActionLoading = (action: FlaggedContentAction) => {
    switch (action) {
      case 'approve': return !!approveLoading;
      case 'remove': return !!removeLoading;
      case 'flagUser': return !!flagUserLoading;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Flagged Content</h2>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 text-destructive">
          <span className="text-sm font-medium">Unable to load flagged content</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Flagged Content</h2>
        </div>
        <p className="text-sm text-muted-foreground">No pending flagged items</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Flagged Content</h2>
        <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
          {pendingCount} pending
        </span>
      </div>

      <div className="space-y-3">
        {items.slice(0, 3).map((item, i) => {
          const id = item.id ?? `flagged-${i}`;
          const title = item.title ?? 'Untitled Content';
          
          return (
          <div key={id} className="border border-border rounded-lg p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.locationOrSource ?? 'Unknown Source'} • {item.reason ?? 'No reason provided'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{item.reportedAgeLabel ?? ''}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {(item.availableActions ?? []).map((action) => (
                <ConfirmModerationAction
                  key={action}
                  action={action as 'approve' | 'remove' | 'flagUser'}
                  itemTitle={title}
                  onConfirm={() => handleAction(action as 'approve' | 'remove' | 'flagUser', id)}
                  isLoading={isActionLoading(action as 'approve' | 'remove' | 'flagUser')}
                  triggerLabel={
                    <Button
                      variant={actionVariant[action as 'approve' | 'remove' | 'flagUser'] ?? 'outline'}
                      size="sm"
                    >
                      {action}
                    </Button>
                  }
                />
              ))}
              {item.targetRoute && (
                <Link
                  to={item.targetRoute}
                  className="text-xs text-primary hover:underline ml-auto"
                >
                  View details
                </Link>
              )}
            </div>
          </div>
        )})}
      </div>

      {items.length > 3 && (
        <p className="text-xs text-muted-foreground mt-3">
          Showing 3 of {items.length} items
        </p>
      )}
    </div>
  );
};