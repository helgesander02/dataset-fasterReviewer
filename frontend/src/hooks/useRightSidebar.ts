"use client";

import { useState } from 'react';
import { useJobDataset } from '@/components/JobDatasetContext';
import { savePendingReview } from '@/services/api';
import { RightSidebarState, RightSidebarActions, SaveData, CachedImage } from '@/types/HomeRightSidebar';

export function useRightSidebar(): RightSidebarState & RightSidebarActions {
  const { selectedJob, selectedDataset, cachedImages } = useJobDataset();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (!selectedJob || !selectedDataset || cachedImages.length === 0) {
      return;
    }

    try {
      setLoading(true);
      setSaveSuccess(false);
      
      const saveData: SaveData = {
        job: selectedJob,
        dataset: selectedDataset,
        images: cachedImages.map(img => ({
          job: img.job,
          dataset: img.dataset,
          imagePath: img.imagePath
        })),
        timestamp: new Date().toISOString()
      };

      await savePendingReview(saveData);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving pending review:', error);
      alert('Save failed! Please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = () => {
    setIsReviewOpen(true);
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
  };

  const groupedImages = cachedImages.reduce((acc, img) => {
    const key = `${img.job}/${img.dataset}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(img);
    return acc;
  }, {} as Record<string, CachedImage[]>);

  return {
    // State
    isReviewOpen,
    loading,
    saveSuccess,
    groupedImages,
    // Actions
    handleSave,
    handleReview,
    handleCloseReview
  };
}
