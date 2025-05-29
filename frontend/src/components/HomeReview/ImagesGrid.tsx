"use client";

import { ReviewItem } from '@/types/HomeReview';
import { ImageItem } from './ImageItem';

interface ImagesGridProps {
  items: ReviewItem[];
  selectedImages: Set<string>;
  onToggleImage: (item: ReviewItem) => void;
}

export function ImagesGrid({ items, selectedImages, onToggleImage }: ImagesGridProps) {
  return (
    <div className="home-review-images-grid">
      {items.map((item, index) => {
        const isSelected = selectedImages.has(item.imagePath);
        return (
          <ImageItem
            key={`${item.imagePath}-${index}`}
            item={item}
            index={index}
            isSelected={isSelected}
            onToggle={onToggleImage}
          />
        );
      })}
    </div>
  );
}
