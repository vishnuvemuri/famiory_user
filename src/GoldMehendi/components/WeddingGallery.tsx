import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, Calendar, Flower2, Music, X, ChevronLeft, ChevronRight, History, Heart, Images, Trash2 } from 'lucide-react';
import styles from './WeddingGallery.module.css';

interface Memory {
  id: string;
  url: string;
  caption: string;
  type: 'image' | 'video';
  date: string;
  uploadDate: number;
  fileSize: string;
}

interface EventData {
  images: Memory[];
  videos: Memory[];
  title: string;
  icon: string;
  date: string;
}

interface WeddingGalleryProps {
  coupleNames?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  eventDates?: {
    haldi: string;
    mehndi: string;
    sangeet: string;
  };
  onDeleteMemory?: (memoryId: string, eventType: string) => Promise<void>;
  initialData?: {
    haldi: EventData;
    mehndi: EventData;
    sangeet: EventData;
  };
  apiEndpoints?: {
    upload: string;
    delete: string;
    fetch: string;
  };
}

const WeddingGallery: React.FC<WeddingGalleryProps> = ({
  coupleNames = "Dhruv & Khushi",
  pageTitle = "Our Wedding Journey",
  pageSubtitle = "Relive every magical moment of our special days",
  eventDates = {
    haldi: "May 15, 2023",
    mehndi: "May 16, 2023",
    sangeet: "May 17, 2023"
  },
  onDeleteMemory,
  initialData,
  apiEndpoints
}) => {
  const [currentEvent, setCurrentEvent] = useState<'haldi' | 'mehndi' | 'sangeet'>('haldi');
  const [memoriesData, setMemoriesData] = useState<{
    haldi: EventData;
    mehndi: EventData;
    sangeet: EventData;
  }>({
    haldi: { 
      images: [], 
      videos: [], 
      title: 'Golden Haldi Moments',
      icon: 'flower2',
      date: eventDates.haldi
    },
    mehndi: { 
      images: [], 
      videos: [], 
      title: 'Mehndi Artistry',
      icon: 'hand-painting',
      date: eventDates.mehndi
    },
    sangeet: { 
      images: [], 
      videos: [], 
      title: 'Sangeet Soirée',
      icon: 'music',
      date: eventDates.sangeet
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [currentMemories, setCurrentMemories] = useState<Memory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [showLoveNote, setShowLoveNote] = useState(false);
  const [loveMessage, setLoveMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const loveMessages = [
    "Forever begins today",
    "Every moment with you is a memory I treasure",
    "Our love story in pictures",
    "The best day of my life",
    "Happiness is being married to you",
    "Memories that will last a lifetime"
  ];

  const eventConfig = {
    haldi: { 
      icon: <Flower2 className={styles.icon} />, 
      color: 'gold',
      bgClass: styles.haldiEvent
    },
    mehndi: { 
      icon: <div className={styles.icon}>🎨</div>, 
      color: 'green',
      bgClass: styles.mehndiEvent
    },
    sangeet: { 
      icon: <Music className={styles.icon} />, 
      color: 'pink',
      bgClass: styles.sangeetEvent
    }
  };

  // Initialize data
  useEffect(() => {
    if (initialData) {
      setMemoriesData(initialData);
    }
  }, [initialData]);

  // Update current memories when event changes
  useEffect(() => {
    const allMemories = [
      ...memoriesData[currentEvent].images,
      ...memoriesData[currentEvent].videos
    ].sort((a, b) => b.uploadDate - a.uploadDate);
    setCurrentMemories(allMemories);
  }, [currentEvent, memoriesData]);

  // Show random love notes
  useEffect(() => {
    const showNote = () => {
      const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      setLoveMessage(randomMessage);
      setShowLoveNote(true);
      
      setTimeout(() => {
        setShowLoveNote(false);
      }, 7000);
    };

    const timer = setTimeout(showNote, 5000);
    const interval = setInterval(showNote, Math.floor(Math.random() * 60000) + 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleEventSwitch = (event: 'haldi' | 'mehndi' | 'sangeet') => {
    setCurrentEvent(event);
  };

  const handleFileSelection = (type: 'image' | 'video') => {
    setSelectedFileType(type);
    if (type === 'image' && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (type === 'video' && videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleFileChange = (files: FileList | null, type: 'image' | 'video') => {
    if (!files || files.length === 0) return;
    
    const validFiles = Array.from(files).filter(file => {
      if (type === 'image') {
        return file.type.startsWith('image/');
      } else {
        return file.type.startsWith('video/');
      }
    });

    setSelectedFiles(validFiles);
    setUploadStatus(`${validFiles.length} ${type}(s) selected - ready to upload`);
  };

  const processFiles = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select files to upload first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(`Uploading ${selectedFiles.length} file(s)...`);

    try {
      await processFilesLocally(selectedFiles, selectedFileType!);
      setUploadStatus(`Successfully uploaded ${selectedFiles.length} file(s)!`);
      displayLoveNote(`Added ${selectedFiles.length} new ${currentEvent} memories!`);
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setTimeout(() => {
        setShowModal(false);
        setUploadStatus('');
        setUploadProgress(0);
        setSelectedFiles([]);
        setSelectedFileType(null);
      }, 2000);
    }
  };

  const processFilesLocally = async (files: File[], type: 'image' | 'video') => {
    const newMemories: Memory[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress((i / files.length) * 100);

      const url = await readFileAsDataURL(file);
      const memory: Memory = {
        id: `${Date.now()}-${i}`,
        url,
        caption: generateCaption(file.name),
        type,
        date: formatDate(new Date(memoryDate)),
        uploadDate: Date.now(),
        fileSize: formatFileSize(file.size)
      };

      newMemories.push(memory);
    }

    setMemoriesData(prev => ({
      ...prev,
      [currentEvent]: {
        ...prev[currentEvent],
        [type === 'image' ? 'images' : 'videos']: [
          ...prev[currentEvent][type === 'image' ? 'images' : 'videos'],
          ...newMemories
        ]
      }
    }));

    setUploadProgress(100);
  };

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      if (onDeleteMemory) {
        await onDeleteMemory(memoryId, currentEvent);
      }

      // Remove from local state
      setMemoriesData(prev => ({
        ...prev,
        [currentEvent]: {
          ...prev[currentEvent],
          images: prev[currentEvent].images.filter(img => img.id !== memoryId),
          videos: prev[currentEvent].videos.filter(vid => vid.id !== memoryId)
        }
      }));

      displayLoveNote('Memory removed successfully');
    } catch (error) {
      console.error('Delete error:', error);
      displayLoveNote('Failed to delete memory');
    }
  };

  // Utility function to read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const generateCaption = (filename: string): string => {
    return filename
      .split('.')[0]
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setShowViewer(true);
  };

  const navigateViewer = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < currentMemories.length) {
      setCurrentIndex(newIndex);
    } else if (direction > 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentMemories.length - 1);
    }
  };

  const displayLoveNote = (message: string) => {
    setLoveMessage(message);
    setShowLoveNote(true);
    setTimeout(() => setShowLoveNote(false), 5000);
  };

  const renderGallery = () => {
    if (currentMemories.length === 0) {
      return (
        <div className={styles.emptyState}>
          {eventConfig[currentEvent].icon}
          <p>No {currentEvent} memories yet. Upload photos and videos to begin your collection.</p>
        </div>
      );
    }

    return (
      <div className={styles.galleryGrid}>
        {currentMemories.map((memory, index) => (
          <div
            key={memory.id}
            className={`${styles.galleryItem} ${memory.type === 'video' ? styles.videoItem : ''}`}
            role="button"
            tabIndex={0}
          >
            {memory.type === 'image' ? (
              <img 
                src={memory.url} 
                alt={memory.caption} 
                loading="lazy"
                onClick={() => openViewer(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openViewer(index);
                  }
                }}
              />
            ) : (
              <video 
                poster={memory.url} 
                preload="none"
                onClick={() => openViewer(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openViewer(index);
                  }
                }}
              >
                <source src={memory.url} />
              </video>
            )}
            <div className={styles.memoryDate}>{memory.date}</div>
            <button
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMemory(memory.id);
              }}
              aria-label="Delete memory"
              title="Delete this memory"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.coupleNames}>{coupleNames}</h1>
        <h2 className={styles.pageTitle}>{pageTitle}</h2>
        <p className={styles.pageSubtitle}>{pageSubtitle}</p>
      </header>

      {/* Event Navigation */}
      <nav className={styles.eventNav}>
        {(['haldi', 'mehndi', 'sangeet'] as const).map((event) => (
          <button
            key={event}
            className={`${styles.eventBtn} ${styles[`${event}Event`]} ${
              currentEvent === event ? styles.active : ''
            }`}
            onClick={() => handleEventSwitch(event)}
            aria-label={`View ${event} ceremony photos`}
          >
            {eventConfig[event].icon}
            {event.charAt(0).toUpperCase() + event.slice(1)}
          </button>
        ))}
      </nav>

      {/* Gallery Container */}
      <section className={styles.galleryContainer}>
        <div className={styles.galleryHeader}>
          <h3 className={styles.eventTitle}>
            {eventConfig[currentEvent].icon}
            {memoriesData[currentEvent].title}
          </h3>
          <span className={styles.eventDate}>
            <Calendar className={styles.icon} />
            {memoriesData[currentEvent].date}
          </span>
        </div>

        <div className={styles.uploadSection}>
          <button
            className={styles.uploadBtn}
            onClick={() => setShowModal(true)}
            aria-label="Upload photos"
          >
            <Images className={styles.icon} />
            Add Photos
          </button>
          <button
            className={styles.uploadBtn}
            onClick={() => setShowModal(true)}
            aria-label="Upload videos"
          >
            <Video className={styles.icon} />
            Add Videos
          </button>
        </div>

        {renderGallery()}
      </section>

      {/* Upload Modal */}
      {showModal && (
        <div className={styles.uploadModal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Share Your Memories</h3>
              <button
                className={styles.closeModal}
                onClick={() => setShowModal(false)}
                aria-label="Close upload modal"
              >
                <X />
              </button>
            </div>

            <div className={styles.uploadOptions}>
              <div
                className={`${styles.uploadOption} ${selectedFileType === 'image' ? styles.selected : ''}`}
                onClick={() => handleFileSelection('image')}
                role="button"
                tabIndex={0}
              >
                <div className={styles.uploadIconContainer}>
                  <Images className={styles.uploadIcon} />
                </div>
                <p className={styles.uploadText}>Upload Photos</p>
              </div>
              <div
                className={`${styles.uploadOption} ${selectedFileType === 'video' ? styles.selected : ''}`}
                onClick={() => handleFileSelection('video')}
                role="button"
                tabIndex={0}
              >
                <div className={styles.uploadIconContainer}>
                  <Video className={styles.uploadIcon} />
                </div>
                <p className={styles.uploadText}>Upload Videos</p>
              </div>
            </div>

            <div className={styles.dateSelection}>
              <label htmlFor="memory-date" className={styles.dateLabel}>Memory Date:</label>
              <input
                type="date"
                id="memory-date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className={styles.dateInput}
              />
              <button
                className={styles.useTodayBtn}
                onClick={() => setMemoryDate(new Date().toISOString().split('T')[0])}
              >
                Use Today
              </button>
            </div>

            {uploading && (
              <div className={styles.progressContainer}>
                <div 
                  className={styles.progressBar}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {uploadStatus && (
              <div className={styles.uploadStatus}>
                {uploadStatus}
              </div>
            )}

            <button 
              className={styles.preserveBtn}
              onClick={processFiles}
              disabled={selectedFiles.length === 0 || uploading}
            >
              <Heart className={styles.icon} />
              Preserve Memories
            </button>

            <p className={styles.uploadInstructions}>
              Select multiple files at once to upload. We'll preserve them forever in your wedding memory book.
              <br /><br />
              <strong>Max file size:</strong> 10MB per file
              <br />
              <strong>Supported formats:</strong> JPG, PNG, GIF, MP4, MOV
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Viewer */}
      {showViewer && currentMemories[currentIndex] && (
        <div className={styles.fullscreenViewer}>
          <button
            className={styles.closeViewer}
            onClick={() => setShowViewer(false)}
            aria-label="Close fullscreen viewer"
          >
            <X />
          </button>

          <div className={styles.viewerContent}>
            {currentMemories[currentIndex].type === 'image' ? (
              <img
                src={currentMemories[currentIndex].url}
                alt={currentMemories[currentIndex].caption}
                className={styles.viewerMedia}
              />
            ) : (
              <video
                src={currentMemories[currentIndex].url}
                controls
                className={styles.viewerMedia}
                autoPlay
              />
            )}

            <div className={styles.viewerNav}>
              <button
                className={styles.navBtn}
                onClick={() => navigateViewer(-1)}
                aria-label="Previous memory"
                disabled={currentMemories.length <= 1}
              >
                <ChevronLeft />
              </button>
              <button
                className={styles.navBtn}
                onClick={() => navigateViewer(1)}
                aria-label="Next memory"
                disabled={currentMemories.length <= 1}
              >
                <ChevronRight />
              </button>
            </div>

            <div className={styles.memoryDateViewer}>
              {currentMemories[currentIndex].date}
            </div>
          </div>

          <div className={styles.memoryCaption}>
            {currentMemories[currentIndex].caption}
          </div>
        </div>
      )}

      {/* Love Note */}
      {showLoveNote && (
        <div className={styles.loveNote}>
          <p>{loveMessage}</p>
        </div>
      )}

      {/* Timeline Button */}
      <button
        className={styles.timelineBtn}
        onClick={() => displayLoveNote("Our wedding timeline coming soon!")}
        title="View Our Wedding Timeline"
        aria-label="View wedding timeline"
      >
        <History />
      </button>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e.target.files, 'image')}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e.target.files, 'video')}
      />
    </div>
  );
};

export default WeddingGallery;