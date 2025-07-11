import React, { useState, useRef } from 'react';
import { Upload, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import './CherishedExhaustion.css';

interface ImagePair {
  id: string;
  category: string;
  caption: string;
  beforeImage: string;
  afterImage: string;
  beforeFile?: File;
  afterFile?: File;
}

interface CherishedExhaustionProps {
  apiEndpoint?: string;
  onImageUpload?: (file: File, type: 'before' | 'after', category: string, caption: string) => void;
  onImagePairSave?: (pair: ImagePair) => void;
  onImageDelete?: (pairId: string) => void;
  onBack?: () => void;
}

const CherishedExhaustion: React.FC<CherishedExhaustionProps> = ({
  apiEndpoint,
  onImageUpload,
  onImagePairSave,
  onImageDelete,
  onBack
}) => {
  const [category, setCategory] = useState('Bride');
  const [caption, setCaption] = useState('');
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [imagePairs, setImagePairs] = useState<ImagePair[]>([]);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [fullscreenType, setFullscreenType] = useState<'before' | 'after'>('before');

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  // API Integration
  React.useEffect(() => {
    if (apiEndpoint) {
      fetchImagePairs();
    }
  }, [apiEndpoint]);

  const fetchImagePairs = async () => {
    if (!apiEndpoint) return;
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setImagePairs(data);
    } catch (error) {
      console.error('Error fetching image pairs:', error);
    }
  };

  const handleBeforeImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setBeforeImage(imageUrl);
        setBeforeFile(file);
      };
      reader.readAsDataURL(file);
      
      if (onImageUpload) {
        onImageUpload(file, 'before', category, caption);
      }
    }
  };

  const handleAfterImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setAfterImage(imageUrl);
        setAfterFile(file);
      };
      reader.readAsDataURL(file);
      
      if (onImageUpload) {
        onImageUpload(file, 'after', category, caption);
      }
    }
  };

  const handleSaveImagePair = () => {
    if (!beforeImage || !afterImage) {
      alert('Please upload both before and after images.');
      return;
    }

    const newPair: ImagePair = {
      id: Date.now().toString(),
      category,
      caption: caption || 'Wedding Day Transformation',
      beforeImage,
      afterImage,
      beforeFile: beforeFile || undefined,
      afterFile: afterFile || undefined
    };

    setImagePairs(prev => [newPair, ...prev]);
    
    if (onImagePairSave) {
      onImagePairSave(newPair);
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setBeforeFile(null);
    setAfterFile(null);
    setCategory('Bride');
    setCaption('');
    if (beforeInputRef.current) beforeInputRef.current.value = '';
    if (afterInputRef.current) afterInputRef.current.value = '';
  };

  const handleDeletePair = (pairId: string) => {
    if (window.confirm('Are you sure you want to delete this memory pair?')) {
      setImagePairs(prev => prev.filter(pair => pair.id !== pairId));
      if (onImageDelete) {
        onImageDelete(pairId);
      }
    }
  };

  const openFullscreen = (index: number, type: 'before' | 'after') => {
    setFullscreenIndex(index);
    setFullscreenType(type);
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
  };

  const navigateFullscreen = (direction: number) => {
    if (fullscreenIndex === null) return;
    
    const totalImages = imagePairs.length * 2; // Each pair has 2 images
    let newIndex = fullscreenIndex;
    let newType = fullscreenType;
    
    if (direction === 1) {
      if (fullscreenType === 'before') {
        newType = 'after';
      } else {
        newIndex = (fullscreenIndex + 1) % imagePairs.length;
        newType = 'before';
      }
    } else {
      if (fullscreenType === 'after') {
        newType = 'before';
      } else {
        newIndex = (fullscreenIndex - 1 + imagePairs.length) % imagePairs.length;
        newType = 'after';
      }
    }
    
    setFullscreenIndex(newIndex);
    setFullscreenType(newType);
  };

  // Keyboard navigation
  React.useEffect(() => {
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
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex, fullscreenType]);

  return (
    <div className="cherished-exhaustion-container">
      {/* Header */}
      <header className="cherished-exhaustion-header">
        <h1>Cherished Exhaustion</h1>
        <p>Capture the beautiful contrast between your pre-wedding excitement and post-wedding blissful exhaustion</p>
        <div className="cherished-exhaustion-divider"></div>
        {onBack && (
          <button className="cherished-exhaustion-back-btn" onClick={onBack}>
            ← Back to Events
          </button>
        )}
      </header>

      {/* Comparison Section */}
      <section className="cherished-exhaustion-comparison-section">
        {/* Form Controls */}
        <div className="cherished-exhaustion-form-controls">
          <div className="cherished-exhaustion-form-group">
            <label htmlFor="categorySelect">Category:</label>
            <select 
              id="categorySelect" 
              className="cherished-exhaustion-form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
              <option value="Mother">Mother</option>
              <option value="Siblings">Siblings</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
            </select>
          </div>

          <div className="cherished-exhaustion-form-group">
            <label htmlFor="captionInput">Caption (optional):</label>
            <input 
              type="text" 
              id="captionInput" 
              className="cherished-exhaustion-form-control"
              placeholder="e.g., Our Wedding Day Transformation"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>

        {/* Image Upload Cards */}
        <div className="cherished-exhaustion-comparison-container">
          <div className="cherished-exhaustion-comparison-card">
            <div className="cherished-exhaustion-comparison-header">
              <h2 className="cherished-exhaustion-comparison-title">Before the Wedding</h2>
            </div>
            <div className="cherished-exhaustion-image-container">
              <img 
                src={beforeImage || "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"}
                alt="Before Wedding" 
              />
            </div>
            <input 
              ref={beforeInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleBeforeImageUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="cherished-exhaustion-upload-btn"
              onClick={() => beforeInputRef.current?.click()}
            >
              <Upload size={16} />
              Upload Pre-Wedding Photo
            </button>
          </div>

          <div className="cherished-exhaustion-comparison-card">
            <div className="cherished-exhaustion-comparison-header">
              <h2 className="cherished-exhaustion-comparison-title">After the Wedding</h2>
            </div>
            <div className="cherished-exhaustion-image-container">
              <img 
                src={afterImage || "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"}
                alt="After Wedding" 
              />
            </div>
            <input 
              ref={afterInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleAfterImageUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="cherished-exhaustion-upload-btn secondary"
              onClick={() => afterInputRef.current?.click()}
            >
              <Upload size={16} />
              Upload Post-Wedding Photo
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cherished-exhaustion-action-buttons">
          <button className="cherished-exhaustion-action-btn cancel-btn" onClick={resetForm}>
            Cancel
          </button>
          <button className="cherished-exhaustion-action-btn save-btn" onClick={handleSaveImagePair}>
            Save This Memory
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="cherished-exhaustion-gallery-section">
        <div className="cherished-exhaustion-gallery-header">
          <h2>Who Survived Better?</h2>
          <p>Relive all your beautiful moments</p>
        </div>
        <div className="cherished-exhaustion-gallery-grid">
          {imagePairs.map((pair, index) => (
            <div key={pair.id} className="cherished-exhaustion-gallery-pair">
              <div className="cherished-exhaustion-category-label">{pair.category}</div>
              <div className="cherished-exhaustion-gallery-images">
                <div className="cherished-exhaustion-gallery-image">
                  <img 
                    src={pair.beforeImage} 
                    alt="Before Wedding"
                    onDoubleClick={() => openFullscreen(index, 'before')}
                  />
                </div>
                <div className="cherished-exhaustion-gallery-image">
                  <img 
                    src={pair.afterImage} 
                    alt="After Wedding"
                    onDoubleClick={() => openFullscreen(index, 'after')}
                  />
                </div>
              </div>
              <div className="cherished-exhaustion-gallery-caption">{pair.caption}</div>
              <button 
                className="cherished-exhaustion-delete-pair-btn"
                onClick={() => handleDeletePair(pair.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Fullscreen Viewer */}
      {fullscreenIndex !== null && (
        <div className="cherished-exhaustion-fullscreen-viewer">
          <button className="cherished-exhaustion-close-button" onClick={closeFullscreen}>
            <X size={24} />
          </button>
          <button 
            className="cherished-exhaustion-nav-button prev-button"
            onClick={() => navigateFullscreen(-1)}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="cherished-exhaustion-nav-button next-button"
            onClick={() => navigateFullscreen(1)}
          >
            <ChevronRight size={24} />
          </button>
          <img 
            className="cherished-exhaustion-fullscreen-image"
            src={fullscreenType === 'before' 
              ? imagePairs[fullscreenIndex]?.beforeImage 
              : imagePairs[fullscreenIndex]?.afterImage
            }
            alt="Fullscreen view"
          />
        </div>
      )}
    </div>
  );
};

export default CherishedExhaustion;