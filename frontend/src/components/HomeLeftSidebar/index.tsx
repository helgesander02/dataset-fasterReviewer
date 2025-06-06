"use client";

import { useJobDataset } from '../JobDatasetContext';
import { SidebarHeader } from './SidebarHeader';
import JobSelect from './JobSelect';
import { DatasetSection } from './DatasetSection';
import LoadingIndicator from './LoadingIndicator';
import { useLeftSidebar } from '@/hooks/useLeftSidebar';
import '@/styles/HomeLeftSidebar.css';

export default function LeftSidebar() {
  const { selectedJob, selectedDataset } = useJobDataset();
  const {
    jobs, datasets, loading, currentPage,
    handleJobSelect, handleDatasetSelect, previousPage,nextPage
  } = useLeftSidebar();

  return (
    <div className="sidebar-container">
      <SidebarHeader />
      
      <JobSelect 
        jobs={jobs} 
        selectedJob={selectedJob} 
        loading={loading} 
        onJobSelect={handleJobSelect} 
      />
      
      {selectedJob && (
        <DatasetSection
          currentPage={currentPage}
          datasets={datasets}
          selectedDataset={selectedDataset}
          onDatasetSelect={handleDatasetSelect}
          onPrevious={previousPage}
          onNext={nextPage}
        />
      )}
      
      {loading && <LoadingIndicator />}
    </div>
  );
}
