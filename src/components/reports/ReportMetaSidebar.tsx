import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ThumbsUp, ThumbsDown, MapPin, Navigation } from 'lucide-react';

interface ReportMetaSidebarProps {
  submittedBy: string;
  latitude: number;
  longitude: number;
  upvotes: number;
  downvotes: number;
  address: string;
  actions: React.ReactNode;
}

export const ReportMetaSidebar = ({
  submittedBy,
  latitude,
  longitude,
  upvotes,
  downvotes,
  address,
  actions,
}: ReportMetaSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Report Information */}
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg font-semibold">Report Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h4>
            <p className="text-sm pl-6">{address}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Submitted By
            </h4>
            <div className="pl-6">
              <span className="text-sm font-medium">{submittedBy}</span>
            </div>
          </div>

          {latitude != null && longitude != null && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Coordinates
              </h4>
              <p className="text-sm pl-6 font-mono text-muted-foreground">
                {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Community Votes */}
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg font-semibold">Community Votes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-center justify-between p-3 bg-success/5 text-success rounded-lg border border-success">
            <div className="flex items-center gap-2 font-medium">
              <ThumbsUp className="h-5 w-5" />
              <span>Upvotes</span>
            </div>
            <span className="font-bold text-lg">{upvotes}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-destructive/5 text-destructive rounded-lg border border-destructive">
            <div className="flex items-center gap-2 font-medium">
              <ThumbsDown className="h-5 w-5" />
              <span>Downvotes</span>
            </div>
            <span className="font-bold text-lg">{downvotes}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg font-semibold">Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">{actions}</div>
        </CardContent>
      </Card>
    </div>
  );
};
