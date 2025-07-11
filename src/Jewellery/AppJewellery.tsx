import React, { useState } from 'react';
import JewelryShowcase from './components/JewelryShowcase';
import JewelryPortfolio from './components/JewelryPortfolio';
import './components/JewelryShowcase.css';
import './components/JewelryPortfolio.css';

interface Store {
  id: string;
  name: string;
  location: string;
  image: string;
  link: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'showcase' | 'portfolio'>('showcase');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleNavigateToPortfolio = (store: Store) => {
    setSelectedStore(store);
    setCurrentView('portfolio');
  };

  const handleBackToShowcase = () => {
    setCurrentView('showcase');
    setSelectedStore(null);
  };

  return (
    <div className="App">
      {currentView === 'showcase' ? (
        <JewelryShowcase 
          // Example API integration - replace with your actual endpoints
          // storesApiEndpoint="https://your-api.com/stores"
          // videosApiEndpoint="https://your-api.com/videos"
          // apiHeaders={{ 'Authorization': 'Bearer your-token' }}
          
          // Navigation handler to portfolio
          onNavigateToPortfolio={handleNavigateToPortfolio}
          
          // Custom handlers
          // onStoreClick={(store) => console.log('Store clicked:', store)}
          // onVideoStoreClick={(video) => console.log('Video store clicked:', video)}
        />
      ) : (
        <JewelryPortfolio
          // Example API integration - replace with your actual endpoints
          // culturalCollectionsApiEndpoint="https://your-api.com/cultural-collections"
          // designItemsApiEndpoint="https://your-api.com/design-items"
          // occasionItemsApiEndpoint="https://your-api.com/occasion-items"
          // featuredCollectionsApiEndpoint="https://your-api.com/featured-collections"
          // storeLocationsApiEndpoint="https://your-api.com/store-locations"
          // apiHeaders={{ 'Authorization': 'Bearer your-token' }}
          
          // Pass selected store information
          jewelerName={selectedStore?.name}
          jewelerWebsite={selectedStore?.link}
          
          // Custom handlers
          // onCulturalItemClick={(item) => console.log('Cultural item clicked:', item)}
          // onDesignItemClick={(item) => console.log('Design item clicked:', item)}
          // onOccasionItemClick={(item) => console.log('Occasion item clicked:', item)}
          // onFeaturedCollectionClick={(collection) => console.log('Featured collection clicked:', collection)}
          // onStoreLocatorClick={() => console.log('Store locator clicked')}
        />
      )}
      
      {/* Navigation button to go back to showcase when in portfolio view */}
      {currentView === 'portfolio' && (
        <button 
          onClick={handleBackToShowcase}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            backgroundColor: '#8b4513',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            zIndex: 1000,
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold'
          }}
        >
          ← Back to Showcase
        </button>
      )}
    </div>
  );
}

export default App;