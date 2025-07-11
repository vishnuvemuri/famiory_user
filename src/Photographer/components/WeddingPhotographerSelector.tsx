import React, { useState, useEffect } from 'react';
import { Eye, Camera } from 'lucide-react';
import styles from './WeddingPhotographerSelector.module.css';
import PhotographerPortfolio from './PhotographerPortfolio';

// Types for photographer data
interface Photographer {
  id: string;
  name: string;
  city: string;
  style: string;
  budget: string;
  image: string;
  description?: string;
  specialization?: string;
}

interface WeddingPhotographerSelectorProps {
  photographers?: Photographer[];
  featuredPhotographer?: Photographer;
  onPhotographerSelect?: (photographer: Photographer) => void;
  onViewPortfolio?: (photographer: Photographer) => void;
  // API integration props
  fetchPhotographers?: () => Promise<Photographer[]>;
  fetchFeaturedPhotographer?: () => Promise<Photographer>;
  fetchPortfolioData?: (id: string) => Promise<any>;
}

const WeddingPhotographerSelector: React.FC<WeddingPhotographerSelectorProps> = ({
  photographers: initialPhotographers,
  featuredPhotographer: initialFeatured,
  onPhotographerSelect,
  onViewPortfolio,
  fetchPhotographers,
  fetchFeaturedPhotographer,
  fetchPortfolioData
}) => {
  // State management
  const [photographers, setPhotographers] = useState<Photographer[]>(initialPhotographers || []);
  const [featuredPhotographer, setFeaturedPhotographer] = useState<Photographer | null>(initialFeatured || null);
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null);
  const [filteredPhotographers, setFilteredPhotographers] = useState<Photographer[]>([]);
  const [showPortfolio, setShowPortfolio] = useState<boolean>(false);
  const [currentPortfolioId, setCurrentPortfolioId] = useState<string | null>(null);
  
  // Filter states
  const [styleFilter, setStyleFilter] = useState<string>('All');
  const [budgetFilter, setBudgetFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(false);

  // Default sample data for demo purposes
  const defaultPhotographers: Photographer[] = [
    {
      id: '1',
      name: 'John Doe',
      city: 'Mumbai',
      style: 'Candid',
      budget: '100000',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300',
      specialization: 'Candid and cinematic wedding photography'
    },
    {
      id: '2',
      name: 'Jane Smith',
      city: 'Delhi',
      style: 'Traditional',
      budget: '150000',
      image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=300',
      specialization: 'Traditional wedding ceremonies'
    },
    {
      id: '3',
      name: 'Alice Johnson',
      city: 'Chennai',
      style: 'Cinematic',
      budget: '200000',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300',
      specialization: 'Cinematic storytelling'
    },
    {
      id: '4',
      name: 'Bob Brown',
      city: 'Pune',
      style: 'Destination',
      budget: '500000',
      image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=300',
      specialization: 'Destination wedding photography'
    },
    {
      id: '5',
      name: 'Bob Martin',
      city: 'Nagpur',
      style: 'Destination',
      budget: '1000000',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300',
      specialization: 'Luxury destination weddings'
    },
    {
      id: '6',
      name: 'Rahul Chabra',
      city: 'Indore',
      style: 'Destination',
      budget: '1000000',
      image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=300',
      specialization: 'Royal destination photography'
    },
    {
      id: '7',
      name: 'Tejas Singh',
      city: 'Kochi',
      style: 'Destination',
      budget: '1000000',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300',
      specialization: 'Coastal wedding photography'
    },
    {
      id: '8',
      name: 'Kavita Mishra',
      city: 'Thane',
      style: 'Destination',
      budget: '1000000',
      image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=300',
      specialization: 'Creative destination shoots'
    }
  ];

  // Default featured photographer
  const defaultFeatured: Photographer = {
    id: 'featured-1',
    name: 'John Doe Photography',
    city: 'Mumbai',
    style: 'Candid',
    budget: '100000',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Specializes in candid and cinematic wedding photography. Based in Mumbai.',
    specialization: 'Candid and cinematic wedding photography'
  };

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load photographers - use API if available, otherwise use defaults
        if (fetchPhotographers) {
          const apiPhotographers = await fetchPhotographers();
          setPhotographers(apiPhotographers);
        } else if (!initialPhotographers) {
          setPhotographers(defaultPhotographers);
        }

        // Load featured photographer
        if (fetchFeaturedPhotographer) {
          const apiFeatured = await fetchFeaturedPhotographer();
          setFeaturedPhotographer(apiFeatured);
        } else if (!initialFeatured) {
          setFeaturedPhotographer(defaultFeatured);
        }
      } catch (error) {
        console.error('Error loading photographer data:', error);
        // Fallback to default data
        setPhotographers(defaultPhotographers);
        setFeaturedPhotographer(defaultFeatured);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchPhotographers, fetchFeaturedPhotographer, initialPhotographers, initialFeatured]);

  // Filter photographers based on selected filters
  useEffect(() => {
    const filtered = photographers.filter(photographer => {
      return (
        (styleFilter === 'All' || photographer.style === styleFilter) &&
        (budgetFilter === 'All' || photographer.budget === budgetFilter) &&
        (locationFilter === 'All' || photographer.city === locationFilter)
      );
    });
    setFilteredPhotographers(filtered);
  }, [photographers, styleFilter, budgetFilter, locationFilter]);

  // Handle photographer selection
  const handlePhotographerSelect = (photographer: Photographer) => {
    setSelectedPhotographer(photographer);
    if (onPhotographerSelect) {
      onPhotographerSelect(photographer);
    }
  };

  // Handle portfolio viewing
  const handleViewPortfolio = (photographer: Photographer) => {
    if (onViewPortfolio) {
      onViewPortfolio(photographer);
    }
    
    // Navigate to portfolio page
    setCurrentPortfolioId(photographer.id);
    setShowPortfolio(true);
  };

  // Handle back from portfolio
  const handleBackFromPortfolio = () => {
    setShowPortfolio(false);
    setCurrentPortfolioId(null);
  };

  // Sample showcase images
  const showcaseImages = [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=200'
  ];

  // Show portfolio page if requested
  if (showPortfolio && currentPortfolioId) {
    return (
      <PhotographerPortfolio
        photographerId={currentPortfolioId}
        onBack={handleBackFromPortfolio}
        fetchPortfolioData={fetchPortfolioData}
      />
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading photographers...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <aside className={styles.leftSidebar}>
        <div className={styles.upperLeft}>
          <div className={styles.imageContainer}>
            <img 
              src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200" 
              alt="Wedding Photographer Showcase" 
              className={styles.sidebarImage}
            />
          </div>
          <h2 className={styles.sidebarTitle}>Wedding Photographer</h2>
          <div className={styles.filters}>
            <div className={styles.filter}>
              <label htmlFor="style-filter">Photography Style:</label>
              <select 
                id="style-filter" 
                value={styleFilter} 
                onChange={(e) => setStyleFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">All</option>
                <option value="Traditional">Traditional</option>
                <option value="Candid">Candid</option>
                <option value="Pre-wedding">Pre-wedding</option>
                <option value="Destination">Destination</option>
                <option value="Cinematic">Cinematic</option>
              </select>
            </div>
            <div className={styles.filter}>
              <label htmlFor="budget-filter">Budget:</label>
              <select 
                id="budget-filter" 
                value={budgetFilter} 
                onChange={(e) => setBudgetFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">All</option>
                <option value="50000">₹50,000</option>
                <option value="100000">₹1 Lakh</option>
                <option value="150000">₹1.5 Lakh</option>
                <option value="200000">₹2 Lakh</option>
                <option value="300000">₹3 Lakh</option>
                <option value="500000">₹5 Lakh</option>
                <option value="700000">₹7 Lakh</option>
                <option value="900000">₹9 Lakh</option>
                <option value="1000000">₹10 Lakh+</option>
              </select>
            </div>
            <div className={styles.filter}>
              <label htmlFor="location-filter">Location:</label>
              <select 
                id="location-filter" 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">All</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chennai">Chennai</option>
                <option value="Kochi">Kochi</option>
                <option value="Pune">Pune</option>
                <option value="Thane">Thane</option>
                <option value="Indore">Indore</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.lowerLeft}>
          <div className={styles.advertisement}>
            <img 
              src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200" 
              alt="Special Offer Advertisement" 
              className={styles.sidebarImage}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Choose Your Wedding Photographer</h1>
          <h2>Find the best photographers for your special day. Explore styles, budgets, and locations.</h2>
        </div>

        {/* Featured Photographer */}
        {featuredPhotographer && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Best Photographer of the Month</h2>
            <div className={styles.featuredCard}>
              <img 
                src={featuredPhotographer.image} 
                alt={featuredPhotographer.name}
                className={styles.featuredImage}
              />
              <div className={styles.featuredInfo}>
                <h3>{featuredPhotographer.name}</h3>
                <p>{featuredPhotographer.description || featuredPhotographer.specialization}</p>
                <button 
                  className={styles.portfolioBtn}
                  onClick={() => handleViewPortfolio(featuredPhotographer)}
                >
                  <Eye size={16} />
                  View Portfolio
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Photographer Grid */}
        <section className={styles.photographerGrid}>
          <h2 className={styles.sectionTitle}>Top Photographers</h2>
          <div className={styles.gridContainer}>
            {filteredPhotographers.map(photographer => (
              <div 
                key={photographer.id}
                className={`${styles.photographerCard} ${
                  selectedPhotographer?.id === photographer.id ? styles.selected : ''
                }`}
                onClick={() => handlePhotographerSelect(photographer)}
              >
                <img 
                  src={photographer.image} 
                  alt={`${photographer.name} Photography`}
                  className={styles.cardImage}
                />
                <h3>{photographer.name}</h3>
                <p>{photographer.city} | {photographer.style}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.selectedInfo}>
            <span>Selected Photographer: {selectedPhotographer?.name || 'None'}</span>
          </div>
          <div className={styles.portfolioAction}>
            <button 
              onClick={() => selectedPhotographer && handleViewPortfolio(selectedPhotographer)}
              disabled={!selectedPhotographer}
              className={styles.portfolioBtn}
            >
              <Eye size={16} />
              View Portfolio
            </button>
          </div>
          <div className={styles.locationInfo}>
            <span>Location: {selectedPhotographer?.city || 'None'}</span>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className={styles.rightSidebar}>
        <h3>Best Photos by Photographer of the Month</h3>
        <div className={styles.imageGrid}>
          {showcaseImages.map((image, index) => (
            <div key={index} className={styles.gridItem}>
              <img 
                src={image} 
                alt={`Photo ${index + 1} by Best Photographer`}
                className={styles.showcaseImage}
              />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default WeddingPhotographerSelector;