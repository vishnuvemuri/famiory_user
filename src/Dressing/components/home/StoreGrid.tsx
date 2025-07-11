import React from 'react';
import StoreCard from './StoreCard';
import { useStore } from '../../context/StoreContext';
import { stores } from '../../data/stores';

const StoreGrid: React.FC = () => {
  const { filter, cityFilter } = useStore();

  const filteredStores = stores.filter(store => {
    const matchesCategory = filter === 'all' || store.category.includes(filter);
    const matchesCity = !cityFilter || store.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesCategory && matchesCity;
  });

  return (
    <section className="store-grid-section">
      <h2 className="section-title">India's Premier Wedding Attire Destinations</h2>
      <div className="store-grid">
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </section>
  );
};

export default StoreGrid;