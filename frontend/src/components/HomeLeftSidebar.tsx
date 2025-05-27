"use client";

import { useState, useEffect } from 'react';
import { fetchJobs, fetchDatasets } from '@/services/api';
import { useJobDataset } from './JobDatasetContext';
import JobSelect from './LeftJobSelect';
import DatasetGrid from './LeftDatasetGrid';
import Pagination from './LeftPagination';
import LoadingIndicator from './LeftLoadingIndicator';
import '@/styles/HomeLeftSidebar.css';

export default function LeftSidebar() {
  const [jobs, setJobs] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const datasetsPerPage = 80;

  const { selectedJob, selectedDataset, setSelectedJob, setSelectedDataset } = useJobDataset();

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
  }, [selectedJob]);

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

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <p className="sidebar-title">Image Verify Viewer</p>
      </div>
      <JobSelect jobs={jobs} selectedJob={selectedJob} onJobSelect={handleJobSelect} loading={loading} />
      {selectedJob && (
        <DatasetGrid
          datasets={datasets}
          selectedDataset={selectedDataset}
          onDatasetSelect={handleDatasetSelect}
          currentPage={currentPage} 
          datasetsPerPage={datasetsPerPage}
        />
      )}
      {datasets.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalDatasets={datasets.length}
          datasetsPerPage={datasetsPerPage} 
          onPrevious={previousPage}
          onNext={nextPage}
        />
      )}
      {loading && <LoadingIndicator />}
    </div>
  );
}