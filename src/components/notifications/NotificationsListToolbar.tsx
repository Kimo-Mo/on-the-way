import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, X } from 'lucide-react';
import type { NotificationType } from '@/types/notifications';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui';
import { CreateNotificationForm } from './CreateNotificationForm';

const CATEGORY_OPTIONS: NotificationType[] = ['Maintenance', 'Policy', 'Safety', 'Legal', 'Event'];

interface NotificationsListToolbarProps {
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCreateNew: () => void;
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
}

export function NotificationsListToolbar({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onCreateNew,
  showCreateForm,
  setShowCreateForm,
}: NotificationsListToolbarProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prevSearch, setPrevSearch] = useState(search);
  const [inputValue, setInputValue] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setInputValue(search);
  }

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 300);
    },
    [onSearchChange]
  );

  const isFiltered = search.length > 0 || category.length > 0;

  const handleClearFilters = () => {
    setInputValue('');
    onSearchChange('');
    onCategoryChange('');
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Search notifications…"
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search notifications by title"
        />
      </div>

      <Select value={category || 'all'} onValueChange={(val) => onCategoryChange(val === 'all' ? '' : val)}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORY_OPTIONS.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters} aria-label="Clear all filters">
          <X className="mr-1 h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}

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
