import type { Provider, UpdateProviderStatusPayload } from '@/types/providers';
import {
  ProviderStatusActionDialog,
  ProviderStatusBadge,
  ProviderVerificationBadge,
  ProviderRating,
} from './index';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../ui';

interface ProvidersTableProps {
  providers: Provider[];
  onViewDetails: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string, payload: UpdateProviderStatusPayload) => void;
}

export function ProvidersTable({
  providers,
  onViewDetails,
  onApprove,
  onReject,
}: ProvidersTableProps) {
  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No service providers found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {providers.map((provider) => {
        const initial = provider.businessName.charAt(0).toUpperCase();
        // Colors based on service type can add a nice touch
        const typeColors: Record<string, string> = {
          towing: 'bg-blue-100 text-blue-700',
          medical: 'bg-red-100 text-red-700',
          fuel: 'bg-green-100 text-green-700',
          mechanic: 'bg-purple-100 text-purple-700',
          other: 'bg-gray-100 text-gray-700',
        };
        const avatarBg = typeColors[provider.serviceType] || typeColors.other;
        const canApprove = provider.verificationStatus !== 'missingRequired';

        return (
          <Card key={provider.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col justify-between sm:flex-row items-stretch">
              <div className="flex items-center gap-4">
                {/* Avatar/Logo */}
                <div
                  className={`shrink-0 h-14 w-14 rounded-xl flex items-center justify-center font-bold text-2xl ${avatarBg}`}>
                  {initial}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{provider.businessName}</span>
                    <ProviderStatusBadge status={provider.status} />
                    <ProviderVerificationBadge status={provider.verificationStatus} />
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                    <div className={`px-2 py-0.5 rounded-md text-xs font-medium ${avatarBg}`}>
                      {provider.serviceType.charAt(0).toUpperCase() + provider.serviceType.slice(1)}
                    </div>
                    <span>{provider.operatingArea}</span>
                    <ProviderRating rating={provider.rating} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 shrink-0">
                {provider.status === 'pending' && onApprove && onReject && (
                  <>
                    <ProviderStatusActionDialog
                      action="approve"
                      disabled={!canApprove}
                      trigger={
                        <Button
                          className="bg-success hover:bg-success/80 shadow-none"
                          disabled={!canApprove}
                          title={
                            canApprove
                              ? undefined
                              : 'Required documents must be uploaded before approval.'
                          }>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      }
                      onSubmit={() => onApprove(provider.id)}
                    />
                    <ProviderStatusActionDialog
                      action="reject"
                      trigger={
                        <Button className="bg-destructive hover:bg-destructive/80 shadow-none">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      }
                      onSubmit={(payload) => onReject(provider.id, payload)}
                    />
                  </>
                )}
                <Button
                  className="bg-primary hover:bg-primary/80 shadow-none"
                  onClick={() => onViewDetails(provider.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
