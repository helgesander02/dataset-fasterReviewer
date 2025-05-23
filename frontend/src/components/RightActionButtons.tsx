import { Eye } from 'lucide-react';

interface ActionButtonsProps {
  onReview: () => void;
  loading: boolean;
}

export default function ActionButtons({ onReview, loading }: ActionButtonsProps) {
  return (
    <div className="action-buttons">
      <button 
        onClick={onReview}
        className="btn btn-review"
        disabled={loading}
      >
        <Eye size={16} />
        <span>Review</span>
      </button>
    </div>
  );
}