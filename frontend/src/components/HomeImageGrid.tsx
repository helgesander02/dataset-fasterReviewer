"use client";

import { useState, useEffect } from 'react';
import { fetchImages, getImageUrl } from '@/services/api';
import { useJobDataset } from './JobDatasetContext';
import '@/styles/HomeImageGrid.css';

interface Image {
  name: string;
  url: string;
}

interface HomeImageGridProps {
  selectedJob: string | null;
  selectedDataset: string | null;
}

export default function HomeImageGrid({ selectedJob, selectedDataset }: HomeImageGridProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const { getCache, addImageToCache, removeImageFromCache } = useJobDataset();
  
  useEffect(() => {
    const loadImages = async () => {
      if (!selectedJob || !selectedDataset) {
        setImages([]);
        setSelectedImages(new Set());
        return;
      }

      try {
        setLoading(true);
        const response = await fetchImages(selectedJob, selectedDataset);
        if (response) {
          const formattedImages = response.map((image: { name: string, path: string }) => ({
            name: image.name,
            url: getImageUrl(selectedJob, selectedDataset, image.name)
          }));
          setImages(formattedImages);
          
          const cachedImagePaths = getCache(selectedJob, selectedDataset);
          setSelectedImages(new Set(cachedImagePaths));
        } else {
          setImages([]);
          setSelectedImages(new Set());
        }
      } catch (error) {
        console.error('Unable to load image:', error);
        setImages([]);
        setSelectedImages(new Set());
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [selectedJob, selectedDataset, getCache]);

  const handleImageClick = (imageName: string) => {
    if (!selectedJob || !selectedDataset) return;
    
    const imageUrl = getImageUrl(selectedJob, selectedDataset, imageName);
    
    if (selectedImages.has(imageUrl)) {
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
      removeImageFromCache(imageUrl);
    } else {
      setSelectedImages(prev => new Set(prev).add(imageUrl));
      addImageToCache(selectedJob, selectedDataset, imageUrl);
    }
  };

  if (!selectedJob || !selectedDataset) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <h2>Welcome to Image Verify Viewer</h2>
          <p>
            Please select a job and dataset from the left sidebar to start reviewing images.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-state-content">
          <div className="loading-message">Loading images...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="image-grid-wrapper">
        {images.length > 0 ? (
          <div className="image-grid">
            {images.map((image, index) => {
              const isSelected = selectedImages.has(image.url);
              return (
                <div 
                  key={index} 
                  className={`image-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleImageClick(image.name)}
                >
                  <img 
                    src={image.url} 
                    alt={`Image ${index}`} 
                    className="grid-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/api/placeholder/150/150";
                    }}
                  />
                  {isSelected && (
                    <div className="selection-indicator">
                      <svg 
                        className="checkmark" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </div>
                  )}
                  <div className="image-name">
                    {image.name}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-images">
            <p>No images found for this dataset.</p>
          </div>
        )}
      </div>
    </div>
  );
}