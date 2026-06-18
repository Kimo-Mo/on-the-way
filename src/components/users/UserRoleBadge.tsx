import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types/users';

interface UserRoleBadgeProps {
  role: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  driver: 'Driver',
  serviceProvider: 'Service Provider',
};

const roleVariants = {
  admin: 'default',
  driver: 'outline',
  serviceProvider: 'secondary',
} as const satisfies Record<UserRole, 'default' | 'outline' | 'secondary'>;

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  return (
    <Badge variant={roleVariants[role]}>
      {roleLabels[role]}
    </Badge>
  );
};