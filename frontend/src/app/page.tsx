"use client";

import { useState } from 'react';
import { fetchDatasets } from '@/services/api';
import { useJobDataset } from '@/components/JobDatasetContext';
import HomeImageGrid from '@/components/HomeImageGrid';

export default function Home() {
  const { selectedJob, setSelectedJob, selectedDataset,  setSelectedDataset} = useJobDataset();


  return (
    <HomeImageGrid  
      selectedJob={selectedJob} 
      selectedDataset={selectedDataset} 
    />
  );
}