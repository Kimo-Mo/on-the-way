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
import type { ProviderServiceType, ProviderStatus } from '@/types/providers';

interface ProvidersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: ProviderServiceType | 'all';
  onTypeChange: (value: ProviderServiceType | 'all') => void;
  status: ProviderStatus | 'all';
  onStatusChange: (value: ProviderStatus | 'all') => void;
  onClearFilters: () => void;
}

export function ProvidersToolbar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  onClearFilters,
}: ProvidersToolbarProps) {
  const hasFilters = search !== '' || type !== 'all' || status !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 w-full">
      <div className="relative flex-1 w-full min-w-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, contact, location..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search providers"
        />
      </div>

      <Select
        value={type}
        onValueChange={(val) => onTypeChange(val as ProviderServiceType | 'all')}>
        <SelectTrigger className="w-40" aria-label="Filter by service type">
          <SelectValue placeholder="Service Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="towing">Towing</SelectItem>
          <SelectItem value="medical">Medical</SelectItem>
          <SelectItem value="fuel">Fuel</SelectItem>
          <SelectItem value="mechanic">Mechanic</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(val) => onStatusChange(val as ProviderStatus | 'all')}>
        <SelectTrigger className="w-40" aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="px-2 lg:px-3 text-muted-foreground hover:text-foreground"
          aria-label="Clear filters">
          <X className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Clear</span>
        </Button>
      )}
    </div>
  );
}
