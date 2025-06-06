"use client";

import React, { useEffect } from 'react';
import { InfiniteImageGridProps } from '@/types/HomeImageGrid';
import { useDatasets } from '@/hooks/useDatasets';
import { useInfiniteImages } from '@/hooks/useInfiniteImages';
import { useImageSelection } from '@/hooks/useImageSelection';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import HomeImageGrid from './ImageGrid';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import LoadingTrigger from './InfiniteLoadingTrigger';
import '@/styles/HomeImageGrid.css';

export default function InfiniteImageGrid({ 
  selectedJob, selectedDataset, 
  setSelectedDataset
}: InfiniteImageGridProps) {

  const { allDatasets, loading: datasetsLoading } = useDatasets(selectedJob); 
  const {
    loading: imagesLoading,
    getCurrentImagePages,
    hasMorePages,
    loadNextPage,
    resetImages
  } = useInfiniteImages(selectedJob, allDatasets);
  
  const { selectedImages, handleImageClick } = useImageSelection(selectedJob, allDatasets);
  const loadingRef = useIntersectionObserver(loadNextPage, imagesLoading);

  useEffect(() => {
    if (!selectedJob) {
      resetImages();
    }
  }, [selectedJob, resetImages]);

  if (!selectedJob) {
    return <EmptyState />;
  }
  
  if (datasetsLoading || (allDatasets.length === 0 && datasetsLoading)) {
    return <LoadingState message="Loading datasets..." />;
  }

  if (allDatasets.length === 0) {
    return (
      <EmptyState 
        title="No Datasets Found" 
        message="No datasets found for this job." 
      />
    );
  }

  const currentImagePages = getCurrentImagePages();
  
  return (
    <div className="infinite-container">
      <div className="infinite-wrapper">
        {currentImagePages.length > 0 ? (
          <>
            {currentImagePages.map((page, pageIndex) => (
              <HomeImageGrid
                key={`${page.dataset}-${pageIndex}`}
                images={page.images}
                selectedImages={selectedImages}
                isLoading={false}
                datasetName={page.dataset}
                onImageClick={handleImageClick}
              />
            ))}
            
            {hasMorePages() && (
              <div ref={loadingRef}>
                <LoadingTrigger isLoading={imagesLoading} />
              </div>
            )}
          </>
        ) : (
          imagesLoading ? (
            <LoadingState message="Loading images..." />
          ) : (
            <EmptyState 
              title="No Images Found" 
              message="No images found for this job." 
            />
          )
        )}
      </div>
    </div>
  );
}