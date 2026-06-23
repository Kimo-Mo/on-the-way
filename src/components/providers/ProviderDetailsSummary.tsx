import type { ProviderDetails } from '@/types/providers';
import { ProviderRating, ProviderStatusBadge, ProviderVerificationBadge } from './index';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ProviderDetailsSummaryProps {
  provider: ProviderDetails;
}

export function ProviderDetailsSummary({ provider }: ProviderDetailsSummaryProps) {
  const initial = provider.businessName.charAt(0).toUpperCase();
  const typeColors: Record<string, string> = {
    towing: 'bg-primary text-white',
    medical: 'bg-destructive text-white',
    fuel: 'bg-success text-white',
    mechanic: 'bg-warning text-white',
    other: 'bg-muted text-white',
  };
  const avatarBg = typeColors[provider.serviceType] || typeColors.other;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-md border text-center">
      <div
        className={`h-24 w-24 rounded-full flex items-center justify-center text-4xl font-bold mb-4 ${avatarBg}`}>
        {initial}
      </div>

      <h2 className="text-2xl font-bold">{provider.businessName}</h2>
      <p className="text-muted-foreground capitalize mb-3">{provider.serviceType}</p>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <ProviderStatusBadge status={provider.status} />
        <ProviderVerificationBadge status={provider.verificationStatus} />
      </div>

      <ProviderRating rating={provider.rating} className="mb-6 justify-center" />

      <div className="w-full space-y-4 text-left border-t pt-4 mt-2">
        {provider.email && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{provider.email}</span>
          </div>
        )}

        {provider.phone && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{provider.phone}</span>
          </div>
        )}

        {provider.address && (
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{provider.address}</span>
          </div>
        )}
      </div>

      {provider.description && (
        <div className="w-full text-left mt-6 pt-4 border-t text-sm">
          <p>{provider.description}</p>
        </div>
      )}
    </div>
  );
}
