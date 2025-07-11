import React from 'react';
import { useStore } from '../../context/StoreContext';
import CityAutocomplete from './CityAutocomplete';

const FilterSection: React.FC = () => {
  const { filter, setFilter } = useStore();

  return (
    <section className="filter-section">
      <div className="filter-container">
        <label htmlFor="filter" className="filter-label">
          Refine Your Search:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Attire</option>
          <option value="bridal">Bridal Collection</option>
          <option value="groom">Groom Collection</option>
        </select>
      </div>

      <CityAutocomplete />
    </section>
  );
};

export default FilterSection;