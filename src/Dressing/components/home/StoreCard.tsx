import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../types/store';

interface StoreCardProps {
  store: Store;
  featured?: boolean;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, featured = false }) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    // Single line API integration point for analytics/tracking
    // Example: await api.trackStoreClick(store.id);
    navigate(`/vendor/${store.id}`);
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