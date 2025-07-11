import React from 'react';
import { Collection } from '../../types/vendor';

interface NewArrivalsSectionProps {
  newArrivals: Collection[];
}

const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ newArrivals }) => {
  return (
    <section className="vendor-section">
      <h2 className="section-title">New Arrivals</h2>
      <div className="vendor-grid">
        {newArrivals.map((arrival, index) => (
          <div key={index} className="grid-item">
            <img src={arrival.image} alt={arrival.title} />
            <h3>{arrival.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivalsSection;