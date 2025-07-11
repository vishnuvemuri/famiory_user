import React from 'react';
import { Collection } from '../../types/vendor';

interface CollectionsSectionProps {
  collections: Collection[];
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({ collections }) => {
  return (
    <section className="vendor-section">
      <h2 className="section-title">Our Collections</h2>
      <div className="vendor-grid">
        {collections.map((collection, index) => (
          <div key={index} className="grid-item">
            <img src={collection.image} alt={collection.title} />
            <h3>{collection.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;