import { Badge } from '@/components/ui/badge';

interface UserRoleBadgeProps {
  role: string;
}

const roleLabels: Record<string, string> = {
  Admin: 'Admin',
  User: 'User',
  // Legacy labels kept for backward compatibility
  admin: 'Admin',
  driver: 'Driver',
  serviceProvider: 'Service Provider',
};

const roleVariants: Record<string, 'default' | 'outline' | 'secondary'> = {
  Admin: 'default',
  User: 'outline',
  // Legacy
  admin: 'default',
  driver: 'outline',
  serviceProvider: 'secondary',
};

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const label = roleLabels[role] ?? role;
  const variant = roleVariants[role] ?? 'outline';
  return <Badge variant={variant}>{label}</Badge>;
};