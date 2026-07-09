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

interface ReportsToolbarProps {
  search: string;
  obstacleType: string;
  sortOrder: string;
  onSearchChange: (value: string) => void;
  onObstacleTypeChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export const ReportsToolbar = ({
  search,
  obstacleType,
  sortOrder,
  onSearchChange,
  onObstacleTypeChange,
  onSortOrderChange,
  onClearFilters,
  isFiltered,
}: ReportsToolbarProps) => {
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
          placeholder="Search by location or description…"
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search reports by location or description"
        />
      </div>

      <Select value={obstacleType || 'all'} onValueChange={onObstacleTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Collision">Collision</SelectItem>
          <SelectItem value="RoadClosure">Road Closure</SelectItem>
          <SelectItem value="Obstacle">Obstacle</SelectItem>
          <SelectItem value="SevereWeather">Severe Weather</SelectItem>
          <SelectItem value="VehicleBreakdown">Vehicle Breakdown</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Latest</SelectItem>
          <SelectItem value="asc">Oldest</SelectItem>
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
