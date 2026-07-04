import { useCallback, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface HelpRequestsToolbarProps {
  search: string;
  category: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export const HelpRequestsToolbar = ({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
  isFiltered,
}: HelpRequestsToolbarProps) => {
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

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Search by user name or location..."
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search help requests by user name or location"
        />
      </div>

      <Select value={category || 'all'} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Medical">Medical</SelectItem>
          <SelectItem value="Towing">Towing</SelectItem>
          <SelectItem value="Fuel">Fuel</SelectItem>
          <SelectItem value="Repair">Repair</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status || 'all'} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} aria-label="Clear all filters">
          <X className="mr-1 h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  );
};
