import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { SuspiciousUser, ModerationActionPayload } from '@/types/moderation';
import { ModerationConfirmDialog } from './ModerationConfirmDialog';

interface SuspiciousUserCardProps {
  user: SuspiciousUser;
  onAction: (payload: ModerationActionPayload) => void;
  isPending: boolean;
}

export function SuspiciousUserCard({ user, onAction, isPending }: SuspiciousUserCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border hover:border-destructive transition-all duration-200 bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="bg-destructive/20 text-destructive rounded-full size-12 flex items-center justify-center text-lg font-bold">
          {user.displayName.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-sm">{user.displayName}</p>
          <p className="text-xs text-muted-foreground">Trust Score: {user.trustScore}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {user.reportCount} reports · {user.warningCount} warnings
      </p>

      <p className="text-xs text-muted-foreground italic">{user.activitySummary}</p>

      <div className="flex items-center gap-2">
        <Button
          className="text-destructive border border-warning/20 bg-warning/10 hover:bg-warning/20 hover:text-destructive"
          disabled={isPending}
          onClick={() => onAction({ targetType: 'user', targetId: user.id, action: 'warn' })}>
          Warn
        </Button>
        <Button variant="destructive" disabled={isPending} onClick={() => setDialogOpen(true)}>
          Suspend
        </Button>
        <Button
          variant="secondary"
          className="bg-slate-700 text-white hover:bg-slate-800"
          disabled={isPending}
          onClick={() =>
            onAction({ targetType: 'user', targetId: user.id, action: 'flagToAdmin' })
          }>
          Flag to Admin
        </Button>
      </div>

      <ModerationConfirmDialog
        open={dialogOpen}
        title="Suspend User"
        description={`This will deactivate ${user.displayName}'s account. To reinstate the account, visit the User Details page.`}
        onConfirm={() => {
          setDialogOpen(false);
          onAction({ targetType: 'user', targetId: user.id, action: 'suspend' });
        }}
        onCancel={() => setDialogOpen(false)}
        isPending={isPending}
      />
    </div>
  );
}
