import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, ArrowLeft, Heart, Camera, Video, X, ChevronLeft, ChevronRight, Image as ImageIcon, Trash2, RotateCw, Filter } from 'lucide-react';
import './WeddingMemoryGallery.css';

interface MediaItem {
  id: string;
  src: string;
  type: 'image' | 'video';
  date: string;
  name: string;
  size: number;
  eventType: string;
}

interface EventData {
  title: string;
  coverImage: string;
  media: MediaItem[];
}

interface WeddingMemoryGalleryProps {
  // API Integration Props
  onUploadMedia?: (files: File[], eventType: string) => Promise<MediaItem[]>;
  onDeleteMedia?: (mediaId: string) => Promise<void>;
  onUpdateCoverImage?: (eventType: string, mediaId: string) => Promise<void>;
  onUpdateProfile?: (imageFile: File) => Promise<string>;
  
  // Data Props
  initialData?: {
    memories: Record<string, EventData>;
    profileImage?: string;
    coupleName?: string;
  };
  
  // Customization Props
  theme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  
  // Event handlers
  onDataChange?: (data: any) => void;
}

const WeddingMemoryGallery: React.FC<WeddingMemoryGalleryProps> = ({
  onUploadMedia,
  onDeleteMedia,
  onUpdateCoverImage,
  onUpdateProfile,
  initialData,
  theme = {},
  onDataChange
}) => {
  // Default event data
  const defaultMemories = {
    'bridal-entry': {
      title: 'The Bridal Entry',
      coverImage: 'https://images.unsplash.com/photo-1529636452757-60d83c0e09cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      media: []
    },
    'eternal-bond': {
      title: 'Eternal Bond',
      coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      media: []
    },
    'seven-steps': {
      title: 'The Seven Steps',
      coverImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      media: []
    }
  };

  // State management
  const [memories, setMemories] = useState<Record<string, EventData>>(
    initialData?.memories || defaultMemories
  );
  const [currentEvent, setCurrentEvent] = useState<string>('');
  const [currentView, setCurrentView] = useState<'initial' | 'memories'>('initial');
  const [profileImage, setProfileImage] = useState<string>(initialData?.profileImage || '');
  const [coupleName, setCoupleName] = useState<string>(initialData?.coupleName || 'Bride & Groom');
  const [activeThemeBtn, setActiveThemeBtn] = useState<string>('');
  
  // Upload state
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentMediaItems, setCurrentMediaItems] = useState<MediaItem[]>([]);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    mediaIndex: number;
  }>({ show: false, x: 0, y: 0, mediaIndex: 0 });
  
  // Filter state
  const [eventFilter, setEventFilter] = useState<string>('');
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Valid file types
  const VALID_FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/quicktime']
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('weddingMemories');
    if (saved && !initialData) {
      try {
        const data = JSON.parse(saved);
        setMemories(data.memories || defaultMemories);
        setProfileImage(data.profileImage || '');
        setCoupleName(data.coupleName || 'Bride & Groom');
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save to localStorage and notify parent
  useEffect(() => {
    const dataToSave = {
      memories,
      profileImage,
      coupleName
    };
    
    localStorage.setItem('weddingMemories', JSON.stringify(dataToSave));
    onDataChange?.(dataToSave);
  }, [memories, profileImage, coupleName, onDataChange]);

  // Toast notification
  const showToast = useCallback((message: string, duration = 3000) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: '', show: false });
    }, duration);
  }, []);

  // Handle file upload
  const handleFileUpload = async (files: FileList | null, type: 'image' | 'video') => {
    if (!files || files.length === 0) return;
    
    const eventType = currentEvent || eventFilter;
    if (!eventType) {
      showToast('Please select an event first');
      return;
    }

    const validFiles = Array.from(files).filter(file => 
      VALID_FILE_TYPES[type].includes(file.type)
    );

    if (validFiles.length === 0) {
      showToast('Invalid file type. Please upload valid images or videos.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setShowUploadOptions(false);

    try {
      let newMediaItems: MediaItem[] = [];

      if (onUploadMedia) {
        // Use API
        newMediaItems = await onUploadMedia(validFiles, eventType);
      } else {
        // Use local file handling
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          const objectUrl = URL.createObjectURL(file);
          
          const mediaItem: MediaItem = {
            id: Date.now() + i + '',
            src: objectUrl,
            type: type,
            date: new Date().toISOString(),
            name: file.name,
            size: file.size,
            eventType: eventType
          };
          
          newMediaItems.push(mediaItem);
          setUploadProgress(((i + 1) / validFiles.length) * 100);
        }
      }

      // Update memories
      setMemories(prev => ({
        ...prev,
        [eventType]: {
          ...prev[eventType],
          media: [...prev[eventType].media, ...newMediaItems]
        }
      }));

      showToast(`Successfully uploaded ${validFiles.length} ${type === 'image' ? 'images' : 'videos'}`);
      
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle profile image upload
  const handleProfileUpload = async (file: File) => {
    try {
      if (onUpdateProfile) {
        const newImageUrl = await onUpdateProfile(file);
        setProfileImage(newImageUrl);
      } else {
        const objectUrl = URL.createObjectURL(file);
        setProfileImage(objectUrl);
      }
      showToast('Profile image updated successfully');
    } catch (error) {
      console.error('Profile upload error:', error);
      showToast('Error updating profile image');
    }
  };

  // View management
  const showEventMemories = (eventType: string) => {
    setCurrentEvent(eventType);
    setCurrentView('memories');
    setActiveThemeBtn(eventType);
    setEventFilter(eventType);
  };

  const showInitialView = () => {
    setCurrentView('initial');
    setCurrentEvent('');
    setActiveThemeBtn('');
    setEventFilter('');
  };

  // Lightbox functions
  const openLightbox = (index: number) => {
    const eventMedia = memories[currentEvent]?.media || [];
    setCurrentMediaItems(eventMedia);
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentMediaIndex - 1 + currentMediaItems.length) % currentMediaItems.length
      : (currentMediaIndex + 1) % currentMediaItems.length;
    setCurrentMediaIndex(newIndex);
  };

  // Context menu functions
  const showContextMenu = (e: React.MouseEvent, mediaIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      mediaIndex
    });
  };

  const hideContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, mediaIndex: 0 });
  };

  const setAsCover = async () => {
    const mediaItem = memories[currentEvent].media[contextMenu.mediaIndex];
    if (mediaItem.type === 'image') {
      try {
        if (onUpdateCoverImage) {
          await onUpdateCoverImage(currentEvent, mediaItem.id);
        }
        
        setMemories(prev => ({
          ...prev,
          [currentEvent]: {
            ...prev[currentEvent],
            coverImage: mediaItem.src
          }
        }));
        
        showToast('Cover image updated successfully');
      } catch (error) {
        console.error('Cover update error:', error);
        showToast('Error updating cover image');
      }
    } else {
      showToast('Only images can be set as cover');
    }
    hideContextMenu();
  };

  const deleteMedia = async () => {
    if (!window.confirm('Are you sure you want to delete this memory?')) return;
    
    const mediaItem = memories[currentEvent].media[contextMenu.mediaIndex];
    
    try {
      if (onDeleteMedia) {
        await onDeleteMedia(mediaItem.id);
      }
      
      // Clean up object URL if it's a local file
      if (mediaItem.src.startsWith('blob:')) {
        URL.revokeObjectURL(mediaItem.src);
      }
      
      setMemories(prev => ({
        ...prev,
        [currentEvent]: {
          ...prev[currentEvent],
          media: prev[currentEvent].media.filter((_, index) => index !== contextMenu.mediaIndex)
        }
      }));
      
      showToast('Memory deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Error deleting memory');
    }
    
    hideContextMenu();
  };

  // Quick delete function for media cards
  const quickDeleteMedia = async (e: React.MouseEvent, mediaIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this memory?')) return;
    
    const mediaItem = memories[currentEvent].media[mediaIndex];
    
    try {
      if (onDeleteMedia) {
        await onDeleteMedia(mediaItem.id);
      }
      
      // Clean up object URL if it's a local file
      if (mediaItem.src.startsWith('blob:')) {
        URL.revokeObjectURL(mediaItem.src);
      }
      
      setMemories(prev => ({
        ...prev,
        [currentEvent]: {
          ...prev[currentEvent],
          media: prev[currentEvent].media.filter((_, index) => index !== mediaIndex)
        }
      }));
      
      showToast('Memory deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Error deleting memory');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          deleteMedia();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentMediaIndex, currentMediaItems.length, currentEvent]);

  // Hide context menu on outside click
  useEffect(() => {
    const handleClick = () => hideContextMenu();
    if (contextMenu.show) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu.show]);

  return (
    <div className="wmg-container" style={{ '--wmg-primary': theme.primary || '#8b5a2b' } as React.CSSProperties}>
      {/* Control Panel */}
      <div className="wmg-control-panel">
        <div className="wmg-panel-header">
          <h2>Mandap Memories</h2>
          <p>Capture the essence of your sacred moments</p>
        </div>
        
        <div className="wmg-panel-content">
          {/* Profile Section */}
          <div className="wmg-profile-section">
            <div 
              className="wmg-avatar-container" 
              onClick={() => profileInputRef.current?.click()}
            >
              <img 
                src={profileImage || `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f5f5f5"/><text x="50%" y="50%" font-size="12" text-anchor="middle" fill="#aaa">Bride & Groom</text></svg>`)}`}
                alt="Bride & Groom"
              />
              <div className="wmg-avatar-overlay">
                <span>Change Photo</span>
              </div>
            </div>
            <h3 className="wmg-couple-name">{coupleName}</h3>
          </div>
          
          {/* Event Filter */}
          <div className="wmg-filter-section">
            <label htmlFor="event-filter">
              <Filter size={16} /> Filter by Event
            </label>
            <select 
              id="event-filter" 
              className="wmg-modern-input"
              value={eventFilter}
              onChange={(e) => {
                setEventFilter(e.target.value);
                if (e.target.value) {
                  showEventMemories(e.target.value);
                }
              }}
            >
              <option value="">All Events</option>
              <option value="bridal-entry">The Bridal Entry</option>
              <option value="eternal-bond">Eternal Bond</option>
              <option value="seven-steps">The Seven Steps</option>
            </select>
          </div>
          
          {/* Upload Section */}
          <div className="wmg-upload-section">
            <button 
              className={`wmg-btn wmg-upload-btn ${isUploading ? 'uploading' : ''}`}
              onClick={() => setShowUploadOptions(!showUploadOptions)}
              disabled={isUploading}
            >
              {isUploading ? <RotateCw size={16} className="wmg-spin" /> : <Upload size={16} />}
              {isUploading ? 'Preserving Memories...' : 'Upload Memories'}
            </button>
            
            {showUploadOptions && (
              <div className="wmg-upload-options">
                <div className="wmg-upload-grid">
                  <div 
                    className="wmg-upload-option"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="wmg-upload-icon">
                      <ImageIcon size={24} />
                    </div>
                    <p>Upload Images</p>
                  </div>
                  <div 
                    className="wmg-upload-option"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="wmg-upload-icon">
                      <Video size={24} />
                    </div>
                    <p>Upload Videos</p>
                  </div>
                </div>
                
                {isUploading && (
                  <div className="wmg-upload-progress">
                    <div className="wmg-progress-bar">
                      <div 
                        className="wmg-progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="wmg-progress-text">
                      Uploading: <span className="wmg-progress-percent">{Math.round(uploadProgress)}%</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="wmg-main-content">
        {/* Header */}
        <header className="wmg-content-header">
          <div className="wmg-header-text">
            <h1>Mandap Memories</h1>
            <p>The Heart of the Wedding Rituals</p>
          </div>
          <div className="wmg-theme-buttons">
            <button 
              className={`wmg-btn wmg-theme-btn ${activeThemeBtn === 'bridal-entry' ? 'active' : ''}`}
              onClick={() => showEventMemories('bridal-entry')}
            >
              <Camera size={16} /> Bridal Entry
            </button>
            <button 
              className={`wmg-btn wmg-theme-btn ${activeThemeBtn === 'eternal-bond' ? 'active' : ''}`}
              onClick={() => showEventMemories('eternal-bond')}
            >
              <Heart size={16} /> Eternal Bond
            </button>
            <button 
              className={`wmg-btn wmg-theme-btn ${activeThemeBtn === 'seven-steps' ? 'active' : ''}`}
              onClick={() => showEventMemories('seven-steps')}
            >
              <div className="wmg-footsteps">👣</div> Seven Steps
            </button>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="wmg-content-area">
          {currentView === 'initial' ? (
            /* Initial View - Event Cards */
            <div className="wmg-initial-view">
              {Object.entries(memories).map(([eventKey, eventData]) => (
                <div 
                  key={eventKey}
                  className="wmg-event-card" 
                  onClick={() => showEventMemories(eventKey)}
                >
                  <img src={eventData.coverImage} alt={eventData.title} />
                  <div className="wmg-card-overlay">
                    <h3>{eventData.title}</h3>
                    <p>View Memories</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Memories View */
            <div className="wmg-memories-view">
              <div className="wmg-view-controls">
                <button 
                  className="wmg-btn wmg-back-btn"
                  onClick={showInitialView}
                >
                  <ArrowLeft size={16} /> Back to Events
                </button>
                <h2 className="wmg-current-event-title">
                  {memories[currentEvent]?.title || 'Event Memories'}
                </h2>
              </div>
              
              <div className="wmg-memories-container">
                {memories[currentEvent]?.media.length > 0 ? (
                  <div className="wmg-media-grid">
                    {memories[currentEvent].media.map((media, index) => (
                      <div 
                        key={media.id}
                        className="wmg-media-card"
                        onClick={() => openLightbox(index)}
                        onContextMenu={(e) => showContextMenu(e, index)}
                      >
                        <button 
                          className="wmg-delete-btn"
                          onClick={(e) => quickDeleteMedia(e, index)}
                          title="Delete this memory"
                        >
                          <X size={16} />
                        </button>
                        {media.type === 'image' ? (
                          <img src={media.src} alt={media.name} loading="lazy" />
                        ) : (
                          <>
                            <video src={media.src} muted />
                            <div className="wmg-play-button">
                              <div className="wmg-play-icon">▶</div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="wmg-empty-placeholder">
                    <Camera size={48} />
                    <p>No memories yet</p>
                    <button 
                      className="wmg-btn wmg-upload-btn"
                      onClick={() => setShowUploadOptions(true)}
                    >
                      <Upload size={16} /> Add Memories
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="wmg-lightbox" onClick={closeLightbox}>
          <div className="wmg-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="wmg-lightbox-close" onClick={closeLightbox}>
              <X size={24} />
            </button>
            
            {currentMediaItems.length > 1 && (
              <>
                <button 
                  className="wmg-lightbox-nav wmg-prev-btn"
                  onClick={() => navigateLightbox('prev')}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  className="wmg-lightbox-nav wmg-next-btn"
                  onClick={() => navigateLightbox('next')}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            
            <div className="wmg-lightbox-media-container">
              {currentMediaItems[currentMediaIndex]?.type === 'image' ? (
                <img 
                  src={currentMediaItems[currentMediaIndex]?.src} 
                  alt="Memory" 
                  className="wmg-lightbox-media"
                />
              ) : (
                <video 
                  src={currentMediaItems[currentMediaIndex]?.src} 
                  controls 
                  className="wmg-lightbox-media"
                  autoPlay
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="wmg-context-menu"
          style={{ 
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ul>
            <li onClick={setAsCover}>
              <ImageIcon size={16} /> Set as Cover Image
            </li>
            <li onClick={deleteMedia}>
              <Trash2 size={16} /> Delete
            </li>
          </ul>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="wmg-toast-message">
          {toast.message}
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e.target.files, 'image')}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e.target.files, 'video')}
      />
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && handleProfileUpload(e.target.files[0])}
      />
    </div>
  );
};

export default WeddingMemoryGallery;