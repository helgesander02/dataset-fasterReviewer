export interface CachedImage {
  job: string;
  dataset: string;
  imagePath: string;
}

export interface SaveData {
  job: string;
  dataset: string;
  images: Array<{
    job: string;
    dataset: string;
    imagePath: string;
  }>;
  timestamp: string;
}

export interface FileChangeLogProps {
  groupedImages: Record<string, CachedImage[]>;
  cachedImages: CachedImage[];
}

export interface ReviewButtonProps {
  onReview: () => void;
  loading: boolean;
}

export interface SaveButtonProps {
  onSave: () => void;
  loading: boolean;
  saveSuccess: boolean;
  cachedImages: CachedImage[];
  disabled: boolean;
}

export interface StatusProps {
  selectedJob: string | null;
  selectedDataset: string | null;
}

export interface RightSidebarState {
  isReviewOpen: boolean;
  loading: boolean;
  saveSuccess: boolean;
  groupedImages: Record<string, CachedImage[]>;
}

export interface RightSidebarActions {
  handleSave: () => Promise<void>;
  handleReview: () => void;
  handleCloseReview: () => void;
}
