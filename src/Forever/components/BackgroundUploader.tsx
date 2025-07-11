import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check } from 'lucide-react';
import { useLoveJourney } from '../contexts/LoveJourneyContext';
import { useToast } from '../contexts/ToastContext';
import { mockApiService } from '../services/apiService';

const BackgroundUploader: React.FC = () => {
  const { setBackgroundImage } = useLoveJourney();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [justUploaded, setJustUploaded] = React.useState(false);

  const handleBackgroundUpload = async (file: File) => {
    if (!file.type.match('image.*')) {
      showToast('Please select an image file', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const { url } = await mockApiService.uploadFile(file);
      setBackgroundImage(url);
      showToast('Background updated successfully!');
      
      setJustUploaded(true);
      setTimeout(() => setJustUploaded(false), 2000);
    } catch (error) {
      showToast('Failed to upload background', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleBackgroundUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="background-uploader"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`upload-button ${justUploaded ? 'success' : ''}`}
      >
        {isUploading ? (
          <div className="spinner" />
        ) : justUploaded ? (
          <Check size={16} />
        ) : (
          <Camera size={16} />
        )}
        <span>
          {isUploading ? 'Uploading...' : justUploaded ? 'Updated!' : 'Change Background'}
        </span>
      </motion.button>
    </motion.div>
  );
};

export default BackgroundUploader;