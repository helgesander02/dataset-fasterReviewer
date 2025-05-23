interface StatusProps {
    selectedJob: string | null;
    selectedDataset: string | null;
  }
  
  export default function Status({ selectedJob, selectedDataset }: StatusProps) {
    return (
      <div className="status">
        {selectedJob && selectedDataset ? (
          <div className="ok">
            已選擇: {selectedJob} / {selectedDataset}
          </div>
        ) : (
          <div className="warn">
            {selectedJob ? '請選擇數據集' : '請選擇工作'}
          </div>
        )}
      </div>
    );
  }