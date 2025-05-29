"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchBase64Images, getImageUrl, fetchDatasets } from '@/services/api';
import { useJobDataset } from './JobDatasetContext';
import HomeImageGrid from './HomeImageGrid';
import '@/styles/HomeImageGrid.css'; 

interface Image {
  name: string;
  url: string;
  dataset: string;
}

interface InfiniteImageGridProps {
  selectedJob: string | null;
}

export default function InfiniteImageGrid({ selectedJob }: InfiniteImageGridProps) {
  const [allDatasets, setAllDatasets] = useState<string[]>([]);
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState<number>(0);
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [loadedPages, setLoadedPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [datasetImageCounts, setDatasetImageCounts] = useState<Map<string, number>>(new Map());
  const { getCache, addImageToCache, removeImageFromCache } = useJobDataset();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  const IMAGES_PER_PAGE = 16;

  // 載入所有 datasets
  useEffect(() => {
    const loadDatasets = async () => {
      if (!selectedJob) {
        setAllDatasets([]);
        setCurrentDatasetIndex(0);
        setAllImages([]);
        setSelectedImages(new Set());
        setLoadedPages(0);
        return;
      }

      try {
        const response = await fetchDatasets(selectedJob);
        const datasets = response.dataset_names || [];
        setAllDatasets(datasets);
        setCurrentDatasetIndex(0);
        setAllImages([]);
        setLoadedPages(0);
        
        // 載入所有快取的選擇狀態
        const allCachedImages = new Set<string>();
        for (const dataset of datasets) {
          const cachedImagePaths = getCache(selectedJob, dataset);
          cachedImagePaths.forEach(path => allCachedImages.add(path));
        }
        setSelectedImages(allCachedImages);
        
      } catch (error) {
        console.error('Error loading datasets:', error);
        setAllDatasets([]);
      }
    };

    loadDatasets();
  }, [selectedJob, getCache]);

  // 載入指定 dataset 的指定頁面圖片
  const loadImagesPage = useCallback(async (datasetIndex: number, pageIndex: number) => {
    if (!selectedJob || !allDatasets[datasetIndex]) return { images: [], hasMore: false };
    
    const dataset = allDatasets[datasetIndex];
    
    try {
      setLoading(true);
      const response = await fetchBase64Images(selectedJob, dataset);
      
      if (response && response.length > 0) {
        // 更新該 dataset 的圖片總數
        setDatasetImageCounts(prev => new Map(prev).set(dataset, response.length));
        
        // 計算這一頁應該顯示的圖片
        const startIndex = pageIndex * IMAGES_PER_PAGE;
        const endIndex = Math.min(startIndex + IMAGES_PER_PAGE, response.length);
        const pageImages = response.slice(startIndex, endIndex).map((image: { name: string, path: string }) => ({
          name: image.name,
          url: getImageUrl(selectedJob, dataset, image.name),
          dataset: dataset
        }));
        
        // 檢查是否還有更多頁面
        const hasMoreInDataset = endIndex < response.length;
        const hasMoreDatasets = datasetIndex < allDatasets.length - 1;
        const hasMore = hasMoreInDataset || hasMoreDatasets;
        
        return { images: pageImages, hasMore, totalInDataset: response.length };
      }
      
      return { images: [], hasMore: datasetIndex < allDatasets.length - 1, totalInDataset: 0 };
    } catch (error) {
      console.error(`Unable to load images for dataset ${dataset}:`, error);
      return { images: [], hasMore: false, totalInDataset: 0 };
    } finally {
      setLoading(false);
    }
  }, [selectedJob, allDatasets]);

  // 載入下一頁（可能是當前 dataset 的下一頁或下一個 dataset 的第一頁）
  const loadNextPage = useCallback(async () => {
    if (loading || allDatasets.length === 0) return;
    
    const currentDataset = allDatasets[currentDatasetIndex];
    if (!currentDataset) return;
    
    // 計算當前 dataset 已載入的頁數
    const currentDatasetImages = allImages.filter(img => img.dataset === currentDataset);
    const currentDatasetPages = Math.ceil(currentDatasetImages.length / IMAGES_PER_PAGE);
    const totalInCurrentDataset = datasetImageCounts.get(currentDataset) || 0;
    const maxPagesInCurrentDataset = Math.ceil(totalInCurrentDataset / IMAGES_PER_PAGE);
    
    let datasetToLoad = currentDatasetIndex;
    let pageToLoad = currentDatasetPages;
    
    // 如果當前 dataset 已載入完畢，切換到下一個 dataset
    if (totalInCurrentDataset > 0 && currentDatasetPages >= maxPagesInCurrentDataset) {
      if (currentDatasetIndex < allDatasets.length - 1) {
        datasetToLoad = currentDatasetIndex + 1;
        pageToLoad = 0;
        setCurrentDatasetIndex(datasetToLoad);
      } else {
        // 所有 datasets 都載入完畢
        return;
      }
    }
    
    const result = await loadImagesPage(datasetToLoad, pageToLoad);
    if (result.images.length > 0) {
      setAllImages(prev => [...prev, ...result.images]);
      setLoadedPages(prev => prev + 1);
    }
  }, [loading, allDatasets, currentDatasetIndex, allImages, datasetImageCounts, loadImagesPage]);

  // 初始化載入前兩頁
  useEffect(() => {
    const initializeImages = async () => {
      if (allDatasets.length === 0) return;
      
      setAllImages([]);
      setLoadedPages(0);
      
      // 載入第一頁
      const firstPage = await loadImagesPage(0, 0);
      if (firstPage.images.length > 0) {
        setAllImages(firstPage.images);
        setLoadedPages(1);
        
        // 載入第二頁
        setTimeout(async () => {
          if (firstPage.totalInDataset > IMAGES_PER_PAGE) {
            // 當前 dataset 還有更多圖片
            const secondPage = await loadImagesPage(0, 1);
            if (secondPage.images.length > 0) {
              setAllImages(prev => [...prev, ...secondPage.images]);
              setLoadedPages(2);
            }
          } else if (allDatasets.length > 1) {
            // 載入下一個 dataset 的第一頁
            const secondPage = await loadImagesPage(1, 0);
            if (secondPage.images.length > 0) {
              setAllImages(prev => [...prev, ...secondPage.images]);
              setCurrentDatasetIndex(1);
              setLoadedPages(2);
            }
          }
        }, 100);
      }
    };

    initializeImages();
  }, [allDatasets, loadImagesPage]);

  // 設置 Intersection Observer 來檢測滾動
  useEffect(() => {
    if (!loadingRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          loadNextPage();
        }
      },
      {
        rootMargin: '100px',
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, loadNextPage]);

  // 處理圖片點擊
  const handleImageClick = useCallback((imageName: string, imageUrl: string, dataset: string) => {
    if (!selectedJob) return;
    
    if (selectedImages.has(imageUrl)) {
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
      removeImageFromCache(imageUrl);
    } else {
      setSelectedImages(prev => new Set(prev).add(imageUrl));
      addImageToCache(selectedJob, dataset, imageUrl);
    }
  }, [selectedJob, selectedImages, addImageToCache, removeImageFromCache]);

  // 將圖片按 dataset 分組，每組再按頁面分組
  const groupedImages = new Map<string, Image[]>();
  allImages.forEach(image => {
    if (!groupedImages.has(image.dataset)) {
      groupedImages.set(image.dataset, []);
    }
    groupedImages.get(image.dataset)!.push(image);
  });

  const imagePages = [];
  for (const [dataset, images] of groupedImages) {
    for (let i = 0; i < images.length; i += IMAGES_PER_PAGE) {
      const pageImages = images.slice(i, i + IMAGES_PER_PAGE);
      imagePages.push({
        dataset,
        images: pageImages,
        isNewDataset: i === 0 // 標記是否為新 dataset 的第一頁
      });
    }
  }

  if (!selectedJob) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <h2>Welcome to Image Verify Viewer</h2>
          <p>
            Please select a job from the left sidebar to start reviewing images.
          </p>
        </div>
      </div>
    );
  }

  if (allDatasets.length === 0) {
    return (
      <div className="loading-state">
        <div className="loading-state-content">
          <div className="loading-message">Loading datasets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="infinite-container" ref={containerRef}>
      <div className="infinite-wrapper">
        {imagePages.length > 0 ? (
          <>
            {imagePages.map((page, pageIndex) => (
              <HomeImageGrid
                key={`${page.dataset}-${pageIndex}`}
                images={page.images}
                onImageClick={handleImageClick}
                selectedImages={selectedImages}
                isLoading={false}
                datasetName={page.dataset}
              />
            ))}
            
            {/* 載入更多的觸發點 */}
            {(currentDatasetIndex < allDatasets.length - 1 || 
              (datasetImageCounts.get(allDatasets[currentDatasetIndex]) || 0) > 
              allImages.filter(img => img.dataset === allDatasets[currentDatasetIndex]).length) && (
              <div ref={loadingRef} className="loading-trigger">
                {loading && (
                  <div className="loading-state">
                    <div className="loading-state-content">
                      <div className="loading-message">Loading more images...</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="no-images">
            <p>No images found for this job.</p>
          </div>
        )}
      </div>
    </div>
  );
}