import React from 'react';
import WeddingPhotographerSelector from './components/WeddingPhotographerSelector';

function App() {
  // Example API integration functions
  const fetchPhotographers = async () => {
    // Replace with your actual API call
    const response = await fetch('/api/photographers');
    return response.json();
  };

  const fetchFeaturedPhotographer = async () => {
    // Replace with your actual API call
    const response = await fetch('/api/photographers/featured');
    return response.json();
  };

  const fetchPortfolioData = async (photographerId: string) => {
    // Replace with your actual API call
    const response = await fetch(`/api/photographers/${photographerId}/portfolio`);
    return response.json();
  };

  const handlePhotographerSelect = (photographer: any) => {
    console.log('Selected photographer:', photographer);
    // Handle photographer selection (e.g., save to state, send to API)
  };

  const handleViewPortfolio = (photographer: any) => {
    console.log('Viewing portfolio for:', photographer);
    // Handle portfolio viewing (e.g., open modal, navigate to portfolio page)
  };

  return (
    <div className="min-h-screen">
      <WeddingPhotographerSelector
        // For API integration, uncomment these lines:
        // fetchPhotographers={fetchPhotographers}
        // fetchFeaturedPhotographer={fetchFeaturedPhotographer}
        // fetchPortfolioData={fetchPortfolioData}
        onPhotographerSelect={handlePhotographerSelect}
        onViewPortfolio={handleViewPortfolio}
      />
    </div>
  );
}

export default App;