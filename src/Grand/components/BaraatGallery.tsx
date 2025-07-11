import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Plus, Images, Image as ImageIcon, Video, Trash2, Check, X, ChevronLeft, ChevronRight, UploadCloud as CloudUpload, Save, Heart } from 'lucide-react';
import styles from './BaraatGallery.module.css';

interface Memory {
  id: string;
  type: 'image' | 'video';
  url: string;
  file?: File;
  date: string;
  uploadedAt: Date;
  isSample?: boolean;
}

interface BaraatGalleryProps {
  // API integration props - customize these functions based on your backend
  onUploadMemories?: (files: File[]) => Promise<Memory[]>;
  onDeleteMemories?: (memoryIds: string[]) => Promise<void>;
  onUpdateCover?: (file: File) => Promise<string>;
  initialMemories?: Memory[];
  className?: string;
}

const BaraatGallery: React.FC<BaraatGalleryProps> = ({
  onUploadMemories,
  onDeleteMemories,
  onUpdateCover,
  initialMemories = [],
  className
}) => {
  // State management
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [coverImage, setCoverImage] = useState<string>('');
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize with sample data if no initial memories provided
  useEffect(() => {
    if (initialMemories.length === 0) {
      const sampleMemories: Memory[] = [
        {
          id: '1',
          type: 'image',
          url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          uploadedAt: new Date(),
          isSample: true
        },
        {
          id: '2',
          type: 'image',
          url: 'https://images.pexels.com/photos/1113634/pexels-photo-1113634.jpeg',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          uploadedAt: new Date(),
          isSample: true
        }
      ];
      setMemories(sampleMemories);
    }
  }, [initialMemories]);

  // Filter memories based on current filter
  useEffect(() => {
    const userMemories = memories.filter(m => !m.isSample);
    const memoriesToShow = userMemories.length > 0 ? userMemories : memories;
    const filtered = memoriesToShow
      .filter(memory => currentFilter === 'all' || memory.type === currentFilter)
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    setFilteredMemories(filtered);
  }, [memories, currentFilter]);

  // Handle cover image upload
  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (onUpdateCover) {
        const coverUrl = await onUpdateCover(file);
        setCoverImage(coverUrl);
      } else {
        // Fallback to local preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      triggerConfetti();
    } catch (error) {
      console.error('Error uploading cover image:', error);
    }
  };

  // Handle memory file selection
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  // Upload memories
  const uploadMemories = async () => {
    if (selectedFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (onUploadMemories) {
        // Use custom upload function
        const newMemories = await onUploadMemories(selectedFiles);
        setMemories(prev => [...newMemories, ...prev]);
      } else {
        // Simulate upload progress and create local previews
        for (let i = 0; i < selectedFiles.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setUploadProgress(((i + 1) / selectedFiles.length) * 100);
        }

        const newMemories: Memory[] = selectedFiles.map(file => ({
          id: generateId(),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: URL.createObjectURL(file),
          file,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          uploadedAt: new Date()
        }));

        setMemories(prev => [...newMemories, ...prev]);
      }

      setSelectedFiles([]);
      setShowUploadModal(false);
      triggerConfetti();
    } catch (error) {
      console.error('Error uploading memories:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete selected memories
  const deleteSelectedMemories = async () => {
    if (selectedMemoryIds.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedMemoryIds.length} selected memory(ies)?`
    );
    if (!confirmDelete) return;

    try {
      if (onDeleteMemories) {
        await onDeleteMemories(selectedMemoryIds);
      }
      setMemories(prev => prev.filter(memory => !selectedMemoryIds.includes(memory.id)));
      setSelectedMemoryIds([]);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error deleting memories:', error);
    }
  };

  // Toggle memory selection
  const toggleMemorySelection = (memoryId: string) => {
    setSelectedMemoryIds(prev =>
      prev.includes(memoryId)
        ? prev.filter(id => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  // Open memory preview
  const openMemoryPreview = (index: number) => {
    if (isEditMode) return;
    setCurrentMemoryIndex(index);
    setShowPreviewModal(true);
  };

  // Navigate preview
  const navigatePreview = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev'
      ? (currentMemoryIndex - 1 + filteredMemories.length) % filteredMemories.length
      : (currentMemoryIndex + 1) % filteredMemories.length;
    setCurrentMemoryIndex(newIndex);
  };

  // Trigger confetti animation
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!showPreviewModal) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        navigatePreview('prev');
        break;
      case 'ArrowRight':
        navigatePreview('next');
        break;
      case 'Escape':
        setShowPreviewModal(false);
        break;
    }
  }, [showPreviewModal, currentMemoryIndex, filteredMemories.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Utility function to generate unique IDs
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className={styles.confetti}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#D4AF37', '#800020', '#E8A5A5', '#FFFFFF'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div 
        className={styles.heroSection}
        style={{
          backgroundImage: coverImage ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${coverImage})` : undefined
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageUpload}
          className={styles.hiddenInput}
          id="cover-upload"
        />
        <label htmlFor="cover-upload" className={styles.editCoverBtn}>
          <Camera size={16} />
          Change Cover
        </label>

        <div className={styles.heroContent}>
          <h1>The Grand Arrival</h1>
          <h2>Relive Our Baraat Moments</h2>
          <p className={styles.subtext}>"The joyous procession that brought us together"</p>
          
          <div className={styles.actionButtons}>
            <button
              className={styles.btnPrimary}
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={20} />
              Add Memories
            </button>
            
            <div className={styles.filterButtons}>
              <button
                className={`${styles.btnFilter} ${currentFilter === 'all' ? styles.active : ''}`}
                onClick={() => setCurrentFilter('all')}
              >
                <Images size={16} />
                All
              </button>
              <button
                className={`${styles.btnFilter} ${currentFilter === 'image' ? styles.active : ''}`}
                onClick={() => setCurrentFilter('image')}
              >
                <ImageIcon size={16} />
                Photos
              </button>
              <button
                className={`${styles.btnFilter} ${currentFilter === 'video' ? styles.active : ''}`}
                onClick={() => setCurrentFilter('video')}
              >
                <Video size={16} />
                Videos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className={styles.gallerySection}>
        <div className={styles.galleryHeader}>
          <h3>
            <Heart size={20} />
            Our Baraat Gallery
          </h3>
          
          {isEditMode && (
            <div className={styles.galleryActions}>
              <button
                className={styles.btnDanger}
                onClick={deleteSelectedMemories}
                disabled={selectedMemoryIds.length === 0}
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
              <button
                className={styles.btnSecondary}
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedMemoryIds([]);
                }}
              >
                <Check size={16} />
                Done
              </button>
            </div>
          )}
        </div>

        <div className={styles.memoriesGrid}>
          {filteredMemories.length === 0 ? (
            <div className={styles.emptyState}>
              <Camera size={48} />
              <h4>No {currentFilter === 'all' ? 'Memories' : currentFilter === 'image' ? 'Photos' : 'Videos'} Yet</h4>
              <p>Your {currentFilter === 'all' ? 'Baraat moments' : currentFilter + 's'} will appear here once you add them</p>
              <button
                className={styles.btnPrimary}
                onClick={() => setShowUploadModal(true)}
              >
                <Plus size={16} />
                Add First Memory
              </button>
            </div>
          ) : (
            filteredMemories.map((memory, index) => (
              <div
                key={memory.id}
                className={`${styles.memoryItem} ${selectedMemoryIds.includes(memory.id) ? styles.selected : ''}`}
                onClick={() => {
                  if (isEditMode) {
                    toggleMemorySelection(memory.id);
                  } else {
                    openMemoryPreview(index);
                  }
                }}
                onDoubleClick={() => {
                  if (!isEditMode) {
                    setIsEditMode(true);
                    toggleMemorySelection(memory.id);
                  }
                }}
              >
                {memory.type === 'image' ? (
                  <img src={memory.url} alt="Baraat memory" />
                ) : (
                  <video src={memory.url} muted />
                )}
                
                {isEditMode && (
                  <input
                    type="checkbox"
                    className={styles.memoryCheckbox}
                    checked={selectedMemoryIds.includes(memory.id)}
                    onChange={() => toggleMemorySelection(memory.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.uploadModal} onClick={() => !isUploading && setShowUploadModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseBtn}
              onClick={() => !isUploading && setShowUploadModal(false)}
              disabled={isUploading}
            >
              <X size={20} />
            </button>
            
            <h3>
              <CloudUpload size={24} />
              Upload Memories
            </h3>

            {selectedFiles.length > 0 && (
              <div className={styles.selectedFilesCount}>
                {selectedFiles.length} files selected
              </div>
            )}

            <div className={styles.uploadOptions}>
              <div className={styles.uploadOption}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelection}
                  className={styles.hiddenInput}
                  id="image-upload"
                  disabled={isUploading}
                />
                <label htmlFor="image-upload">
                  <ImageIcon size={32} />
                  <span>Upload Photos</span>
                </label>
              </div>
              
              <div className={styles.uploadOption}>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileSelection}
                  className={styles.hiddenInput}
                  id="video-upload"
                  disabled={isUploading}
                />
                <label htmlFor="video-upload">
                  <Video size={32} />
                  <span>Upload Videos</span>
                </label>
              </div>
            </div>

            {isUploading && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
                <div className={styles.progressText}>Uploading {Math.round(uploadProgress)}%</div>
              </div>
            )}

            <button
              className={styles.preserveMemoriesBtn}
              onClick={uploadMemories}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              <Save size={16} />
              {isUploading ? 'Uploading...' : 'Preserve Memories'}
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && filteredMemories[currentMemoryIndex] && (
        <div className={styles.previewModal} onClick={() => setShowPreviewModal(false)}>
          <div className={styles.previewContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowPreviewModal(false)}
            >
              <X size={24} />
            </button>

            <div className={styles.previewNav}>
              <button
                className={styles.navBtn}
                onClick={() => navigatePreview('prev')}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className={styles.navBtn}
                onClick={() => navigatePreview('next')}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className={styles.memoryInfo}>
              <span>{currentMemoryIndex + 1}/{filteredMemories.length}</span>
              <span>{filteredMemories[currentMemoryIndex].date}</span>
            </div>

            <div className={styles.mediaContainer}>
              {filteredMemories[currentMemoryIndex].type === 'image' ? (
                <img
                  src={filteredMemories[currentMemoryIndex].url}
                  alt="Memory preview"
                />
              ) : (
                <video
                  src={filteredMemories[currentMemoryIndex].url}
                  controls
                  autoPlay
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaraatGallery;