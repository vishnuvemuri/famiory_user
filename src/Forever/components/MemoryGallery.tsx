import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import MemoryCard from './MemoryCard';
import { useLoveJourney } from '../contexts/LoveJourneyContext';
import { Memory } from '../contexts/LoveJourneyContext';

interface MemoryGalleryProps {
  onMemoryClick: (memory: Memory) => void;
}

// Default memories for demo
const defaultMemories = [
  {
    id: '1',
    title: 'The Proposal',
    description: 'That magical evening under the stars',
    date: '2024-01-15',
    coverImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    mediaFiles: [
      {
        id: '1-1',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        name: 'proposal-1.jpg',
        size: 1024000
      },
      {
        id: '1-2',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        name: 'proposal-2.jpg',
        size: 1024000
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    category: 'proposal' as const,
  },
  {
    id: '2',
    title: 'Engagement Ceremony',
    description: 'Celebrating with close family',
    date: '2024-02-20',
    coverImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    mediaFiles: [
      {
        id: '2-1',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        name: 'engagement-1.jpg',
        size: 1024000
      }
    ],
    createdAt: '2024-02-20T00:00:00Z',
    category: 'engagement' as const,
  },
  {
    id: '3',
    title: 'Family Celebration',
    description: 'Traditional blessings from elders',
    date: '2024-03-10',
    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    mediaFiles: [
      {
        id: '3-1',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        name: 'family-1.jpg',
        size: 1024000
      }
    ],
    createdAt: '2024-03-10T00:00:00Z',
    category: 'family' as const,
  },
  {
    id: '4',
    title: 'Engagement Party',
    description: 'Dancing the night away',
    date: '2024-03-25',
    coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    mediaFiles: [
      {
        id: '4-1',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        name: 'party-1.jpg',
        size: 1024000
      }
    ],
    createdAt: '2024-03-25T00:00:00Z',
    category: 'party' as const,
  },
];

const MemoryGallery: React.FC<MemoryGalleryProps> = ({ onMemoryClick }) => {
  const { state } = useLoveJourney();
  
  // Use default memories if none exist
  const memories = state.memories.length > 0 ? state.memories : defaultMemories;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleAddMemoryClick = () => {
    // Dispatch the custom event to open the modal
    window.dispatchEvent(new CustomEvent('openAddMemoryModal'));
  };

  return (
    <section className="memory-gallery">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="section-header"
      >
        <h2 className="section-title">Our Precious Moments</h2>
        <p className="section-subtitle">
          Relive every special moment from our journey together, from the first date to the magical proposal and beyond.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="memory-grid"
      >
        {memories.map((memory, index) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            index={index}
            onMemoryClick={onMemoryClick}
          />
        ))}
      </motion.div>

      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.95 }}
        className="add-memory-button"
        onClick={handleAddMemoryClick}
      >
        <Plus size={20} />
        Add New Memory
      </motion.button>
    </section>
  );
};

export default MemoryGallery;