import { Badge } from '@/components/ui/badge';
import { incidentTypeLabels } from '@/types/reports';

interface ObstacleTypeBadgeProps {
  type: string;
}

export const ObstacleTypeBadge = ({ type }: ObstacleTypeBadgeProps) => {
  const label = incidentTypeLabels[type] ?? type;
  return (
    <Badge variant="outline" className="text-blue-700 border-blue-200 dark:text-blue-400">
      {label}
    </Badge>
  );
};