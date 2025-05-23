"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getPendingReview } from '@/services/api';


interface CachedImage {
  job: string;
  dataset: string;
  imagePath: string;
}

interface JobDatasetContextType {
  selectedJob: string;
  selectedDataset: string;
  setSelectedJob: (job: string) => void;
  setSelectedDataset: (dataset: string) => void;
  cachedImages: CachedImage[];
  addImageToCache: (job: string, dataset: string, imagePath: string) => void;
  removeImageFromCache: (imagePath: string) => void;
  getCache: (job: string, dataset: string) => string[];
}

const JobDatasetContext = createContext<JobDatasetContextType | undefined>(undefined);

export function JobDatasetProvider({ children }: { children: ReactNode }) {
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [cachedImages, setCachedImages] = useState<CachedImage[]>([]);

  useEffect(() => {
    async function loadPending() {
      try {
        const data = await getPendingReview(true);
        data.items.forEach((item: CachedImage) => {
          addImageToCache(item.job, item.dataset, item.imagePath);
        });
      } catch (error) {
        console.error('Error loading pending review on init:', error);
      }
    }

    loadPending();
  }, []);

  const addImageToCache = (job: string, dataset: string, imagePath: string) => {
    const exists = cachedImages.some(
      img => img.job === job && img.dataset === dataset && img.imagePath === imagePath
    );

    if (!exists) {
      const newCachedImage: CachedImage = { job, dataset, imagePath };
      setCachedImages(prev => [newCachedImage, ...prev]);
    }
  };

  const removeImageFromCache = (imagePath: string) => {
    setCachedImages(prev => prev.filter(img => img.imagePath !== imagePath));
  };

  const getCache = (job: string, dataset: string) => {
    return cachedImages
      .filter(img => img.job === job && img.dataset === dataset)
      .map(img => img.imagePath);
  };

  return (
    <JobDatasetContext.Provider
      value={{
        selectedJob,
        selectedDataset,
        setSelectedJob,
        setSelectedDataset,
        cachedImages,
        addImageToCache,
        removeImageFromCache,
        getCache,
      }}
    >
      {children}
    </JobDatasetContext.Provider>
  );
}

export function useJobDataset() {
  const context = useContext(JobDatasetContext);
  if (!context) {
    throw new Error('useJobDataset must be used within a JobDatasetProvider');
  }
  return context;
}
