"use client";

import React from 'react';
import { PaginationProps } from '@/types/HomeLeftSidebar';

export default function Pagination({ 
  currentPage, totalDatasets, datasetsPerPage, 
  onPrevious, onNext 
}: PaginationProps) {

  const isFirstPage = currentPage === 0;
  const isLastPage = (currentPage + 1) * datasetsPerPage >= totalDatasets;
  
  return (
    <div className="pagination-container">
      <button 
        className="pagination-button" 
        onClick={onPrevious} 
        disabled={isFirstPage}
      >
        Previous
      </button>
      <button 
        className="pagination-button" 
        onClick={onNext} 
        disabled={isLastPage}
      >
        Next
      </button>
    </div>
  );
}
