import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFlagUser } from '@/hooks/useReports';
import { UserX } from 'lucide-react';

interface FlagUserDialogProps {
  reportId: string;
  submitterName: string;
  onSuccess: () => void;
  className?: string;
}

export const FlagUserDialog = ({ reportId, submitterName, onSuccess, className }: FlagUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const flagMutation = useFlagUser();

  const handleFlag = async () => {
    try {
      await flagMutation.mutateAsync(reportId);
      setOpen(false);
      onSuccess();
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>Flag User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <UserX className="mx-auto h-10 w-10 text-destructive mb-2" />
          <DialogTitle>Flag User</DialogTitle>
          <DialogDescription>
            Are you sure you want to flag <strong>{submitterName}</strong> for moderation review?
            This will notify the moderation team to review the user's account for policy violations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleFlag}
            disabled={flagMutation.isPending}
          >
            {flagMutation.isPending ? 'Flagging...' : 'Flag User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};