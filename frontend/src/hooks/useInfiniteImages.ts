"use client";

import { useState, useCallback, useRef, useEffect, use } from 'react';
import { fetchBase64Images, fetchALLPages } from '@/services/api';
import { IMAGES_PER_PAGE } from '@/services/config';
import { Image, ImagePage } from '@/types/HomeImageGrid';

export function useInfiniteImages(
  selectedJob: string | null, selectedDataset: string | null, allDatasets: string[], currentPage: number,
  setSelectedDataset: (dataset: string) => void, setCurrentPage: (page: number) => void) {

  const [maxPageIndex, setMaxPageIndex] = useState<number>(0); 
  const [allImagePages, setAllImagePages] = useState<ImagePage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loadedPagesRef = useRef<Set<string>>(new Set());
  
  const [currentJobDatasetKey, setCurrentJobDatasetKey] = useState<string>('');
  const isInitializingRef = useRef<boolean>(false);

  const pageObserversRef = useRef<Map<number, IntersectionObserver>>(new Map());

  const updateCurrentPageIndex = useCallback((newPageIndex: number) => {
    if (newPageIndex !== currentPageIndex) {
      setCurrentPageIndex(newPageIndex);
      setCurrentPage(newPageIndex);
    }
  }, [currentPageIndex, setCurrentPage]);

  const setupPageObserver = useCallback((pageIndex: number, element: HTMLElement) => {
    if (pageObserversRef.current.has(pageIndex)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            updateCurrentPageIndex(pageIndex);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }
    );

    observer.observe(element);
    pageObserversRef.current.set(pageIndex, observer);
  }, [updateCurrentPageIndex]);

  // 清理觀察器的函數
  const cleanupObservers = useCallback(() => {
    pageObserversRef.current.forEach((observer) => {
      observer.disconnect();
    });
    pageObserversRef.current.clear();
  }, []);

  // 註冊頁面元素的函數
  const registerPageElement = useCallback((pageIndex: number, element: HTMLElement | null) => {
    if (element) {
      setupPageObserver(pageIndex, element);
    }
  }, [setupPageObserver]);

  useEffect(() => {
    const fetchCurrentDatasetByCurrentPage = async () => {
      try {
        if (currentPageIndex < 0 || !selectedJob || !selectedDataset) {
          console.warn('Invalid page index or no job selected, skipping dataset detail fetch.');
          return;
        }
        const response = await fetchALLPages(selectedJob);
        const pages = Array.isArray(response.pages) ? response.pages : Object.values(response.pages);
        setSelectedDataset(pages[currentPageIndex]);
        console.log(`Current dataset detail fetched for page index ${currentPageIndex}: ${pages[currentPageIndex]}`);
        
      } catch (error) {
        console.error(`Error fetching details for dataset ${selectedDataset}:`, error);
      }
    };

    fetchCurrentDatasetByCurrentPage();
  }, [currentPageIndex]);

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

  const resetImages = useCallback(() => {
    console.log('Resetting images...');
    cleanupObservers();
    setAllImagePages([]);
    setCurrentPageIndex(0);
    setCurrentDatasetIndex(0);
    setHasMore(true);
    setCurrentJobDatasetKey('');
    setMaxPageIndex(0);
    loadedPagesRef.current.clear();
    isInitializingRef.current = false;
  }, [cleanupObservers]);

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
      
      cleanupObservers();
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
        setCurrentPage(0);
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
  }, [selectedJob, allDatasets, loadPageImages, currentJobDatasetKey, resetImages, cleanupObservers, setCurrentPage]);

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
      if (nextPageIndex >= maxPageIndex && maxPageIndex > 0) {
        console.warn(`No more pages available for dataset ${currentDataset} at index ${currentDatasetIndex}`);
        setHasMore(false);
        return;
      }
      const response = await loadPageImages(selectedJob, currentDataset, nextPageIndex);
      if (response) {
        const { imagePage, maxPage } = response;
        setMaxPageIndex(maxPage);
        setAllImagePages(prev => [...prev, imagePage]);

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

  useEffect(() => {
    return () => {
      cleanupObservers();
    };
  }, [cleanupObservers]);

  return {
    allImagePages,
    loading,
    currentPageIndex,
    getCurrentImagePages,
    hasMorePages,
    loadNextPage,
    resetImages,
    initializeImages,
    registerPageElement
  };
}