import React from 'react';
import { motion } from 'framer-motion';
import { Memory } from '../contexts/LoveJourneyContext';

interface MemoryCardProps {
  memory: Memory;
  index: number;
  onMemoryClick: (memory: Memory) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, index, onMemoryClick }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
      }
    },
  };

  const overlayVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
  };

  const handleClick = () => {
    onMemoryClick(memory);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className="memory-card"
      onClick={handleClick}
    >
      <div className="memory-image-container">
        <motion.img
          src={memory.coverImage}
          alt={memory.title}
          className="memory-image"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          whileHover="visible"
          className="memory-overlay"
        >
          <h4>{memory.title}</h4>
          <p>{memory.description}</p>
          <span className="memory-date">
            {new Date(memory.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MemoryCard;