import React from 'react';
import { Store } from '../types/store';

interface StoreCardProps {
  store: Store;
  featured?: boolean;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, featured = false }) => {
  const handleExploreClick = () => {
    // API integration point - single line to call backend
    // Example: await api.getStoreDetails(store.id);
    console.log(`Exploring ${store.name} - API call would go here`);
  };

  return (
    <div className={`store-card ${featured ? 'featured' : ''}`}>
      <img
        src={store.image}
        alt={`${store.name} Store`}
        className="store-image"
      />
      <div className="store-info">
        <h3 className="store-name">{store.name}</h3>
        <p className="store-description">{store.description}</p>
        <button
          className="store-button"
          onClick={handleExploreClick}
        >
          {featured ? 'Explore Collection' : 'View Collection'}
        </button>
      </div>
    </div>
  );
};

export default StoreCard;