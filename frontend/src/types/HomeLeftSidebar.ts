export interface JobSelectProps {
    jobs: string[];
    selectedJob: string;
    loading: boolean;
    onJobSelect: (job: string) => void;
}

export interface DatasetSectionProps {
    currentPage: number; 
    datasets: string[]; 
    selectedDataset: string;
    onDatasetSelect: (dataset: string) => void; 
    onPrevious: () => void; 
    onNext: () => void;
}

export interface DatasetGridProps {
    currentPage: number;
    datasetsPerPage: number;
    datasets: string[];
    selectedDataset: string;
    onDatasetSelect: (dataset: string) => void;
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
