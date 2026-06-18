import { Badge } from '@/components/ui/badge';
import type { UserStatus } from '@/types/users';

interface UserStatusBadgeProps {
  status: UserStatus;
}

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  const capitalized = status.charAt(0).toUpperCase() + status.slice(1);

  const variants: Record<UserStatus, string> = {
    active: 'bg-green-500/15 text-green-700 border-green-200 dark:text-green-400',
    suspended: 'bg-destructive/10 text-destructive border-destructive/20',
    pending: 'bg-amber-500/15 text-amber-700 border-amber-200 dark:text-amber-400',
  };

  return <Badge variant="outline" className={variants[status]}>{capitalized}</Badge>;
};