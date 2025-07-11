import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Images } from 'lucide-react';
import ImageGallery from './ImageGallery';

const HeroSection: React.FC = () => {
  return (
    <div className="hero-sections">
      {/* Left Section */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hero-section left-section"
      >
        <ImageGallery
          mainImage="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
          title="Our First Date"
          description="That magical evening when we first met and knew there was something special between us."
          circleImages={[
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1492288991661-058aa541ff43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
          ]}
        />
      </motion.div>

      {/* Center Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="hero-section center-section"
      >
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="hero-title"
        >
          From Yes To Forever
        </motion.h1>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="hero-subtitle"
        >
          Our Journey Begins
        </motion.h2>
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="hero-buttons"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
          >
            <BookOpen size={20} />
            Read Our Story
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline"
          >
            <Images size={20} />
            View Gallery
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hero-section right-section"
      >
        <ImageGallery
          mainImage="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
          title="The Proposal"
          description="That breathtaking moment when we promised to spend our lives together under the stars."
          circleImages={[
            "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
          ]}
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;