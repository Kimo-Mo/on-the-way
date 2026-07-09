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
import { Copy, Check } from 'lucide-react';
import type { HelpRequestUser } from '@/types/help-requests';

interface ContactUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: HelpRequestUser;
}

export const ContactUserModal = ({ open, onOpenChange, user }: ContactUserModalProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const hasNoContact = !user.phone && !user.email;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact User</DialogTitle>
          <DialogDescription>
            User contact details for this help request. No email or call is triggered automatically.
          </DialogDescription>
        </DialogHeader>

        {hasNoContact && (
          <div className="bg-muted border rounded-md p-3 text-sm text-muted-foreground">
            No contact information is available for this user.
          </div>
        )}

        <div className="space-y-0">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleCopy(user.name ?? '', 'name')}
              aria-label="Copy name"
            >
              {copied === 'name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{user.phone ?? 'N/A'}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!user.phone}
              onClick={() => user.phone && handleCopy(user.phone, 'phone')}
              aria-label="Copy phone number"
            >
              {copied === 'phone' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user.email ?? 'N/A'}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!user.email}
              onClick={() => user.email && handleCopy(user.email, 'email')}
              aria-label="Copy email address"
            >
              {copied === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
