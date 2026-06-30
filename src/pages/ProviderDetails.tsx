import { useParams, useNavigate } from 'react-router';
import { useProviderDetails, useUpdateProviderStatus } from '@/hooks/providers/useProviders';
import {
  ProviderDetailsSummary,
  VerificationDocumentsPanel,
  CustomerReviewsPanel,
  ProviderStatusActionDialog,
} from '@/components/providers';
import { canApproveProvider, getProviderStatusActionAvailability } from '@/types/providers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, ArrowLeft, MapPin, Building } from 'lucide-react';

export default function ProviderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: provider, isLoading, isError, refetch } = useProviderDetails(id);
  const { mutate: updateStatus } = useUpdateProviderStatus();

  if (isError) {
    return (
      <div>
        <Button variant="ghost" onClick={() => navigate('/providers')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load provider details.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RotateCcw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || !provider) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/providers')} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 border rounded-lg h-100 bg-muted/20 animate-pulse" />
          <div className="md:col-span-2 space-y-6">
            <div className="border rounded-lg h-62.5 bg-muted/20 animate-pulse" />
            <div className="border rounded-lg h-62.5 bg-muted/20 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Button variant="ghost" onClick={() => navigate('/providers')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <ProviderDetailsSummary provider={provider} />

          <div className="flex flex-col gap-3 w-full">
            <ProviderStatusActionDialog
              action="approve"
              trigger={
                <Button
                  className="w-full bg-success hover:bg-success/80"
                  disabled={!canApproveProvider(provider)}>
                  Approve Provider
                </Button>
              }
              onSubmit={(payload) => updateStatus({ id: provider.id, payload })}
            />
            <ProviderStatusActionDialog
              action="reject"
              trigger={
                <Button
                  className="w-full bg-destructive hover:bg-destructive/80"
                  disabled={!getProviderStatusActionAvailability(provider).canReject}>
                  Reject Provider
                </Button>
              }
              onSubmit={(payload) => updateStatus({ id: provider.id, payload })}
            />
            <ProviderStatusActionDialog
              action="suspend"
              trigger={
                <Button
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                  disabled={!getProviderStatusActionAvailability(provider).canSuspend}>
                  Suspend Provider
                </Button>
              }
              onSubmit={(payload) => updateStatus({ id: provider.id, payload })}
            />
          </div>

          {provider.latestStatusDecision &&
            (provider.status === 'rejected' || provider.status === 'suspended') && (
              <div className="bg-card rounded-md border p-6 space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  Latest Decision
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Action:</span>{' '}
                    <span className="capitalize">{provider.latestStatusDecision.action}</span>
                  </p>
                  <p>
                    <span className="font-medium">Reason:</span>{' '}
                    {provider.latestStatusDecision.reason}
                  </p>
                  {provider.latestStatusDecision.notes && (
                    <p>
                      <span className="font-medium">Notes:</span>{' '}
                      {provider.latestStatusDecision.notes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Decided at {new Date(provider.latestStatusDecision.decidedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-md border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building />
              Business Information
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {provider.description || 'No description provided.'}
            </p>
            <div className="bg-primary/5 border border-primary/10 rounded-md p-4">
              <p className="text-xs font-semibold text-primary mb-1">Service Area</p>
              <p className="text-sm text-primary">{provider.operatingArea}</p>
            </div>
          </div>

          <VerificationDocumentsPanel
            documents={provider.documents}
            missingRequiredTypes={provider.missingRequiredDocumentTypes}
          />

          <div className="bg-card rounded-md border p-6">
            <h3 className="text-lg font-semibold mb-4">Service Area Map</h3>
            <div className="bg-muted/30 rounded-md h-62.5 flex flex-col items-center justify-center border">
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-primary">{provider.operatingArea}</span>
            </div>
          </div>

          <CustomerReviewsPanel rating={provider.rating} recentReviews={provider.recentReviews} />
        </div>
      </div>
    </div>
  );
}
