import React, { useState, useMemo } from 'react';
import { UploadCloud as CloudUpload, ArrowLeft, Heart } from 'lucide-react';
import { useMemories } from '../hooks/useMemories';
import { MemoryCard } from './MemoryCard';
import { UploadModal } from './UploadModal';
import { EmptyState } from './EmptyState';
import { Memory, MemoryFormData } from '../types/memory';

interface MemoryGalleryProps {
  onBackClick?: () => void;
  onMemorySelect?: (memory: Memory) => void;
  showBackButton?: boolean;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  onBackClick,
  onMemorySelect,
  showBackButton = false
}) => {
  const { memories, loading, createMemory, toggleFavorite } = useMemories();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const filteredMemories = useMemo(() => {
    if (showOnlyFavorites) {
      return memories.filter(memory => memory.isFavorite);
    }
    return memories;
  }, [memories, showOnlyFavorites]);

  const favoriteCount = useMemo(() => {
    return memories.filter(memory => memory.isFavorite).length;
  }, [memories]);

  const handleUploadSubmit = async (formData: MemoryFormData) => {
    const result = await createMemory(formData);
    if (result.success) {
      setIsUploadModalOpen(false);
      alert('Memory saved successfully!');
    } else {
      alert(`Failed to save memory: ${result.error}`);
    }
  };

  const handleToggleFavorite = async (memoryId: string) => {
    await toggleFavorite(memoryId);
  };

  const handleReliveMemory = (memory: Memory) => {
    if (onMemorySelect) {
      onMemorySelect(memory);
    } else {
      console.log('Reliving memory:', memory.title);
      // Default behavior or navigation to memory detail page
    }
  };

  const handleShowFavorites = () => {
    setShowOnlyFavorites(true);
  };

  const handleShowAll = () => {
    setShowOnlyFavorites(false);
  };

  return (
    <div className="memory-gallery">
      {/* Header */}
      <header className="memory-gallery-header">
        <div className="logo">
          <h1 className="logo-text">First To Cherish</h1>
        </div>
        <div className="header-buttons">
          <button 
            className="header-btn primary-btn"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <CloudUpload size={18} />
            Upload Memory
          </button>
          {showBackButton && onBackClick && (
            <button 
              className="header-btn secondary-btn"
              onClick={onBackClick}
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h2 className="hero-title">Our Cherished Memories</h2>
        <p className="hero-description">
          Relive the beautiful moments that brought us together. Each memory is a treasure in our journey towards forever.
        </p>
        {!showOnlyFavorites ? (
          <button 
            className="filter-button"
            onClick={handleShowFavorites}
            disabled={favoriteCount === 0}
          >
            <Heart size={18} />
            Show Favorites ({favoriteCount})
          </button>
        ) : (
          <button 
            className="filter-button secondary"
            onClick={handleShowAll}
          >
            <ArrowLeft size={18} />
            Show All Memories
          </button>
        )}
      </section>

      {/* Memories Grid */}
      <div className="memories-container">
        {loading ? (
          <div className="loading-state">Loading memories...</div>
        ) : filteredMemories.length > 0 ? (
          <div className="memories-grid">
            {filteredMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onToggleFavorite={handleToggleFavorite}
                onReliveMemory={handleReliveMemory}
              />
            ))}
          </div>
        ) : showOnlyFavorites ? (
          <EmptyState />
        ) : (
          <EmptyState 
            message="No Memories Yet"
            submessage="Start preserving your beautiful moments by uploading your first memory."
          />
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        loading={loading}
      />
    </div>
  );
};