import { useParams, useNavigate } from 'react-router';
import {
  useHelpRequestDetails,
  useUpdateHelpRequestStatus,
  useReassignProvider,
} from '@/hooks/help-requests/useHelpRequests';
import { PageError } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  HelpRequestStatusBadge,
  HelpRequestCategoryBadge,
  HelpRequestMap,
  ActionPanel,
  ConfirmStatusDialog,
  ContactUserModal,
} from '@/components/help-requests';
import { useState } from 'react';
import { ChevronLeft, MapPin } from 'lucide-react';

const HelpRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: request, isLoading, isError } = useHelpRequestDetails(id ?? '');
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateHelpRequestStatus();
  const { isPending: isReassigning } = useReassignProvider();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'complete' | 'cancel';
  }>({ open: false, action: 'complete' });
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleMarkCompleted = () => {
    setConfirmDialog({ open: true, action: 'complete' });
  };
  const handleCancelRequest = () => {
    setConfirmDialog({ open: true, action: 'cancel' });
  };
  const handleConfirmAction = () => {
    if (!id) return;
    updateStatus(
      { id, newStatus: confirmDialog.action === 'complete' ? 'Completed' : 'Cancelled' },
      { onSuccess: () => setConfirmDialog((prev) => ({ ...prev, open: false })) }
    );
  };
  const handleContactUser = () => setContactModalOpen(true);

  return (
    <section className="py-7 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/help-requests')}>
          <ChevronLeft /> Back to Requests
        </Button>
      </div>
      {isError && <PageError message="Request not found or failed to load." />}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        </div>
      ) : request ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Request Description</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <HelpRequestCategoryBadge category={request.type} />
                  <HelpRequestStatusBadge status={request.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Submitted: {request.createdAt ? new Date(request.createdAt).toLocaleString() : '—'}
                </p>
                {request.description && (
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                )}
                <div className="bg-primary/5 text-primary p-3 rounded-lg border border-primary/50 flex flex-col gap-3">
                  <p className="font-medium"><MapPin className="inline-block w-4 h-4 " /> Location:</p>
                  <p>{request.address ?? '—'}</p>
                  <p>Coordinates: {request.latitude ?? '—'}, {request.longitude ?? '—'}</p>
                </div>
              </CardContent>
            </Card>
            <HelpRequestMap
              coordinates={
                request.latitude != null && request.longitude != null
                  ? { lat: request.latitude, lng: request.longitude }
                  : null
              }
              locationText={request.address ?? ''}
            />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{request.user?.name ?? '—'}</p>
                <p className="text-sm text-muted-foreground">Phone: {request.user?.phone ?? 'N/A'}</p>
                <p className="text-sm text-muted-foreground">Email: {request.user?.email ?? 'N/A'}</p>
              </CardContent>
            </Card>
            <ActionPanel
              request={request}
              onMarkCompleted={handleMarkCompleted}
              onCancelRequest={handleCancelRequest}
              onReassignProvider={() => {}}
              onContactUser={handleContactUser}
              isUpdatingStatus={isUpdatingStatus}
              isReassigning={isReassigning}
            />
          </div>
        </div>
      ) : null}
      <ConfirmStatusDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        action={confirmDialog.action}
        onConfirm={handleConfirmAction}
        isLoading={isUpdatingStatus}
      />
      {request && (
        <ContactUserModal
          open={contactModalOpen}
          onOpenChange={setContactModalOpen}
          user={request.user ?? { name: '', phone: '', email: '' }}
        />
      )}
    </section>
  );
};

export default HelpRequestDetailsPage;
