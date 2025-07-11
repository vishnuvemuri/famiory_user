import React, { useState } from 'react';
import { MemoryGallery } from './components/MemoryGallery';
import { MemoryDetailPage } from './components/MemoryDetailPage';
import { Memory } from './types/memory';
import './styles/MemoryGallery.css';
import './styles/MemoryDetailPage.css';
import './indexFirst.module.css'

function App() {
  const [currentView, setCurrentView] = useState<'gallery' | 'detail'>('gallery');
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

  const handleMemorySelect = (memory: Memory) => {
    console.log('Selected memory:', memory);
    setSelectedMemoryId(memory.id);
    setCurrentView('detail');
  };

  const handleBackToGallery = () => {
    setCurrentView('gallery');
    setSelectedMemoryId(null);
  };

  return (
    <div className="App">
      {currentView === 'gallery' && (
        <MemoryGallery
          onMemorySelect={handleMemorySelect}
          onBackClick={handleBackToGallery}
          showBackButton={false}
        />
      )}
      
      {currentView === 'detail' && selectedMemoryId && (
        <MemoryDetailPage
          memoryId={selectedMemoryId}
          onBack={handleBackToGallery}
        />
      )}
    </div>
  );
}

export default App;