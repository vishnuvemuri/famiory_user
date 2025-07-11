import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Edit3, Trash2, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Memory, MediaFile } from '../contexts/LoveJourneyContext';
import { useToast } from '../contexts/ToastContext';
import { mockApiService } from '../services/apiService';

interface MemoryDetailPageProps {
  memory: Memory | null;
  onBack: () => void;
  onUpdateMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
}

const MemoryDetailPage: React.FC<MemoryDetailPageProps> = ({
  memory,
  onBack,
  onUpdateMemory,
  onDeleteMemory
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [fullscreenMedia, setFullscreenMedia] = useState<{ isOpen: boolean; index: number }>({
    isOpen: false,
    index: 0
  });

  useEffect(() => {
    if (memory) {
      setEditedDescription(memory.description);
    }
  }, [memory]);

  if (!memory) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="memory-detail-container"
      >
        <div className="memory-not-found">
          <h2>Memory Not Found</h2>
          <p>The memory you're looking for doesn't exist.</p>
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={20} />
            Back to Memories
          </button>
        </div>
      </motion.div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleSaveDescription = async () => {
    if (!editedDescription.trim()) {
      showToast('Description cannot be empty', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedMemory = {
        ...memory,
        description: editedDescription.trim()
      };
      
      onUpdateMemory(updatedMemory);
      setIsEditingDescription(false);
      showToast('Description updated successfully!');
    } catch (error) {
      showToast('Failed to update description', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedia = async (mediaIndex: number) => {
    if (!confirm('Are you sure you want to delete this media? This cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedMediaFiles = memory.mediaFiles.filter((_, index) => index !== mediaIndex);
      const updatedMemory = {
        ...memory,
        mediaFiles: updatedMediaFiles
      };
      
      onUpdateMemory(updatedMemory);
      showToast('Media deleted successfully!');
      
      // Close fullscreen if we deleted the currently viewed media
      if (fullscreenMedia.isOpen && fullscreenMedia.index === mediaIndex) {
        setFullscreenMedia({ isOpen: false, index: 0 });
      }
    } catch (error) {
      showToast('Failed to delete media', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenMedia({ isOpen: true, index });
  };

  const closeFullscreen = () => {
    setFullscreenMedia({ isOpen: false, index: 0 });
  };

  const navigateFullscreen = (direction: 'prev' | 'next') => {
    const totalMedia = memory.mediaFiles.length;
    if (totalMedia === 0) return;

    let newIndex = fullscreenMedia.index;
    if (direction === 'prev') {
      newIndex = (fullscreenMedia.index - 1 + totalMedia) % totalMedia;
    } else {
      newIndex = (fullscreenMedia.index + 1) % totalMedia;
    }
    setFullscreenMedia({ isOpen: true, index: newIndex });
  };

  // Keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenMedia.isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeFullscreen();
          break;
        case 'ArrowLeft':
          navigateFullscreen('prev');
          break;
        case 'ArrowRight':
          navigateFullscreen('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenMedia]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="memory-detail-container"
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-overlay"
          >
            <div className="loading-content">
              <div className="loading-spinner" />
              <p>Preserving Your Memories...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="memory-header"
      >
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back to Memories
        </button>
        <h1>From Yes to Forever</h1>
        <h2>{memory.title}</h2>
      </motion.div>

      {/* Content Layout */}
      <div className="memory-layout">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="memory-info"
        >
          <div className="memory-date">
            <Calendar size={18} />
            <span>{formatDate(memory.date)}</span>
          </div>
          
          <div className="memory-description-section">
            {isEditingDescription ? (
              <div className="edit-description">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="description-textarea"
                  rows={8}
                  placeholder="Describe this precious memory..."
                />
                <div className="edit-actions">
                  <button
                    onClick={() => {
                      setIsEditingDescription(false);
                      setEditedDescription(memory.description);
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    className="save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="memory-description">
                <p>{memory.description}</p>
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="edit-description-btn"
                >
                  <Edit3 size={16} />
                  Edit Description
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Gallery */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="memory-gallery"
        >
          {memory.mediaFiles.length === 0 ? (
            <div className="empty-gallery">
              <div className="empty-state">
                <h3>No Media Yet</h3>
                <p>This memory is waiting to be filled with your precious photos and videos.</p>
              </div>
            </div>
          ) : (
            <div className="gallery-grid">
              {memory.mediaFiles.map((media, index) => (
                <motion.div
                  key={media.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="gallery-item"
                  onClick={() => openFullscreen(index)}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.name}
                      className="gallery-media"
                      loading="lazy"
                    />
                  ) : (
                    <div className="video-container">
                      <video
                        src={media.url}
                        className="gallery-media"
                        muted
                      />
                      <div className="video-overlay">
                        <Play size={24} />
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMedia(index);
                    }}
                    className="delete-media-btn"
                    aria-label="Delete media"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {fullscreenMedia.isOpen && memory.mediaFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fullscreen-gallery"
            onClick={closeFullscreen}
          >
            <button
              onClick={closeFullscreen}
              className="close-fullscreen"
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>

            <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
              {memory.mediaFiles[fullscreenMedia.index]?.type === 'image' ? (
                <img
                  src={memory.mediaFiles[fullscreenMedia.index]?.url}
                  alt={memory.mediaFiles[fullscreenMedia.index]?.name}
                  className="fullscreen-media"
                />
              ) : (
                <video
                  src={memory.mediaFiles[fullscreenMedia.index]?.url}
                  className="fullscreen-media"
                  controls
                  autoPlay
                />
              )}

              {memory.mediaFiles.length > 1 && (
                <>
                  <button
                    onClick={() => navigateFullscreen('prev')}
                    className="nav-btn prev-btn"
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => navigateFullscreen('next')}
                    className="nav-btn next-btn"
                    aria-label="Next media"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="gallery-counter">
              {fullscreenMedia.index + 1} / {memory.mediaFiles.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryDetailPage;