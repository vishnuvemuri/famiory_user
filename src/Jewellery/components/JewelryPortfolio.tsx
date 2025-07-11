import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, MapPin, Phone, Mail, Instagram } from 'lucide-react';

interface CulturalCollection {
  id: string;
  name: string;
  image: string;
  culture: string;
  description?: string;
  link?: string;
}

interface DesignItem {
  id: string;
  title: string;
  subtitle: string;
  modelImage: string;
  jewelryImage: string;
  category: string;
}

interface OccasionItem {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface FeaturedCollection {
  id: string;
  name: string;
  image: string;
  link?: string;
  isMain?: boolean;
}

interface StoreLocation {
  id: string;
  city: string;
  address: string;
  phone?: string;
}

interface JewelryPortfolioProps {
  // API endpoints for different data types
  culturalCollectionsApiEndpoint?: string;
  designItemsApiEndpoint?: string;
  occasionItemsApiEndpoint?: string;
  featuredCollectionsApiEndpoint?: string;
  storeLocationsApiEndpoint?: string;
  
  // Custom API headers
  apiHeaders?: Record<string, string>;
  
  // Jeweler information (can be passed from JewelryShowcase)
  jewelerName?: string;
  jewelerDescription?: string;
  jewelerLogo?: string;
  jewelerWebsite?: string;
  jewelerContact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    instagram?: string;
  };
  
  // Custom event handlers
  onCulturalItemClick?: (item: CulturalCollection) => void;
  onDesignItemClick?: (item: DesignItem) => void;
  onOccasionItemClick?: (item: OccasionItem) => void;
  onFeaturedCollectionClick?: (collection: FeaturedCollection) => void;
  onStoreLocatorClick?: () => void;
}

const JewelryPortfolio: React.FC<JewelryPortfolioProps> = ({
  culturalCollectionsApiEndpoint,
  designItemsApiEndpoint,
  occasionItemsApiEndpoint,
  featuredCollectionsApiEndpoint,
  storeLocationsApiEndpoint,
  apiHeaders = {},
  jewelerName = "Tanishq Jewellers",
  jewelerDescription,
  jewelerLogo,
  jewelerWebsite = "https://www.tanishq.co.in",
  jewelerContact = {},
  onCulturalItemClick,
  onDesignItemClick,
  onOccasionItemClick,
  onFeaturedCollectionClick,
  onStoreLocatorClick
}) => {
  // State management
  const [culturalCollections, setCulturalCollections] = useState<CulturalCollection[]>([]);
  const [designItems, setDesignItems] = useState<DesignItem[]>([]);
  const [occasionItems, setOccasionItems] = useState<OccasionItem[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollection[]>([]);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [selectedCulture, setSelectedCulture] = useState('Telugu');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Refs for gallery navigation
  const occasionGalleryRef = useRef<HTMLDivElement>(null);

  // Default data (fallback if no API provided)
  const defaultCulturalCollections: CulturalCollection[] = [
    { id: '1', name: 'Telugu Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Telugu' },
    { id: '2', name: 'Gujarati Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Gujarati' },
    { id: '3', name: 'Tamil Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Tamil' },
    { id: '4', name: 'Marathi Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Marathi' },
    { id: '5', name: 'Punjabi Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Punjabi' },
    { id: '6', name: 'UP Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'UP' },
    { id: '7', name: 'Bihari Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Bihari' },
    { id: '8', name: 'Kannadiga Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Kannadiga' },
    { id: '9', name: 'Marwari Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Marwari' },
    { id: '10', name: 'Odia Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Odia' },
    { id: '11', name: 'Muslim Bride', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', culture: 'Muslim' }
  ];

  const defaultDesignItems: DesignItem[] = [
    { id: '1', title: 'Golden', subtitle: 'Diamond Earrings', modelImage: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', jewelryImage: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'earrings' },
    { id: '2', title: 'Pearl', subtitle: 'Elegant Bracelet', modelImage: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', jewelryImage: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'bracelet' },
    { id: '3', title: 'Diamond', subtitle: 'Royal Necklace', modelImage: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', jewelryImage: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'necklace' }
  ];

  const defaultOccasionItems: OccasionItem[] = [
    { id: '1', name: 'Engagement', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', name: 'Haldi', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '3', name: 'Mehendi', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '4', name: 'Sangeet', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '5', name: 'Wedding', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '6', name: 'Reception', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '7', name: 'Cocktail', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const defaultFeaturedCollections: FeaturedCollection[] = [
    { id: '1', name: 'Main Featured Collection', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', isMain: true },
    { id: '2', name: 'Sub Featured Collection', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', isMain: false }
  ];

  const defaultStoreLocations: StoreLocation[] = [
    { id: '1', city: 'Mumbai', address: '123 Jewel Street, Bandra West', phone: '1800-266-0123' },
    { id: '2', city: 'Delhi', address: '456 Gold Road, Connaught Place', phone: '1800-266-0123' },
    { id: '3', city: 'Bangalore', address: '789 Diamond Avenue, MG Road', phone: '1800-266-0123' }
  ];

  // API Integration Functions
  const fetchData = async (endpoint: string, fallbackData: any[], setter: Function) => {
    if (endpoint) {
      try {
        const response = await fetch(endpoint, { headers: apiHeaders });
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        setter(fallbackData);
      }
    } else {
      setter(fallbackData);
    }
  };

  // Get unique cultures for buttons
  const uniqueCultures = [...new Set(culturalCollections.map(item => item.culture))];

  // Get current cultural collection
  const currentCulturalItem = culturalCollections.find(item => item.culture === selectedCulture);

  // Handle clicks
  const handleCulturalItemClick = (item: CulturalCollection) => {
    if (onCulturalItemClick) {
      onCulturalItemClick(item);
    } else if (item.link) {
      window.open(item.link, '_blank');
    }
  };

  const handleDesignItemClick = (item: DesignItem) => {
    if (onDesignItemClick) {
      onDesignItemClick(item);
    }
  };

  const handleOccasionItemClick = (item: OccasionItem) => {
    if (onOccasionItemClick) {
      onOccasionItemClick(item);
    }
  };

  const handleFeaturedCollectionClick = (collection: FeaturedCollection) => {
    if (onFeaturedCollectionClick) {
      onFeaturedCollectionClick(collection);
    } else if (collection.link) {
      window.open(collection.link, '_blank');
    } else {
      window.open(jewelerWebsite, '_blank');
    }
  };

  const handleStoreLocatorClick = () => {
    if (onStoreLocatorClick) {
      onStoreLocatorClick();
    } else {
      window.open(`${jewelerWebsite}/stores`, '_blank');
    }
  };

  // Scroll functions
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gallery navigation
  const scrollOccasionGallery = (direction: 'left' | 'right') => {
    if (occasionGalleryRef.current) {
      const scrollAmount = 200;
      const currentScroll = occasionGalleryRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      occasionGalleryRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  // Effects
  useEffect(() => {
    fetchData(culturalCollectionsApiEndpoint, defaultCulturalCollections, setCulturalCollections);
    fetchData(designItemsApiEndpoint, defaultDesignItems, setDesignItems);
    fetchData(occasionItemsApiEndpoint, defaultOccasionItems, setOccasionItems);
    fetchData(featuredCollectionsApiEndpoint, defaultFeaturedCollections, setFeaturedCollections);
    fetchData(storeLocationsApiEndpoint, defaultStoreLocations, setStoreLocations);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get jeweler info from URL params if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nameFromUrl = urlParams.get('name');
    if (nameFromUrl && !jewelerName) {
      // Update jeweler name if passed via URL
    }
  }, []);

  return (
    <div className="jewelry-portfolio">
      {/* Header Section */}
      <header className="jewelry-portfolio-header">
        <h1 className="jewelry-portfolio-title">Famiory</h1>
        <p className="jewelry-portfolio-subtitle">Plan Your Jewellery Shopping</p>
      </header>

      {/* Brand Info Section */}
      <section className="jewelry-portfolio-brand-section">
        <div className="jewelry-portfolio-brand-logo">
          {jewelerLogo ? (
            <img src={jewelerLogo} alt={`${jewelerName} Brand Logo`} />
          ) : (
            <div className="jewelry-portfolio-default-logo">
              <span>{jewelerName.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="jewelry-portfolio-brand-info">
          <h2>{jewelerName}</h2>
          <p>
            {jewelerDescription || 
            `Established in 1994, ${jewelerName} has grown to become India's largest and most trusted jewellery brand with a presence of over 300 stores across 200+ cities. Our aim is to make the jewellery buying experience joyful and hassle-free for our customers.`}
          </p>
          <p>
            With a strong commitment to purity and craftsmanship, we offer a wide range of designs that blend traditional aesthetics with contemporary styles. Our jewellery is crafted with the finest materials and undergoes rigorous quality checks to ensure you get nothing but the best.
          </p>
          <p>
            At {jewelerName}, we believe jewellery is not just an adornment but an expression of love, tradition, and personal style.
          </p>
        </div>
      </section>

      {/* Cultural Bridal Section */}
      <section className="jewelry-portfolio-cultural-section">
        <h2>For a Sparkling New Beginning</h2>
        <div className="jewelry-portfolio-cultural-buttons">
          {uniqueCultures.map(culture => (
            <button
              key={culture}
              className={`jewelry-portfolio-cultural-btn ${selectedCulture === culture ? 'active' : ''}`}
              onClick={() => setSelectedCulture(culture)}
            >
              {culture} Bride
            </button>
          ))}
        </div>
        
        {currentCulturalItem && (
          <div className="jewelry-portfolio-cultural-gallery">
            <div className="jewelry-portfolio-cultural-item">
              <img src={currentCulturalItem.image} alt={currentCulturalItem.name} />
              <div className="jewelry-portfolio-cultural-caption">{currentCulturalItem.name}</div>
              <button 
                className="jewelry-portfolio-know-more-btn"
                onClick={() => handleCulturalItemClick(currentCulturalItem)}
              >
                Know More
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Design Led Jewellery Section */}
      <section className="jewelry-portfolio-design-section">
        <h2>Design Led Jewellery</h2>
        <div className="jewelry-portfolio-design-gallery">
          {designItems.map(item => (
            <div 
              key={item.id} 
              className="jewelry-portfolio-design-item"
              onClick={() => handleDesignItemClick(item)}
            >
              <div className="jewelry-portfolio-model-container">
                <img src={item.modelImage} alt={`Model wearing ${item.title} ${item.subtitle}`} className="jewelry-portfolio-model-image" />
                <img src={item.jewelryImage} alt={`${item.title} ${item.subtitle}`} className="jewelry-portfolio-jewelry-image" />
              </div>
              <div className="jewelry-portfolio-jewelry-name">
                <span className="jewelry-portfolio-jewelry-title">{item.title}</span>
                <span className="jewelry-portfolio-jewelry-subtitle">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="jewelry-portfolio-featured-section">
        <h2>Featured Collections</h2>
        <div className="jewelry-portfolio-featured-container">
          {featuredCollections.map(collection => (
            <div 
              key={collection.id}
              className={`jewelry-portfolio-featured-item ${collection.isMain ? 'main' : 'sub'}`}
              onClick={() => handleFeaturedCollectionClick(collection)}
            >
              <img src={collection.image} alt={collection.name} />
            </div>
          ))}
        </div>
      </section>

      {/* Wedding Occasion Section */}
      <section className="jewelry-portfolio-occasion-section">
        <h2>Be a Star in Every Wedding Occasion</h2>
        <div className="jewelry-portfolio-occasion-gallery">
          <button 
            className="jewelry-portfolio-gallery-nav left" 
            onClick={() => scrollOccasionGallery('left')}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="jewelry-portfolio-occasion-images" ref={occasionGalleryRef}>
            {occasionItems.map(item => (
              <div 
                key={item.id} 
                className="jewelry-portfolio-occasion-item"
                onClick={() => handleOccasionItemClick(item)}
              >
                <img src={item.image} alt={`${item.name} Jewellery`} />
                <div className="jewelry-portfolio-occasion-caption">{item.name}</div>
              </div>
            ))}
          </div>
          <button 
            className="jewelry-portfolio-gallery-nav right" 
            onClick={() => scrollOccasionGallery('right')}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Store Locator Section */}
      <section className="jewelry-portfolio-locator-section">
        <div className="jewelry-portfolio-locator-content">
          <h2>Locate Your Nearest</h2>
          <h3>{jewelerName} Store</h3>
          <p>Visit our stores to experience the jewellery in person and get expert advice from our consultants.</p>
          <button className="jewelry-portfolio-find-now-btn" onClick={handleStoreLocatorClick}>
            Find Now <MapPin size={16} />
          </button>
        </div>
        <div className="jewelry-portfolio-store-images">
          <div className="jewelry-portfolio-store-img">
            <img src="https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400" alt={`${jewelerName} Store Exterior 1`} />
          </div>
          <div className="jewelry-portfolio-store-img">
            <img src="https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400" alt={`${jewelerName} Store Exterior 2`} />
          </div>
          <div className="jewelry-portfolio-store-img">
            <img src="https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400" alt={`${jewelerName} Store Interior 1`} />
          </div>
          <div className="jewelry-portfolio-store-img">
            <img src="https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400" alt={`${jewelerName} Store Interior 2`} />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="jewelry-portfolio-footer">
        <div className="jewelry-portfolio-footer-top">
          <div className="jewelry-portfolio-footer-item">
            <div className="jewelry-portfolio-jeweler-name">{jewelerName}</div>
          </div>
          <div className="jewelry-portfolio-footer-item">
            <div className="jewelry-portfolio-website-link">
              <a href={jewelerWebsite} target="_blank" rel="noopener noreferrer">
                {jewelerWebsite.replace('https://', '').replace('http://', '')}
              </a>
            </div>
          </div>
          <div className="jewelry-portfolio-footer-item">
            <div className="jewelry-portfolio-social-media">
              {jewelerContact.whatsapp && (
                <a href={`https://wa.me/${jewelerContact.whatsapp}`} className="jewelry-portfolio-social-icon" target="_blank" rel="noopener noreferrer">
                  <Phone size={18} />
                </a>
              )}
              {jewelerContact.email && (
                <a href={`mailto:${jewelerContact.email}`} className="jewelry-portfolio-social-icon" target="_blank" rel="noopener noreferrer">
                  <Mail size={18} />
                </a>
              )}
              {jewelerContact.instagram && (
                <a href={jewelerContact.instagram} className="jewelry-portfolio-social-icon" target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>
          <div className="jewelry-portfolio-footer-item">
            <div className="jewelry-portfolio-contact-info">
              <span>{jewelerContact.phone || '1800-266-0123'}</span>
            </div>
          </div>
        </div>

        <div className="jewelry-portfolio-store-locations">
          <h4>Store Locations</h4>
          <div className="jewelry-portfolio-locations-grid">
            {storeLocations.map(location => (
              <div key={location.id} className="jewelry-portfolio-location-item">
                <strong>{location.city}</strong><br />
                {location.address}
              </div>
            ))}
          </div>
          <a href={`${jewelerWebsite}/stores`} className="jewelry-portfolio-more-stores" target="_blank" rel="noopener noreferrer">
            More Stores
          </a>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button className="jewelry-portfolio-back-to-top" onClick={scrollToTop}>
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default JewelryPortfolio;