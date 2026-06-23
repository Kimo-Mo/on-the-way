import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '../ui';

export function ProviderTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col justify-between sm:flex-row items-stretch">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-50" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            <Skeleton className="h-9 w-24 ml-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
