import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const HelpRequestCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="space-y-3 flex flex-col sm:flex-row items-center gap-5">
        <div className="bg-muted/30 w-full sm:w-24 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex-1 flex sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Skeleton className="h-3.5 w-3.5" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div className="flex items-center shrink-0 sm:ml-auto">
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
