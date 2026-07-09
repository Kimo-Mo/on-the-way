import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { NotificationStatus } from '@/types/notifications';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui';
import { CreateNotificationForm } from './CreateNotificationForm';

type FilterOption = NotificationStatus | 'All';

const FILTER_OPTIONS: FilterOption[] = ['All', 'Published', 'Draft', 'Scheduled', 'Failed'];

interface NotificationsListToolbarProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  onCreateNew: () => void;
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
}

export function NotificationsListToolbar({
  activeFilter,
  onFilterChange,
  onCreateNew,
  showCreateForm,
  setShowCreateForm,
}: NotificationsListToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={activeFilter === option ? 'default' : 'outline'}
            onClick={() => onFilterChange(option)}>
            {option}
          </Button>
        ))}
      </div>
      <Button onClick={onCreateNew}>
        <Plus className="h-4 w-4 mr-2" />
        New Notification
      </Button>
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-2xl p-0 border-0 bg-transparent shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>New Notification</DialogTitle>
          </DialogHeader>
          <CreateNotificationForm onClose={() => setShowCreateForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
