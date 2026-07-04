import { Badge } from '@/components/ui/badge';
import { Stethoscope, Truck, Fuel, Wrench } from 'lucide-react';
import type { HelpRequestCategory } from '@/types/help-requests';

interface HelpRequestCategoryBadgeProps {
  category: HelpRequestCategory;
}

const iconMap: Record<HelpRequestCategory, React.ComponentType<{ className?: string }>> = {
  Medical: Stethoscope,
  Towing: Truck,
  Fuel: Fuel,
  Repair: Wrench,
};

export const HelpRequestCategoryBadge = ({ category }: HelpRequestCategoryBadgeProps) => {
  const Icon = iconMap[category];

  return (
    <Badge variant="outline" className="gap-1">
      <Icon className="h-3 w-3" />
      {category}
    </Badge>
  );
};
