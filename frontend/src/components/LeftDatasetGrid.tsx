import React from 'react';

interface DatasetGridProps {
  datasets: string[];
  selectedDataset: string;
  onDatasetSelect: (dataset: string) => void;
  currentPage: number;
  datasetsPerPage: number;
}

export default function DatasetGrid({ datasets, selectedDataset, onDatasetSelect, currentPage, datasetsPerPage }: DatasetGridProps) {
  const getCurrentPageDatasets = () => {
    const startIndex = currentPage * datasetsPerPage;
    return datasets.slice(startIndex, startIndex + datasetsPerPage);
  };

  return (
    <div className="dataset-container">
      <p className="dataset-label">Select a Dataset:</p>
      <div className="dataset-grid">
        {getCurrentPageDatasets().map((dataset, i) => {
          const isSelected = dataset === selectedDataset;
          return (
            <div 
              key={dataset} 
              className={`dataset-item ${isSelected ? 'dataset-item-selected' : ''}`}
              onClick={() => onDatasetSelect(dataset)}
              title={dataset}
            >
              {i + 1 + currentPage * datasetsPerPage}
            </div>
          );
        })}
      </div>
    </div>
  );
}