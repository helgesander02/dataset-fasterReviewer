import { Save, Clock } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  loading: boolean;
  saveSuccess: boolean;
  cachedImages: any[];
  disabled: boolean;
}

export default function SaveButton({ onSave, loading, saveSuccess, cachedImages, disabled }: SaveButtonProps) {
  return (
    <div>
      {saveSuccess && (
        <div className="save-success">
          <Clock size={12} />
          保存成功！
        </div>
      )}
      
      <button 
        onClick={onSave}
        disabled={disabled}
        className="btn btn-save"
      >
        {loading ? (
          <>
            <div className="loading-spinner"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save size={16} />
            <span>Save ({cachedImages.length})</span>
          </>
        )}
      </button>
    </div>
  );
}