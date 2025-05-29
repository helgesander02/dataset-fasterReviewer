"use client";

import { useState, useEffect } from 'react';
import { fetchJobs, fetchDatasets } from '@/services/api';
import { datasetsPerPage } from '@/services/config';
import { useJobDataset } from '@/components/JobDatasetContext';
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
      } finally {
        setLoading(false);
      }
    };

    loadDatasets();
  }, [selectedJob, setSelectedDataset]);

  const handleJobSelect = (job: string) => {
    setSelectedJob(job);
    setSelectedDataset('');
  };

  const handleDatasetSelect = (dataset: string) => {
    setSelectedDataset(dataset);
    console.log(`Dataset selected: ${dataset}`);
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if ((currentPage + 1) * datasetsPerPage < datasets.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    // State
    jobs,
    datasets,
    loading,
    currentPage,
    // Actions
    handleJobSelect,
    handleDatasetSelect,
    previousPage,
    nextPage
  };
}