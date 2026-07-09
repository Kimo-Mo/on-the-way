import { Badge } from '@/components/ui/badge';
import { Stethoscope, Truck, Fuel, Wrench, CloudRain } from 'lucide-react';

interface HelpRequestCategoryBadgeProps {
  category: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Backend AssistanceType enum names
  MedicalHelp: Stethoscope,
  CarBreakdown: Truck,
  FlatTire: Fuel,
  Weather: CloudRain,
  // Legacy aliases
  Medical: Stethoscope,
  Towing: Truck,
  Fuel: Fuel,
  Repair: Wrench,
};

const labelMap: Record<string, string> = {
  MedicalHelp: 'Medical Help',
  CarBreakdown: 'Car Breakdown',
  FlatTire: 'Flat Tire',
  Weather: 'Weather',
};

export const HelpRequestCategoryBadge = ({ category }: HelpRequestCategoryBadgeProps) => {
  const Icon = iconMap[category] ?? Truck;
  const label = labelMap[category] ?? category;

  return (
    <Badge variant="outline" className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};
