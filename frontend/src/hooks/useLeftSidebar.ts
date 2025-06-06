"use client";

import { useState, useEffect } from 'react';
import { useJobDataset } from '@/components/JobDatasetContext';
import { fetchJobs, fetchDatasets } from '@/services/api';
import { DATASET_PER_PAGE } from '@/services/config';
import { SidebarState, SidebarActions } from '@/types/HomeLeftSidebar';

export function useLeftSidebar(): SidebarState & SidebarActions {
  const [jobs, setJobs] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { selectedJob, selectedDataset, setSelectedJob, setSelectedDataset } = useJobDataset();

  // Load jobs on component mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchJobs();
        setJobs(response.job_names || []);

      } catch (error) {
        console.error('Unable to load job:', error);
        alert('Unable to load jobs, please try again later.');

      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  // Load datasets when job changes
  useEffect(() => {
    const loadDatasets = async () => {
      if (!selectedJob) return;
      
      try {
        setLoading(true);
        const response = await fetchDatasets(selectedJob);
        setDatasets(response.dataset_names || []);
        setCurrentPage(0);

        if (response.dataset_names.length > 0) {
          setSelectedDataset(response.dataset_names[0]);
        }
      } catch (error) {
        console.error('Unable to load dataset:', error);
        alert('Unable to load datasets, please try again later.');

      } finally {
        setLoading(false);
      }
    };

    loadDatasets();
  }, [selectedJob, setSelectedDataset]);

  //  Handle job and dataset selection
  const handleJobSelect = (job: string) => {
    setSelectedJob(job);
    setSelectedDataset('');
    console.log(`Job selected: ${job}`);
  };

  const handleDatasetSelect = (dataset: string) => {
    setSelectedDataset(dataset);
    console.log(`Dataset selected: ${dataset}`);
  };

  // Pagination logic
  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if ((currentPage + 1) * DATASET_PER_PAGE < datasets.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    jobs,
    datasets,
    loading,
    currentPage,
    handleJobSelect,
    handleDatasetSelect,
    previousPage,
    nextPage
  };
}