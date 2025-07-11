import React from 'react';
import StoreCard from './StoreCard';
import { featuredStore } from '../data/stores';

const FeaturedStore: React.FC = () => {
  return (
    <section className="featured-section">
      <h2 className="section-title">Featured Store of the Month</h2>
      <div className="featured-card">
        <StoreCard store={featuredStore} featured={true} />
      </div>
    </section>
  );
};

export default FeaturedStore;