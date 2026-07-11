import { useParams, useNavigate } from 'react-router';
import { Calendar, ChevronLeft, Image, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReportDetails, useUpdateReportStatus } from '@/hooks/reports/useReports';
import {
  ObstacleTypeBadge,
  ReportImageGallery,
  ReportMap,
  ReportMetaSidebar,
} from '@/components/reports';

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: report, isLoading, isError } = useReportDetails(id ?? '');
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateReportStatus();

  if (isLoading) {
    return (
      <section className="py-7 space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="h-4 w-4" /> Back to Reports
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isError || !report) {
    return (
      <section className="py-7 space-y-6 max-w-6xl mx-auto">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardContent className="py-12 space-y-4">
            <h2 className="text-2xl font-bold">Report Not Found</h2>
            <p className="text-muted-foreground">
              The report you are looking for does not exist or has been removed.
            </p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="py-7 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Reports
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <ObstacleTypeBadge type={report.type} />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-4" />
                    {formatDate(report.createdAt)} {formatTime(report.createdAt)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-bold mb-3">Report Description</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{report.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Image className="size-4" />
                Attached Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportImageGallery imageUrl={report.imageUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="size-4" />
                Location on Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportMap
                latitude={report.latitude}
                longitude={report.longitude}
                address={report.address}
              />
            </CardContent>
          </Card>
        </div>

        <ReportMetaSidebar
          submittedBy={report.submittedBy}
          latitude={report.latitude}
          longitude={report.longitude}
          upvotes={report.upvotes}
          downvotes={report.downvotes}
          address={report.address}
          actions={
            <div className="w-full">
              <label htmlFor="report-status" className="block text-sm font-medium mb-1">
                Update Status
              </label>
              <Select
                value={report.status === 'Open' ? '0' : report.status === 'Solved' ? '1' : '2'}
                onValueChange={(val) =>
                  updateStatus({ id: report.id, newStatus: parseInt(val, 10) })
                }
                disabled={isUpdating}>
                <SelectTrigger id="report-status" className="w-full">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Open</SelectItem>
                  <SelectItem value="1">Solved</SelectItem>
                  <SelectItem value="2">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />
      </div>
    </section>
  );
};

export default ReportDetails;
