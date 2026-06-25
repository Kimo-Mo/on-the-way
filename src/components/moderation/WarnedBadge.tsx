import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export function WarnedBadge() {
  return (
    <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
      <AlertTriangle className="h-3 w-3" />
      Warned
    </Badge>
  );
}
