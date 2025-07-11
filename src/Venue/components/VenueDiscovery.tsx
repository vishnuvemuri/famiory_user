import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign } from 'lucide-react';
import VenuePortfolio from './VenuePortfolio';
import './VenueDiscovery.css';

interface Venue {
  id: string;
  name: string;
  city: string;
  type: string;
  price: number;
  address: string;
  description: string;
  image: string;
  featured?: boolean;
}

interface VenueDiscoveryProps {
  // API integration props - your backend developer can easily integrate these
  apiEndpoint?: string;
  onVenueClick?: (venue: Venue) => void;
  onSearch?: (filters: FilterState) => void;
  customVenues?: Venue[];
}

interface FilterState {
  city: string;
  venueType: string;
  priceRange: string;
  search: string;
}

const VenueDiscovery: React.FC<VenueDiscoveryProps> = ({
  apiEndpoint = '/api/venues', // Easy API integration - single line
  onVenueClick,
  onSearch,
  customVenues
}) => {
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [featuredVenue, setFeaturedVenue] = useState<Venue | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    city: 'all',
    venueType: 'all',
    priceRange: 'all',
    search: ''
  });

  // Sample data - replace with API call
  const sampleVenues: Venue[] = [
    {
      id: '1',
      name: 'Grand Palace Hotel',
      city: 'Mumbai',
      type: 'Hotel',
      price: 150000,
      address: '123 Luxury Street, Mumbai',
      description: 'A luxurious venue with stunning views and top-notch amenities.',
      image: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: true
    },
    {
      id: '2',
      name: 'Ocean Breeze Resort',
      city: 'Mumbai',
      type: 'Resort',
      price: 40000,
      address: 'Mumbai',
      description: 'A beautiful resort perfect for intimate weddings.',
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'Capital Heights Hotel',
      city: 'Delhi',
      type: 'Hotel',
      price: 80000,
      address: 'Delhi',
      description: 'Modern hotel with excellent facilities.',
      image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      name: 'Green Haven Farmhouse',
      city: 'Bangalore',
      type: 'Farmhouse',
      price: 150000,
      address: 'Bangalore',
      description: 'Spacious farmhouse with natural beauty.',
      image: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      name: 'Royal Banquet Hall',
      city: 'Hyderabad',
      type: 'Banquet',
      price: 250000,
      address: 'Hyderabad',
      description: 'Elegant banquet hall for grand celebrations.',
      image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '6',
      name: 'Coastal Retreat Resort',
      city: 'Chennai',
      type: 'Resort',
      price: 90000,
      address: 'Chennai',
      description: 'Scenic resort with coastal charm.',
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '7',
      name: 'Heritage Hotel',
      city: 'Kolkata',
      type: 'Hotel',
      price: 120000,
      address: 'Kolkata',
      description: 'Luxury hotel with historic vibes.',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '8',
      name: 'Pune Countryside Farm',
      city: 'Pune',
      type: 'Farmhouse',
      price: 50000,
      address: 'Pune',
      description: 'Cozy farmhouse for small gatherings.',
      image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '9',
      name: 'Palace Banquet',
      city: 'Jaipur',
      type: 'Banquet',
      price: 200000,
      address: 'Jaipur',
      description: 'Royal banquet with palatial decor.',
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '10',
      name: 'Serenity Resort',
      city: 'Ahmedabad',
      type: 'Resort',
      price: 60000,
      address: 'Ahmedabad',
      description: 'Relaxing resort with modern amenities.',
      image: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  // Easy API integration function - single line call
  const fetchVenues = async () => {
    setLoading(true);
    try {
      // Replace this with actual API call: const response = await fetch(apiEndpoint);
      // const data = await response.json();
      const data = customVenues || sampleVenues;
      setVenues(data);
      setFeaturedVenue(data.find(v => v.featured) || data[0]);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, filters]);

  const filterVenues = () => {
    let filtered = venues.filter(venue => !venue.featured);

    if (filters.city !== 'all') {
      filtered = filtered.filter(venue => venue.city === filters.city);
    }

    if (filters.venueType !== 'all') {
      filtered = filtered.filter(venue => venue.type === filters.venueType);
    }

    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(venue => {
        const price = venue.price;
        switch (filters.priceRange) {
          case 'below-50000':
            return price < 50000;
          case '50000-100000':
            return price >= 50000 && price <= 100000;
          case '100000-200000':
            return price >= 100000 && price <= 200000;
          case '200000+':
            return price >= 200000;
          default:
            return true;
        }
      });
    }

    if (filters.search) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        venue.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        venue.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredVenues(filtered);
    
    // Call onSearch callback for API integration
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleVenueClick = (venue: Venue) => {
    // Navigate to venue portfolio page
    setSelectedVenueId(venue.id);
    
    // Call onVenueClick callback for additional handling
    if (onVenueClick) {
      onVenueClick(venue);
    }
  };

  const handleBackToVenues = () => {
    setSelectedVenueId(null);
  };

  // If a venue is selected, show the portfolio page
  if (selectedVenueId) {
    return (
      <VenuePortfolio
        venueId={selectedVenueId}
        apiEndpoint={apiEndpoint}
        onBackToVenues={handleBackToVenues}
      />
    );
  }

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad'];
  const venueTypes = ['Resort', 'Hotel', 'Farmhouse', 'Banquet'];
  const priceRanges = [
    { value: 'below-50000', label: 'Below ₹50,000' },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000-200000', label: '₹1,00,000 - ₹2,00,000' },
    { value: '200000+', label: '₹2,00,000+' }
  ];

  return (
    <div className="venue-discovery">
      {loading && (
        <div className="venue-discovery__loader">
          <div className="venue-discovery__spinner"></div>
        </div>
      )}

      {/* Hero Section */}
      <div className="venue-discovery__hero">
        <h1 className="venue-discovery__title">Discover Perfect Wedding Venues</h1>
        <p className="venue-discovery__subtitle">
          At Famiory, we help you find the ideal wedding venue in India, tailored to your style and budget.
        </p>
      </div>

      {/* Filters */}
      <div className="venue-discovery__filters">
        <div className="venue-discovery__filter-group">
          <label className="venue-discovery__filter-label">
            <MapPin size={16} />
            City
          </label>
          <select
            className="venue-discovery__filter-select"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="venue-discovery__filter-group">
          <label className="venue-discovery__filter-label">
            <Calendar size={16} />
            Venue Type
          </label>
          <select
            className="venue-discovery__filter-select"
            value={filters.venueType}
            onChange={(e) => handleFilterChange('venueType', e.target.value)}
          >
            <option value="all">All Venues</option>
            {venueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="venue-discovery__filter-group">
          <label className="venue-discovery__filter-label">
            <DollarSign size={16} />
            Price Range
          </label>
          <select
            className="venue-discovery__filter-select"
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          >
            <option value="all">All Prices</option>
            {priceRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>

        <div className="venue-discovery__filter-group">
          <label className="venue-discovery__filter-label">
            <Search size={16} />
            Search
          </label>
          <input
            type="text"
            className="venue-discovery__filter-input"
            placeholder="Search venues..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Venue of the Month */}
      {featuredVenue && (
        <div className="venue-discovery__featured-section">
          <h2 className="venue-discovery__featured-title">Venue of the Month</h2>
          <div 
            className="venue-discovery__featured-card"
            onClick={() => handleVenueClick(featuredVenue)}
          >
            <img
              src={featuredVenue.image}
              alt={featuredVenue.name}
              className="venue-discovery__featured-image"
            />
            <div className="venue-discovery__featured-content">
              <h3 className="venue-discovery__featured-name">{featuredVenue.name}</h3>
              <p className="venue-discovery__featured-address">{featuredVenue.address}</p>
              <p className="venue-discovery__featured-description">{featuredVenue.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Venue Grid */}
      <div className="venue-discovery__grid">
        {filteredVenues.map(venue => (
          <div
            key={venue.id}
            className="venue-discovery__card"
            onClick={() => handleVenueClick(venue)}
          >
            <img
              src={venue.image}
              alt={venue.name}
              className="venue-discovery__card-image"
            />
            <div className="venue-discovery__card-content">
              <h3 className="venue-discovery__card-name">{venue.name}</h3>
              <p className="venue-discovery__card-city">{venue.city}</p>
              <p className="venue-discovery__card-description">{venue.description}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredVenues.length === 0 && !loading && (
        <div className="venue-discovery__no-results">
          <p>No venues found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default VenueDiscovery;