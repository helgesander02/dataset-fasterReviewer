"use client";

import React from 'react';
import DatasetGrid from './DatasetGrid';
import Pagination from './Pagination';
import { datasetsPerPage } from '@/services/config';

interface DatasetSectionProps {
  datasets: string[];
  selectedDataset: string;
  onDatasetSelect: (dataset: string) => void;
  currentPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function DatasetSection({
  datasets,
  selectedDataset,
  onDatasetSelect,
  currentPage,
  onPrevious,
  onNext
}: DatasetSectionProps) {
  return (
    <>
      <DatasetGrid
        datasets={datasets}
        selectedDataset={selectedDataset}
        onDatasetSelect={onDatasetSelect}
        currentPage={currentPage} 
        datasetsPerPage={datasetsPerPage}
      />
      {datasets.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalDatasets={datasets.length}
          datasetsPerPage={datasetsPerPage} 
          onPrevious={onPrevious}
          onNext={onNext}
        />
      )}
    </>
  );
}
