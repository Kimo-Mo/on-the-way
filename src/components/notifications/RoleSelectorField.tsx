import { Badge } from '@/components/ui/badge';
import type { NotificationRole } from '@/types/notifications';

const ALL_ROLES: NotificationRole[] = ['Driver', 'ServiceProvider', 'Admin'];

interface RoleSelectorFieldProps {
  selectedRoles: NotificationRole[];
  onChange: (roles: NotificationRole[]) => void;
}

export function RoleSelectorField({ selectedRoles, onChange }: RoleSelectorFieldProps) {
  const toggle = (role: NotificationRole) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ALL_ROLES.map((role) => (
        <Badge
          key={role}
          variant={selectedRoles.includes(role) ? 'default' : 'outline'}
          className="cursor-pointer select-none"
          onClick={() => toggle(role)}
        >
          {role}
        </Badge>
      ))}
    </div>
  );
}