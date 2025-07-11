import React from 'react';
import { Play } from 'lucide-react';
import { MediaItem } from '../types/memoryDetail';

interface ThumbnailGridProps {
  mediaItems: MediaItem[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  onThumbnailDoubleClick: (index: number) => void;
}

export const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({
  mediaItems,
  currentIndex,
  onThumbnailClick,
  onThumbnailDoubleClick
}) => {
  return (
    <div className="thumbnail-grid">
      {mediaItems.map((item, index) => (
        <div
          key={item.id}
          className={`thumbnail-container ${index === currentIndex ? 'active' : ''}`}
          onClick={() => onThumbnailClick(index)}
          onDoubleClick={() => onThumbnailDoubleClick(index)}
        >
          <img
            src={item.thumbnail}
            alt={item.title || `Media ${index + 1}`}
            className="thumbnail"
          />
          {item.type === 'video' && (
            <div className="thumbnail-badge">
              <Play size={12} />
              Video
            </div>
          )}
        </div>
      ))}
    </div>
  );
};