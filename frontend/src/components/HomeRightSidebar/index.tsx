"use client";

import { useJobDataset } from '../JobDatasetContext';
import ReviewButton from './ReviewButton';
import FileChangeLog from './FileChangeLog';
import SaveButton from './SaveButton';
import Status from './Status';
import HomeReview from '../HomeReview';
import { useRightSidebar } from '@/hooks/useRightSidebar';
import '@/styles/HomeRightSidebar.css';

export default function RightSidebar() {
  const { selectedJob, selectedDataset, cachedImages } = useJobDataset();
  const {
    isReviewOpen, loading, saveSuccess, groupedImages,
    handleSave, handleReview, handleCloseReview
  } = useRightSidebar();

  return (
    <div className="right-sidebar">
      <ReviewButton onReview={handleReview} loading={loading} />
      <FileChangeLog groupedImages={groupedImages} cachedImages={cachedImages} />
      <div className="mt-auto">
        <Status selectedJob={selectedJob} selectedDataset={selectedDataset} />
        <SaveButton 
          onSave={handleSave} 
          loading={loading} 
          saveSuccess={saveSuccess} 
          cachedImages={cachedImages} 
          disabled={!selectedJob || !selectedDataset || cachedImages.length === 0 || loading} 
        />
      </div>
      
      <HomeReview 
        isOpen={isReviewOpen} 
        onClose={handleCloseReview} 
      />
    </div>
  );
}
