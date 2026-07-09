import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Phone, CheckCircle, XCircle } from 'lucide-react';
import type { HelpRequest, HelpRequestDetails } from '@/types/help-requests';
import { TERMINAL_STATUSES } from '@/types/help-requests';

interface ActionPanelProps {
  request: HelpRequest | HelpRequestDetails;
  onMarkCompleted: () => void;
  onCancelRequest: () => void;
  onContactUser: () => void;
  isUpdatingStatus: boolean;
}

export const ActionPanel = ({
  request,
  onMarkCompleted,
  onCancelRequest,
  onContactUser,
  isUpdatingStatus,
}: ActionPanelProps) => {
  const isTerminal = request.status ? TERMINAL_STATUSES.includes(request.status) : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Button variant="outline" className="w-full" onClick={onContactUser}>
            <Phone className="mr-2 h-4 w-4" />
            Contact User
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="default"
                    className="w-full"
                    disabled={isTerminal || isUpdatingStatus}
                    onClick={onMarkCompleted}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                </span>
              </TooltipTrigger>
              {(isTerminal || isUpdatingStatus) && (
                <TooltipContent>
                  {isTerminal ? 'This request is already in a terminal state' : 'Updating…'}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isTerminal || isUpdatingStatus}
                    onClick={onCancelRequest}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Request
                  </Button>
                </span>
              </TooltipTrigger>
              {(isTerminal || isUpdatingStatus) && (
                <TooltipContent>
                  {isTerminal ? 'This request is already in a terminal state' : 'Updating…'}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};
