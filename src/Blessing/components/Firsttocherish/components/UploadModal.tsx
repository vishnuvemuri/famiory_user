import React, { useState } from 'react';
import { X, Camera, Images, Save } from 'lucide-react';
import { MemoryFormData } from '../types/memory';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: MemoryFormData) => Promise<void>;
  loading: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverPhoto: null as File | null,
    additionalMedia: null as FileList | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.coverPhoto) {
      alert('Please upload a cover photo!');
      return;
    }

    const submitData: MemoryFormData = {
      title: formData.title,
      description: formData.description,
      coverPhoto: formData.coverPhoto,
      additionalMedia: formData.additionalMedia || undefined
    };

    await onSubmit(submitData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      coverPhoto: null,
      additionalMedia: null
    });
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverPhoto: file }));
    }
  };

  const handleAdditionalMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prev => ({ ...prev, additionalMedia: files }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal-content" onClick={e => e.stopPropagation()}>
        <button 
          className="upload-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <h2 className="upload-modal-title">Preserve a New Memory</h2>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="coverPhoto" className="form-label">Cover Photo</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="coverPhoto"
                accept="image/*"
                onChange={handleCoverPhotoChange}
                className="file-input-hidden"
                required
              />
              <label htmlFor="coverPhoto" className="file-input-label">
                <Camera size={20} />
                {formData.coverPhoto ? formData.coverPhoto.name : 'Choose a Photo'}
              </label>
            </div>
            <p className="file-hint">(JPEG, PNG, GIF - Max 5MB)</p>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">Memory Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="E.g., Our First Vacation"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Your Memory</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this special moment..."
              className="form-textarea"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalMedia" className="form-label">Additional Media (Photos & Videos)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="additionalMedia"
                multiple
                accept="image/*,video/*"
                onChange={handleAdditionalMediaChange}
                className="file-input-hidden"
              />
              <label htmlFor="additionalMedia" className="file-input-label">
                <Images size={20} />
                Add Photos & Videos
              </label>
            </div>
            <p className="file-hint">(JPEG, PNG, GIF, MP4, MOV - Max 20MB each)</p>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Memory'}
          </button>
        </form>
      </div>
    </div>
  );
};