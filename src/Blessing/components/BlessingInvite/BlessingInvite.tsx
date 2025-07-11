import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Star, Trash2 } from 'lucide-react';
import { Memory, BlessingInviteProps } from './types';
import { MemoryGrid } from './MemoryGrid';
import { UploadModal } from './UploadModal';
import { FullViewModal } from './FullViewModal';
import styles from './BlessingInvite.module.css';

// Utility function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const BlessingInvite: React.FC<BlessingInviteProps> = ({
  onUploadMemories,
  onPinMemory,
  apiEndpoint,
  initialMemories = [],
  backgroundImage = './background1.png'
}) => {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [pinnedMemoryIndex, setPinnedMemoryIndex] = useState<number>(-1);
  const [hoveredMemory, setHoveredMemory] = useState<Memory | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const [currentFullViewIndex, setCurrentFullViewIndex] = useState(-1);
  const [draggedIndex, setDraggedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  // Load initial data from API
  useEffect(() => {
    if (apiEndpoint && !initialMemories.length) {
      loadMemoriesFromAPI();
    }
  }, [apiEndpoint, initialMemories.length]);

  // API Integration Helper - Single line integration for backend
  const callAPI = async (endpoint: string, data?: any, method: string = 'POST') => {
    if (!apiEndpoint) return null;
    
    setLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      showSuccessMessage('API call failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadMemoriesFromAPI = async () => {
    try {
      const data = await callAPI('/memories', null, 'GET');
      if (data?.memories) {
        setMemories(data.memories);
      }
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  };

  const handleUploadMemories = useCallback(async (files: File[], text: string) => {
    const newMemories: Memory[] = [];
    
    // Process files and create memory objects
    for (const file of files) {
      const url = URL.createObjectURL(file);
      const memory: Memory = {
        id: generateId(),
        type: file.type.startsWith('image') ? 'image' : 'video',
        url,
        file,
        text: text || 'No description',
        createdAt: new Date()
      };
      newMemories.push(memory);
    }

    // Update local state immediately for better UX
    setMemories(prev => [...prev, ...newMemories]);

    // Call API if provided
    try {
      if (onUploadMemories) {
        await onUploadMemories(newMemories);
      } else if (apiEndpoint) {
        await callAPI('/upload', { memories: newMemories });
      }
      showSuccessMessage('Memories uploaded successfully!');
    } catch (error) {
      // Rollback on error
      setMemories(prev => prev.filter(m => !newMemories.find(nm => nm.id === m.id)));
      showSuccessMessage('Upload failed. Please try again.');
    }
  }, [onUploadMemories, apiEndpoint]);

  const handlePinMemory = useCallback(async (index: number) => {
    const previousIndex = pinnedMemoryIndex;
    setPinnedMemoryIndex(index);
    
    try {
      if (onPinMemory) {
        await onPinMemory(memories[index].id);
      } else if (apiEndpoint) {
        await callAPI('/pin', { memoryId: memories[index].id });
      }
      showSuccessMessage('Memory pinned successfully!');
    } catch (error) {
      // Rollback on error
      setPinnedMemoryIndex(previousIndex);
      showSuccessMessage('Failed to pin memory. Please try again.');
    }
  }, [memories, onPinMemory, apiEndpoint, pinnedMemoryIndex]);

  const handleDeleteMemory = useCallback(async (index: number) => {
    const memoryToDelete = memories[index];
    const previousMemories = [...memories];
    
    // Update local state immediately for better UX
    setMemories(prev => prev.filter((_, i) => i !== index));
    
    // Adjust pinned memory index if necessary
    if (pinnedMemoryIndex === index) {
      setPinnedMemoryIndex(-1);
    } else if (pinnedMemoryIndex > index) {
      setPinnedMemoryIndex(prev => prev - 1);
    }
    
    try {
      // Call API if provided
      if (apiEndpoint) {
        await callAPI('/delete', { memoryId: memoryToDelete.id });
      }
      showSuccessMessage('Memory deleted successfully!');
    } catch (error) {
      // Rollback on error
      setMemories(previousMemories);
      setPinnedMemoryIndex(pinnedMemoryIndex);
      showSuccessMessage('Failed to delete memory. Please try again.');
    }
  }, [memories, pinnedMemoryIndex, apiEndpoint]);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex >= 0) {
      handlePinMemory(draggedIndex);
    }
  };

  const showFullView = (index: number) => {
    setCurrentFullViewIndex(index);
    setIsFullViewOpen(true);
  };

  const showSuccessMessage = (message: string) => {
    // Create a temporary success notification with scoped styles
    const notification = document.createElement('div');
    notification.className = styles['success-notification'];
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const pinnedMemory = pinnedMemoryIndex >= 0 ? memories[pinnedMemoryIndex] : null;

  return (
    <div 
      className={styles['blessing-invite-container']}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles['content-wrapper']}>
        <h1 className={styles['main-title']}>Blessing & Invite</h1>
        
        <div className={styles['upper-section']}>
          {/* Left Section */}
          <div className={styles['left-section']}>
            <p className={styles['inspirational-text']}>
              Every invitation carries love, blessings, and beautiful memories.
            </p>
            <button 
              className={styles['upload-button']}
              onClick={() => setIsUploadModalOpen(true)}
              disabled={loading}
            >
              <Upload size={20} />
              {loading ? 'Loading...' : 'Upload Memories'}
            </button>
          </div>

          {/* Center Section - Pinned Memory */}
          <div 
            className={styles['center-section']}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {pinnedMemory ? (
              <>
                {pinnedMemory.type === 'image' ? (
                  <img src={pinnedMemory.url} alt="Pinned Memory" />
                ) : (
                  <video src={pinnedMemory.url} controls />
                )}
                <Star className={styles['pinned-indicator']} size={24} />
              </>
            ) : (
              <div className={styles['placeholder-content']}>
                <img 
                  src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Default Memory" 
                />
                <Star className={styles['pinned-indicator']} size={24} />
              </div>
            )}
          </div>

          {/* Right Section - Memory Description */}
          <div className={styles['right-section']}>
            {hoveredMemory ? (
              <p>{hoveredMemory.text}</p>
            ) : (
              <p>
                Hover over a memory to see the description.
                <br />
                <small>(Drag a memory here to pin it)</small>
              </p>
            )}
          </div>
        </div>

        {/* Memory Grid */}
        <MemoryGrid
          memories={memories}
          onMemoryHover={setHoveredMemory}
          onMemoryDoubleClick={showFullView}
          onDragStart={setDraggedIndex}
          onDeleteMemory={handleDeleteMemory}
        />

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUploadMemories}
        />

        {/* Full View Modal */}
        <FullViewModal
          isOpen={isFullViewOpen}
          memories={memories}
          currentIndex={currentFullViewIndex}
          onClose={() => setIsFullViewOpen(false)}
          onPrevious={() => setCurrentFullViewIndex(prev => Math.max(0, prev - 1))}
          onNext={() => setCurrentFullViewIndex(prev => Math.min(memories.length - 1, prev + 1))}
        />
      </div>
    </div>
  );
};