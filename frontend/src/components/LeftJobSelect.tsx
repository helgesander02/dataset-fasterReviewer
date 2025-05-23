import React from 'react';

interface JobSelectProps {
  jobs: string[];
  selectedJob: string;
  onJobSelect: (job: string) => void;
  loading: boolean;
}

export default function JobSelect({ jobs, selectedJob, onJobSelect, loading }: JobSelectProps) {
  return (
    <div className="job-select-container">
      <select 
        className="job-select"
        value={selectedJob}
        onChange={(e) => onJobSelect(e.target.value)}
        disabled={loading}
      >
        <option value="" disabled>Select a Job</option>
        {jobs.map((job, index) => (
          <option key={job} value={job}>
            {index + 1}. {job}
          </option>
        ))}
      </select>
    </div>
  );
}