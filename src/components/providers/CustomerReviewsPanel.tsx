import type { ProviderRatingSummary, CustomerReview } from '@/types/providers';
import { Star, Award } from 'lucide-react';

interface CustomerReviewsPanelProps {
  rating: ProviderRatingSummary;
  recentReviews: CustomerReview[];
}

export function CustomerReviewsPanel({ rating, recentReviews }: CustomerReviewsPanelProps) {
  return (
    <div className="bg-card rounded-md border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Award className="h-5 w-5" />
        Customer Reviews
      </h3>

      {rating.reviewCount === 0 ? (
        <p className="text-sm text-muted-foreground">No customer reviews yet.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 fill-warning text-warning" />
            <span className="font-bold">{rating.averageRating?.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">
              out of 5 ({rating.reviewCount} total)
            </span>
          </div>

          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {review.reviewerName || 'Anonymous Customer'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.reviewedAt).toISOString().split('T')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < review.rating ? 'fill-warning text-warning' : 'text-muted/30'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
