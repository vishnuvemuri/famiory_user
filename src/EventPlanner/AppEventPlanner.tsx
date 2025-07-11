import React, { useState } from 'react';
import WeddingPlannerSelector from './WeddingPlannerSelector';
import WeddingPlannerPortfolio from './WeddingPlannerPortfolio';
import './WeddingPlannerSelector.css';

function App() {
  const [currentView, setCurrentView] = useState<'selector' | 'portfolio'>('selector');
  const [selectedPlannerId, setSelectedPlannerId] = useState<string>('');

  const handleViewPortfolio = (plannerId: string) => {
    setSelectedPlannerId(plannerId);
    setCurrentView('portfolio');
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedPlannerId('');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'selector' ? (
        <WeddingPlannerSelector onViewPortfolio={handleViewPortfolio} />
      ) : (
        <WeddingPlannerPortfolio 
          plannerId={selectedPlannerId} 
          onBack={handleBackToSelector} 
        />
      )}
    </div>
  );
}

export default App;