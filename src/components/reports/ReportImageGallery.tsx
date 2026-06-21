import { Card, CardContent } from '@/components/ui/card';

interface ReportImageGalleryProps {
  imageUrls: string[];
}

export const ReportImageGallery = ({ imageUrls }: ReportImageGalleryProps) => {
  if (imageUrls.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <span>No images attached</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
      {imageUrls.map((url, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <img src={url} alt={`Report image ${index + 1}`} className="w-full h-48 object-cover" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
