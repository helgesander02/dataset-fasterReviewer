import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalDatasets: number;
  datasetsPerPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({ currentPage, totalDatasets, datasetsPerPage, onPrevious, onNext }: PaginationProps) {
  return (
    <div className="pagination-container">
      <button 
        className="pagination-button" 
        onClick={onPrevious} 
        disabled={currentPage === 0}
      >
        Previous
      </button>
      <button 
        className="pagination-button" 
        onClick={onNext} 
        disabled={(currentPage + 1) * datasetsPerPage >= totalDatasets}
      >
        Next
      </button>
    </div>
  );
}