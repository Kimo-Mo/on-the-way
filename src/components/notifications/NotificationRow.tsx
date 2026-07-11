import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, CalendarDays, BellRing } from 'lucide-react';
import type { AdminNotification } from '@/types/notifications';
import { deriveNotificationStatus } from '@/types/notifications';
import { NotificationStatusBadge } from './NotificationStatusBadge';
import { NotificationDetailsModal } from './NotificationDetailsModal';
import { DeleteNotificationModal } from './DeleteNotificationModal';

interface NotificationRowProps {
  notification: AdminNotification;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function NotificationRow({ notification, onDelete, isDeleting }: NotificationRowProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const status = deriveNotificationStatus(notification.publishDate);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-base truncate">{notification.title}</p>
          <NotificationStatusBadge status={status} />
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <BellRing className="h-3.5 w-3.5" />
            <span>{notification.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>
              {notification.publishDate ? new Date(notification.publishDate.endsWith('Z') ? notification.publishDate : notification.publishDate + 'Z').toLocaleDateString() : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="icon"
          variant="ghost"
          title="View details"
          onClick={() => setShowDetails(true)}>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          title="Delete"
          disabled={isDeleting}
          onClick={() => setShowDelete(true)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <NotificationDetailsModal
        notificationId={notification.id ?? null}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      <DeleteNotificationModal
        notificationId={notification.id ?? null}
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
