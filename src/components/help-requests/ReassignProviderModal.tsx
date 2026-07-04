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
import { getAvailableProviders } from '@/lib/help-requests-fixtures';
import type { HelpRequestCategory } from '@/types/help-requests';

interface ReassignProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestCategory: HelpRequestCategory;
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
