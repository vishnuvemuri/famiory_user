import React, { useState, useEffect } from 'react';
import { Heart, Upload, Images, FolderPlus, Video, Play, X, ChevronLeft, ChevronRight, MapPin, Trash2, UploadCloud as CloudUpload, Edit } from 'lucide-react';
import styles from './WeddingMemories.module.css';

const WeddingMemories = ({ 
  apiEndpoints = {
    getAlbums: '/api/albums',
    getPhotos: '/api/photos', 
    getVideos: '/api/videos',
    createAlbum: '/api/albums',
    uploadMedia: '/api/media',
    deleteMedia: '/api/media',
    updateProfile: '/api/profile'
  },
  onApiCall = (endpoint, options) => {
    // Default API call handler - replace with your actual API implementation
    console.log(`API Call: ${endpoint}`, options);
    return Promise.resolve({ data: [], success: true });
  },
  coupleNames = "Alex & Sam",
  profileImageUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
}) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showAlbumView, setShowAlbumView] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [isEditingAlbum, setIsEditingAlbum] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentViewerItems, setCurrentViewerItems] = useState([]);
  const [currentViewerIndex, setCurrentViewerIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, target: null });
  const [profileImage, setProfileImage] = useState(profileImageUrl);
  const [mediaPreview, setMediaPreview] = useState({ cover: null, media: [] });

  // Album form states
  const [albumForm, setAlbumForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    cover: null,
    media: []
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [albumsRes, photosRes, videosRes] = await Promise.all([
        onApiCall(apiEndpoints.getAlbums, { method: 'GET' }),
        onApiCall(apiEndpoints.getPhotos, { method: 'GET' }),
        onApiCall(apiEndpoints.getVideos, { method: 'GET' })
      ]);

      setAlbums(albumsRes.data || []);
      setMediaItems([...(photosRes.data || []), ...(videosRes.data || [])]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleImageUpload = async (files) => {
    // Add uploaded images directly to state
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      type: 'image',
      url: URL.createObjectURL(file),
      title: file.name.split('.')[0],
      date: new Date().toISOString().split('T')[0]
    }));
    
    setMediaItems(prev => [...prev, ...newImages]);
    
    // Optional: Call API for backend sync
    try {
      await onApiCall(apiEndpoints.uploadMedia, {
        method: 'POST',
        body: new FormData()
      });
    } catch (error) {
      console.error('Error syncing with backend:', error);
    }
  };

  const handleVideoUpload = async (files) => {
    // Add uploaded videos directly to state
    const newVideos = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      type: 'video',
      url: URL.createObjectURL(file),
      title: file.name.split('.')[0],
      date: new Date().toISOString().split('T')[0]
    }));
    
    setMediaItems(prev => [...prev, ...newVideos]);
    
    // Optional: Call API for backend sync
    try {
      await onApiCall(apiEndpoints.uploadMedia, {
        method: 'POST',
        body: new FormData()
      });
    } catch (error) {
      console.error('Error syncing with backend:', error);
    }
  };

  const handleCreateAlbum = async () => {
    if (!albumForm.title.trim()) {
      alert('Please enter an album title');
      return;
    }

    if (!albumForm.cover) {
      alert('Please select a cover image');
      return;
    }

    if (!albumForm.media || albumForm.media.length === 0) {
      alert('Please add at least one photo or video');
      return;
    }

    if (isEditingAlbum) {
      // Update existing album
      const updatedAlbum = {
        id: editingAlbumId,
        title: albumForm.title,
        date: albumForm.date || new Date().toISOString().split('T')[0],
        location: albumForm.location || '',
        cover: typeof albumForm.cover === 'string' ? albumForm.cover : URL.createObjectURL(albumForm.cover),
        media: Array.from(albumForm.media).map(file => {
          if (file.id) return file; // Existing media
          return {
            id: Date.now() + Math.random(),
            type: file.type.startsWith('video') ? 'video' : 'image',
            url: URL.createObjectURL(file),
            title: file.name.split('.')[0],
            date: albumForm.date || new Date().toISOString().split('T')[0],
            location: albumForm.location || ''
          };
        })
      };

      setAlbums(prev => prev.map(album => 
        album.id === editingAlbumId ? updatedAlbum : album
      ));
    } else {
      // Create new album
      const newAlbum = {
        id: Date.now(),
        title: albumForm.title,
        date: albumForm.date || new Date().toISOString().split('T')[0],
        location: albumForm.location || '',
        cover: URL.createObjectURL(albumForm.cover),
        media: Array.from(albumForm.media).map(file => ({
          id: Date.now() + Math.random(),
          type: file.type.startsWith('video') ? 'video' : 'image',
          url: URL.createObjectURL(file),
          title: file.name.split('.')[0],
          date: albumForm.date || new Date().toISOString().split('T')[0],
          location: albumForm.location || ''
        }))
      };

      setAlbums(prev => [...prev, newAlbum]);
    }
    
    // Close modal and reset form
    closeAlbumModal();

    // Optional: Call API for backend sync
    try {
      await onApiCall(isEditingAlbum ? apiEndpoints.updateAlbum : apiEndpoints.createAlbum, {
        method: 'POST',
        body: new FormData()
      });
    } catch (error) {
      console.error('Error syncing album with backend:', error);
    }
  };

  const handleEditAlbum = (album) => {
    setIsEditingAlbum(true);
    setEditingAlbumId(album.id);
    setAlbumForm({
      title: album.title,
      date: album.date,
      location: album.location || '',
      cover: album.cover,
      media: album.media || []
    });
    setMediaPreview({
      cover: album.cover,
      media: album.media || []
    });
    setShowAlbumModal(true);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!confirm('Are you sure you want to delete this album? This action cannot be undone.')) return;

    // Remove from state immediately
    setAlbums(prev => prev.filter(album => album.id !== albumId));

    // Optional: Call API for backend sync
    try {
      await onApiCall(`${apiEndpoints.deleteMedia}/${albumId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error syncing deletion with backend:', error);
    }
  };

  const closeAlbumModal = () => {
    setShowAlbumModal(false);
    setIsEditingAlbum(false);
    setEditingAlbumId(null);
    setAlbumForm({ 
      title: '', 
      date: new Date().toISOString().split('T')[0], 
      location: '', 
      cover: null, 
      media: [] 
    });
    setMediaPreview({ cover: null, media: [] });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAlbumForm({...albumForm, cover: file});
      setMediaPreview(prev => ({
        ...prev,
        cover: URL.createObjectURL(file)
      }));
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const existingMedia = isEditingAlbum ? albumForm.media : [];
      setAlbumForm({...albumForm, media: [...existingMedia, ...files]});
      
      const newPreviews = files.map(file => ({
        id: Date.now() + Math.random(),
        type: file.type.startsWith('video') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        title: file.name.split('.')[0],
        isNew: true
      }));
      
      setMediaPreview(prev => ({
        ...prev,
        media: [...prev.media, ...newPreviews]
      }));
    }
  };

  const removePreviewMedia = (mediaId) => {
    setMediaPreview(prev => ({
      ...prev,
      media: prev.media.filter(item => item.id !== mediaId)
    }));
    
    if (isEditingAlbum) {
      setAlbumForm(prev => ({
        ...prev,
        media: prev.media.filter(item => item.id !== mediaId)
      }));
    } else {
      const updatedFiles = Array.from(albumForm.media).filter((_, index) => {
        const previewIndex = mediaPreview.media.findIndex(item => item.id === mediaId);
        return index !== previewIndex;
      });
      setAlbumForm({...albumForm, media: updatedFiles});
    }
  };

  const handleDeleteMedia = async (mediaId, type) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    // Remove from state immediately
    setMediaItems(prev => prev.filter(item => item.id !== mediaId));
    setAlbums(prev => prev.map(album => ({
      ...album,
      media: album.media ? album.media.filter(item => item.id !== mediaId) : []
    })));

    // Optional: Call API for backend sync
    try {
      await onApiCall(`${apiEndpoints.deleteMedia}/${mediaId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error syncing deletion with backend:', error);
    }
  };

  const openViewer = (type, url, items) => {
    setCurrentViewerItems(items);
    setCurrentViewerIndex(items.findIndex(item => item.url === url));
    setShowViewer(true);
  };

  const navigateViewer = (direction) => {
    const newIndex = (currentViewerIndex + direction + currentViewerItems.length) % currentViewerItems.length;
    setCurrentViewerIndex(newIndex);
  };

  const openAlbumView = (album) => {
    setCurrentAlbum(album);
    setShowAlbumView(true);
  };

  const showContextMenu = (e, target, type) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      target: { ...target, type, id: target.id || target.dataset?.id }
    });
  };

  const handleSetAsProfile = async () => {
    if (contextMenu.target && contextMenu.target.type === 'image') {
      setProfileImage(contextMenu.target.url);
      
      try {
        await onApiCall(apiEndpoints.updateProfile, {
          method: 'POST',
          body: JSON.stringify({ profileImage: contextMenu.target.url }),
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setContextMenu({ show: false, x: 0, y: 0, target: null });
  };

  const handleDeleteFromContext = () => {
    if (contextMenu.target) {
      if (contextMenu.target.type === 'album') {
        handleDeleteAlbum(parseInt(contextMenu.target.id));
      } else {
        handleDeleteMedia(contextMenu.target.id, contextMenu.target.type);
      }
    }
    setContextMenu({ show: false, x: 0, y: 0, target: null });
  };

  // Get counts for display
  const photosCount = mediaItems.filter(item => item.type === 'image').length;
  const videosCount = mediaItems.filter(item => item.type === 'video').length;
  const albumsCount = albums.length;

  return (
    <div className={styles.weddingMemories}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isUploadMode ? styles.expanded : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Heart size={20} />
          </div>
          <h1 className={styles.brandName}>Before We Do</h1>
        </div>
        
        <div className={styles.profileCard}>
          <img 
            src={profileImage} 
            alt="Couple" 
            className={styles.profileImage}
          />
          <h3 className={styles.coupleNames}>{coupleNames}</h3>
          
          <div className={styles.memoryCount}>
            <div className={styles.countItem}>
              <div className={styles.countNumber}>{photosCount}</div>
              <div className={styles.countLabel}>Photos</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countNumber}>{albumsCount}</div>
              <div className={styles.countLabel}>Albums</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countNumber}>{videosCount}</div>
              <div className={styles.countLabel}>Videos</div>
            </div>
          </div>
        </div>
        
        <button 
          className={styles.navToggle}
          onClick={() => setIsUploadMode(!isUploadMode)}
        >
          {isUploadMode ? <X size={16} /> : <Upload size={16} />}
          {isUploadMode ? 'Done' : 'Upload Memories'}
        </button>
        
        {isUploadMode && (
          <div className={styles.editMode}>
            <label className={styles.uploadOption}>
              <div className={styles.uploadIcon}>
                <Images size={20} />
              </div>
              <span className={styles.uploadLabel}>Upload Photos</span>
              <p className={styles.uploadDescription}>JPG, PNG up to 10MB</p>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                className={styles.hidden}
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </label>
            
            <div 
              className={styles.uploadOption}
              onClick={() => setShowAlbumModal(true)}
            >
              <div className={styles.uploadIcon}>
                <FolderPlus size={20} />
              </div>
              <span className={styles.uploadLabel}>New Album</span>
              <p className={styles.uploadDescription}>Organize your memories</p>
            </div>
            
            <label className={styles.uploadOption}>
              <div className={styles.uploadIcon}>
                <Video size={20} />
              </div>
              <span className={styles.uploadLabel}>Upload Videos</span>
              <p className={styles.uploadDescription}>MP4, MOV up to 100MB</p>
              <input 
                type="file" 
                accept="video/*" 
                multiple
                className={styles.hidden}
                onChange={(e) => handleVideoUpload(e.target.files)}
              />
            </label>
          </div>
        )}
      </aside>
      
      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Our Wedding Journey</h1>
          <p className={styles.pageSubtitle}>Cherish every moment before we say "I Do"</p>
        </header>
        
        <section>
          <h2 className={styles.sectionTitle}>Albums</h2>
          <div className={styles.mediaGrid}>
            {albums.map(album => (
              <div 
                key={album.id} 
                className={`${styles.mediaCard} ${styles.albumCard}`}
                onClick={() => openAlbumView(album)}
                onContextMenu={(e) => showContextMenu(e, { ...album, dataset: { id: album.id } }, 'album')}
              >
                <img src={album.cover} alt={album.title} className={styles.mediaThumbnail} />
                <div className={styles.albumInfo}>
                  <div className={styles.albumDate}>{formatDate(album.date)}</div>
                  <h3 className={styles.albumTitle}>{album.title}</h3>
                  {album.location && (
                    <div className={styles.albumLocation}>
                      <MapPin size={12} />
                      {album.location}
                    </div>
                  )}
                </div>
                <div className={styles.albumCount}>
                  <Images size={12} />
                  {album.media?.length || 0}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className={styles.sectionTitle}>Videos</h2>
          <div className={styles.mediaGrid}>
            {mediaItems.filter(item => item.type === 'video').map(video => (
              <div 
                key={video.id} 
                className={styles.mediaCard}
                onClick={() => openViewer('video', video.url, mediaItems.filter(m => m.type === 'video'))}
                onContextMenu={(e) => showContextMenu(e, video, 'video')}
              >
                <video src={video.url} className={styles.mediaThumbnail} muted />
                <div className={styles.playButton}>
                  <Play size={20} />
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className={styles.sectionTitle}>Photos</h2>
          <div className={styles.mediaGrid}>
            {mediaItems.filter(item => item.type === 'image').map(image => (
              <div 
                key={image.id} 
                className={styles.mediaCard}
                onClick={() => openViewer('image', image.url, mediaItems.filter(m => m.type === 'image'))}
                onContextMenu={(e) => showContextMenu(e, image, 'image')}
              >
                <img src={image.url} alt={image.title} className={styles.mediaThumbnail} />
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {/* Album Creation Modal */}
      {showAlbumModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create New Album</h3>
              <h3 className={styles.modalTitle}>{isEditingAlbum ? 'Edit Album' : 'Create New Album'}</h3>
              <button 
                className={styles.closeModal}
                onClick={closeAlbumModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Album Title</label>
                <input 
                  type="text"
                  className={styles.formInput}
                  placeholder="Engagement Party, Bridal Shower, etc."
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({...albumForm, title: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Date</label>
                <input 
                  type="date"
                  className={styles.formInput}
                  value={albumForm.date}
                  onChange={(e) => setAlbumForm({...albumForm, date: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location (optional)</label>
                <input 
                  type="text"
                  className={styles.formInput}
                  placeholder="Where was this taken?"
                  value={albumForm.location}
                  onChange={(e) => setAlbumForm({...albumForm, location: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cover Image</label>
                <label className={styles.uploadArea}>
                  <Images size={32} />
                  <p>Click to upload cover image</p>
                  <small>Recommended size: 1200x800px</small>
                  <input 
                    type="file"
                    accept="image/*"
                    className={styles.hidden}
                    onChange={(e) => setAlbumForm({...albumForm, cover: e.target.files[0]})}
                  />
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Add Photos & Videos</label>
                <label className={styles.uploadArea}>
                  <CloudUpload size={32} />
                  <p>Click to upload media</p>
                  <small>Supports JPG, PNG (up to 10MB), MP4, MOV (up to 100MB)</small>
                  <input 
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className={styles.hidden}
                    onChange={(e) => setAlbumForm({...albumForm, media: e.target.files})}
                  />
                </label>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.btnOutline}
                onClick={() => setShowAlbumModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.btnPrimary}
                onClick={handleCreateAlbum}
              >
                Create Album
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Album View Modal */}
      {showAlbumView && currentAlbum && (
        <div className={styles.albumOverlay}>
          <div className={styles.albumContent}>
            <div className={styles.albumHeader}>
              <h3 className={styles.albumTitle}>{currentAlbum.title}</h3>
              <button 
                className={styles.albumClose}
                onClick={() => setShowAlbumView(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.albumBody}>
              <div className={styles.albumGrid}>
                {currentAlbum.media?.map(item => (
                  <div 
                    key={item.id} 
                    className={styles.albumMedia}
                    onClick={() => openViewer(item.type, item.url, currentAlbum.media)}
                    onContextMenu={(e) => showContextMenu(e, item, `album-${item.type}`)}
                  >
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.title} />
                    ) : (
                      <div className={styles.videoContainer}>
                        <video src={item.url} muted />
                        <div className={styles.playButton}>
                          <Play size={16} />
                        </div>
                      </div>
                    )}
                    <div className={styles.mediaActions}>
                      <button 
                        className={styles.deleteMedia}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(item.id, item.type);
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Fullscreen Viewer */}
      {showViewer && currentViewerItems[currentViewerIndex] && (
        <div className={styles.viewerOverlay}>
          <div className={styles.viewerContent}>
            <div className={styles.viewerMedia}>
              {currentViewerItems[currentViewerIndex].type === 'image' ? (
                <img 
                  src={currentViewerItems[currentViewerIndex].url} 
                  alt={currentViewerItems[currentViewerIndex].title}
                />
              ) : (
                <video 
                  src={currentViewerItems[currentViewerIndex].url} 
                  controls 
                  autoPlay
                />
              )}
            </div>
            
            <div className={styles.viewerNav} onClick={() => navigateViewer(-1)}>
              <ChevronLeft size={24} />
            </div>
            
            <div className={styles.viewerNav} onClick={() => navigateViewer(1)}>
              <ChevronRight size={24} />
            </div>
            
            <div className={styles.viewerClose} onClick={() => setShowViewer(false)}>
              <X size={24} />
            </div>
          </div>
        </div>
      )}
      
      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className={styles.contextMenu}
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {(contextMenu.target?.type === 'image' || contextMenu.target?.type === 'album-image') && (
            <div className={styles.contextItem} onClick={handleSetAsProfile}>
              <Heart size={16} />
              Set as Profile
            </div>
          )}
          {contextMenu.target?.type === 'album' && (
            <div className={styles.contextItem} onClick={() => {
              const album = albums.find(a => a.id === parseInt(contextMenu.target.id));
              if (album) handleEditAlbum(album);
              setContextMenu({ show: false, x: 0, y: 0, target: null });
            }}>
              <Edit size={16} />
              Edit Album
            </div>
          )}
          <div className={`${styles.contextItem} ${styles.delete}`} onClick={handleDeleteFromContext}>
            <Trash2 size={16} />
            Delete
          </div>
        </div>
      )}
      
      {/* Click outside to close context menu */}
      {contextMenu.show && (
        <div 
          className={styles.contextOverlay}
          onClick={() => setContextMenu({ show: false, x: 0, y: 0, target: null })}
        />
      )}
    </div>
  );
};

export default WeddingMemories;