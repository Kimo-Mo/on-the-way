import { Link } from 'react-router';
import type { MapEvent } from '@/types/dashboard';
import { DashboardPanel } from './DashboardPanel';
import { AlertCircle, CircleHelp, Building2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface InteractiveMapProps {
  events: MapEvent[];
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
}

const categoryLabels: Record<MapEvent['category'], string> = {
  urgentReport: 'Urgent Report',
  helpRequest: 'Help Request',
  provider: 'Provider',
};

export const InteractiveMap = ({ events, isLoading, error, isEmpty }: InteractiveMapProps) => {
  if (isLoading) {
    return (
      <DashboardPanel title="Live Map Events" isLoading={true}>
        <></>
      </DashboardPanel>
    );
  }

  if (error) {
    return (
      <DashboardPanel
        title="Live Map Events"
        isError={true}
        errorMessage="Unable to load map events">
        <></>
      </DashboardPanel>
    );
  }

  if (isEmpty || events.length === 0) {
    return (
      <DashboardPanel title="Live Map Events" isEmpty={true} emptyMessage="No active incidents">
        <></>
      </DashboardPanel>
    );
  }

  return (
    <DashboardPanel title="Live Map Events" action={<Legend />}>
      <div className="relative z-0 h-85 w-full overflow-hidden rounded-xl border border-border">
        <MapContainer
          center={[30.0444, 31.2357]}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {events.map((event) => (
            <Marker key={event.id} position={[event.coordinates.lat, event.coordinates.lng]}>
              <Popup>
                <div className="flex flex-col gap-1 min-w-37.5">
                  <span className="font-semibold text-sm">{event.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {categoryLabels[event.category]}
                  </span>
                  <span className="text-xs">{event.status}</span>
                  {event.targetRoute && (
                    <Link
                      to={event.targetRoute}
                      className="text-primary text-xs hover:underline mt-1 block">
                      View Details
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </DashboardPanel>
  );
};

const Legend = () => (
  <div className="flex items-center gap-3 text-xs">
    <div className="flex items-center gap-1">
      <AlertCircle className="size-3 text-destructive" />
      <span className="text-muted-foreground">Report</span>
    </div>
    <div className="flex items-center gap-1">
      <CircleHelp className="size-3 text-warning" />
      <span className="text-muted-foreground">Help</span>
    </div>
    <div className="flex items-center gap-1">
      <Building2 className="size-3 text-success" />
      <span className="text-muted-foreground">Provider</span>
    </div>
  </div>
);
