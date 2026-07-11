import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useGetNotificationById } from '@/hooks/notifications/useNotifications';
import { NotificationStatusBadge } from './NotificationStatusBadge';
import { deriveNotificationStatus } from '@/types/notifications';
import { AUDIENCE_LABELS } from '@/types/notifications';

interface NotificationDetailsModalProps {
  notificationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDetailsModal({
  notificationId,
  isOpen,
  onClose,
}: NotificationDetailsModalProps) {
  const { data: notification, isLoading, isError } = useGetNotificationById(notificationId ?? '', { enabled: isOpen });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Notification Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4 text-sm mt-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        )}

        {isError && (
          <p className="text-destructive text-sm">Failed to load notification details.</p>
        )}

        {!isLoading && !isError && notification && (
          <div className="space-y-4 text-sm mt-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Status</span>
                <NotificationStatusBadge
                  status={deriveNotificationStatus(notification.publishDate)}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="font-medium">{notification.category}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Audience</span>
                <p className="font-medium">
                  {AUDIENCE_LABELS[
                    notification.targetAudience as keyof typeof AUDIENCE_LABELS
                  ] ?? notification.targetAudience}
                </p>
              </div>
              {(notification.roles ?? []).length > 0 && (
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block mb-1">Roles</span>
                  <div className="flex gap-2 flex-wrap">
                    {(notification.roles ?? []).map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Created</span>
                <p className="font-medium">
                  {notification.createdAt
                    ? new Date(notification.createdAt.endsWith('Z') ? notification.createdAt : notification.createdAt + 'Z').toLocaleString()
                    : '—'}
                </p>
              </div>
              {notification.publishDate && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Publish Date</p>
                  <p className="font-medium">
                    {new Date(notification.publishDate.endsWith('Z') ? notification.publishDate : notification.publishDate + 'Z').toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Title</span>
              <p className="font-semibold">{notification.title}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Message</span>
              <p className="text-sm whitespace-pre-wrap">{notification.content}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
