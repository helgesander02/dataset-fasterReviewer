"use client";

import { useState, useEffect } from 'react';
import { fetchALLPages } from '@/services/api';
import { useJobDataset } from '@/components/JobDatasetContext';
import InfiniteImageGrid from '@/components/HomeImageGrid/InfinitelmageGrid';

export default function Home() {
  const { selectedJob, selectedDataset, setSelectedDataset } = useJobDataset();
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Warning: if qukly changing job, maybe it occurs that the backend does not have the dataset for the job, 
  //          because the daraset cache is not yet created. need to wait a moment before fetching the dataset details.
  useEffect(() => {
    const fetchCurrentDatasetBySelectedDataset = async () => {
      try {
        if (!selectedJob || !selectedDataset) {
          console.warn('No job or dataset selected, skipping dataset detail fetch.');
          return;
        }
        console.log(`Fetching current dataset details for job: ${selectedJob}, dataset: ${selectedDataset}`);
        const response = await fetchALLPages(selectedJob);
        const pages = Array.isArray(response.pages) ? response.pages : Object.values(response.pages);
        const firstIndex = pages.indexOf(selectedDataset);
        if (firstIndex != currentPage) {
          setCurrentPage(firstIndex);
          console.log(`Page index updated to ${firstIndex} for dataset ${selectedDataset}`);
        }
        console.log(`Current dataset detail fetched for ${selectedDataset} at page index ${firstIndex}`);
        
      } catch (error) {
        console.error(`Error fetching details for dataset ${selectedDataset}:`, error);
        setCurrentPage(0);
      }
    };
    
    fetchCurrentDatasetBySelectedDataset();
  }, [selectedDataset]);

  return (
    <div className="main-container">
      <InfiniteImageGrid 
        selectedJob={selectedJob}
        selectedDataset={selectedDataset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSelectedDataset={setSelectedDataset}
      />
    </div>
  );
}
