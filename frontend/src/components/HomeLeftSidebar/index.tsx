"use client";

import { useJobDataset } from '../JobDatasetContext';
import { useLeftSidebar } from '@/hooks/useLeftSidebar';
import { SidebarHeader } from './SidebarHeader';
import JobSelect from './JobSelect';
import { DatasetSection } from './DatasetSection';
import LoadingIndicator from './LoadingIndicator';
import '@/styles/HomeLeftSidebar.css';

export default function LeftSidebar() {
  const { selectedJob, selectedDataset } = useJobDataset();
  const {
    jobs,
    datasets,
    loading,
    currentPage,
    handleJobSelect,
    handleDatasetSelect,
    previousPage,
    nextPage
  } = useLeftSidebar();

  return (
    <div className="sidebar-container">
      <SidebarHeader />
      
      <JobSelect 
        jobs={jobs} 
        selectedJob={selectedJob} 
        onJobSelect={handleJobSelect} 
        loading={loading} 
      />
      
      {selectedJob && (
        <DatasetSection
          datasets={datasets}
          selectedDataset={selectedDataset}
          onDatasetSelect={handleDatasetSelect}
          currentPage={currentPage}
          onPrevious={previousPage}
          onNext={nextPage}
        />
      )}
      
      {loading && <LoadingIndicator />}
    </div>
  );
}
