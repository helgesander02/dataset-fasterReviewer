export interface Image {
    name: string;
    url: string;
    dataset: string;
}

export interface HomeImageGridProps {
    images: Image[];
    selectedImages: Set<string>;
    isLoading: boolean;
    datasetName: string;
    onImageClick: (imageName: string, imageUrl: string, dataset: string) => void;
}

export interface ImageItemProps {
    image: Image;
    index: number;
    isSelected: boolean;
    onImageClick: (imageName: string, imageUrl: string, dataset: string) => void;
}

export interface LoadingStateProps {
    message?: string;
}

export interface SelectionIndicatorProps {
    className?: string;
}

export interface InfiniteImageGridProps {
    selectedJob: string | null;
    selectedDataset: string | null;
    setSelectedDataset: (dataset: string) => void;
}

export interface ImagePage {
    dataset: string;
    images: Image[];
    isNewDataset: boolean;
}

export interface EmptyStateProps {
    title?: string;
    message?: string;
}

export interface LoadingTriggerProps {
    isLoading: boolean;
    loadingMessage?: string;
}

export interface DatasetImageCountsMap extends Map<string, number> {}
