import { useGetModerationSummary } from '@/hooks/useGetModerationSummary';
import {
  ModerationPageHeader,
  FlaggedReportsSection,
  SuspiciousUsersSection,
  PendingModerationQueue,
} from '@/components/moderation';

export function ModerationPanel() {
  const { data: summary, isLoading: summaryLoading } = useGetModerationSummary();

  return (
    <div className="py-7">
      <ModerationPageHeader pendingCount={summary?.totalPendingCount} isLoading={summaryLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlaggedReportsSection />
        <SuspiciousUsersSection />
      </div>
      <div className="bg-card p-4 rounded-lg border border-border shadow-md mt-6">
        <PendingModerationQueue />
      </div>
    </div>
  );
}
