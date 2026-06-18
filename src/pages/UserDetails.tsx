import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, UserX } from 'lucide-react';
import { useUserDetails } from '@/hooks/useUserDetails';
import { UserRoleBadge, UserStatusBadge } from '@/components/users';

const activityColors: Record<string, string> = {
  reportSubmitted: 'bg-blue-500',
  reportVerified: 'bg-green-500',
  helpRequestCreated: 'bg-purple-500',
  helpRequestResolved: 'bg-emerald-500',
  profileUpdated: 'bg-gray-500',
  suspended: 'bg-red-500',
  reactivated: 'bg-teal-500',
};

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useUserDetails(id ?? '');

  if (isLoading) {
    return (
      <section className="py-7 space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="py-7 space-y-6">
        <div className="flex justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-12 space-y-4">
              <UserX className="mx-auto h-16 w-16 text-muted-foreground" />
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">User Not Found</h2>
                <p className="text-muted-foreground">
                  The user you are looking for does not exist or has been removed.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-7 space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="gap-1">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader className="space-y-2">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge status={user.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Trust Score</p>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold w-16">{user.trustScore}%</span>
                <Progress value={user.trustScore} className="flex-1" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p>{formatDate(user.joinedAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{user.phone ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Address</p>
              <p>{user.address ?? '—'}</p>
            </div>
            {user.role === 'driver' && user.vehicleInfo && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Vehicle Info</p>
                <p>{user.vehicleInfo}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Activity History</h2>
        {user.activityHistory.length === 0 ? (
          <p className="text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {user.activityHistory.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div
                  className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${activityColors[activity.type] || 'bg-muted'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserDetails;
