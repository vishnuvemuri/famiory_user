import React, { useState, useEffect } from 'react';
import { Heart, MapPin, DollarSign, Play, Eye } from 'lucide-react';

// API Configuration - Replace these URLs with your actual API endpoints
const API_CONFIG = {
  planners: 'https://your-api.com/api/wedding-planners',
  featuredPlanner: 'https://your-api.com/api/featured-planner',
  locations: 'https://your-api.com/api/locations',
  portfolio: (plannerId: string) => `https://your-api.com/api/portfolio/${plannerId}`,
};

// Types
interface WeddingPlanner {
  id: string;
  name: string;
  city: string;
  budget: string;
  image: string;
  description?: string;
  video?: string;
  gallery?: string[];
}

interface FeaturedPlanner extends WeddingPlanner {
  video: string;
  gallery: string[];
}

interface WeddingPlannerSelectorProps {
  onViewPortfolio: (plannerId: string) => void;
}

// Sample data for demonstration
const samplePlanners: WeddingPlanner[] = [
  {
    id: '1',
    name: 'Elite Events by Sarah',
    city: 'Mumbai',
    budget: '100000',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Specializes in luxury weddings. Based in Mumbai.'
  },
  {
    id: '2',
    name: 'Perfect Wedding Co.',
    city: 'Delhi',
    budget: '150000',
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Dream Day Weddings',
    city: 'Chennai',
    budget: '200000',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Royal Wedding Planners',
    city: 'Pune',
    budget: '500000',
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Happily Ever After',
    city: 'Nagpur',
    budget: '1000000',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    name: 'Grand Wedding Designs',
    city: 'Indore',
    budget: '1000000',
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '7',
    name: 'Elegant Nuptials',
    city: 'Kochi',
    budget: '1000000',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '8',
    name: 'Wedding Wizards',
    city: 'Thane',
    budget: '1000000',
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const sampleFeaturedPlanner: FeaturedPlanner = {
  id: '1',
  name: 'Elite Events by Sarah',
  city: 'Mumbai',
  budget: '100000',
  image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
  description: 'Specializes in luxury weddings. Based in Mumbai.',
  video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  gallery: [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400'
  ]
};

const WeddingPlannerSelector: React.FC<WeddingPlannerSelectorProps> = ({ onViewPortfolio }) => {
  const [planners, setPlanners] = useState<WeddingPlanner[]>([]);
  const [featuredPlanner, setFeaturedPlanner] = useState<FeaturedPlanner | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedPlanner, setSelectedPlanner] = useState<WeddingPlanner | null>(null);
  const [budgetFilter, setBudgetFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // API Integration Functions - Easy to connect to your backend
  const fetchPlanners = async () => {
    try {
      const response = await fetch(API_CONFIG.planners);
      const data = await response.json();
      setPlanners(data);
    } catch (error) {
      console.log('Using sample data for planners');
      setPlanners(samplePlanners);
    }
  };

  const fetchFeaturedPlanner = async () => {
    try {
      const response = await fetch(API_CONFIG.featuredPlanner);
      const data = await response.json();
      setFeaturedPlanner(data);
    } catch (error) {
      console.log('Using sample data for featured planner');
      setFeaturedPlanner(sampleFeaturedPlanner);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch(API_CONFIG.locations);
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.log('Using sample data for locations');
      const uniqueLocations = [...new Set(samplePlanners.map(p => p.city))];
      setLocations(uniqueLocations);
    }
  };

  const viewPortfolio = (plannerId: string) => {
    // Navigate to portfolio page - the WeddingPlannerPortfolio component
    // will handle its own data loading and fallback to sample data if needed
    onViewPortfolio(plannerId);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPlanners(),
        fetchFeaturedPlanner(),
        fetchLocations()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredPlanners = planners.filter(planner => {
    const budgetMatch = budgetFilter === 'All' || planner.budget === budgetFilter;
    const locationMatch = locationFilter === 'All' || planner.city === locationFilter;
    return budgetMatch && locationMatch;
  });

  const budgetOptions = [
    { value: 'All', label: 'All' },
    { value: '50000', label: '50,000' },
    { value: '100000', label: '1 Lakh' },
    { value: '150000', label: '1.5 Lakh' },
    { value: '200000', label: '2 Lakh' },
    { value: '300000', label: '3 Lakh' },
    { value: '500000', label: '5 Lakh' },
    { value: '700000', label: '7 Lakh' },
    { value: '900000', label: '9 Lakh' },
    { value: '1000000', label: '10 Lakh' }
  ];

  if (loading) {
    return (
      <div className="wedding-planner-loading">
        <div className="loading-spinner"></div>
        <p>Loading wedding planners...</p>
      </div>
    );
  }

  return (
    <div className="wedding-planner-container">
      {/* Left Sidebar */}
      <aside className="wedding-planner-left-sidebar">
        <div className="sidebar-upper">
          <div className="sidebar-image-container">
            <img 
              src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400" 
              alt="Wedding Planning Showcase" 
              className="sidebar-image"
            />
          </div>
          <h2 className="sidebar-title">Wedding Planner</h2>
          
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="budget-filter" className="filter-label">
                <DollarSign size={16} />
                Budget:
              </label>
              <select 
                id="budget-filter"
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="filter-select"
              >
                {budgetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="location-filter" className="filter-label">
                <MapPin size={16} />
                Location:
              </label>
              <select 
                id="location-filter"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="sidebar-lower">
          <div className="video-container">
            <h3 className="video-title">Featured Video</h3>
            <div className="video-wrapper">
              {featuredPlanner?.video ? (
                <video controls className="featured-video">
                  <source src={featuredPlanner.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="video-placeholder">
                  <Play size={48} />
                  <p>Video coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="wedding-planner-main">
        <div className="main-header">
          <h1 className="main-title">Choose Your Wedding Planner</h1>
          <h2 className="main-subtitle">Find the best wedding planners for your special day. Explore budgets and locations.</h2>
        </div>

        {/* Featured Planner */}
        {featuredPlanner && (
          <section className="featured-planner-section">
            <h2 className="section-title">Best Wedding Planner of the Month</h2>
            <div className="featured-planner-card">
              <img 
                src={featuredPlanner.image} 
                alt={featuredPlanner.name}
                className="featured-planner-image"
              />
              <div className="featured-planner-info">
                <h3 className="featured-planner-name">{featuredPlanner.name}</h3>
                <p className="featured-planner-desc">{featuredPlanner.description}</p>
                <button 
                  className="explore-btn"
                  onClick={() => viewPortfolio(featuredPlanner.id)}
                >
                  <Eye size={16} />
                  View Portfolio
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Planners Grid */}
        <section className="planners-grid-section">
          <h2 className="section-title">Top Wedding Planners</h2>
          <div className="planners-grid">
            {filteredPlanners.map(planner => (
              <div 
                key={planner.id}
                className={`planner-card ${selectedPlanner?.id === planner.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlanner(planner)}
              >
                <img 
                  src={planner.image} 
                  alt={planner.name}
                  className="planner-card-image"
                />
                <h3 className="planner-card-name">{planner.name}</h3>
                <p className="planner-card-location">{planner.city}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Selection Bar */}
        <div className="bottom-selection-bar">
          <div className="selection-info">
            <span className="selected-planner-text">
              Selected Planner: {selectedPlanner ? selectedPlanner.name : 'None'}
            </span>
          </div>
          <div className="portfolio-action">
            <button 
              className="portfolio-btn"
              onClick={() => selectedPlanner && viewPortfolio(selectedPlanner.id)}
              disabled={!selectedPlanner}
            >
              View Portfolio
            </button>
          </div>
          <div className="location-info">
            <span className="selected-location-text">
              Location: {selectedPlanner ? selectedPlanner.city : 'None'}
            </span>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="wedding-planner-right-sidebar">
        <h3 className="gallery-title">Best Weddings by Planner of the Month</h3>
        <div className="wedding-gallery">
          {featuredPlanner?.gallery?.map((image, index) => (
            <div key={index} className="gallery-item">
              <img 
                src={image} 
                alt={`Wedding ${index + 1} by ${featuredPlanner.name}`}
                className="gallery-image"
              />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default WeddingPlannerSelector;