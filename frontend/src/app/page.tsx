"use client";

import { useState, useEffect } from 'react';
import { fetchDatasets, fetchImages } from '@/services/api';
import { useJobDataset } from '@/components/JobDatasetContext';
import InfiniteImageGrid from '@/components/HomeInfinitelmageGrid';

export default function Home() {
  const { selectedJob } = useJobDataset();
  const [totalDatasets, setTotalDatasets] = useState<number>(0);

  useEffect(() => {
    const fetchTotalDatasets = async () => {
      if (!selectedJob) {
        setTotalDatasets(0);
        return;
      }

      try {
        const response = await fetchDatasets(selectedJob);
        const datasets = Array.isArray(response.dataset_names) ? response.dataset_names : [];
        setTotalDatasets(datasets.length);
        console.log(`Total datasets for ${selectedJob}: ${datasets.length}`);
      } catch (error) {
        console.error('Error fetching total datasets:', error);
        setTotalDatasets(0);
      }
    };

    fetchTotalDatasets();
  }, [selectedJob]);

  return (
    <div className="main-container">
      <InfiniteImageGrid 
        selectedJob={selectedJob}
      />
    </div>
  );
}