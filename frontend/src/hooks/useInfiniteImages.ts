"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchBase64Images } from '@/services/api';
import { IMAGES_PER_PAGE } from '@/services/config';
import { Image, ImagePage } from '@/types/HomeImageGrid';

export function useInfiniteImages(selectedJob: string | null, allDatasets: string[]) {
  const [allImagePages, setAllImagePages] = useState<ImagePage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loadedPagesRef = useRef<Set<string>>(new Set());
  
  const [currentJobDatasetKey, setCurrentJobDatasetKey] = useState<string>('');
  const isInitializingRef = useRef<boolean>(false);

  const loadPageImages = useCallback(async (job: string, dataset: string, pageIndex: number) => {
    const pageKey = `${dataset}-${pageIndex}`;
    
    if (loadedPagesRef.current.has(pageKey)) {
      console.log(`Page ${pageKey} already loaded, skipping...`);
      return null;
    }

    try {
      console.log(`Loading page ${pageIndex} for dataset ${dataset}...`);
      const response = await fetchBase64Images(job, dataset, pageIndex, IMAGES_PER_PAGE);
      console.log(`Loaded page ${pageIndex} for dataset ${dataset}:`, response);
      
      if (response && response.images.base64_image_set && response.images.base64_image_set.length > 0) {
        const pageImages: Image[] = response.images.base64_image_set.map((image: { name: string, path: string }) => ({
          name: image.name,
          url: `data:image/webp;base64,${image.path}`,
          dataset: dataset
        }));

        const imagePage: ImagePage = {
          dataset: dataset,
          images: pageImages,
          isNewDataset: pageIndex === 0
        };

        loadedPagesRef.current.add(pageKey);
        return { imagePage, maxPage: response.maxPage };
      }
      return null;
    } catch (error) {
      console.error(`Error loading page ${pageIndex} for dataset ${dataset}:`, error);
      return null;
    }
  }, []);

  // 重置所有狀態
  const resetImages = useCallback(() => {
    console.log('Resetting images...');
    setAllImagePages([]);
    setCurrentPageIndex(0);
    setCurrentDatasetIndex(0);
    setHasMore(true);
    setCurrentJobDatasetKey('');
    loadedPagesRef.current.clear();
    isInitializingRef.current = false;
  }, []);

  const initializeImages = useCallback(async () => {
    if (!selectedJob || allDatasets.length === 0) {
      resetImages();
      return;
    }

    const newJobDatasetKey = `${selectedJob}-${allDatasets.join(',')}-${allDatasets.length}`;
    
    if (currentJobDatasetKey === newJobDatasetKey) {
      console.log('Already initialized for this job and datasets, skipping...');
      return;
    }

    if (isInitializingRef.current) {
      console.log('Already initializing, skipping...');
      return;
    }

    try {
      console.log(`Initializing images for job: ${selectedJob}, datasets: ${allDatasets.join(',')}`);
      isInitializingRef.current = true;
      setLoading(true);
      
      setAllImagePages([]);
      setCurrentPageIndex(0);
      setCurrentDatasetIndex(0);
      setHasMore(true);
      loadedPagesRef.current.clear();
      
      const firstDataset = allDatasets[0];
      const firstPage = await loadPageImages(selectedJob, firstDataset, 0);
      
      if (firstPage) {
        setAllImagePages([firstPage.imagePage]);
        setCurrentPageIndex(0);
        setCurrentDatasetIndex(0);
        setHasMore(firstPage.maxPage > 0);
        setCurrentJobDatasetKey(newJobDatasetKey);
      } else {
        setAllImagePages([]);
        setHasMore(false);
        setCurrentJobDatasetKey(newJobDatasetKey);
      }
      
    } catch (error) {
      console.error('Error initializing images:', error);
      setAllImagePages([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      isInitializingRef.current = false;
    }
  }, [selectedJob, allDatasets, loadPageImages, currentJobDatasetKey, resetImages]);

  useEffect(() => {
    if (selectedJob && allDatasets.length > 0) {
      const newJobDatasetKey = `${selectedJob}-${allDatasets.join(',')}-${allDatasets.length}`;
      
      if (currentJobDatasetKey !== newJobDatasetKey) {
        console.log('Job or datasets changed, initializing...');
        initializeImages();
      }
    } else if (!selectedJob) {
      resetImages();
    }
  }, [selectedJob, allDatasets, currentJobDatasetKey]);

  const loadNextPage = useCallback(async () => {
    if (!selectedJob || loading || !hasMore || currentDatasetIndex >= allDatasets.length || isInitializingRef.current) {
      return;
    }

    try {
      setLoading(true);
      const currentDataset = allDatasets[currentDatasetIndex];
      const nextPageIndex = currentPageIndex + 1;

      const response = await loadPageImages(selectedJob, currentDataset, nextPageIndex);
      if (response) {
        const { imagePage, maxPage } = response;

        setAllImagePages(prev => [...prev, imagePage]);
        setCurrentPageIndex(nextPageIndex);

        if (nextPageIndex >= maxPage) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading next page:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [selectedJob, loading, hasMore, currentDatasetIndex, currentPageIndex, allDatasets, loadPageImages]);

  const getCurrentImagePages = useCallback(() => {
    return allImagePages;
  }, [allImagePages]);

  const hasMorePages = useCallback(() => {
    return hasMore;
  }, [hasMore]);

  return {
    allImagePages,
    loading,
    getCurrentImagePages,
    hasMorePages,
    loadNextPage,
    resetImages,
    initializeImages
  };
}