import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'complete' | 'cancel';
  onConfirm: () => void;
  isLoading: boolean;
}

export const ConfirmStatusDialog = ({
  open,
  onOpenChange,
  action,
  onConfirm,
  isLoading,
}: ConfirmStatusDialogProps) => {
  const title = action === 'complete' ? 'Mark as Completed' : 'Cancel Request';
  const description =
    action === 'complete'
      ? 'Are you sure you want to mark this request as completed? This action cannot be undone.'
      : 'Are you sure you want to cancel this help request? This action cannot be undone.';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go back</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Processing...' : title}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
