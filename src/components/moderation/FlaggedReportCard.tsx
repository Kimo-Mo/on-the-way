import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { FlaggedReport, ModerationActionPayload } from '@/types/moderation';
import { FlagReasonBadge } from './FlagReasonBadge';
import { WarnedBadge } from './WarnedBadge';
import { ModerationConfirmDialog } from './ModerationConfirmDialog';
import { ThumbsDown } from 'lucide-react';

interface FlaggedReportCardProps {
  report: FlaggedReport;
  onAction: (payload: ModerationActionPayload) => void;
  isPending: boolean;
}

export function FlaggedReportCard({ report, onAction, isPending }: FlaggedReportCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border hover:border-destructive transition-all duration-200 bg-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-sm">{report.reportTitle}</p>
          <p className="text-muted-foreground text-xs">{report.location}</p>
          <p className="text-destructive text-xs flex items-center gap-1">
            <ThumbsDown size={14} /> {report.downvoteCount} downvotes
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FlagReasonBadge reason={report.flagReason} />
        {report.warnedAt !== null && <WarnedBadge />}
      </div>

      <p className="text-xs text-muted-foreground">by {report.submittingUser.displayName}</p>

      <div className="flex items-center gap-2">
        <Button
          variant="default"
          className="bg-success hover:bg-success/80"
          disabled={isPending}
          onClick={() =>
            onAction({ targetType: 'report', targetId: report.id, action: 'approve' })
          }>
          Approve
        </Button>
        <Button variant="destructive" disabled={isPending} onClick={() => setDialogOpen(true)}>
          Remove
        </Button>
        <Button
          variant="secondary"
          className="bg-slate-700 text-white hover:bg-slate-800"
          disabled={isPending}
          onClick={() =>
            onAction({ targetType: 'report', targetId: report.id, action: 'warnUser' })
          }>
          Warn User
        </Button>
      </div>

      <ModerationConfirmDialog
        open={dialogOpen}
        title="Remove Report"
        description={`This will permanently remove "${report.reportTitle}" from the platform. This action cannot be undone.`}
        onConfirm={() => {
          setDialogOpen(false);
          onAction({ targetType: 'report', targetId: report.id, action: 'remove' });
        }}
        onCancel={() => setDialogOpen(false)}
        isPending={isPending}
      />
    </div>
  );
}
