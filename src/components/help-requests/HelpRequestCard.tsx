import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, Stethoscope, Truck, Fuel, Wrench, CloudRain } from 'lucide-react';
import type { HelpRequest } from '@/types/help-requests';
import { HelpRequestStatusBadge } from './HelpRequestStatusBadge';
import { HelpRequestCategoryBadge } from './HelpRequestCategoryBadge';

interface HelpRequestCardProps {
  request: HelpRequest;
  onViewDetails: (id: string) => void;
}

const typeIconMap: Record<string, typeof Truck> = {
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

const typeBgMap: Record<string, string> = {
  MedicalHelp: 'bg-destructive/5 text-destructive',
  CarBreakdown: 'bg-primary/5 text-primary',
  FlatTire: 'bg-warning/5 text-warning',
  Weather: 'bg-info/5 text-info',
  // Legacy aliases
  Medical: 'bg-destructive/5 text-destructive',
  Towing: 'bg-primary/5 text-primary',
  Fuel: 'bg-warning/5 text-warning',
  Repair: 'bg-success/5 text-success',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export const HelpRequestCard = ({ request, onViewDetails }: HelpRequestCardProps) => {
  // Backend returns `type` (not `category`)
  const Icon = typeIconMap[request.type] ?? Truck;
  const bgClass = typeBgMap[request.type] ?? 'bg-primary/5 text-primary';

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col sm:flex-row gap-5 items-center">
        <div className={`${bgClass} rounded-full flex p-4 items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 flex sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Backend returns `type` e.g. "FlatTire" */}
              <HelpRequestCategoryBadge category={request.type} />
              {/* Backend returns `status` e.g. "Pending" */}
              <HelpRequestStatusBadge status={request.status} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              {/* Backend returns `userName` (not nested user.fullName) */}
              <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {getInitials(request.userName)}
              </div>
              <span className="font-medium">{request.userName}</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {/* Backend returns `address` (not `locationText`) */}
                <span className="truncate max-w-50 sm:max-w-xs">{request.address}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center shrink-0 sm:ml-auto">
            <Button
              onClick={() => onViewDetails(request.id)}
              aria-label={`View ${request.type} request from ${request.userName}`}>
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
