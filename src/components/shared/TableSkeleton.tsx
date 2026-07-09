import {
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  className?: string;
}

/**
 * Skeleton placeholder for table-based pages during data fetching.
 *
 * @param columns - Number of table columns to render (determines header width).
 * @param rows - Number of skeleton body rows (defaults to 6).
 * @param className - Additional class names merged onto the root container.
 * @returns A table-shaped skeleton with a header row and body rows.
 */
export const TableSkeleton = ({ columns, rows = 6, className }: TableSkeletonProps) => {
  return (
    <Card className={cn('', className)}>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: columns }).map((_, i) => (
                  <TableHead key={i} className="p-3">
                    <Skeleton className="h-4 w-3/4" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-t border-border">
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <TableCell key={colIndex} className="p-3">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
