export interface ReviewItem {
    job: string;
    dataset: string;
    imagePath: string;
}

export interface PendingReviewData {
    items: ReviewItem[];
}

export interface HomeReviewProps {
    isOpen: boolean;
    onClose: () => void;
}
