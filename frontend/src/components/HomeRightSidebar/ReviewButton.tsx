import { Eye } from 'lucide-react';
import { ReviewButtonProps } from '@/types/HomeRightSidebar';

export default function ReviewButton({ onReview, loading }: ReviewButtonProps) {
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
