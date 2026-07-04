import type { TimelineEvent } from '@/types/help-requests';

interface RequestTimelineProps {
  timeline: TimelineEvent[];
}

export const RequestTimeline = ({ timeline }: RequestTimelineProps) => {
  if (timeline.length === 0) {
    return <p className="text-muted-foreground">No timeline events.</p>;
  }

  return (
    <div className="relative">
      {timeline.map((event, index) => (
        <div key={event.id} className="flex gap-4 relative">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary mt-1 shrink-0 z-10" />
            {index < timeline.length - 1 && (
              <div className="absolute left-1.5 top-4 bottom-0 w-px bg-border" />
            )}
          </div>
          <div className="pb-6">
            <p className="font-medium text-sm">{event.eventLabel}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(event.timestamp).toLocaleString()}
            </p>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
