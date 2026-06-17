import { Link } from 'react-router';
import type { ActivityEvent } from '@/types/dashboard';
import { DashboardPanel } from './DashboardPanel';
import {
  FileText,
  CheckCircle,
  Building2,
  Flag,
  Megaphone,
  Info,
} from 'lucide-react';

interface RecentActivityProps {
  events: ActivityEvent[];
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
}

const typeIcons: Record<ActivityEvent['type'], typeof FileText> = {
  reportSubmitted: FileText,
  reportVerified: CheckCircle,
  providerRegistered: Building2,
  userFlagged: Flag,
  announcementPublished: Megaphone,
  system: Info,
};

const typeLabels: Record<ActivityEvent['type'], string> = {
  reportSubmitted: 'Report submitted',
  reportVerified: 'Report verified',
  providerRegistered: 'Provider registered',
  userFlagged: 'User flagged',
  announcementPublished: 'Announcement',
  system: 'System',
};

const toneStyles: Record<NonNullable<ActivityEvent['tone']>, string> = {
  default: 'border-l-border',
  success: 'border-l-success',
  warning: 'border-l-warning',
  danger: 'border-l-destructive',
  info: 'border-l-info',
};

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export const RecentActivity = ({ events, isLoading, error, isEmpty }: RecentActivityProps) => {
  if (isLoading) {
    return (
      <DashboardPanel title="Recent Activity" isLoading={true}>
        <></>
      </DashboardPanel>
    );
  }

  if (error) {
    return (
      <DashboardPanel title="Recent Activity" isError={true} errorMessage="Unable to load activity">
        <></>
      </DashboardPanel>
    );
  }

  if (isEmpty || events.length === 0) {
    return (
      <DashboardPanel title="Recent Activity" isEmpty={true} emptyMessage="No recent activity">
        <></>
      </DashboardPanel>
    );
  }

  return (
    <DashboardPanel title="Recent Activity">
      <div className="space-y-3">
        {events.slice(0, 5).map((event) => {
          const Icon = typeIcons[event.type];
          const toneStyle = toneStyles[event.tone || 'default'];
          const timeLabel = formatRelativeTime(event.timestamp);

          const content = (
            <div className={`flex items-start gap-3 pl-2 border-l-2 ${toneStyle}`}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {typeLabels[event.type]} • {timeLabel}
                </p>
              </div>
            </div>
          );

          if (event.targetRoute) {
            return (
              <Link
                key={event.id}
                to={event.targetRoute}
                className="block focus:outline-none">
                {content}
              </Link>
            );
          }

          return <div key={event.id}>{content}</div>;
        })}
      </div>
    </DashboardPanel>
  );
};