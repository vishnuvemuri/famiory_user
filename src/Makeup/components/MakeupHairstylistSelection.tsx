import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import styles from './MakeupHairstylistSelection.module.css';
import ArtistPortfolio from './ArtistPortfolio';

interface Artist {
  id: number;
  name: string;
  specialization: string;
  location: string;
  price: string;
  image: string;
  rating?: number;
  experience?: string;
}

interface MakeupHairstylistSelectionProps {
  onArtistSelect?: (artist: Artist) => void;
  apiEndpoint?: string;
}

const MakeupHairstylistSelection: React.FC<MakeupHairstylistSelectionProps> = ({
  onArtistSelect,
  apiEndpoint = '/api/artists'
}) => {
  const [activeToggle, setActiveToggle] = useState<'bride' | 'groom'>('bride');
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    price: ''
  });
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [bestArtists, setBestArtists] = useState<Artist[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);

  // Mock data - Replace with API call
  const mockArtists: Artist[] = [
    {
      id: 1,
      name: "Artist 1",
      specialization: "Makeup & Hairstyling",
      location: "Mumbai",
      price: "1-2 Lakhs",
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      experience: "5 years"
    },
    {
      id: 2,
      name: "Artist 2",
      specialization: "Skincare & Grooming",
      location: "Delhi",
      price: "2-3 Lakhs",
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      experience: "7 years"
    },
    {
      id: 3,
      name: "Artist 3",
      specialization: "Mehendi & Nail Art",
      location: "Bangalore",
      price: "3-4 Lakhs",
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      experience: "4 years"
    },
    {
      id: 4,
      name: "Artist 4",
      specialization: "Groom Styling & Haircare",
      location: "Hyderabad",
      price: "1-2 Lakhs",
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      experience: "6 years"
    },
    {
      id: 5,
      name: "Artist 5",
      specialization: "Beard Styling & Shaving",
      location: "Chennai",
      price: "2-3 Lakhs",
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.5,
      experience: "3 years"
    },
    {
      id: 6,
      name: "Artist 6",
      specialization: "Skincare & Grooming",
      location: "Mumbai",
      price: "3-4 Lakhs",
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      experience: "8 years"
    },
    {
      id: 7,
      name: "Artist 7",
      specialization: "Mehendi & Nail Care",
      location: "Delhi",
      price: "1-2 Lakhs",
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      experience: "5 years"
    },
    {
      id: 8,
      name: "Artist 8",
      specialization: "Makeup & Hairstyling",
      location: "Bangalore",
      price: "2-3 Lakhs",
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      experience: "6 years"
    },
    {
      id: 9,
      name: "Artist 9",
      specialization: "Makeup & Hairstyling",
      location: "Chennai",
      price: "1-2 Lakhs",
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      experience: "4 years"
    },
    {
      id: 10,
      name: "Artist 10",
      specialization: "Skincare & Grooming",
      location: "Hyderabad",
      price: "3-4 Lakhs",
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      experience: "7 years"
    },
    {
      id: 11,
      name: "Artist 11",
      specialization: "Mehendi & Nail Art",
      location: "Mumbai",
      price: "2-3 Lakhs",
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.5,
      experience: "3 years"
    },
    {
      id: 12,
      name: "Artist 12",
      specialization: "Groom Styling & Haircare",
      location: "Delhi",
      price: "1-2 Lakhs",
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      experience: "5 years"
    }
  ];

  // API Integration - Replace mockArtists with actual API call
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        // const response = await fetch(apiEndpoint);
        // const data = await response.json();
        // setArtists(data);
        
        // Using mock data for now
        setArtists(mockArtists);
        setBestArtists(mockArtists.slice(0, 3));
      } catch (error) {
        console.error('Error fetching artists:', error);
        // Fallback to mock data
        setArtists(mockArtists);
        setBestArtists(mockArtists.slice(0, 3));
      }
    };

    fetchArtists();
  }, [apiEndpoint]);

  // Filter artists based on active toggle and filters
  useEffect(() => {
    let filtered = artists;

    // Filter by toggle (bride/groom)
    if (activeToggle === 'bride') {
      filtered = filtered.filter(artist => 
        ['Makeup & Hairstyling', 'Skincare & Grooming', 'Mehendi & Nail Art'].includes(artist.specialization)
      );
    } else {
      filtered = filtered.filter(artist => 
        ['Groom Styling & Haircare', 'Skincare & Grooming', 'Beard Styling & Shaving', 'Mehendi & Nail Care'].includes(artist.specialization)
      );
    }

    // Apply filters
    if (filters.specialization) {
      filtered = filtered.filter(artist => artist.specialization === filters.specialization);
    }
    if (filters.location) {
      filtered = filtered.filter(artist => artist.location === filters.location);
    }
    if (filters.price) {
      filtered = filtered.filter(artist => artist.price === filters.price);
    }

    setFilteredArtists(filtered);
  }, [artists, activeToggle, filters]);

  const brideOptions = [
    "Makeup & Hairstyling",
    "Skincare & Grooming",
    "Mehendi & Nail Art"
  ];

  const groomOptions = [
    "Groom Styling & Haircare",
    "Skincare & Grooming",
    "Beard Styling & Shaving",
    "Mehendi & Nail Care"
  ];

  const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"];
  const priceRanges = ["1-2 Lakhs", "2-3 Lakhs", "3-4 Lakhs", "4-5 Lakhs"];

  const handleToggleChange = (toggle: 'bride' | 'groom') => {
    setActiveToggle(toggle);
    setFilters({ specialization: '', location: '', price: '' });
  };

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleArtistClick = (artist: Artist) => {
    // Navigate to artist portfolio
    setSelectedArtistId(artist.id);
    
    // Call parent callback if provided
    if (onArtistSelect) {
      onArtistSelect(artist);
    }
  };

  const handleBackToArtists = () => {
    setSelectedArtistId(null);
  };

  // If an artist is selected, show their portfolio
  if (selectedArtistId) {
    return (
      <ArtistPortfolio 
        artistId={selectedArtistId}
        onBack={handleBackToArtists}
        apiEndpoint={`${apiEndpoint.replace('/artists', '/artist')}`}
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Upper Part - Fixed */}
      <div className={styles.upperPart}>
        <div className={styles.heading}>
          <h1>Makeup & Hairstylist</h1>
          <h1>Selection</h1>
        </div>

        <div className={styles.subHeadline}>
          <p>Find the best makeup artists and hairstylists for your special day!</p>
        </div>

        <div className={styles.toggleButton}>
          <button 
            className={`${styles.toggleBtn} ${activeToggle === 'bride' ? styles.active : ''}`}
            onClick={() => handleToggleChange('bride')}
          >
            Bride
          </button>
          <button 
            className={`${styles.toggleBtn} ${activeToggle === 'groom' ? styles.active : ''}`}
            onClick={() => handleToggleChange('groom')}
          >
            Groom
          </button>
        </div>

        <div className={styles.filters}>
          <button 
            className={styles.filterBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            Specialization
          </button>
          <button 
            className={styles.filterBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            Location
          </button>
          <button 
            className={styles.filterBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            Price Range
          </button>
        </div>

        {showFilters && (
          <div className={styles.filterDropdowns}>
            <select 
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Specialization</option>
              {(activeToggle === 'bride' ? brideOptions : groomOptions).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select 
              value={filters.price}
              onChange={(e) => handleFilterChange('price', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Price Range</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Lower Part - Fixed */}
      <div className={styles.lowerPart}>
        {/* Left Side - Fixed */}
        <div className={styles.leftSide}>
          <h3>Best Hairstylist of the Month</h3>
          {bestArtists.length > 0 && (
            <div className={styles.bestArtist}>
              <img src={bestArtists[0].image} alt="Best Artist" />
              <div className={styles.artistInfo}>
                <h4>{bestArtists[0].name}</h4>
                <p>{bestArtists[0].specialization}</p>
                <p>⭐ {bestArtists[0].rating}</p>
              </div>
            </div>
          )}

          <div className={styles.previousWork}>
            <h3>Best Makeup Artists of the Month</h3>
            {bestArtists.slice(1).map(artist => (
              <div key={artist.id} className={styles.workItem}>
                <img src={artist.image} alt={artist.name} />
                <div className={styles.workInfo}>
                  <h5>{artist.name}</h5>
                  <p>{artist.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Fixed with Scrollable Content */}
        <div className={styles.rightSide}>
          <h2>Top Makeup & Hairstylist</h2>
          <div className={styles.scrollableContainer}>
            <div className={styles.gridContainer}>
              {filteredArtists.map(artist => (
                <div 
                  key={artist.id}
                  className={styles.gridItem}
                  onClick={() => handleArtistClick(artist)}
                >
                  <img src={artist.image} alt={artist.name} />
                  <div className={styles.artistDetails}>
                    <h4>{artist.name}</h4>
                    <p>{artist.specialization}</p>
                    <p className={styles.location}>📍 {artist.location}</p>
                    <p className={styles.price}>💰 {artist.price}</p>
                    {artist.rating && (
                      <p className={styles.rating}>⭐ {artist.rating}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeupHairstylistSelection;