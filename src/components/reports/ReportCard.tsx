import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import type { Report } from '@/types/reports';
import { ReportStatusBadge } from './ReportStatusBadge';
import { ObstacleTypeBadge } from './ObstacleTypeBadge';

interface ReportCardProps {
  report: Report;
  onViewDetails: (reportId: string) => void;
}

export const ReportCard = ({ report, onViewDetails }: ReportCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
        <div className="bg-muted/30 w-full sm:w-24 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold truncate">{report.title}</h3>
              <ReportStatusBadge status={report.status} />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate max-w-50 sm:max-w-xs">{report.location}</span>
              </div>
              <span className="text-muted-foreground/50">•</span>
              <ObstacleTypeBadge type={report.obstacleType} />
              <span className="text-muted-foreground/50">•</span>
              <span>{formatDate(report.submittedAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-5 shrink-0 sm:ml-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-success font-medium text-sm">
                <ThumbsUp className="h-4 w-4" />
                <span>{report.votes.upvotes}</span>
              </div>
              <div className="flex items-center gap-1.5 text-destructive font-medium text-sm">
                <ThumbsDown className="h-4 w-4" />
                <span>{report.votes.downvotes}</span>
              </div>
            </div>
            <Button
              onClick={() => onViewDetails(report.id)}
              aria-label={`View details for ${report.title}`}>
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
