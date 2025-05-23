"use client";

import { useJobDataset } from './JobDatasetContext';
import { savePendingReview } from '@/services/api';
import { useState } from 'react';
import '@/styles/HomeRightSidebar.css';
import ActionButtons from './RightActionButtons';
import FileChangeLog from './RightFileChangeLog';
import SaveButton from './RightSaveButton';
import Status from './RightStatus';

export default function RightSidebar() {
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
      
      const saveData = {
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
      alert('保存失敗！請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = () => {
    setIsReviewOpen(true);
  };

  const groupedImages = cachedImages.reduce((acc, img) => {
    const key = `${img.job}/${img.dataset}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(img);
    return acc;
  }, {} as Record<string, typeof cachedImages>);

  return (
    <div className="right-sidebar">
      <ActionButtons onReview={handleReview} loading={loading} />
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
    </div>
  );
}