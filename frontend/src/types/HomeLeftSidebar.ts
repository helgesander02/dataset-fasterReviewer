export interface JobSelectProps {
    jobs: string[];
    selectedJob: string;
    onJobSelect: (job: string) => void;
    loading: boolean;
}

export interface DatasetGridProps {
    datasets: string[];
    selectedDataset: string;
    onDatasetSelect: (dataset: string) => void;
    currentPage: number;
    datasetsPerPage: number;
}

export interface PaginationProps {
    currentPage: number;
    totalDatasets: number;
    datasetsPerPage: number;
    onPrevious: () => void;
    onNext: () => void;
}

export interface SidebarState {
    jobs: string[];
    datasets: string[];
    loading: boolean;
    currentPage: number;
}

export interface SidebarActions {
    handleJobSelect: (job: string) => void;
    handleDatasetSelect: (dataset: string) => void;
    previousPage: () => void;
    nextPage: () => void;
}
