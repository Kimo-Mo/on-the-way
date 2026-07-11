import { useParams, useNavigate } from 'react-router';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Progress,
  Skeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Label,
} from '@/components/ui';
import { useState } from 'react';
import { ChevronLeft, UserX, Loader2 } from 'lucide-react';
import { useUserDetails, useUpdateUserStatus, useMakeUserAdmin } from '@/hooks/users/useUsers';
import { UserRoleBadge, UserStatusBadge } from '@/components/users';
import { CardSkeleton } from '@/components/shared';

const activityColors: Record<string, string> = {
  Incident: 'bg-blue-500',
  Assistance: 'bg-purple-500',
  reportSubmitted: 'bg-blue-500',
  reportVerified: 'bg-green-500',
  helpRequestCreated: 'bg-purple-500',
  helpRequestResolved: 'bg-emerald-500',
  profileUpdated: 'bg-gray-500',
  suspended: 'bg-red-500',
  reactivated: 'bg-teal-500',
  report: 'bg-primary',
  help: 'bg-destructive',
  interaction: 'bg-success',
};

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useUserDetails(id ?? '');
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();
  const { mutate: makeAdmin, isPending: isMakingAdmin } = useMakeUserAdmin();
  const isUpdating = isUpdatingStatus || isMakingAdmin;

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const confirmRoleChange = () => {
    if (!user) return;
    makeAdmin(user.id, {
      onSuccess: () => {
        setRoleDialogOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <section className="py-7 space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft />
          Back to Users
        </Button>
        <CardSkeleton className="grid-cols-1 md:grid-cols-1 lg:grid-cols-1 h-64" count={1} />
        <Skeleton className="h-10 w-64" />
        <CardSkeleton className="grid-cols-1 md:grid-cols-1 lg:grid-cols-1 h-24" count={1} />
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
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1 px-2">
        <ChevronLeft />
        Back to Users
      </Button>

      <Card>
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              {/* Backend returns `name` (not `fullName`) */}
              <h1 className="text-3xl font-bold">{user.name ?? 'Unknown User'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <UserRoleBadge role={user.role} />
                <UserStatusBadge status={user.status} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Change Status</Label>
              <Select
                value={user.status}
                onValueChange={(val) =>
                  updateStatus({ id: user.id, status: val as 'Active' | 'Suspended' | 'Banned' })
                }
                disabled={isUpdating}>
                <SelectTrigger id="status" className="w-48">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Banned">Banned</SelectItem>
                </SelectContent>
              </Select>
              {user.role !== 'Admin' && (
                <Button
                  variant="default"
                  onClick={() => setRoleDialogOpen(true)}
                  disabled={isUpdating}
                  className="w-48">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Mark as Admin
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Trust Score</p>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold w-16">{user.trustScore}</span>
                <Progress value={user.trustScore} className="flex-1" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Member Since</p>
              {/* Backend returns `joinedDate` (not `joinedAt`) */}
              <p>{user.joinedDate ? formatDate(user.joinedDate) : '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              {/* Backend returns `phone` (not `phone` optional) */}
              <p>{user.phone || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Activity History</h2>
        {user.activityHistory.length === 0 ? (
          <p className="text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {user.activityHistory.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-primary transition-colors duration-200">
                <div
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${activityColors[activity.type] ?? 'bg-muted'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {/* Backend returns `date` (not `timestamp`) */}
                    {activity.date ? new Date(activity.date).toLocaleString() : '—'}
                  </p>
                </div>
                <Badge className="capitalize">{activity.type}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to grant Admin privileges to this user? This is a sensitive
              action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoleDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default UserDetails;
