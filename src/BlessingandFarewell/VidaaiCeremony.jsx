import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Play, Edit3, Trash2, X, ChevronLeft, ChevronRight, Maximize, Camera } from 'lucide-react';
import styles from './VidaaiCeremony.module.css';

const VidaaiCeremony = ({ 
  // API integration props - your backend developer can pass these
  apiEndpoints = {
    uploadVideo: '/api/videos/upload',
    uploadMemory: '/api/memories/upload', 
    updateBlessing: '/api/blessings/update',
    deleteMemory: '/api/memories/delete',
    getMemories: '/api/memories',
    getBlessings: '/api/blessings'
  },
  onApiCall = (endpoint, data) => {
    // This function will be called for all API operations
    // Your backend developer can implement the actual API calls here
    console.log('API Call:', endpoint, data);
    return Promise.resolve({ success: true });
  }
}) => {
  // State management
  const [memories, setMemories] = useState([
    {
      id: 1,
      type: 'image',
      src: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg",
      caption: "Bride with her parents",
      date: "2023-05-15"
    },
    {
      id: 2,
      type: 'image', 
      src: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg",
      caption: "Emotional farewell",
      date: "2023-05-15"
    },
    {
      id: 3,
      type: 'image',
      src: "https://images.pexels.com/photos/1024992/pexels-photo-1024992.jpeg", 
      caption: "Blessing ceremony",
      date: "2023-05-15"
    },
    {
      id: 4,
      type: 'image',
      src: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
      caption: "Sisters' goodbye", 
      date: "2023-05-15"
    }
  ]);

  const [blessings, setBlessings] = useState({
    parents: {
      avatar: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg",
      name: "Parents",
      relation: "Mother & Father"
    },
    siblings: {
      avatar: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg",
      name: "Siblings", 
      relation: "Brothers & Sisters"
    },
    grandparents: {
      avatar: "https://images.pexels.com/photos/1024992/pexels-photo-1024992.jpeg",
      name: "Grandparents",
      relation: "Dada-Dadi, Nana-Nani"
    },
    mamas: {
      avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
      name: "Mamas & Mami", 
      relation: "Maternal Uncles & Aunts"
    }
  });

  const [mainVideo, setMainVideo] = useState(null);
  const [selectedMemories, setSelectedMemories] = useState(new Set());
  const [currentModalIndex, setCurrentModalIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const videoInputRef = useRef(null);
  const memoryInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // API integration functions
  const handleVideoUpload = async (files) => {
    if (!files.length) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('video', file);
        
        // API call - your backend developer implements this
        await onApiCall(apiEndpoints.uploadVideo, formData);
        
        // Create local URL for immediate display
        const videoURL = URL.createObjectURL(file);
        setMainVideo({
          src: videoURL,
          name: file.name
        });
        
        setUploadProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error('Video upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleMemoryUpload = async (files) => {
    if (!files.length) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const newMemories = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('memory', file);
        
        // API call - your backend developer implements this
        const response = await onApiCall(apiEndpoints.uploadMemory, formData);
        
        const newMemory = {
          id: Date.now() + i,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          src: URL.createObjectURL(file),
          caption: file.name.replace(/\.[^/.]+$/, ""),
          date: new Date().toISOString().split('T')[0]
        };
        
        newMemories.push(newMemory);
        setUploadProgress(((i + 1) / files.length) * 100);
      }
      
      setMemories(prev => [...prev, ...newMemories]);
    } catch (error) {
      console.error('Memory upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleBlessingAvatarUpdate = async (blessingType, file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('blessingType', blessingType);
      
      // API call - your backend developer implements this
      await onApiCall(apiEndpoints.updateBlessing, formData);
      
      setBlessings(prev => ({
        ...prev,
        [blessingType]: {
          ...prev[blessingType],
          avatar: URL.createObjectURL(file)
        }
      }));
    } catch (error) {
      console.error('Avatar update failed:', error);
    }
  };

  const handleDeleteMemory = async (memoryId) => {
    try {
      // API call - your backend developer implements this
      await onApiCall(apiEndpoints.deleteMemory, { id: memoryId });
      
      setMemories(prev => prev.filter(m => m.id !== memoryId));
      setSelectedMemories(prev => {
        const newSet = new Set(prev);
        newSet.delete(memoryId);
        return newSet;
      });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const idsToDelete = Array.from(selectedMemories);
      
      // API call - your backend developer implements this
      await onApiCall(apiEndpoints.deleteMemory, { ids: idsToDelete });
      
      setMemories(prev => prev.filter(m => !selectedMemories.has(m.id)));
      setSelectedMemories(new Set());
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  // Event handlers
  const openModal = (index) => {
    setCurrentModalIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  };

  const navigateModal = (direction) => {
    const newIndex = (currentModalIndex + direction + memories.length) % memories.length;
    setCurrentModalIndex(newIndex);
  };

  const toggleSelection = (memoryId) => {
    setSelectedMemories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memoryId)) {
        newSet.delete(memoryId);
      } else {
        newSet.add(memoryId);
      }
      return newSet;
    });
  };

  const showDeleteConfirmation = (action) => {
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        switch(e.key) {
          case 'Escape':
            if (isFullscreen) {
              setIsFullscreen(false);
            } else {
              closeModal();
            }
            break;
          case 'ArrowLeft':
            navigateModal(-1);
            break;
          case 'ArrowRight':
            navigateModal(1);
            break;
          case 'f':
          case 'F':
            setIsFullscreen(!isFullscreen);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isFullscreen]);

  return (
    <div className={styles.appContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Vidaai Ceremony</h1>
        <p>Capturing the emotional farewell as the bride leaves her parental home</p>
      </header>

      <main className={styles.mainContent}>
        {/* Emotional Quote */}
        <div className={styles.emotionalQuote}>
          A daughter's vidaai is not goodbye, but the beginning of a new journey filled with blessings
        </div>
        
        {/* Farewell Video Section */}
        <section className={styles.farewellSection}>
          <h2 className={styles.sectionTitle}>The Emotional Farewell</h2>
          <p className={styles.sectionDescription}>
            Relive the heartfelt moments when the bride bid farewell to her family, 
            taking their blessings as she embarks on her new journey. These precious 
            tears and emotions are memories to cherish forever.
          </p>
          
          <div className={styles.videoContainer}>
            {mainVideo ? (
              <video controls className={styles.mainVideo}>
                <source src={mainVideo.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className={styles.videoOverlay}>
                <h3>Upload Your Vidaai Moments</h3>
                <p>Share the emotional farewell video to preserve these precious memories</p>
                <button 
                  className={styles.uploadVideoBtn}
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Upload size={20} /> Upload Video
                </button>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className={styles.uploadProgress}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className={styles.progressText}>{Math.round(uploadProgress)}%</span>
            </div>
          )}
        </section>

        {/* Blessings Section */}
        <section className={styles.blessingsSection}>
          <h2 className={styles.blessingsTitle}>Blessings From Family</h2>
          <p className={styles.blessingsDescription}>
            These are the heartfelt blessings from loved ones as the bride prepares to 
            begin her new life. Each touch, each tear, and each word of wisdom carries 
            the love of her family.
          </p>
          
          <div className={styles.blessingsGrid}>
            {Object.entries(blessings).map(([type, blessing]) => (
              <div key={type} className={styles.blessingCard}>
                <div 
                  className={styles.blessingAvatar}
                  onClick={() => {
                    avatarInputRef.current.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) handleBlessingAvatarUpdate(type, file);
                    };
                    avatarInputRef.current.click();
                  }}
                >
                  <img src={blessing.avatar} alt={blessing.name} />
                  <div className={styles.avatarOverlay}>
                    <Camera size={24} />
                  </div>
                </div>
                <div className={styles.blessingInfo}>
                  <h3 className={styles.blessingName}>{blessing.name}</h3>
                  <p className={styles.blessingRelation}>{blessing.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Memories Section */}
        <section className={styles.memoriesSection}>
          <div className={styles.memoriesHeader}>
            <h2 className={styles.sectionTitle}>Precious Memories</h2>
            <div className={styles.memoriesControls}>
              <button 
                className={styles.uploadBtn}
                onClick={() => memoryInputRef.current?.click()}
              >
                <Upload size={20} /> Upload Memories
              </button>
              {selectedMemories.size > 0 && (
                <button 
                  className={styles.bulkDeleteBtn}
                  onClick={() => showDeleteConfirmation(handleBulkDelete)}
                >
                  <Trash2 size={20} /> Delete Selected ({selectedMemories.size})
                </button>
              )}
            </div>
          </div>
          
          {isUploading && (
            <div className={styles.uploadProgress}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className={styles.progressText}>{Math.round(uploadProgress)}%</span>
            </div>
          )}
          
          <div className={styles.memoriesGrid}>
            {memories.map((memory, index) => (
              <div key={memory.id} className={styles.memoryCard}>
                <div className={styles.memoryCheckbox}>
                  <input
                    type="checkbox"
                    id={`memory-${memory.id}`}
                    checked={selectedMemories.has(memory.id)}
                    onChange={() => toggleSelection(memory.id)}
                  />
                  <label htmlFor={`memory-${memory.id}`}></label>
                </div>
                
                <div 
                  className={styles.memoryMedia}
                  onClick={() => openModal(index)}
                >
                  <img src={memory.src} alt={memory.caption} />
                  {memory.type === 'video' && (
                    <div className={styles.playIcon}>
                      <Play size={32} />
                    </div>
                  )}
                </div>
                
                <div className={styles.memoryCaption}>{memory.caption}</div>
                
                <button 
                  className={styles.deleteMemoryBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    showDeleteConfirmation(() => handleDeleteMemory(memory.id));
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      {isModalOpen && (
        <div className={`${styles.modal} ${isFullscreen ? styles.fullscreen : ''}`}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={closeModal}>
              <X size={24} />
            </button>
            
            <button className={styles.navBtn} onClick={() => navigateModal(-1)}>
              <ChevronLeft size={24} />
            </button>
            
            <button className={styles.navBtn} onClick={() => navigateModal(1)}>
              <ChevronRight size={24} />
            </button>
            
            <div className={styles.modalMediaContainer}>
              {memories[currentModalIndex]?.type === 'image' ? (
                <img 
                  src={memories[currentModalIndex].src} 
                  alt={memories[currentModalIndex].caption}
                  className={styles.modalImage}
                />
              ) : (
                <video 
                  src={memories[currentModalIndex]?.src} 
                  controls 
                  className={styles.modalVideo}
                />
              )}
              
              <div className={styles.mediaInfo}>
                <h4>{memories[currentModalIndex]?.caption}</h4>
                <p>{formatDate(memories[currentModalIndex]?.date)}</p>
              </div>
              
              <div className={styles.mediaCounter}>
                {currentModalIndex + 1} / {memories.length}
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.fullscreenBtn}
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize size={16} /> Fullscreen
              </button>
              <button 
                className={styles.deleteInModalBtn}
                onClick={() => showDeleteConfirmation(() => handleDeleteMemory(memories[currentModalIndex].id))}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.confirmationModal}>
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete the selected item(s)?</p>
              <div className={styles.confirmationActions}>
                <button 
                  className={styles.confirmBtn}
                  onClick={() => {
                    confirmAction();
                    setShowConfirmModal(false);
                  }}
                >
                  Confirm
                </button>
                <button 
                  className={styles.cancelBtn}
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2023 Vidaai Ceremony | Preserving Emotional Farewell Moments | Created With Love</p>
      </footer>

      {/* Hidden file inputs */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleVideoUpload(Array.from(e.target.files))}
      />
      
      <input
        ref={memoryInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleMemoryUpload(Array.from(e.target.files))}
      />
      
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default VidaaiCeremony;