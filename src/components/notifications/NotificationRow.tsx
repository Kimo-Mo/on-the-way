import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, CalendarDays, Users, BellRing } from 'lucide-react';
import type { AdminNotification } from '@/types/notifications';
import { NotificationStatusBadge } from './NotificationStatusBadge';
import { AUDIENCE_LABELS } from '@/types/notifications';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NotificationRowProps {
  notification: AdminNotification;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function NotificationRow({ notification, onDelete, isDeleting }: NotificationRowProps) {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const canDelete = notification.status === 'Draft' || notification.status === 'Scheduled';

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-base truncate">{notification.title}</p>
          <NotificationStatusBadge status={notification.status} />
          {notification.priority === 'High' && <Badge variant="warning">High Priority</Badge>}
          {notification.priority === 'Medium' && <Badge variant="outline">Medium Priority</Badge>}
          {notification.priority === 'Low' && <Badge variant="secondary">Low Priority</Badge>}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <BellRing className="h-3.5 w-3.5" />
            <span>{notification.type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span className="capitalize">
              {notification.targetAudience === 'Broadcast'
                ? 'All users'
                : notification.roles.join(', ')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* View dialog trigger */}
        <Button
          size="icon"
          variant="ghost"
          title="View details"
          onClick={() => setShowViewDialog(true)}>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>

        {/* View details dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm mt-2">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Status</span>
                  <NotificationStatusBadge status={notification.status} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Priority</span>
                  {notification.priority === 'High' && <Badge variant="warning">High</Badge>}
                  {notification.priority === 'Medium' && <Badge variant="outline">Medium</Badge>}
                  {notification.priority === 'Low' && <Badge variant="secondary">Low</Badge>}
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Type</span>
                  <p className="font-medium">{notification.type}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Audience</span>
                  <p className="font-medium">{AUDIENCE_LABELS[notification.targetAudience]}</p>
                </div>
                {notification.roles.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground block mb-1">Roles</span>
                    <div className="flex gap-2 flex-wrap">
                      {notification.roles.map((role) => (
                        <Badge key={role} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Created</span>
                  <p className="font-medium">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                {notification.scheduledAt && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Scheduled At</span>
                    <p className="font-medium">
                      {new Date(notification.scheduledAt).toLocaleString()}
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
                <p className="bg-muted/50 p-3 rounded-md border leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete with confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="ghost" title="Delete" disabled={!canDelete || isDeleting}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
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
              <AlertDialogAction onClick={() => onDelete(notification.id)} variant="destructive">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
