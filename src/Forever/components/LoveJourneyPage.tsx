import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationHeader from './NavigationHeader';
import HeroSection from './HeroSection';
import MemoryGallery from './MemoryGallery';
import MemoryDetailPage from './MemoryDetailPage';
import BackgroundUploader from './BackgroundUploader';
import AddMemoryModal from './modals/AddMemoryModal';
import { useLoveJourney } from '../contexts/LoveJourneyContext';
import { Memory } from '../contexts/LoveJourneyContext';

const LoveJourneyPage: React.FC = () => {
  const { state, updateMemory, deleteMemory } = useLoveJourney();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const handleBackToGallery = () => {
    setSelectedMemory(null);
  };

  const handleUpdateMemory = (updatedMemory: Memory) => {
    updateMemory(updatedMemory);
    setSelectedMemory(updatedMemory);
  };

  const handleDeleteMemory = (memoryId: string) => {
    deleteMemory(memoryId);
    setSelectedMemory(null);
  };

  if (selectedMemory) {
    return (
      <MemoryDetailPage
        memory={selectedMemory}
        onBack={handleBackToGallery}
        onUpdateMemory={handleUpdateMemory}
        onDeleteMemory={handleDeleteMemory}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="love-journey-container"
    >
      <BackgroundUploader />
      
      <div className="upper-section" style={{ backgroundImage: `url(${state.backgroundImage})` }}>
        <NavigationHeader />
        <HeroSection />
      </div>

      <div className="lower-section">
        <MemoryGallery onMemoryClick={handleMemoryClick} />
      </div>

      <AddMemoryModal />
    </motion.div>
  );
};

export default LoveJourneyPage;