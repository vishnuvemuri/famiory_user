import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FolderFormData, WeddingCategory } from '../types';

interface AddContainerModalProps {
  isOpen: boolean;
  currentCategory: WeddingCategory;
  onClose: () => void;
  onSubmit: (formData: FolderFormData) => Promise<void>;
}

const AddContainerModal: React.FC<AddContainerModalProps> = ({
  isOpen,
  currentCategory,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<{
    coverImage: File | null;
    title: string;
    subtitle: string;
  }>({
    coverImage: null,
    title: '',
    subtitle: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === 'cover-image' && files) {
      setFormData(prev => ({ ...prev, coverImage: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.coverImage || !formData.title.trim()) {
      alert('Please provide both a cover image and a title');
      return;
    }

    // Validate image
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(formData.coverImage.type)) {
      alert('Please upload a JPEG, PNG, or WEBP image');
      return;
    }

    if (formData.coverImage.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    
    try {
      await onSubmit({
        coverImage: formData.coverImage,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || undefined
      });
      
      // Reset form
      setFormData({
        coverImage: null,
        title: '',
        subtitle: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding container:', error);
      alert('Failed to add container. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white p-8 rounded-xl w-[90%] max-w-lg relative shadow-2xl"
        style={{ backgroundColor: '#FFFFF8' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 border-none bg-transparent cursor-pointer p-0 flex items-center justify-center hover:opacity-80 transition-opacity duration-300 disabled:cursor-not-allowed"
          aria-label="Close modal"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <h2 className="mb-5 text-gray-800 text-center text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          Add New Container
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label 
              htmlFor="cover-image" 
              className="block mb-2 font-bold text-gray-700"
            >
              Cover Image (Required)
            </label>
            <input
              type="file"
              id="cover-image"
              name="cover-image"
              accept="image/*"
              required
              disabled={isLoading}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded text-base transition-colors duration-300 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mb-5">
            <label 
              htmlFor="title" 
              className="block mb-2 font-bold text-gray-700"
            >
              Title (Required)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter title"
              required
              disabled={isLoading}
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded text-base transition-colors duration-300 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mb-5">
            <label 
              htmlFor="subtitle" 
              className="block mb-2 font-bold text-gray-700"
            >
              Subtitle (Optional)
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              placeholder="Enter subtitle"
              disabled={isLoading}
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded text-base transition-colors duration-300 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end gap-2.5 mt-5">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded cursor-pointer text-base transition-all duration-300 bg-blue-600 text-white border-none hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Container'}
            </button>
          </div>
        </form>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-5 text-center text-blue-600">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2.5"></div>
            <p>Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddContainerModal;