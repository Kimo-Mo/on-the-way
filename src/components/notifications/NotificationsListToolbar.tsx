import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { NotificationStatus } from '@/types/notifications';

type FilterOption = NotificationStatus | 'All';

const FILTER_OPTIONS: FilterOption[] = ['All', 'Published', 'Draft', 'Scheduled', 'Failed'];

interface NotificationsListToolbarProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  onCreateNew: () => void;
}

export function NotificationsListToolbar({
  activeFilter,
  onFilterChange,
  onCreateNew,
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
    </div>
  );
}
