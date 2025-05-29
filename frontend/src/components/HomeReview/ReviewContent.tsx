"use client";

import { PendingReviewData, ReviewItem } from '@/types/HomeReview';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { ImagesGrid } from './ImagesGrid';

interface ReviewContentProps {
  loading: boolean;
  error: string | null;
  reviewData: PendingReviewData | null;
  selectedImages: Set<string>;
  onRetry: () => void;
  onToggleImage: (item: ReviewItem) => void;
}

export function ReviewContent({ 
  loading, 
  error, 
  reviewData, 
  selectedImages, 
  onRetry, 
  onToggleImage 
}: ReviewContentProps) {
  const hasImages = reviewData && reviewData.items.length > 0;

  return (
    <div className="home-review-content">
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : !hasImages ? (
        <EmptyState />
      ) : (
        <ImagesGrid 
          items={reviewData.items}
          selectedImages={selectedImages}
          onToggleImage={onToggleImage}
        />
      )}
    </div>
  );
}
