import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ReportCardSkeleton = () => {
  return (
    <Card className='py-0'>
      <CardContent className="space-y-3 p-0 flex flex-col sm:flex-row items-stretch">
        <div className="bg-muted/30 w-full sm:w-24 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5 min-w-0">
                <Skeleton className="h-3.5 w-3.5 shrink-0" />
                <Skeleton className="truncate max-w-50 sm:max-w-xs" />
              </div>
              <span className="text-muted-foreground/50">•</span>
              <Skeleton className="h-4 w-24" />
              <span className="text-muted-foreground/50">•</span>
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-5 shrink-0 sm:ml-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-success font-medium text-sm">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5 text-destructive font-medium text-sm">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
