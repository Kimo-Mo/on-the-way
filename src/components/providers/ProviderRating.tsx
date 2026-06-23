import { Star } from 'lucide-react';
import type { ProviderRatingSummary } from '@/types/providers';

interface ProviderRatingProps {
  rating: ProviderRatingSummary;
  className?: string;
}

export function ProviderRating({ rating, className = '' }: ProviderRatingProps) {
  if (rating.averageRating === null || rating.reviewCount === 0) {
    return <span className={`text-muted-foreground text-sm ${className}`}>No reviews yet</span>;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star className="h-4 w-4 fill-warning text-warning" />
      <span className="font-medium text-sm">{rating.averageRating.toFixed(1)}</span>
      <span className="text-muted-foreground text-sm">({rating.reviewCount} reviews)</span>
    </div>
  );
}
