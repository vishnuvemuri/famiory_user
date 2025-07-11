import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, Volume2, VolumeX, Trash2, X, ChevronLeft, ChevronRight, Camera, Video } from 'lucide-react';
import './HerFirstStep.css';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  file?: File;
}

interface HerFirstStepProps {
  apiEndpoint?: string;
  onMediaUpload?: (file: File, type: 'image' | 'video') => void;
  onMediaDelete?: (mediaId: string) => void;
  onBack?: () => void;
}

const HerFirstStep: React.FC<HerFirstStepProps> = ({
  apiEndpoint,
  onMediaUpload,
  onMediaDelete,
  onBack
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; mediaId: string } | null>(null);
  const [heroImage, setHeroImage] = useState('https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200');
  const [featuredPhoto1, setFeaturedPhoto1] = useState('https://images.pexels.com/photos/6266298/pexels-photo-6266298.jpeg?auto=compress&cs=tinysrgb&w=600');
  const [featuredPhoto2, setFeaturedPhoto2] = useState('https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=600');
  const [featuredVideo, setFeaturedVideo] = useState('https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const featuredVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleMedia: MediaItem[] = [
      {
        id: '1',
        type: 'image',
        src: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '2',
        type: 'image',
        src: 'https://images.pexels.com/photos/6266298/pexels-photo-6266298.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '3',
        type: 'video',
        src: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
        poster: 'https://images.pexels.com/photos/1618221/pexels-photo-1618221.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '4',
        type: 'image',
        src: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ];
    setMediaItems(sampleMedia);
  }, []);

  // API Integration
  useEffect(() => {
    if (apiEndpoint) {
      fetchMediaData();
    }
  }, [apiEndpoint]);

  const fetchMediaData = async () => {
    if (!apiEndpoint) return;
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setMediaItems(data);
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const newMedia: MediaItem = {
            id: Date.now().toString() + Math.random(),
            type: 'image',
            src: URL.createObjectURL(file),
            file
          };
          setMediaItems(prev => [...prev, newMedia]);
          if (onMediaUpload) {
            onMediaUpload(file, 'image');
          }
        }
      });
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          video.src = URL.createObjectURL(file);
          video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.currentTime = 1;
          });
          
          video.addEventListener('seeked', () => {
            if (context) {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const posterUrl = canvas.toDataURL('image/jpeg');
              
              const newMedia: MediaItem = {
                id: Date.now().toString() + Math.random(),
                type: 'video',
                src: URL.createObjectURL(file),
                poster: posterUrl,
                file
              };
              setMediaItems(prev => [...prev, newMedia]);
              if (onMediaUpload) {
                onMediaUpload(file, 'video');
              }
            }
          });
        }
      });
    }
  };

  const deleteMedia = (mediaId: string) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      setMediaItems(prev => prev.filter(item => item.id !== mediaId));
      if (onMediaDelete) {
        onMediaDelete(mediaId);
      }
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    const media = mediaItems[index];
    if (media.type === 'video') {
      setTimeout(() => {
        if (fullscreenVideoRef.current) {
          fullscreenVideoRef.current.volume = volume;
          fullscreenVideoRef.current.muted = isMuted;
          fullscreenVideoRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
    setIsPlaying(false);
  };

  const navigateFullscreen = (direction: number) => {
    if (fullscreenIndex !== null) {
      const newIndex = (fullscreenIndex + direction + mediaItems.length) % mediaItems.length;
      setFullscreenIndex(newIndex);
      const media = mediaItems[newIndex];
      if (media.type === 'video') {
        setTimeout(() => {
          if (fullscreenVideoRef.current) {
            fullscreenVideoRef.current.volume = volume;
            fullscreenVideoRef.current.muted = isMuted;
            fullscreenVideoRef.current.play();
            setIsPlaying(true);
          }
        }, 100);
      }
    }
  };

  const togglePlayPause = () => {
    if (fullscreenVideoRef.current) {
      if (isPlaying) {
        fullscreenVideoRef.current.pause();
      } else {
        fullscreenVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.volume = newVolume;
      if (newVolume > 0) {
        fullscreenVideoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleContextMenu = (event: React.MouseEvent, mediaId: string) => {
    event.preventDefault();
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      mediaId
    });
  };

  const handleContextAction = (action: string) => {
    if (!contextMenu) return;
    
    const media = mediaItems.find(item => item.id === contextMenu.mediaId);
    if (!media) return;

    switch (action) {
      case 'set-hero':
        if (media.type === 'image') setHeroImage(media.src);
        break;
      case 'set-photo1':
        if (media.type === 'image') setFeaturedPhoto1(media.src);
        break;
      case 'set-photo2':
        if (media.type === 'image') setFeaturedPhoto2(media.src);
        break;
      case 'set-video':
        if (media.type === 'video') setFeaturedVideo(media.src);
        break;
    }
    setContextMenu(null);
  };

  const toggleFeaturedVideoMute = () => {
    if (featuredVideoRef.current) {
      featuredVideoRef.current.muted = !featuredVideoRef.current.muted;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (fullscreenIndex !== null) {
        switch (event.key) {
          case 'Escape':
            closeFullscreen();
            break;
          case 'ArrowLeft':
            navigateFullscreen(-1);
            break;
          case 'ArrowRight':
            navigateFullscreen(1);
            break;
          case ' ':
            event.preventDefault();
            if (mediaItems[fullscreenIndex]?.type === 'video') {
              togglePlayPause();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex, isPlaying]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="her-first-step-container">
      {/* Hero Section */}
      <section 
        className="her-first-step-hero"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="her-first-step-overlay">
          <h1>Her First Step</h1>
          <p>A sacred moment as the bride takes her first step into her new home</p>
        </div>
        {onBack && (
          <button className="her-first-step-back-btn" onClick={onBack}>
            ← Back to Events
          </button>
        )}
      </section>

      {/* Description */}
      <div className="her-first-step-description">
        <p>Surrounded by love and blessings, this is the beginning of a beautiful journey together.</p>
      </div>

      {/* Upload Section */}
      <section className="her-first-step-upload-section">
        <h2>Share Your Memories</h2>
        <p>Upload photos and videos from this special day to cherish forever</p>
        <div className="her-first-step-upload-options">
          <button 
            className="her-first-step-upload-btn"
            onClick={() => imageInputRef.current?.click()}
          >
            <Camera size={20} />
            Upload Photos
          </button>
          <button 
            className="her-first-step-upload-btn"
            onClick={() => videoInputRef.current?.click()}
          >
            <Video size={20} />
            Upload Videos
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            style={{ display: 'none' }}
          />
        </div>
      </section>

      {/* Featured Video Section */}
      <div className="her-first-step-featured-video-section">
        <h2>Our Special Moment</h2>
        <div className="her-first-step-autoplay-video-container">
          <video
            ref={featuredVideoRef}
            autoPlay
            muted
            loop
            onClick={toggleFeaturedVideoMute}
            onDoubleClick={() => {
              const index = mediaItems.findIndex(item => item.src === featuredVideo);
              if (index !== -1) openFullscreen(index);
            }}
          >
            <source src={featuredVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Featured Photos Section */}
      <section className="her-first-step-featured-photos">
        <h2>Featured Photos</h2>
        <div className="her-first-step-photos-grid">
          <div className="her-first-step-featured-photo">
            <img src={featuredPhoto1} alt="Featured photo 1" />
          </div>
          <div className="her-first-step-featured-photo">
            <img src={featuredPhoto2} alt="Featured photo 2" />
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <div className="her-first-step-media-display">
        <h2>Memory Gallery</h2>
        <div className="her-first-step-media-grid">
          {mediaItems.map((media, index) => (
            <div
              key={media.id}
              className={`her-first-step-media-item ${media.type === 'video' ? 'video' : ''}`}
              onClick={() => openFullscreen(index)}
              onContextMenu={(e) => handleContextMenu(e, media.id)}
            >
              {media.type === 'video' ? (
                <>
                  <video src={media.src} poster={media.poster} />
                  <div className="her-first-step-play-icon">
                    <Play size={24} />
                  </div>
                </>
              ) : (
                <img src={media.src} alt={`Memory ${index + 1}`} />
              )}
              <button
                className="her-first-step-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMedia(media.id);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="her-first-step-footer">
        <p>May this home be filled with love, laughter, and endless happiness.</p>
      </footer>

      {/* Fullscreen Viewer */}
      {fullscreenIndex !== null && (
        <div className="her-first-step-fullscreen-viewer">
          <button className="her-first-step-close-btn" onClick={closeFullscreen}>
            <X size={24} />
          </button>
          
          <div className="her-first-step-fullscreen-content">
            {mediaItems[fullscreenIndex]?.type === 'video' ? (
              <video
                ref={fullscreenVideoRef}
                src={mediaItems[fullscreenIndex].src}
                controls={false}
                autoPlay
                loop
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <img
                src={mediaItems[fullscreenIndex]?.src}
                alt="Fullscreen view"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            )}
            
            <button 
              className="her-first-step-nav-btn her-first-step-prev-btn"
              onClick={() => navigateFullscreen(-1)}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="her-first-step-nav-btn her-first-step-next-btn"
              onClick={() => navigateFullscreen(1)}
            >
              <ChevronRight size={24} />
            </button>
            
            {mediaItems[fullscreenIndex]?.type === 'video' && (
              <div className="her-first-step-media-controls">
                <button className="her-first-step-media-control-btn" onClick={togglePlayPause}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="her-first-step-media-control-btn" onClick={toggleMute}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="her-first-step-volume-slider"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="her-first-step-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <ul>
            {mediaItems.find(item => item.id === contextMenu.mediaId)?.type === 'image' && (
              <>
                <li onClick={() => handleContextAction('set-hero')}>Highlight on Top</li>
                <li onClick={() => handleContextAction('set-photo1')}>Pin as Key Memory</li>
                <li onClick={() => handleContextAction('set-photo2')}>Pin as Key Memory</li>
              </>
            )}
            {mediaItems.find(item => item.id === contextMenu.mediaId)?.type === 'video' && (
              <li onClick={() => handleContextAction('set-video')}>Set as Special Moment Clip</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HerFirstStep;