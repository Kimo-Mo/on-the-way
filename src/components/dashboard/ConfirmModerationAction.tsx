import { useState } from 'react';
import type { ReactElement } from 'react';
import { Button } from '@/components/ui';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { FlaggedContentAction } from '@/types/dashboard';

interface ConfirmModerationActionProps {
  triggerLabel: ReactElement;
  action: FlaggedContentAction;
  itemTitle: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const actionLabels: Record<FlaggedContentAction, string> = {
  approve: 'Approve',
  remove: 'Remove',
  flagUser: 'Flag User',
};

const actionDescriptions: Record<FlaggedContentAction, string> = {
  approve: 'This will approve the flagged content and make it visible.',
  remove: 'This will remove the flagged content permanently.',
  flagUser: 'This will flag the user for review.',
};

export const ConfirmModerationAction = ({
  triggerLabel,
  action,
  itemTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModerationActionProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerLabel}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm {actionLabels[action]}</DialogTitle>
          <DialogDescription>
            {actionDescriptions[action]} Proceed with this action?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Item: {itemTitle}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant={action === 'approve' ? 'default' : 'destructive'} 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : actionLabels[action]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};