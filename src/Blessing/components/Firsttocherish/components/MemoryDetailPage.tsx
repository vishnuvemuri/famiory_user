import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useMemoryDetail } from '../hooks/useMemoryDetail';
import { MemoryDetailFormData } from '../types/memoryDetail';
import { MediaViewer } from './MediaViewer';
import { ThumbnailGrid } from './ThumbnailGrid';
import { FullscreenViewer } from './FullscreenViewer';

interface MemoryDetailPageProps {
  memoryId: string;
  onBack?: () => void;
}

export const MemoryDetailPage: React.FC<MemoryDetailPageProps> = ({
  memoryId,
  onBack
}) => {
  const { memoryDetail, loading, error, updateMemoryDetail } = useMemoryDetail(memoryId);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [formData, setFormData] = useState<MemoryDetailFormData>({
    title: '',
    date: '',
    time: { hours: '', minutes: '', seconds: '' },
    location: '',
    note: ''
  });

  // Update form data when memory detail loads
  useEffect(() => {
    if (memoryDetail) {
      setFormData({
        title: memoryDetail.title,
        date: memoryDetail.date,
        time: memoryDetail.time,
        location: memoryDetail.location,
        note: memoryDetail.note
      });
    }
  }, [memoryDetail]);

  // Keyboard navigation for main gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreenOpen || !memoryDetail?.mediaItems.length) return;
      
      if (e.key === 'ArrowLeft') {
        navigateMedia(-1);
      } else if (e.key === 'ArrowRight') {
        navigateMedia(1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen, memoryDetail?.mediaItems.length, currentMediaIndex]);

  const navigateMedia = (direction: number) => {
    if (!memoryDetail?.mediaItems.length) return;
    
    const newIndex = (currentMediaIndex + direction + memoryDetail.mediaItems.length) % memoryDetail.mediaItems.length;
    setCurrentMediaIndex(newIndex);
  };

  const navigateFullscreen = (direction: number) => {
    if (!memoryDetail?.mediaItems.length) return;
    
    const newIndex = (fullscreenIndex + direction + memoryDetail.mediaItems.length) % memoryDetail.mediaItems.length;
    setFullscreenIndex(newIndex);
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await updateMemoryDetail(formData);
    if (result.success) {
      alert('Memory updated successfully!');
    } else {
      alert(`Failed to update memory: ${result.error}`);
    }
  };

  const handleInputChange = (field: keyof MemoryDetailFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (timeField: 'hours' | 'minutes' | 'seconds', value: string) => {
    setFormData(prev => ({
      ...prev,
      time: {
        ...prev.time,
        [timeField]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="memory-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading memory details...</p>
      </div>
    );
  }

  if (error || !memoryDetail) {
    return (
      <div className="memory-detail-error">
        <h2>Error Loading Memory</h2>
        <p>{error || 'Memory not found'}</p>
        {onBack && (
          <button className="btn btn-primary" onClick={onBack}>
            <ChevronLeft size={18} />
            Back to Gallery
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="memory-detail-page">
      <div className="app-container">
        {/* Memory Details Panel */}
        <div className="memory-details">
          <h1 className="memory-title">{memoryDetail.title}</h1>
          
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="memory-date">Date</label>
              <input
                type="date"
                id="memory-date"
                className="form-control"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Time</label>
              <div className="time-inputs">
                <input
                  type="text"
                  className="form-control"
                  value={formData.time.hours}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                  placeholder="HH"
                  maxLength={2}
                />
                <input
                  type="text"
                  className="form-control"
                  value={formData.time.minutes}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                  placeholder="MM"
                  maxLength={2}
                />
                <input
                  type="text"
                  className="form-control"
                  value={formData.time.seconds}
                  onChange={(e) => handleTimeChange('seconds', e.target.value)}
                  placeholder="SS"
                  maxLength={2}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                className="form-control"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="comment">Memory Note</label>
              <textarea
                id="comment"
                className="form-control"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Describe this special moment..."
                rows={6}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Memory'}
            </button>
          </form>
        </div>

        {/* Gallery Section */}
        <div className="gallery-section">
          {memoryDetail.mediaItems.length > 0 && (
            <>
              <div className="main-media-container">
                <MediaViewer
                  mediaItem={memoryDetail.mediaItems[currentMediaIndex]}
                  onDoubleClick={() => openFullscreen(currentMediaIndex)}
                />
              </div>
              
              <div className="media-controls">
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigateMedia(-1)}
                  disabled={memoryDetail.mediaItems.length <= 1}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigateMedia(1)}
                  disabled={memoryDetail.mediaItems.length <= 1}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <ThumbnailGrid
                mediaItems={memoryDetail.mediaItems}
                currentIndex={currentMediaIndex}
                onThumbnailClick={setCurrentMediaIndex}
                onThumbnailDoubleClick={openFullscreen}
              />
            </>
          )}
          
          {memoryDetail.mediaItems.length === 0 && (
            <div className="no-media-state">
              <h3>No Media Available</h3>
              <p>This memory doesn't have any photos or videos yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Viewer */}
      <FullscreenViewer
        isOpen={isFullscreenOpen}
        mediaItems={memoryDetail.mediaItems}
        currentIndex={fullscreenIndex}
        onClose={closeFullscreen}
        onNavigate={navigateFullscreen}
      />
    </div>
  );
};