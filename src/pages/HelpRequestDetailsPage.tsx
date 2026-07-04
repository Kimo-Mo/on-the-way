import { useParams, useNavigate } from 'react-router';
import {
  useHelpRequestDetails,
  useUpdateHelpRequestStatus,
  useReassignProvider,
} from '@/hooks/help-requests/useHelpRequests';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  HelpRequestStatusBadge,
  HelpRequestCategoryBadge,
  HelpRequestMap,
  RequestTimeline,
  ActionPanel,
  ConfirmStatusDialog,
  ReassignProviderModal,
  ContactUserModal,
} from '@/components/help-requests';
import { useState } from 'react';
import { ChevronLeft, MapPin } from 'lucide-react';

const HelpRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useHelpRequestDetails(id ?? '');
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateHelpRequestStatus();
  const { mutate: doReassign, isPending: isReassigning } = useReassignProvider();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'complete' | 'cancel';
  }>({
    open: false,
    action: 'complete',
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  const handleMarkCompleted = () => {
    setConfirmDialog({ open: true, action: 'complete' });
  };

  const handleCancelRequest = () => {
    setConfirmDialog({ open: true, action: 'cancel' });
  };

  const handleConfirmAction = () => {
    updateStatus(
      { id: id!, newStatus: confirmDialog.action === 'complete' ? 'Completed' : 'Assigned' },
      { onSuccess: () => setConfirmDialog((prev) => ({ ...prev, open: false })) }
    );
  };

  const handleReassignProvider = () => {
    setReassignModalOpen(true);
  };

  const handleContactUser = () => {
    setContactModalOpen(true);
  };

  return (
    <section className="py-7 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/help-requests')}>
          <ChevronLeft /> Back to Requests
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>Request not found or failed to load.</AlertDescription>
        </Alert>
      )}

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
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Description */}
            <Card>
              <CardHeader>
                <CardTitle>Request Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <HelpRequestCategoryBadge category={data.request.category} />
                  <HelpRequestStatusBadge status={data.request.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Submitted: {new Date(data.request.createdAt).toLocaleString()}
                </p>
                <div className="bg-primary/5 text-primary p-3 rounded-lg border border-primary/50 flex flex-col gap-3">
                  <p className="font-medium">
                    <MapPin className="inline-block w-4 h-4 " /> Location:
                  </p>
                  <p>{data.request.locationText}</p>
                  <p>
                    Coordinates: {data.request.coordinates.lat}, {data.request.coordinates.lng}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location on Map */}
            <HelpRequestMap
              coordinates={data.request.coordinates}
              locationText={data.request.locationText}
            />

            {/* Request Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Request Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <RequestTimeline timeline={data.timeline} />
              </CardContent>
            </Card>
          </div>

          {/* Right column — action panel */}
          <div className="space-y-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{data.request.user.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  Phone: {data.request.user.phone ?? 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {data.request.user.email ?? 'N/A'}
                </p>
              </CardContent>
            </Card>

            {/* Assigned Provider */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Provider</CardTitle>
              </CardHeader>
              <CardContent>
                {data.request.provider ? (
                  <div className="space-y-2">
                    <p className="font-medium">{data.request.provider.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Type: {data.request.provider.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Rating: {data.request.provider.rating.toFixed(1)} ★
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ETA: {data.request.provider.etaMinutes} minutes
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Unassigned</p>
                )}
              </CardContent>
            </Card>

            <ActionPanel
              request={data.request}
              onMarkCompleted={handleMarkCompleted}
              onCancelRequest={handleCancelRequest}
              onReassignProvider={handleReassignProvider}
              onContactUser={handleContactUser}
              isUpdatingStatus={isUpdatingStatus}
              isReassigning={isReassigning}
            />
          </div>
        </div>
      ) : null}

      {/* Confirmation dialog */}
      <ConfirmStatusDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        action={confirmDialog.action}
        onConfirm={handleConfirmAction}
        isLoading={isUpdatingStatus}
      />

      {/* ContactUserModal */}
      {data && (
        <ContactUserModal
          open={contactModalOpen}
          onOpenChange={setContactModalOpen}
          user={data.request.user}
        />
      )}

      {/* ReassignProviderModal */}
      {data && (
        <ReassignProviderModal
          open={reassignModalOpen}
          onOpenChange={setReassignModalOpen}
          requestCategory={data.request.category}
          currentProviderId={data.request.provider?.id ?? null}
          onReassign={(providerId) => {
            doReassign({ id: id!, providerId });
            setReassignModalOpen(false);
          }}
          isLoading={isReassigning}
        />
      )}
    </section>
  );
};

export default HelpRequestDetailsPage;
