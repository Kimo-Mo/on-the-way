import { Badge } from '@/components/ui/badge';
import type { ObstacleType } from '@/types/reports';
import { obstacleTypeLabels } from '@/types/reports';

interface ObstacleTypeBadgeProps {
  type: ObstacleType;
}

export const ObstacleTypeBadge = ({ type }: ObstacleTypeBadgeProps) => {
  return <Badge variant="outline" className="text-blue-700 border-blue-200 dark:text-blue-400">
    {obstacleTypeLabels[type]}
  </Badge>;
};