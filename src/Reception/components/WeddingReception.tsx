import React, { useState, useEffect } from 'react';
import { Camera, Plus, Edit3, Trash2, X, ChevronLeft, ChevronRight, Upload, Heart, Instagram, Facebook, Mail, Video, Image } from 'lucide-react';
import './WeddingReception.css';

interface Memory {
  id: string;
  type: 'image' | 'video';
  src: string;
  caption: string;
  thumbnail?: string;
}

interface SpecialMoment {
  id: string;
  title: string;
  description: string;
  cover: string;
  memories: Memory[];
}

interface WeddingData {
  heroImage: string;
  coupleNames: string;
  groomName: string;
  brideName: string;
  eventTitle: string;
  eventSubtitle: string;
  entranceVideo: string;
  specialMoments: SpecialMoment[];
  candidMemories: Memory[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    email?: string;
  };
  copyrightText: string;
}

interface WeddingReceptionProps {
  data: WeddingData;
  onUploadHero?: (file: File) => Promise<string>;
  onUploadEntrance?: (file: File) => Promise<string>;
  onUploadMemories?: (files: File[], category: string) => Promise<Memory[]>;
  onDeleteMemory?: (memoryId: string, category: string) => Promise<void>;
  onUpdateMoment?: (moment: SpecialMoment) => Promise<void>;
  onDeleteMoment?: (momentId: string) => Promise<void>;
  onCreateMoment?: (moment: Omit<SpecialMoment, 'id'>) => Promise<SpecialMoment>;
  onUpdateWeddingData?: (data: Partial<WeddingData>) => Promise<void>;
  onRefreshData?: () => Promise<WeddingData>;
}

const WeddingReception: React.FC<WeddingReceptionProps> = ({
  data,
  onUploadHero,
  onUploadEntrance,
  onUploadMemories,
  onDeleteMemory,
  onUpdateMoment,
  onDeleteMoment,
  onCreateMoment,
  onUpdateWeddingData,
  onRefreshData
}) => {
  const [selectedMedia, setSelectedMedia] = useState<Memory | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentAlbum, setCurrentAlbum] = useState<'candid' | string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEntranceModal, setShowEntranceModal] = useState(false);
  const [showAlbumView, setShowAlbumView] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('');
  const [editingMoment, setEditingMoment] = useState<SpecialMoment | null>(null);
  const [momentForm, setMomentForm] = useState({
    title: '',
    description: '',
    cover: '',
    memories: [] as Memory[]
  });
  const [loading, setLoading] = useState(false);

  // State for wedding data - this will be updated dynamically from API
  const [weddingData, setWeddingData] = useState<WeddingData>(data);

  // Helper function to detect video files
  const isVideoFile = (src: string): boolean => {
    if (!src) return false;
    
    // Check file extension
    const videoExtensions = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i;
    if (videoExtensions.test(src)) return true;
    
    // Check if it's a blob URL from uploaded video
    if (src.startsWith('blob:')) {
      // For blob URLs, we need to check the original file type
      // This will be handled during upload
      return true; // Assume blob URLs are videos for now
    }
    
    return false;
  };
  // Update local state when props change (API data updates)
  useEffect(() => {
    setWeddingData(data);
  }, [data]);

  // Refresh data from API
  const refreshData = async () => {
    if (onRefreshData) {
      setLoading(true);
      try {
        const freshData = await onRefreshData();
        setWeddingData(freshData);
      } catch (error) {
        console.error('Failed to refresh data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleHeroUpload = async (file: File) => {
    if (onUploadHero) {
      setLoading(true);
      try {
        const newSrc = await onUploadHero(file);
        const updatedData = { ...weddingData, heroImage: newSrc };
        setWeddingData(updatedData);
        
        // Update backend with new hero image
        if (onUpdateWeddingData) {
          await onUpdateWeddingData({ heroImage: newSrc });
        }
      } catch (error) {
        console.error('Failed to upload hero image:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEntranceUpload = async (file: File) => {
    if (onUploadEntrance) {
      setLoading(true);
      try {
        const newSrc = await onUploadEntrance(file);
        // Store the file type information along with the URL
        const updatedData = { 
          ...weddingData, 
          entranceVideo: newSrc,
          // Store additional metadata if needed
          entranceVideoType: file.type
        };
        setWeddingData(updatedData);
        
        // Update backend with new entrance media
        if (onUpdateWeddingData) {
          await onUpdateWeddingData({ 
            entranceVideo: newSrc,
            entranceVideoType: file.type
          });
        }
        
        setShowEntranceModal(false);
      } catch (error) {
        console.error('Failed to upload entrance media:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMemoryUpload = async (files: File[], category: string) => {
    if (onUploadMemories) {
      setLoading(true);
      try {
        const newMemories = await onUploadMemories(files, category);
        
        if (category === 'candid') {
          const updatedData = {
            ...weddingData,
            candidMemories: [...weddingData.candidMemories, ...newMemories]
          };
          setWeddingData(updatedData);
          
          // Update backend
          if (onUpdateWeddingData) {
            await onUpdateWeddingData({ candidMemories: updatedData.candidMemories });
          }
        } else if (category.startsWith('moment-')) {
          const momentId = category.split('-')[1];
          const updatedMoments = weddingData.specialMoments.map(moment =>
            moment.id === momentId
              ? { ...moment, memories: [...moment.memories, ...newMemories] }
              : moment
          );
          const updatedData = { ...weddingData, specialMoments: updatedMoments };
          setWeddingData(updatedData);
          
          // Update specific moment in backend
          const updatedMoment = updatedMoments.find(m => m.id === momentId);
          if (updatedMoment && onUpdateMoment) {
            await onUpdateMoment(updatedMoment);
          }
        }
      } catch (error) {
        console.error('Failed to upload memories:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = (memory: Memory, index: number, albumType: string) => {
    setSelectedMedia(memory);
    setCurrentMediaIndex(index);
    setCurrentAlbum(albumType);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: number) => {
    let memories: Memory[] = [];
    
    if (currentAlbum === 'candid') {
      memories = weddingData.candidMemories;
    } else if (currentAlbum.startsWith('moment-')) {
      const momentId = currentAlbum.split('-')[1];
      const moment = weddingData.specialMoments.find(m => m.id === momentId);
      memories = moment?.memories || [];
    }

    if (memories.length === 0) return;

    const newIndex = (currentMediaIndex + direction + memories.length) % memories.length;
    setCurrentMediaIndex(newIndex);
    setSelectedMedia(memories[newIndex]);
  };

  const openUploadModal = (category: string) => {
    setUploadCategory(category);
    setShowUploadModal(true);
  };

  const openEditModal = (moment?: SpecialMoment) => {
    if (moment) {
      setEditingMoment(moment);
      setMomentForm({
        title: moment.title,
        description: moment.description,
        cover: moment.cover,
        memories: moment.memories
      });
    } else {
      setEditingMoment(null);
      setMomentForm({
        title: '',
        description: '',
        cover: '',
        memories: []
      });
    }
    setShowEditModal(true);
  };

  const openAlbumView = (momentId: string) => {
    setCurrentAlbum(`moment-${momentId}`);
    setShowAlbumView(true);
  };

  const handleDeleteMemory = async (memoryId: string) => {
    if (onDeleteMemory && confirm('Are you sure you want to delete this memory?')) {
      setLoading(true);
      try {
        await onDeleteMemory(memoryId, currentAlbum);
        
        if (currentAlbum === 'candid') {
          const updatedData = {
            ...weddingData,
            candidMemories: weddingData.candidMemories.filter(m => m.id !== memoryId)
          };
          setWeddingData(updatedData);
          
          // Update backend
          if (onUpdateWeddingData) {
            await onUpdateWeddingData({ candidMemories: updatedData.candidMemories });
          }
        } else if (currentAlbum.startsWith('moment-')) {
          const momentId = currentAlbum.split('-')[1];
          const updatedMoments = weddingData.specialMoments.map(moment =>
            moment.id === momentId
              ? { ...moment, memories: moment.memories.filter(m => m.id !== memoryId) }
              : moment
          );
          const updatedData = { ...weddingData, specialMoments: updatedMoments };
          setWeddingData(updatedData);
          
          // Update specific moment in backend
          const updatedMoment = updatedMoments.find(m => m.id === momentId);
          if (updatedMoment && onUpdateMoment) {
            await onUpdateMoment(updatedMoment);
          }
        }
        
        closeModal();
      } catch (error) {
        console.error('Failed to delete memory:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveMoment = async (coverFile?: File, memoryFiles?: FileList) => {
    setLoading(true);
    try {
      let coverUrl = momentForm.cover;
      let newMemories: Memory[] = [];

      // Handle cover image upload
      if (coverFile && onUploadMemories) {
        const coverMemories = await onUploadMemories([coverFile], 'cover');
        if (coverMemories.length > 0) {
          coverUrl = coverMemories[0].src;
        }
      }

      // Handle memory files upload
      if (memoryFiles && memoryFiles.length > 0 && onUploadMemories) {
        newMemories = await onUploadMemories(Array.from(memoryFiles), 'memories');
      }

      const updatedMoment = {
        ...momentForm,
        cover: coverUrl,
        memories: [...momentForm.memories, ...newMemories]
      };

      if (editingMoment) {
        if (onUpdateMoment) {
          const finalMoment = { ...editingMoment, ...updatedMoment };
          await onUpdateMoment(finalMoment);
          
          const updatedMoments = weddingData.specialMoments.map(moment =>
            moment.id === editingMoment.id ? finalMoment : moment
          );
          const updatedData = { ...weddingData, specialMoments: updatedMoments };
          setWeddingData(updatedData);
          
          // Update backend
          if (onUpdateWeddingData) {
            await onUpdateWeddingData({ specialMoments: updatedMoments });
          }
        }
      } else {
        if (onCreateMoment) {
          const newMoment = await onCreateMoment(updatedMoment);
          const updatedMoments = [...weddingData.specialMoments, newMoment];
          const updatedData = { ...weddingData, specialMoments: updatedMoments };
          setWeddingData(updatedData);
          
          // Update backend
          if (onUpdateWeddingData) {
            await onUpdateWeddingData({ specialMoments: updatedMoments });
          }
        }
      }
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to save moment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMoment = async (momentId: string) => {
    if (onDeleteMoment && confirm('Are you sure you want to delete this moment?')) {
      setLoading(true);
      try {
        await onDeleteMoment(momentId);
        const updatedMoments = weddingData.specialMoments.filter(m => m.id !== momentId);
        const updatedData = { ...weddingData, specialMoments: updatedMoments };
        setWeddingData(updatedData);
        
        // Update backend
        if (onUpdateWeddingData) {
          await onUpdateWeddingData({ specialMoments: updatedMoments });
        }
        
        setShowEditModal(false);
      } catch (error) {
        console.error('Failed to delete moment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="wr-wedding-reception">
      {loading && (
        <div className="wr-loading-overlay">
          <div className="wr-loading-spinner">
            <Heart className="wr-loading-icon" size={48} />
            <p>Updating memories...</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="wr-hero">
        <img 
          className="wr-hero-image" 
          src={weddingData.heroImage} 
          alt="Wedding couple" 
        />
        <div className="wr-hero-content">
          <div className="wr-family-heading">Famiory</div>
          <div className="wr-reception-title">{weddingData.eventTitle}</div>
          <h1 className="wr-couple-names">{weddingData.coupleNames}</h1>
          <p className="wr-hero-subtitle">{weddingData.eventSubtitle}</p>
          <button 
            className="wr-upload-hero-btn"
            onClick={() => document.getElementById('hero-upload')?.click()}
            disabled={loading}
          >
            <Camera size={20} />
            Change Cover Photo
          </button>
          <input
            id="hero-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleHeroUpload(file);
            }}
          />
        </div>
        <div className="wr-scroll-down">↓</div>
      </section>

      <div className="wr-container">
        {/* Grand Entrance Section */}
        <section className="wr-section">
          <h2 className="wr-section-title">Grand Entrance</h2>
          <div className="wr-gallery-grid">
            <div className="wr-video-container">
              {isVideoFile(weddingData.entranceVideo) ? (
                <video 
                  className="wr-entrance-video"
                  src={weddingData.entranceVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onClick={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.muted = !video.muted;
                  }}
                  onLoadedData={() => {
                    // Ensure video plays after loading
                    const video = document.querySelector('.wr-entrance-video') as HTMLVideoElement;
                    if (video) {
                      video.play().catch(e => console.log("Video autoplay prevented:", e));
                    }
                  }}
                />
              ) : (
                <img 
                  className="wr-entrance-video"
                  src={weddingData.entranceVideo}
                  alt="Grand entrance"
                />
              )}
              <div 
                className="wr-edit-btn"
                onClick={() => setShowEntranceModal(true)}
              >
                <Edit3 size={16} />
              </div>
              <div className="wr-gallery-caption">
                {isVideoFile(weddingData.entranceVideo) ? 'Tap🔊 || 2x⛶' : 'Grand Entrance'}
              </div>
            </div>
          </div>
        </section>

        {/* Special Moments */}
        <section className="wr-section">
          <h2 className="wr-section-title">Special Moments</h2>
          <div className="wr-moments-grid">
            {weddingData.specialMoments.map((moment) => (
              <div 
                key={moment.id} 
                className="wr-moment-card"
                onClick={() => openAlbumView(moment.id)}
              >
                <div className="wr-moment-image">
                  <img src={moment.cover} alt={moment.title} />
                  <div 
                    className="wr-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(moment);
                    }}
                  >
                    <Edit3 size={16} />
                  </div>
                </div>
                <div className="wr-moment-content">
                  <h3 className="wr-moment-title">{moment.title}</h3>
                  <p className="wr-moment-desc">{moment.description}</p>
                </div>
              </div>
            ))}
            <div 
              className="wr-add-moment-btn"
              onClick={() => openEditModal()}
            >
              <div className="wr-add-memory-icon">
                <Plus size={48} />
              </div>
              <div className="wr-add-memory-text">Add Special Moment</div>
            </div>
          </div>
        </section>

        {/* Candid Moments */}
        <section className="wr-section">
          <h2 className="wr-section-title">Candid Moments</h2>
          <div className="wr-gallery-grid">
            {weddingData.candidMemories.map((memory, index) => (
              <div 
                key={memory.id}
                className="wr-gallery-item"
                onClick={() => openModal(memory, index, 'candid')}
              >
                {memory.type === 'image' ? (
                  <img src={memory.src} alt={memory.caption} />
                ) : (
                  <video src={memory.src} autoPlay loop muted />
                )}
                <div className="wr-gallery-caption">{memory.caption}</div>
              </div>
            ))}
            <div 
              className="wr-gallery-item wr-add-memory-btn"
              onClick={() => openUploadModal('candid')}
            >
              <div className="wr-add-memory-icon">
                <Plus size={48} />
              </div>
              <div className="wr-add-memory-text">Add Candid Memories</div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="wr-footer">
        <div className="wr-container">
          <h2 className="wr-footer-title">Thank You</h2>
          <p className="wr-footer-text">
            For being part of our special day and helping us create memories that will last a lifetime.
          </p>
          <div className="wr-social-links">
            {weddingData.socialLinks.instagram && (
              <a href={weddingData.socialLinks.instagram} className="wr-social-link">
                <Instagram size={24} />
              </a>
            )}
            {weddingData.socialLinks.facebook && (
              <a href={weddingData.socialLinks.facebook} className="wr-social-link">
                <Facebook size={24} />
              </a>
            )}
            {weddingData.socialLinks.email && (
              <a href={`mailto:${weddingData.socialLinks.email}`} className="wr-social-link">
                <Mail size={24} />
              </a>
            )}
          </div>
          <p className="wr-copyright">{weddingData.copyrightText}</p>
        </div>
      </footer>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="wr-modal" onClick={closeModal}>
          <div className="wr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="wr-close-modal" onClick={closeModal}>
              <X size={24} />
            </button>
            <div className="wr-modal-nav">
              <button 
                className="wr-modal-nav-btn"
                onClick={() => navigateMedia(-1)}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="wr-modal-nav-btn"
                onClick={() => navigateMedia(1)}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            {selectedMedia.type === 'image' ? (
              <img 
                src={selectedMedia.src} 
                alt={selectedMedia.caption}
                className="wr-modal-media"
              />
            ) : (
              <video 
                src={selectedMedia.src}
                className="wr-modal-media"
                controls
                autoPlay
              />
            )}
            <p className="wr-modal-caption">{selectedMedia.caption}</p>
            <button 
              className="wr-modal-delete-btn"
              onClick={() => handleDeleteMemory(selectedMedia.id)}
              disabled={loading}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Album View */}
      {showAlbumView && (
        <div className="wr-album-view">
          <div className="wr-container">
            <div className="wr-album-header">
              <h2 className="wr-album-title">
                {currentAlbum.startsWith('moment-') 
                  ? weddingData.specialMoments.find(m => m.id === currentAlbum.split('-')[1])?.title 
                  : 'Album'}
              </h2>
              <button 
                className="wr-close-album"
                onClick={() => setShowAlbumView(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="wr-album-grid">
              {currentAlbum.startsWith('moment-') && 
                weddingData.specialMoments
                  .find(m => m.id === currentAlbum.split('-')[1])
                  ?.memories.map((memory, index) => (
                    <div 
                      key={memory.id}
                      className="wr-gallery-item"
                      onClick={() => openModal(memory, index, currentAlbum)}
                    >
                      {memory.type === 'image' ? (
                        <img src={memory.src} alt={memory.caption} />
                      ) : (
                        <video src={memory.src} autoPlay loop muted />
                      )}
                      <div className="wr-gallery-caption">{memory.caption}</div>
                    </div>
                  ))
              }
              <div 
                className="wr-gallery-item wr-add-memory-btn"
                onClick={() => {
                  setShowAlbumView(false);
                  openUploadModal(currentAlbum);
                }}
              >
                <div className="wr-add-memory-icon">
                  <Plus size={48} />
                </div>
                <div className="wr-add-memory-text">Add Memories</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grand Entrance Edit Modal */}
      {showEntranceModal && (
        <div className="wr-edit-modal">
          <div className="wr-edit-container">
            <div className="wr-edit-header">
              <h3 className="wr-edit-title">Edit Grand Entrance</h3>
              <button 
                className="wr-close-edit"
                onClick={() => setShowEntranceModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="wr-edit-form">
              <div className="wr-form-group">
                <label className="wr-form-label">Upload New Media</label>
                <input
                  type="file"
                  id="entrance-upload"
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleEntranceUpload(file);
                  }}
                />
                <label htmlFor="entrance-upload" className="wr-upload-label">
                  <div className="wr-upload-icon">
                    {isVideoFile(weddingData.entranceVideo) ? (
                      <Video size={48} />
                    ) : (
                      <Image size={48} />
                    )}
                  </div>
                  <div className="wr-upload-text">Click to upload image or video</div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="wr-upload-modal">
          <div className="wr-upload-container">
            <div className="wr-upload-header">
              <h3 className="wr-upload-title">Upload Memories</h3>
              <button 
                className="wr-close-upload"
                onClick={() => setShowUploadModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="wr-upload-form">
              <input
                type="file"
                id="memory-upload"
                accept="image/*,video/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    handleMemoryUpload(files, uploadCategory);
                    setShowUploadModal(false);
                  }
                }}
              />
              <label htmlFor="memory-upload" className="wr-upload-label">
                <div className="wr-upload-icon">
                  <Upload size={48} />
                </div>
                <div className="wr-upload-text">Click to browse or drag and drop files</div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Edit Moment Modal */}
      {showEditModal && (
        <div className="wr-edit-modal">
          <div className="wr-edit-container">
            <div className="wr-edit-header">
              <h3 className="wr-edit-title">
                {editingMoment ? 'Edit Special Moment' : 'Add Special Moment'}
              </h3>
              <button 
                className="wr-close-edit"
                onClick={() => setShowEditModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form 
              className="wr-edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const coverFile = formData.get('cover') as File;
                const memoryFiles = formData.get('memories') as FileList;
                handleSaveMoment(
                  coverFile?.size > 0 ? coverFile : undefined,
                  memoryFiles?.length > 0 ? memoryFiles : undefined
                );
              }}
            >
              <div className="wr-form-group">
                <label className="wr-form-label">Title</label>
                <input
                  type="text"
                  className="wr-form-input"
                  value={momentForm.title}
                  onChange={(e) => setMomentForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="wr-form-group">
                <label className="wr-form-label">Description</label>
                <textarea
                  className="wr-form-input"
                  rows={3}
                  value={momentForm.description}
                  onChange={(e) => setMomentForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="wr-form-group">
                <label className="wr-form-label">Cover Image</label>
                <input
                  type="file"
                  name="cover"
                  className="wr-form-input"
                  accept="image/*"
                />
              </div>
              
              <div className="wr-form-group">
                <label className="wr-form-label">Upload Memories</label>
                <input
                  type="file"
                  name="memories"
                  className="wr-form-input"
                  accept="image/*,video/*"
                  multiple
                />
              </div>
              
              <div className="wr-edit-btns">
                {editingMoment && (
                  <button 
                    type="button"
                    className="wr-delete-moment-btn"
                    onClick={() => handleDeleteMoment(editingMoment.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                    Delete Moment
                  </button>
                )}
                <button type="submit" className="wr-save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingReception;