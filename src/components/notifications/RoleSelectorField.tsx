import { Badge } from '@/components/ui/badge';
import type { AdminRole } from '@/types/notifications';

const ALL_ROLES: AdminRole[] = ['Driver', 'ServiceProvider', 'Admin'];

interface RoleSelectorFieldProps {
  selectedRoles: AdminRole[];
  onChange: (roles: AdminRole[]) => void;
}

export function RoleSelectorField({ selectedRoles, onChange }: RoleSelectorFieldProps) {
  const toggle = (role: AdminRole) => {
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