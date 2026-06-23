import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useReportDetails } from '@/hooks/useReportDetails';
import {
  FlagUserDialog,
  ObstacleTypeBadge,
  RemoveReportDialog,
  ReportImageGallery,
  ReportMap,
  ReportMetaSidebar,
  ReportStatusBadge,
} from '@/components/reports';
import { useApproveReport, useMarkUrgent } from '@/hooks/useReports';

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: report, isLoading, isError } = useReportDetails(id ?? '');
  const approveMutation = useApproveReport();
  const markUrgentMutation = useMarkUrgent();

  const handleApprove = async () => {
    if (id) {
      await approveMutation.mutateAsync(id);
    }
  };

  const handleMarkUrgent = async () => {
    if (id) {
      await markUrgentMutation.mutateAsync(id);
    }
  };

  const handleRemoveSuccess = () => {
    navigate('/reports');
  };

  const handleFlagSuccess = () => {
    // No navigation, UI updates via query invalidation
  };

  if (isLoading) {
    return (
      <section className="py-7 space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
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

  const isRemoved = report.status === 'removed';
  const canApprove = report.status === 'pending' || report.status === 'urgent';
  const canMarkUrgent = report.status === 'pending';

  return (
    <section className="py-7 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Reports
        </Button>
        <ReportStatusBadge status={report.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <ObstacleTypeBadge type={report.obstacleType} />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-4 w-4 inline-block">📅</span>
                    {formatDate(report.submittedAt)} {formatTime(report.submittedAt)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-3">Report Description</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{report.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span className="h-4 w-4 inline-block">🖼️</span>
                Attached Images
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ReportImageGallery imageUrls={report.imageUrls} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span className="h-4 w-4 inline-block">🗺️</span>
                Location on Map
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ReportMap gpsCoordinates={report.gpsCoordinates} location={report.location} />
            </CardContent>
          </Card>
        </div>

        <ReportMetaSidebar
          submitter={report.submitter}
          gpsCoordinates={report.gpsCoordinates}
          votes={report.votes}
          location={report.location}
          actions={
            <>
              {canApprove && (
                <Button
                  className="w-full bg-success hover:bg-success/80 font-semibold"
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  aria-label="Approve this report">
                  {approveMutation.isPending ? 'Approving...' : 'Approve Report'}
                </Button>
              )}
              {canMarkUrgent && (
                <Button
                  className="w-full bg-warning hover:bg-warning/80 font-semibold"
                  onClick={handleMarkUrgent}
                  disabled={markUrgentMutation.isPending}
                  aria-label="Mark this report as urgent">
                  {markUrgentMutation.isPending ? 'Marking...' : 'Mark as Urgent'}
                </Button>
              )}
              {!isRemoved && (
                <RemoveReportDialog
                  reportId={report.id}
                  onSuccess={handleRemoveSuccess}
                  className="w-full bg-destructive hover:bg-destructive/80 text-white font-semibold"
                />
              )}
              {!report.submitter.isDeleted && !isRemoved && (
                <FlagUserDialog
                  reportId={report.id}
                  submitterName={report.submitter.name}
                  onSuccess={handleFlagSuccess}
                  className="w-full bg-foreground hover:bg-foreground/90 text-white hover:text-white font-semibold"
                />
              )}
            </>
          }
        />
      </div>
    </section>
  );
};

export default ReportDetails;
