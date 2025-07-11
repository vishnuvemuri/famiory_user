import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  VolumeX, 
  Volume2, 
  Maximize, 
  MapPin 
} from 'lucide-react';
import './VendorSelection.css';

// API Configuration
const API_CONFIG = {
  baseUrl: 'https://your-api-domain.com/api',
  endpoints: {
    reels: '/reels',
    featuredVendor: '/featured-vendor',
    vendors: '/vendors',
    locations: '/locations'
  },
  enabled: false // Set to true when API is ready
};

// Type definitions
interface Reel {
  id: string;
  videoUrl: string;
  editUrl: string;
}

interface FeaturedVendor {
  id: string;
  name: string;
  logo: string;
  description: string;
  profileUrl: string;
}

interface Vendor {
  id: string;
  name: string;
  image: string;
  location: string;
  city: string;
  occasion: string;
  profileUrl: string;
}

interface Location {
  value: string;
  label: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface VendorSelectionProps {
  onVendorSelect: (vendorId: string) => void;
}

const VendorSelection: React.FC<VendorSelectionProps> = ({ onVendorSelect }) => {
  // State management
  const [reels, setReels] = useState<Reel[]>([]);
  const [featuredVendor, setFeaturedVendor] = useState<FeaturedVendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [muteStates, setMuteStates] = useState<boolean[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [occasionFilter, setOccasionFilter] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState(-1);
  
  const [loading, setLoading] = useState({
    reels: true,
    featuredVendor: true,
    vendors: true,
    locations: true
  });

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // API call function
  const apiCall = async <T,>(endpoint: string): Promise<T | null> => {
    if (!API_CONFIG.enabled) return null;
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result: ApiResponse<T> = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  };

  // Load reels data
  const loadReels = async () => {
    const data = await apiCall<Reel[]>(API_CONFIG.endpoints.reels);
    if (data) {
      setReels(data);
      setMuteStates(new Array(data.length).fill(true));
    } else {
      // Fallback data
      const fallbackReels = [
        { id: '1', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', editUrl: '/design?reel=1' },
        { id: '2', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', editUrl: '/design?reel=2' },
        { id: '3', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', editUrl: '/design?reel=3' },
        { id: '4', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_7mb.mp4', editUrl: '/design?reel=4' }
      ];
      setReels(fallbackReels);
      setMuteStates(new Array(fallbackReels.length).fill(true));
    }
    setLoading(prev => ({ ...prev, reels: false }));
  };

  // Load featured vendor
  const loadFeaturedVendor = async () => {
    const data = await apiCall<FeaturedVendor>(API_CONFIG.endpoints.featuredVendor);
    if (data) {
      setFeaturedVendor(data);
    } else {
      // Fallback data
      setFeaturedVendor({
        id: '1',
        name: 'Royal Invitations',
        logo: 'https://images.pexels.com/photos/1024991/pexels-photo-1024991.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
        description: 'Premium quality with royal touch designs',
        profileUrl: '/vendor/royal-invitations'
      });
    }
    setLoading(prev => ({ ...prev, featuredVendor: false }));
  };

  // Load vendors
  const loadVendors = async () => {
    const data = await apiCall<Vendor[]>(API_CONFIG.endpoints.vendors);
    if (data) {
      setVendors(data);
      setFilteredVendors(data);
    } else {
      // Fallback data
      const fallbackVendors = [
        { id: '1', name: 'Royal Invitations', image: 'https://images.pexels.com/photos/1024991/pexels-photo-1024991.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Mumbai, Andheri West', city: 'mumbai', occasion: 'Wedding & Engagement', profileUrl: '/vendor/royal-invitations' },
        { id: '2', name: 'Elegant Cards', image: 'https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Delhi, Connaught Place', city: 'delhi', occasion: 'Wedding & Reception', profileUrl: '/vendor/elegant-cards' },
        { id: '3', name: 'Golden Designs', image: 'https://images.pexels.com/photos/1024992/pexels-photo-1024992.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Bangalore, Koramangala', city: 'bangalore', occasion: 'Marriage', profileUrl: '/vendor/golden-designs' },
        { id: '4', name: 'Luxury Invites', image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Hyderabad, Banjara Hills', city: 'hyderabad', occasion: 'Wedding & Anniversary', profileUrl: '/vendor/luxury-invites' },
        { id: '5', name: 'Classic Creations', image: 'https://images.pexels.com/photos/1024994/pexels-photo-1024994.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Chennai, T Nagar', city: 'chennai', occasion: 'Reception', profileUrl: '/vendor/classic-creations' },
        { id: '6', name: 'Modern Weddings', image: 'https://images.pexels.com/photos/1024995/pexels-photo-1024995.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Mumbai, Bandra', city: 'mumbai', occasion: 'Wedding & Anniversary', profileUrl: '/vendor/modern-weddings' },
        { id: '7', name: 'Heritage Cards', image: 'https://images.pexels.com/photos/1024996/pexels-photo-1024996.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Delhi, Chandni Chowk', city: 'delhi', occasion: 'Marriage', profileUrl: '/vendor/heritage-cards' },
        { id: '8', name: 'Minimal Designs', image: 'https://images.pexels.com/photos/1024997/pexels-photo-1024997.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Bangalore, Indiranagar', city: 'bangalore', occasion: 'Reception', profileUrl: '/vendor/minimal-designs' },
        { id: '9', name: 'Grand Invites', image: 'https://images.pexels.com/photos/1024998/pexels-photo-1024998.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Hyderabad, Jubilee Hills', city: 'hyderabad', occasion: 'Marriage', profileUrl: '/vendor/grand-invites' },
        { id: '10', name: 'Traditional Touch', image: 'https://images.pexels.com/photos/1024999/pexels-photo-1024999.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop', location: 'Chennai, Mylapore', city: 'chennai', occasion: 'Engagement', profileUrl: '/vendor/traditional-touch' }
      ];
      setVendors(fallbackVendors);
      setFilteredVendors(fallbackVendors);
    }
    setLoading(prev => ({ ...prev, vendors: false }));
  };

  // Load locations
  const loadLocations = async () => {
    const data = await apiCall<Location[]>(API_CONFIG.endpoints.locations);
    if (data) {
      setLocations(data);
    } else {
      // Fallback data
      setLocations([
        { value: 'mumbai', label: 'Mumbai' },
        { value: 'delhi', label: 'Delhi' },
        { value: 'bangalore', label: 'Bangalore' },
        { value: 'hyderabad', label: 'Hyderabad' },
        { value: 'chennai', label: 'Chennai' }
      ]);
    }
    setLoading(prev => ({ ...prev, locations: false }));
  };

  // Initialize data
  useEffect(() => {
    loadReels();
    loadFeaturedVendor();
    loadVendors();
    loadLocations();
  }, []);

  // Video carousel logic
  const updateCarousel = (newIndex: number) => {
    // Pause current video
    const currentVideo = videoRefs.current[currentReelIndex];
    if (currentVideo) {
      currentVideo.pause();
    }

    setCurrentReelIndex(newIndex);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (reels.length === 0) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        setCurrentReelIndex(prev => (prev + 1) % reels.length);
      }, 5000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [reels.length]);

  // Handle video mute toggle
  const toggleMute = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = !video.muted;
      setMuteStates(prev => {
        const newStates = [...prev];
        newStates[index] = video.muted;
        return newStates;
      });
    }
  };

  // Handle fullscreen
  const toggleFullscreen = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    }
  };

  // Filter vendors
  useEffect(() => {
    let filtered = vendors;

    if (locationSearch) {
      filtered = filtered.filter(vendor => 
        vendor.location.toLowerCase().includes(locationSearch.toLowerCase()) ||
        vendor.city.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    if (occasionFilter) {
      filtered = filtered.filter(vendor => 
        vendor.occasion.toLowerCase().includes(occasionFilter.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  }, [vendors, locationSearch, occasionFilter]);

  // Handle location search
  const filteredLocations = locations.filter(location =>
    location.label.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Handle keyboard navigation
  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedOption(prev => 
        prev < filteredLocations.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedOption(prev => 
        prev > 0 ? prev - 1 : filteredLocations.length - 1
      );
    } else if (e.key === 'Enter' && highlightedOption >= 0) {
      e.preventDefault();
      setLocationSearch(filteredLocations[highlightedOption].label);
      setShowLocationDropdown(false);
      setHighlightedOption(-1);
    } else if (e.key === 'Escape') {
      setShowLocationDropdown(false);
      setHighlightedOption(-1);
    }
  };

  // Handle vendor card click
  const handleVendorClick = (vendor: Vendor) => {
    onVendorSelect(vendor.id);
  };

  // Handle featured vendor click
  const handleFeaturedVendorClick = () => {
    if (featuredVendor) {
      onVendorSelect(featuredVendor.id);
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="vs-loading">
      <div className="vs-spinner"></div>
    </div>
  );

  return (
    <div className="vendor-selection">
      <div className="vs-container">
        {/* Header */}
        <header className="vs-header">
          <h1>Elegant Invitations for Your Special Moments</h1>
          <p>Start your celebration with a touch of elegance and style.</p>
        </header>

        {/* Video Carousel Section */}
        <section className="vs-reel-section">
          <h2>Exclusive Invitation Designs</h2>
          {loading.reels ? (
            <LoadingSpinner />
          ) : (
            <div className="vs-video-carousel">
              <div className="vs-video-container">
                {reels.map((reel, index) => (
                  <div 
                    key={reel.id} 
                    className={`vs-reel ${index === currentReelIndex ? 'active' : ''}`}
                  >
                    <video
                      ref={el => videoRefs.current[index] = el}
                      muted={muteStates[index]}
                      loop
                      playsInline
                      onLoadedData={() => {
                        if (index === currentReelIndex) {
                          videoRefs.current[index]?.play().catch(console.error);
                        }
                      }}
                    >
                      <source src={reel.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    <div className="vs-video-controls">
                      <button 
                        className="vs-mute-btn"
                        onClick={() => toggleMute(index)}
                      >
                        {muteStates[index] ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <button 
                        className="vs-fullscreen-btn"
                        onClick={() => toggleFullscreen(index)}
                      >
                        <Maximize size={16} />
                      </button>
                    </div>
                    
                    <a href={reel.editUrl} className="vs-edit-btn">Edit</a>
                  </div>
                ))}
              </div>
              
              <div className="vs-video-navigation">
                <button 
                  className="vs-nav-arrow vs-left-arrow"
                  onClick={() => updateCarousel((currentReelIndex - 1 + reels.length) % reels.length)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  className="vs-nav-arrow vs-right-arrow"
                  onClick={() => updateCarousel((currentReelIndex + 1) % reels.length)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="vs-video-indicators">
                {reels.map((_, index) => (
                  <span
                    key={index}
                    className={`vs-indicator ${index === currentReelIndex ? 'active' : ''}`}
                    onClick={() => updateCarousel(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Featured Vendor Section */}
        {loading.featuredVendor ? (
          <LoadingSpinner />
        ) : featuredVendor && (
          <div className="vs-vendor-month-link" onClick={handleFeaturedVendorClick}>
            <section className="vs-vendor-month">
              <h2>Best Invitation Shop of the Month</h2>
              <img src={featuredVendor.logo} alt={`${featuredVendor.name} Logo`} className="vs-vendor-logo" />
              <div className="vs-vendor-name">{featuredVendor.name}</div>
              <p>{featuredVendor.description}</p>
            </section>
          </div>
        )}

        {/* Filter Section */}
        <section className="vs-filter-section">
          <div className="vs-filter-container vs-location-search-container">
            <input
              ref={locationInputRef}
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              onKeyDown={handleLocationKeyDown}
              placeholder="Search location..."
              className="vs-location-search"
            />
            {showLocationDropdown && (
              <div className="vs-location-dropdown">
                {filteredLocations.map((location, index) => (
                  <div
                    key={location.value}
                    className={`vs-location-option ${index === highlightedOption ? 'highlighted' : ''}`}
                    onClick={() => {
                      setLocationSearch(location.label);
                      setShowLocationDropdown(false);
                      setHighlightedOption(-1);
                    }}
                  >
                    {location.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="vs-filter-container">
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="vs-filter-btn"
            >
              <option value="">Select Occasion</option>
              <option value="marriage">Marriage</option>
              <option value="engagement">Engagement</option>
              <option value="reception">Reception</option>
              <option value="wedding">Wedding</option>
              <option value="anniversary">Anniversary</option>
            </select>
          </div>
        </section>

        {/* Vendors Grid */}
        <div className="vs-stores-grid">
          {loading.vendors ? (
            <LoadingSpinner />
          ) : (
            filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="vs-store-card"
                onClick={() => handleVendorClick(vendor)}
              >
                <img src={vendor.image} alt={vendor.name} className="vs-store-image" />
                <div className="vs-store-info">
                  <div className="vs-store-name">{vendor.name}</div>
                  <div className="vs-store-location">
                    <MapPin size={14} />
                    {vendor.location}
                  </div>
                  <div className="vs-store-occasion">{vendor.occasion}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorSelection;