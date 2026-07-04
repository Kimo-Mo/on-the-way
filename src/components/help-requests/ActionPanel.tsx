import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Phone, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import type { HelpRequest } from '@/types/help-requests';
import { TERMINAL_STATUSES } from '@/types/help-requests';

interface ActionPanelProps {
  request: HelpRequest;
  onMarkCompleted: () => void;
  onCancelRequest: () => void;
  onReassignProvider: () => void;
  onContactUser: () => void;
  isUpdatingStatus: boolean;
  isReassigning: boolean;
}

export const ActionPanel = ({
  request,
  onMarkCompleted,
  onCancelRequest,
  onReassignProvider,
  onContactUser,
  isUpdatingStatus,
  isReassigning,
}: ActionPanelProps) => {
  const isTerminal = TERMINAL_STATUSES.includes(request.status);

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
                    onClick={onMarkCompleted}
                  >
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
                    variant="outline"
                    className="w-full"
                    disabled={isTerminal || isReassigning}
                    onClick={onReassignProvider}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reassign Provider
                  </Button>
                </span>
              </TooltipTrigger>
              {(isTerminal || isReassigning) && (
                <TooltipContent>
                  {isTerminal ? 'Cannot reassign a completed or cancelled request' : 'Updating…'}
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
                    onClick={onCancelRequest}
                  >
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
