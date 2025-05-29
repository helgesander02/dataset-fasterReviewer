"use client";

import React from 'react';

interface Image {
  name: string;
  url: string;
  dataset: string;
}

interface HomeImageGridProps {
  images: Image[];
  onImageClick: (imageName: string, imageUrl: string, dataset: string) => void;
  selectedImages: Set<string>;
  isLoading: boolean;
  datasetName: string;
}

export default function HomeImageGrid({ 
  images, 
  onImageClick, 
  selectedImages, 
  isLoading, 
  datasetName 
}: HomeImageGridProps) {
  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-state-content">
          <div className="loading-message">Loading images...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-grid-section">
      <div className="image-grid">
        {images.map((image, index) => {
          const isSelected = selectedImages.has(image.url);
          return (
            <div 
              key={`${image.dataset}-${image.name}-${index}`} 
              className={`image-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onImageClick(image.name, image.url, image.dataset)}
            >
              <img 
                src={image.url} 
                alt={`${image.dataset} - Image ${index}`} 
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
    </div>
  );
}