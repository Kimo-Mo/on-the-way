import { Card, CardContent } from '@/components/ui/card';

interface ReportImageGalleryProps {
  /** Backend returns a single nullable imageUrl string */
  imageUrl: string | null;
}

export const ReportImageGallery = ({ imageUrl }: ReportImageGalleryProps) => {
  if (!imageUrl) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <span>No images attached</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <img
        src={
          import.meta.env.VITE_API_BASE_URL?.endsWith('/api')
            ? import.meta.env.VITE_API_BASE_URL?.slice(0, -4) + imageUrl
            : import.meta.env.VITE_API_BASE_URL + imageUrl
        }
        alt="Report image"
        className="w-full h-64 object-contain"
      />
    </div>
  );
};
