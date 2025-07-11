import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { cities } from '../data/cities';

const CityAutocomplete: React.FC = () => {
  const { setCityFilter } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredSuggestions = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setCityFilter('');
    }
    setActiveSuggestion(-1);
  };

  const handleSuggestionClick = (city: string) => {
    setInputValue(city);
    setCityFilter(city);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        handleSuggestionClick(suggestions[activeSuggestion]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="filter-container autocomplete-container">
      <label htmlFor="city-filter" className="filter-label">
        Search Your City:
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id="city-filter"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Start typing your city..."
          className="filter-input"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="autocomplete-suggestions">
            {suggestions.map((city, index) => (
              <div
                key={city}
                className={`autocomplete-item ${
                  index === activeSuggestion ? 'active' : ''
                }`}
                onClick={() => handleSuggestionClick(city)}
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityAutocomplete;