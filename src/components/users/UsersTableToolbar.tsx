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
import { Search, X, UserPlus } from 'lucide-react';
import { RegisterAdminModal } from './RegisterAdminModal';

interface UsersTableToolbarProps {
  search: string;
  role: string;
  status: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export const UsersTableToolbar = ({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onClearFilters,
  isFiltered,
}: UsersTableToolbarProps) => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prevSearch, setPrevSearch] = useState(search);
  const [inputValue, setInputValue] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setInputValue(search);
  }
  const [isRegisterAdminOpen, setIsRegisterAdminOpen] = useState(false);

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
          placeholder="Search by name or email…"
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search users by name or email"
        />
      </div>

      <Select value={role || 'all'} onValueChange={onRoleChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status || 'all'} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
        </SelectContent>
      </Select>

      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} aria-label="Clear all filters">
          <X className="mr-1 h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}

      <div className="ml-auto">
        <Button variant="default" onClick={() => setIsRegisterAdminOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      <RegisterAdminModal open={isRegisterAdminOpen} onOpenChange={setIsRegisterAdminOpen} />
    </div>
  );
};