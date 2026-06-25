import { Button } from '@/components/ui/button';
import { AUDIENCE_LABELS } from '@/types/notifications';
import type { NotificationAudience } from '@/types/notifications';

interface AudienceSelectorProps {
  value: NotificationAudience;
  onChange: (audience: NotificationAudience) => void;
}

const AUDIENCE_OPTIONS: NotificationAudience[] = ['Broadcast', 'SpecificRoles'];

export function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {AUDIENCE_OPTIONS.map((option) => (
        <Button
          key={option}
          type="button"
          variant={value === option ? 'default' : 'outline'}
          onClick={() => onChange(option)}>
          {AUDIENCE_LABELS[option]}
        </Button>
      ))}
    </div>
  );
}
