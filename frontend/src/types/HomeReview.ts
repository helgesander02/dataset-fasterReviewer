export interface ReviewItem {
    job: string;
    dataset: string;
    imageName: string;
    imagePath: string;
}

export interface PendingReviewData {
    items: ReviewItem[];
}

export interface HomeReviewProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface ReviewHeaderProps {
    saving: boolean;
    onClose: () => void;
}

export interface ReviewContentProps {
    loading: boolean;
    error: string | null;
    reviewData: PendingReviewData | null;
    selectedImages: Set<string>;
    onRetry: () => void;
    onToggleImage: (item: ReviewItem) => void;
}

export interface ImagesGridProps {
    items: ReviewItem[];
    selectedImages: Set<string>;
    onToggleImage: (item: ReviewItem) => void;
}

export interface ImageItemProps {
    item: ReviewItem;
    index: number;
    isSelected: boolean;
    onToggle: (item: ReviewItem) => void;
}
