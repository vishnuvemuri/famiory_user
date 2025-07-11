import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import { mockApiService } from '../services/apiService';

interface ImageGalleryProps {
  mainImage: string;
  title: string;
  description: string;
  circleImages: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  title,
  description,
  circleImages
}) => {
  const { showToast } = useToast();
  const [currentMainImage, setCurrentMainImage] = useState(mainImage);
  const [currentCircleImages, setCurrentCircleImages] = useState(circleImages);

  const handleImageUpload = async (file: File, isMainImage: boolean, index?: number) => {
    try {
      const { url } = await mockApiService.uploadFile(file);
      
      if (isMainImage) {
        setCurrentMainImage(url);
      } else if (index !== undefined) {
        const newCircleImages = [...currentCircleImages];
        newCircleImages[index] = url;
        setCurrentCircleImages(newCircleImages);
      }
      
      showToast('Photo updated successfully!');
    } catch (error) {
      showToast('Failed to upload photo', 'error');
    }
  };

  const createFileInput = (isMainImage: boolean, index?: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file, isMainImage, index);
      }
    };
    input.click();
  };

  return (
    <div className="image-gallery">
      <motion.div 
        className="main-image-container"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          src={currentMainImage}
          alt={title}
          className="main-image"
          onClick={() => createFileInput(true)}
        />
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="image-info"
        >
          <h3>{title}</h3>
          <p>{description}</p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="circle-images"
      >
        {currentCircleImages.map((image, index) => (
          <motion.img
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            src={image}
            alt={`Memory ${index + 1}`}
            className="circle-image"
            onClick={() => createFileInput(false, index)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ImageGallery;