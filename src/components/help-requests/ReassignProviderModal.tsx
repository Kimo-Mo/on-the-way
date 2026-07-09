import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
interface ProviderOption {
  id: string;
  name: string;
  rating: number;
  etaMinutes: number;
}

/** @mock Inline mock — no backend endpoint for listing providers by category. */
const getAvailableProviders = (category: string): ProviderOption[] => {
  const providersByCategory: Record<string, ProviderOption[]> = {
    MedicalHelp: [
      { id: 'prov_med_1', name: 'Cairo Medical Response', rating: 4.8, etaMinutes: 12 },
      { id: 'prov_med_2', name: 'Nile First Aid', rating: 4.5, etaMinutes: 18 },
    ],
    CarBreakdown: [
      { id: 'prov_tow_1', name: 'Express Towing Co.', rating: 4.6, etaMinutes: 20 },
      { id: 'prov_tow_2', name: 'Ring Road Rescue', rating: 4.3, etaMinutes: 25 },
    ],
    FlatTire: [
      { id: 'prov_fuel_1', name: 'Fuel Express Cairo', rating: 4.7, etaMinutes: 15 },
      { id: 'prov_fuel_2', name: 'Quick Fuel Delivery', rating: 4.4, etaMinutes: 22 },
    ],
    Weather: [
      { id: 'prov_rep_1', name: 'Mobile Mechanic Plus', rating: 4.5, etaMinutes: 30 },
      { id: 'prov_rep_2', name: 'Roadside Repair Experts', rating: 4.2, etaMinutes: 35 },
    ],
  };
  return providersByCategory[category] ?? [];
};

interface ReassignProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestCategory: string;
  currentProviderId: string | null;
  onReassign: (providerId: string) => void;
  isLoading: boolean;
}

export const ReassignProviderModal = ({
  open,
  onOpenChange,
  requestCategory,
  currentProviderId,
  onReassign,
  isLoading,
}: ReassignProviderModalProps) => {
  const providers = getAvailableProviders(requestCategory);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(currentProviderId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign Provider</DialogTitle>
          <DialogDescription>
            Select a new provider for this help request. Only providers matching the request category are shown.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto space-y-1">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProviderId(provider.id)}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                selectedProviderId === provider.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted border border-transparent'
              }`}
            >
              <p className="font-medium text-sm">{provider.name}</p>
              <p className="text-xs text-muted-foreground">
                Rating: {provider.rating.toFixed(1)} ★ · ETA: {provider.etaMinutes} min
              </p>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedProviderId) {
                onReassign(selectedProviderId);
              }
            }}
            disabled={selectedProviderId === null || isLoading}
          >
            {isLoading ? 'Reassigning...' : 'Reassign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
