"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, Image as ImageIcon, Loader2, Check, Save } from 'lucide-react';
import { getPendingReview, savePendingReview } from '@/services/api';
import { useJobDataset } from './JobDatasetContext';
import '@/styles/HomeReview.css';

interface HomeReviewProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewItem {
  job: string;
  dataset: string;
  imagePath: string;
}

interface PendingReviewData {
  items: ReviewItem[];
}

export default function HomeReview({ isOpen, onClose }: HomeReviewProps) {
  const { cachedImages, addImageToCache, removeImageFromCache } = useJobDataset();
  
  // State management
  const [reviewData, setReviewData] = useState<PendingReviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedDataset, setSelectedDataset] = useState<string>('');

  // Fetch pending review data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPendingReview();
    }
  }, [isOpen]);

  // Sync selected images with cached images
  useEffect(() => {
    if (reviewData?.items) {
      const cachedImagePaths = new Set(cachedImages.map(img => img.imagePath));
      setSelectedImages(cachedImagePaths);
    }
  }, [reviewData, cachedImages]);

  // Fetch pending review data
  const fetchPendingReview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingReview(true);
      setReviewData(data);
    } catch (err) {
      console.error('Error fetching pending review:', err);
      setError('無法載入待審核資料，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  // Save to pending review
  const saveToPendingReview = useCallback(async () => {
    try {
      setSaving(true);
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
    } catch (err) {
      console.error('Error saving pending review:', err);
    } finally {
      setSaving(false);
    }
  }, [selectedJob, selectedDataset, cachedImages]);

  // Toggle individual image selection
  const toggleImageSelection = async (item: ReviewItem) => {
    const { job, dataset, imagePath } = item;
    const isCurrentlySelected = selectedImages.has(imagePath);
    
    if (isCurrentlySelected) {
      removeImageFromCache(imagePath);
    } else {
      addImageToCache(job, dataset, imagePath);
    }
  };

  // Select all images
  const selectAllImages = async () => {
    if (!reviewData?.items) return;
    
    reviewData.items.forEach(item => {
      addImageToCache(item.job, item.dataset, item.imagePath);
    });
  };

  // Deselect all images
  const deselectAllImages = async () => {
    if (!reviewData?.items) return;
    
    reviewData.items.forEach(item => {
      removeImageFromCache(item.imagePath);
    });
  };

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  if (!isOpen) return null;

  const hasImages = reviewData && reviewData.items.length > 0;
  const selectedCount = selectedImages.size;
  const totalCount = reviewData?.items.length || 0;

  return (
    <div className="home-review-overlay">
      <div className="home-review-modal">
        {/* Header */}
        <div className="home-review-header">
          <h2 className="home-review-title">
            <ImageIcon size={20} />
            Select Picture
            {saving && <Loader2 size={16} className="loading-spin" />}
          </h2>
          <button 
            onClick={onClose}
            className="home-review-close-btn"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="home-review-content">
          {loading ? (
            <div className="home-review-loading">
              <Loader2 size={24} className="loading-spin" />
              <span>loading...</span>
            </div>
          ) : error ? (
            <div className="home-review-error">
              <p>{error}</p>
              <button 
                onClick={fetchPendingReview}
                className="home-review-retry-btn"
              >
                Reload
              </button>
            </div>
          ) : !hasImages ? (
            <div className="home-review-empty">
              <ImageIcon size={48} />
              <p>There are currently no pictures</p>
            </div>
          ) : (
            <div className="home-review-images-grid">
              {reviewData.items.map((item, index) => {
                const isSelected = selectedImages.has(item.imagePath);
                return (
                  <div 
                    key={`${item.imagePath}-${index}`}
                    className={`home-review-image-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleImageSelection(item)}
                  >
                    <img 
                      src={item.imagePath} 
                      alt={`Image ${index + 1}`}
                      className="home-review-image"
                      onError={handleImageError}
                    />
                    <div className="home-review-image-fallback">
                      <ImageIcon size={32} />
                    </div>
                    {isSelected && (
                      <div className="home-review-selection-indicator">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasImages && (
          <div className="home-review-footer">
            <div className="home-review-total">
              Selected: {selectedCount} / {totalCount}
            </div>
            <div className="home-review-actions">
              <button 
                className="home-review-action-btn secondary"
                onClick={deselectAllImages}
                disabled={saving}
              >
                Cancel All
              </button>
              <button 
                className="home-review-action-btn secondary"
                onClick={selectAllImages}
                disabled={saving}
              >
                Select ALL
              </button>
              <button 
                className="home-review-action-btn primary save-btn"
                onClick={saveToPendingReview}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="loading-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}