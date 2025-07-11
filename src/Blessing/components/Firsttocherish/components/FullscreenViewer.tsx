import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types/memoryDetail';
import { MediaViewer } from './MediaViewer';

interface FullscreenViewerProps {
  isOpen: boolean;
  mediaItems: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: number) => void;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  isOpen,
  mediaItems,
  currentIndex,
  onClose,
  onNavigate
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onNavigate(-1);
          break;
        case 'ArrowRight':
          onNavigate(1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !mediaItems[currentIndex]) return null;

  return (
    <div className="fullscreen-viewer">
      <div className="viewer-controls">
        <button className="viewer-btn" onClick={onClose} aria-label="Close viewer">
          <X size={24} />
        </button>
      </div>
      
      <div className="viewer-nav">
        <button 
          className="nav-btn" 
          onClick={() => onNavigate(-1)}
          aria-label="Previous media"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="nav-btn" 
          onClick={() => onNavigate(1)}
          aria-label="Next media"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      <div className="fullscreen-media-container">
        <MediaViewer
          mediaItem={mediaItems[currentIndex]}
          onDoubleClick={() => {}} // No action needed in fullscreen
          className="fullscreen"
        />
      </div>
    </div>
  );
};