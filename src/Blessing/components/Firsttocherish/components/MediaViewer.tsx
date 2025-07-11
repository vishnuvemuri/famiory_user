import React from 'react';
import { Play } from 'lucide-react';
import { MediaItem } from '../types/memoryDetail';

interface MediaViewerProps {
  mediaItem: MediaItem;
  onDoubleClick: () => void;
  className?: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  mediaItem,
  onDoubleClick,
  className = ''
}) => {
  if (mediaItem.type === 'image') {
    return (
      <div className={`media-container ${className}`}>
        <img
          src={mediaItem.url}
          alt={mediaItem.title || 'Memory'}
          className="main-media"
          onDoubleClick={onDoubleClick}
        />
        <div className="media-type-indicator">Photo</div>
      </div>
    );
  }

  if (mediaItem.type === 'video') {
    return (
      <div className={`media-container ${className}`}>
        <video
          src={mediaItem.url}
          className="main-video"
          controls
          onDoubleClick={onDoubleClick}
        />
        <div className="media-type-indicator">
          <Play size={14} />
          Video
        </div>
      </div>
    );
  }

  return null;
};