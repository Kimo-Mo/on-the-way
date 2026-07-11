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

interface DeleteNotificationModalProps {
  notificationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function DeleteNotificationModal({
  notificationId,
  isOpen,
  onClose,
  onDelete,
  isDeleting,
}: DeleteNotificationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this notification?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the notification.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(notificationId ?? '')}
            variant="destructive"
            disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
