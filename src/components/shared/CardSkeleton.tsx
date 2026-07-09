import { Card, CardContent, CardHeader } from '../ui';
import { Skeleton } from '../ui';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Skeleton placeholder for card-based layouts during data fetching.
 *
 * @param count - Number of skeleton cards to render (defaults to 3).
 * @param className - Additional class names merged onto the responsive grid container.
 * @returns A responsive grid of skeleton cards matching the standard card layout.
 */
export const CardSkeleton = ({ count = 3, className }: CardSkeletonProps) => {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
