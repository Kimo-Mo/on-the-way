import { AlertCircle, RotateCw } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '@/lib/utils';

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Full-page error state with an optional retry action.
 *
 * @param message - Custom error message to display (defaults to a generic message).
 * @param onRetry - Callback invoked when the admin clicks the retry button.
 * @param className - Additional class names merged onto the root container.
 * @returns A centered error card with icon, message, and optional retry button.
 */
export const PageError = ({ message, onRetry, className }: PageErrorProps) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center',
        className
      )}>
      <AlertCircle className="size-10 text-destructive" />
      <p className="max-w-md text-sm font-medium text-foreground">
        {message ?? 'Something went wrong while loading this data.'}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw className="size-4" />
          Retry
        </Button>
      )}
    </div>
  );
};
