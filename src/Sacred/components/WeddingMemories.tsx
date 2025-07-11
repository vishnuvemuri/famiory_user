import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Volume2, VolumeX, Upload, Download, Trash2, Maximize2, ChevronLeft, ChevronRight, Pause } from 'lucide-react';
import styles from './WeddingMemories.module.css';

interface Memory {
  id: string;
  type: 'image' | 'video';
  src: string;
  date: string;
  caption: string;
  isFeatured?: boolean;
}

interface WeddingMemoriesProps {
  coupleNames?: string;
  title?: string;
  subtitle?: string;
  // API integration props - replace these URLs with your actual API endpoints
  apiEndpoints?: {
    getMemories: (tab: string) => Promise<Memory[]>;
    uploadMemory: (tab: string, file: File) => Promise<Memory>;
    deleteMemory: (id: string) => Promise<void>;
    setFeatured: (id: string) => Promise<void>;
  };
  // Default data for demo purposes
  initialMemories?: {
    rings: Memory[];
    suhagrat: Memory[];
  };
}

const WeddingMemories: React.FC<WeddingMemoriesProps> = ({
  coupleNames = "Aarav & Priya",
  title = "Our New Beginning",
  subtitle = "Hold onto the laughter, love, and all the little joys.",
  apiEndpoints,
  initialMemories = {
    rings: [
      {
        id: '1',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1523438885201-768d7745e967?q=80&w=2070&auto=format&fit=crop',
        date: '2023-05-15',
        caption: 'Our first dance as husband and wife'
      },
      {
        id: '2',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop',
        date: '2023-05-15',
        caption: 'Exchanging rings'
      }
    ],
    suhagrat: [
      {
        id: '3',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1516589091380-5d601ae6dafa?q=80&w=2070&auto=format&fit=crop',
        date: '2023-05-16',
        caption: 'First morning together'
      }
    ]
  }
}) => {
  // State management
  const [currentTab, setCurrentTab] = useState<'rings' | 'suhagrat'>('rings');
  const [memories, setMemories] = useState(initialMemories);
  const [isMuted, setIsMuted] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    memoryId: string;
    tab: string;
  }>({ visible: false, x: 0, y: 0, memoryId: '', tab: '' });
  const [modal, setModal] = useState<{
    visible: boolean;
    type: 'memory' | 'slideshow';
    src: string;
    isVideo: boolean;
  }>({ visible: false, type: 'memory', src: '', isVideo: false });
  const [slideshow, setSlideshow] = useState<{
    isPlaying: boolean;
    currentIndex: number;
    images: Memory[];
  }>({ isPlaying: false, currentIndex: 0, images: [] });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featuredVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const slideshowIntervalRef = useRef<NodeJS.Timeout>();

  // Default videos for featured content
  const defaultVideos = {
    rings: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-bride-and-groom-holding-hands-in-the-wedding-42403-large.mp4',
    suhagrat: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-wedding-bouquet-42404-large.mp4'
  };

  // API integration helpers - Single line API calls
  const loadMemories = useCallback(async (tab: string) => {
    if (apiEndpoints?.getMemories) {
      const data = await apiEndpoints.getMemories(tab);
      setMemories(prev => ({ ...prev, [tab]: data }));
    }
  }, [apiEndpoints]);

  const uploadMemory = useCallback(async (file: File) => {
    if (apiEndpoints?.uploadMemory) {
      const newMemory = await apiEndpoints.uploadMemory(currentTab, file);
      setMemories(prev => ({
        ...prev,
        [currentTab]: [...prev[currentTab], newMemory]
      }));
    }
  }, [apiEndpoints, currentTab]);

  const deleteMemory = useCallback(async (id: string) => {
    if (apiEndpoints?.deleteMemory) {
      await apiEndpoints.deleteMemory(id);
      setMemories(prev => ({
        ...prev,
        [currentTab]: prev[currentTab].filter(m => m.id !== id)
      }));
    }
  }, [apiEndpoints, currentTab]);

  const setFeaturedMemory = useCallback(async (id: string) => {
    if (apiEndpoints?.setFeatured) {
      await apiEndpoints.setFeatured(id);
      // Update local state to reflect the change
      setMemories(prev => ({
        ...prev,
        [currentTab]: prev[currentTab].map(m => ({
          ...m,
          isFeatured: m.id === id
        }))
      }));
    }
  }, [apiEndpoints, currentTab]);

  // Load memories on component mount and tab change
  useEffect(() => {
    loadMemories(currentTab);
  }, [currentTab, loadMemories]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(prev => ({ ...prev, visible: false }));
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Featured video management
  const getFeaturedVideo = () => {
    const featuredMemory = memories[currentTab].find(m => m.isFeatured && m.type === 'video');
    return featuredMemory?.src || defaultVideos[currentTab];
  };

  // Toggle volume
  const toggleVolume = () => {
    setIsMuted(!isMuted);
    if (featuredVideoRef.current) {
      featuredVideoRef.current.muted = !isMuted;
      featuredVideoRef.current.volume = isMuted ? 0.4 : 0;
    }
  };

  // Handle file upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  // Remove selected file before upload
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    for (const file of selectedFiles) {
      if (apiEndpoints) {
        await uploadMemory(file);
      } else {
        // Demo mode - create local memory
        const reader = new FileReader();
        reader.onload = (e) => {
          const newMemory: Memory = {
            id: Date.now().toString(),
            type: file.type.includes('video') ? 'video' : 'image',
            src: e.target?.result as string,
            date: new Date().toISOString().split('T')[0],
            caption: file.name.split('.')[0]
          };
          setMemories(prev => ({
            ...prev,
            [currentTab]: [...prev[currentTab], newMemory]
          }));
        };
        reader.readAsDataURL(file);
      }
    }
    setSelectedFiles([]);
    setShowUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Context menu handlers
  const showContextMenu = (e: React.MouseEvent, memoryId: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      memoryId,
      tab: currentTab
    });
  };

  const handleSetFeatured = async () => {
    const memory = memories[currentTab].find(m => m.id === contextMenu.memoryId);
    if (memory && memory.type === 'video') {
      await setFeaturedMemory(memory.id);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this memory?')) {
      await deleteMemory(contextMenu.memoryId);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleDownload = () => {
    const memory = memories[currentTab].find(m => m.id === contextMenu.memoryId);
    if (memory) {
      const link = document.createElement('a');
      link.href = memory.src;
      link.download = `memory-${memory.caption}`;
      link.click();
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  // Modal and slideshow handlers
  const openMemoryModal = (memory: Memory) => {
    setModal({
      visible: true,
      type: 'memory',
      src: memory.src,
      isVideo: memory.type === 'video'
    });
  };

  const startSlideshow = () => {
    const images = memories[currentTab].filter(m => m.type === 'image');
    if (images.length === 0) {
      alert('No images available for slideshow');
      return;
    }
    
    setSlideshow({
      isPlaying: true,
      currentIndex: 0,
      images
    });
    
    setModal({
      visible: true,
      type: 'slideshow',
      src: images[0].src,
      isVideo: false
    });

    // Start auto-advance
    slideshowIntervalRef.current = setInterval(() => {
      setSlideshow(prev => {
        const nextIndex = (prev.currentIndex + 1) % images.length;
        setModal(modalPrev => ({ ...modalPrev, src: images[nextIndex].src }));
        return { ...prev, currentIndex: nextIndex };
      });
    }, 3000);
  };

  const toggleSlideshowPlay = () => {
    setSlideshow(prev => {
      const newIsPlaying = !prev.isPlaying;
      if (newIsPlaying && slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
        slideshowIntervalRef.current = setInterval(() => {
          setSlideshow(slidePrev => {
            const nextIndex = (slidePrev.currentIndex + 1) % slidePrev.images.length;
            setModal(modalPrev => ({ ...modalPrev, src: slidePrev.images[nextIndex].src }));
            return { ...slidePrev, currentIndex: nextIndex };
          });
        }, 3000);
      } else if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
      return { ...prev, isPlaying: newIsPlaying };
    });
  };

  const navigateSlide = (direction: 'prev' | 'next') => {
    setSlideshow(prev => {
      const newIndex = direction === 'next' 
        ? (prev.currentIndex + 1) % prev.images.length
        : (prev.currentIndex - 1 + prev.images.length) % prev.images.length;
      
      setModal(modalPrev => ({ ...modalPrev, src: prev.images[newIndex].src }));
      return { ...prev, currentIndex: newIndex };
    });
  };

  const closeModal = () => {
    setModal({ visible: false, type: 'memory', src: '', isVideo: false });
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
    }
    setSlideshow({ isPlaying: false, currentIndex: 0, images: [] });
  };

  return (
    <div className={styles.weddingMemories}>
      <div className={styles.overlay}>
        <div className={styles.container}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.coupleNames}>{coupleNames}</div>
            <h1 className={styles.pageTitle}>{title}</h1>
            <p className={styles.pageSubtitle}>{subtitle}</p>
          </header>

          {/* Main Content */}
          <main className={styles.main}>
            {/* Tab Navigation */}
            <nav className={styles.tabsNav}>
              <button 
                className={`${styles.tabsNavBtn} ${currentTab === 'rings' ? styles.active : ''}`}
                onClick={() => setCurrentTab('rings')}
              >
                Playful Start
              </button>
              <button 
                className={`${styles.tabsNavBtn} ${currentTab === 'suhagrat' ? styles.active : ''}`}
                onClick={() => setCurrentTab('suhagrat')}
              >
                The First Night
              </button>
            </nav>

            {/* Featured Video */}
            <div className={styles.featuredMedia}>
              <div className={styles.featuredVideoContainer}>
                <video 
                  ref={featuredVideoRef}
                  className={styles.featuredVideo}
                  src={getFeaturedVideo()}
                  loop
                  muted={isMuted}
                  autoPlay
                  preload="metadata"
                  onDoubleClick={() => openMemoryModal({ 
                    id: 'featured', 
                    type: 'video', 
                    src: getFeaturedVideo(), 
                    date: '', 
                    caption: 'Featured Video' 
                  })}
                />
              </div>
              <button className={styles.volumeControl} onClick={toggleVolume}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            {/* Memory Gallery */}
            <section className={styles.gallery}>
              <div className={styles.galleryHeader}>
                <h2 className={styles.galleryTitle}>
                  {currentTab === 'rings' ? 'Shared Joys' : 'Our Memories'}
                </h2>
                <div className={styles.galleryActions}>
                  <button 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={startSlideshow}
                  >
                    View Slideshow
                  </button>
                  <button 
                    className={styles.btn}
                    onClick={() => setShowUpload(true)}
                  >
                    <Upload size={16} />
                    Add Memories
                  </button>
                </div>
              </div>

              {/* Memory Grid */}
              {memories[currentTab].length > 0 ? (
                <div className={styles.memoryGrid}>
                  {memories[currentTab].map((memory) => (
                    <div 
                      key={memory.id}
                      className={styles.memoryCard}
                      onClick={() => openMemoryModal(memory)}
                      onContextMenu={(e) => showContextMenu(e, memory.id)}
                    >
                      {memory.type === 'video' ? (
                        <>
                          <video 
                            className={styles.memoryMedia}
                            src={memory.src}
                            muted
                            preload="metadata"
                          />
                          <div className={styles.memoryBadge}>
                            <Play size={12} />
                          </div>
                        </>
                      ) : (
                        <img 
                          src={memory.src} 
                          alt={memory.caption}
                          className={styles.memoryMedia}
                          loading="lazy"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>No memories yet. Upload your first memory!</p>
                </div>
              )}
            </section>

            {/* Upload Area */}
            {showUpload && (
              <section className={styles.uploadArea}>
                <h3 className={styles.uploadAreaTitle}>Add Your Memories</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                />
                <button 
                  className={styles.btn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </button>
                <p className={styles.uploadInfo}>
                  Select photos or videos to upload
                </p>
                
                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className={styles.selectedFilesContainer}>
                    <h4 className={styles.selectedFilesTitle}>
                      Selected Files ({selectedFiles.length})
                    </h4>
                    <div className={styles.selectedFilesList}>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className={styles.selectedFileItem}>
                          <div className={styles.filePreview}>
                            {file.type.includes('video') ? (
                              <div className={styles.videoPreview}>
                                <Play size={20} />
                              </div>
                            ) : (
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={file.name}
                                className={styles.imagePreview}
                              />
                            )}
                          </div>
                          <div className={styles.fileInfo}>
                            <span className={styles.fileName}>{file.name}</span>
                            <span className={styles.fileSize}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <button 
                            className={styles.removeFileBtn}
                            onClick={() => removeSelectedFile(index)}
                            title="Remove file"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedFiles.length > 0 && (
                  <p className={styles.selectedFiles}>
                    {selectedFiles.length} file(s) selected
                  </p>
                )}
                <div className={styles.uploadActions}>
                  <button 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => {
                      setShowUpload(false);
                      setSelectedFiles([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.btn}
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0}
                  >
                    Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </section>
            )}
          </main>

          {/* Context Menu */}
          {contextMenu.visible && (
            <div 
              className={styles.contextMenu}
              style={{ 
                left: contextMenu.x, 
                top: contextMenu.y 
              }}
            >
              {memories[contextMenu.tab].find(m => m.id === contextMenu.memoryId)?.type === 'video' && (
                <div className={styles.contextItem} onClick={handleSetFeatured}>
                  <Play size={16} />
                  Set as Featured Video
                </div>
              )}
              <div className={styles.contextItem} onClick={() => {
                const memory = memories[contextMenu.tab].find(m => m.id === contextMenu.memoryId);
                if (memory) openMemoryModal(memory);
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}>
                <Maximize2 size={16} />
                View Fullscreen
              </div>
              <div className={styles.contextItem} onClick={handleDownload}>
                <Download size={16} />
                Download
              </div>
              <div className={styles.contextItem} onClick={handleDelete}>
                <Trash2 size={16} />
                Delete Memory
              </div>
            </div>
          )}

          {/* Modal */}
          {modal.visible && (
            <div className={styles.modal} onClick={closeModal}>
              <span className={styles.modalClose} onClick={closeModal}>×</span>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {modal.isVideo ? (
                  <video 
                    ref={modalVideoRef}
                    className={styles.modalMedia}
                    src={modal.src}
                    controls
                    autoPlay
                  />
                ) : (
                  <img 
                    src={modal.src} 
                    alt="Memory"
                    className={styles.modalMedia}
                  />
                )}
              </div>
              
              {/* Slideshow Controls */}
              {modal.type === 'slideshow' && (
                <div className={styles.slideshowControls}>
                  <button 
                    className={styles.slideshowBtn}
                    onClick={() => navigateSlide('prev')}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    className={styles.slideshowBtn}
                    onClick={toggleSlideshowPlay}
                  >
                    {slideshow.isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button 
                    className={styles.slideshowBtn}
                    onClick={() => navigateSlide('next')}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingMemories;