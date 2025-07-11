import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Image as ImageIcon, Video } from 'lucide-react';
import { useLoveJourney } from '../../contexts/LoveJourneyContext';
import { useToast } from '../../contexts/ToastContext';
import { mockApiService } from '../../services/apiService';
import { MediaFile } from '../../contexts/LoveJourneyContext';

const AddMemoryModal: React.FC = () => {
  const { addMemory } = useLoveJourney();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'proposal' as 'proposal' | 'engagement' | 'family' | 'party',
  });
  
  const [coverImage, setCoverImage] = useState<string>('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      category: 'proposal',
    });
    setCoverImage('');
    setMediaFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !coverImage) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      addMemory({
        ...formData,
        coverImage,
        mediaFiles,
      });
      
      showToast('Memory added successfully!');
      setIsOpen(false);
      resetForm();
    } catch (error) {
      showToast('Failed to add memory', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (files: FileList | null, isCover: boolean = false) => {
    if (!files || files.length === 0) return;

    try {
      if (isCover) {
        const { url } = await mockApiService.uploadFile(files[0]);
        setCoverImage(url);
        showToast('Cover image uploaded!');
      } else {
        const uploadPromises = Array.from(files).map(async (file) => {
          const { url, id } = await mockApiService.uploadFile(file);
          return {
            id,
            type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
            url,
            name: file.name,
            size: file.size,
          };
        });
        
        const newMediaFiles = await Promise.all(uploadPromises);
        setMediaFiles(prev => [...prev, ...newMediaFiles]);
        showToast(`${newMediaFiles.length} files uploaded!`);
      }
    } catch (error) {
      showToast('Upload failed', 'error');
    }
  };

  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== id));
  };

  // Expose modal control to parent component
  React.useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('openAddMemoryModal', handleOpenModal);
    return () => window.removeEventListener('openAddMemoryModal', handleOpenModal);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add New Memory</h2>
              <button
                className="modal-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Memory Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Beach Proposal"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    category: e.target.value as 'proposal' | 'engagement' | 'family' | 'party'
                  }))}
                >
                  <option value="proposal">Proposal Story</option>
                  <option value="engagement">Engagement</option>
                  <option value="family">Family Celebration</option>
                  <option value="party">Engagement Party</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us about this special moment..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cover Photo *</label>
                <div className="upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, true)}
                    className="file-input"
                  />
                  <div className="upload-content">
                    <Upload size={32} />
                    <p>Upload Cover Photo</p>
                    <small>Recommended size: 1200x800px</small>
                  </div>
                </div>
                {coverImage && (
                  <div className="preview-item">
                    <img src={coverImage} alt="Cover preview" className="cover-preview" />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="remove-button"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Add Photos & Videos</label>
                <div className="upload-area">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="file-input"
                  />
                  <div className="upload-content">
                    <ImageIcon size={32} />
                    <p>Upload Media Files</p>
                    <small>JPEG, PNG, MP4 files accepted</small>
                  </div>
                </div>
                
                {mediaFiles.length > 0 && (
                  <div className="media-preview">
                    {mediaFiles.map((file) => (
                      <div key={file.id} className="preview-item">
                        {file.type === 'image' ? (
                          <img src={file.url} alt={file.name} className="media-thumbnail" />
                        ) : (
                          <div className="video-thumbnail">
                            <Video size={24} />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMediaFile(file.id)}
                          className="remove-button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Memory
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to open modal from other components
export const openAddMemoryModal = () => {
  window.dispatchEvent(new CustomEvent('openAddMemoryModal'));
};

export default AddMemoryModal;