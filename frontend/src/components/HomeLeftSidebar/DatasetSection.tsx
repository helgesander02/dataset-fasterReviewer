"use client";

import React from 'react';
import DatasetGrid from './DatasetGrid';
import Pagination from './DatasetPagination';
import { DATASET_PER_PAGE } from '@/services/config';
import { DatasetSectionProps } from '@/types/HomeLeftSidebar';

export function DatasetSection({
  currentPage, datasets, selectedDataset,
  onDatasetSelect, onPrevious, onNext
}: DatasetSectionProps) {
  
  return (
    <>
      <DatasetGrid
        currentPage={currentPage}
        datasetsPerPage={DATASET_PER_PAGE}
        datasets={datasets}
        selectedDataset={selectedDataset}
        onDatasetSelect={onDatasetSelect}
      />

      {datasets.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalDatasets={datasets.length}
          datasetsPerPage={DATASET_PER_PAGE} 
          onPrevious={onPrevious}
          onNext={onNext}
        />
      )}
    </>
  );
}
