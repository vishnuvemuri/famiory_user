import React from 'react';
import { Heart } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No Favorite Memories Yet",
  submessage = "Click the heart icon on your favorite memories to save them here."
}) => {
  return (
    <div className="empty-state">
      <Heart size={48} className="empty-state-icon" />
      <h3 className="empty-state-title">{message}</h3>
      <p className="empty-state-description">{submessage}</p>
    </div>
  );
};