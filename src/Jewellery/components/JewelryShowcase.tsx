import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowUp, MapPin, VolumeX, Volume2, Maximize, Minimize, X } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  location: string;
  image: string;
  link: string;
}

interface VideoItem {
  id: string;
  src: string;
  name: string;
  storeLink: string;
}

interface JewelryShowcaseProps {
  // API endpoint for fetching stores
  storesApiEndpoint?: string;
  // API endpoint for fetching videos
  videosApiEndpoint?: string;
  // Custom API headers
  apiHeaders?: Record<string, string>;
  // Custom onStoreClick handler
  onStoreClick?: (store: Store) => void;
  // Custom onVideoStoreClick handler
  onVideoStoreClick?: (videoItem: VideoItem) => void;
  // Navigation handler for jewelry portfolio
  onNavigateToPortfolio?: (store: Store) => void;
}

const JewelryShowcase: React.FC<JewelryShowcaseProps> = ({
  storesApiEndpoint,
  videosApiEndpoint,
  apiHeaders = {},
  onStoreClick,
  onVideoStoreClick,
  onNavigateToPortfolio
}) => {
  // State management
  const [stores, setStores] = useState<Store[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isChangingVideo, setIsChangingVideo] = useState(false);

  // Refs
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Default data (fallback if no API provided)
  const defaultVideos: VideoItem[] = [
    { id: '1', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', name: 'Exquisite Vines', storeLink: 'https://royaljewels.example.com' },
    { id: '2', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', name: 'Royal Diamonds', storeLink: 'https://diamondpalace.example.com' },
    { id: '3', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', name: 'Golden Bangles', storeLink: 'https://goldenera.example.com' },
    { id: '4', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', name: 'Elegant Necklaces', storeLink: 'https://heritagejewelers.example.com' },
    { id: '5', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', name: 'Traditional Sets', storeLink: 'https://sparkleshine.example.com' }
  ];

  const defaultStores: Store[] = [
    { id: '1', name: 'Royal Jewels', location: 'Mumbai', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://royaljewels.example.com' },
    { id: '2', name: 'Diamond Palace', location: 'Delhi', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://diamondpalace.example.com' },
    { id: '3', name: 'Golden Era', location: 'Bangalore', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://goldenera.example.com' },
    { id: '4', name: 'Heritage Jewelers', location: 'Hyderabad', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://heritagejewelers.example.com' },
    { id: '5', name: 'Sparkle & Shine', location: 'Chennai', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://sparkleshine.example.com' },
    { id: '6', name: 'Eternal Beauty', location: 'Kolkata', image: 'https://images.pexels.com/photos/1454180/pexels-photo-1454180.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://eternalbeauty.example.com' }
  ];

  // API Integration Functions
  const fetchStores = async () => {
    if (storesApiEndpoint) {
      try {
        const response = await fetch(storesApiEndpoint, { headers: apiHeaders });
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setStores(defaultStores);
      }
    } else {
      setStores(defaultStores);
    }
  };

  const fetchVideos = async () => {
    if (videosApiEndpoint) {
      try {
        const response = await fetch(videosApiEndpoint, { headers: apiHeaders });
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos(defaultVideos);
      }
    } else {
      setVideos(defaultVideos);
    }
  };

  // Video Functions
  const updateVideo = async () => {
    if (isChangingVideo || !videos.length) return;
    
    setIsChangingVideo(true);
    
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });

    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      try {
        currentVideo.currentTime = 0;
        currentVideo.muted = isMuted;
        currentVideo.volume = volume;
        
        if (isPlaying) {
          await currentVideo.play();
        }
      } catch (error) {
        console.error('Video play failed:', error);
      }
    }
    
    setIsChangingVideo(false);
  };

  const changeVideo = (direction: number) => {
    if (isChangingVideo || !videos.length) return;
    
    setCurrentVideoIndex((prev) => {
      const newIndex = (prev + direction + videos.length) % videos.length;
      return newIndex;
    });
    resetAutoPlay();
  };

  const changeVideoTo = (index: number) => {
    if (isChangingVideo || !videos.length) return;
    
    setCurrentVideoIndex(index);
    resetAutoPlay();
  };

  const resetAutoPlay = () => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    
    if (isPlaying) {
      autoPlayIntervalRef.current = setInterval(() => {
        changeVideo(1);
      }, 20000);
    }
  };

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (!currentVideo) return;

    if (isPlaying) {
      currentVideo.pause();
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    } else {
      currentVideo.play();
      resetAutoPlay();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.volume = newVolume;
      if (newVolume > 0) {
        currentVideo.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!isFullscreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Location Filter Functions
  const uniqueLocations = [...new Set(stores.map(store => store.location))];
  
  const filteredLocationOptions = uniqueLocations.filter(location =>
    location.toLowerCase().includes(locationSearchTerm.toLowerCase()) &&
    !selectedLocations.includes(location)
  );

  const handleLocationSelect = (location: string) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
    }
    setLocationSearchTerm('');
  };

  const handleLocationRemove = (locationToRemove: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc !== locationToRemove));
  };

  const handleCustomLocationAdd = () => {
    if (locationSearchTerm.trim() && !selectedLocations.includes(locationSearchTerm.trim())) {
      setSelectedLocations([...selectedLocations, locationSearchTerm.trim()]);
      setLocationSearchTerm('');
    }
  };

  const handleLocationInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredLocationOptions.length > 0) {
        handleLocationSelect(filteredLocationOptions[0]);
      } else if (locationSearchTerm.trim()) {
        handleCustomLocationAdd();
      }
    } else if (e.key === 'Backspace' && !locationSearchTerm && selectedLocations.length > 0) {
      handleLocationRemove(selectedLocations[selectedLocations.length - 1]);
    }
  };

  // Filtered stores
  const filteredStores = selectedLocations.length > 0
    ? stores.filter(store => 
        selectedLocations.some(selectedLocation => 
          store.location.toLowerCase().includes(selectedLocation.toLowerCase())
        )
      )
    : stores;

  // Scroll functions
  const scrollToSecondPage = () => {
    const secondPage = document.getElementById('second-page');
    if (secondPage) {
      secondPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle store clicks with portfolio navigation
  const handleStoreClick = (store: Store) => {
    if (onNavigateToPortfolio) {
      onNavigateToPortfolio(store);
    } else if (onStoreClick) {
      onStoreClick(store);
    } else {
      // Default navigation to portfolio page with store info
      const portfolioUrl = `/portfolio?name=${encodeURIComponent(store.name)}&location=${encodeURIComponent(store.location)}`;
      window.location.href = portfolioUrl;
    }
  };

  const handleVideoStoreClick = () => {
    const currentVideo = videos[currentVideoIndex];
    if (onVideoStoreClick) {
      onVideoStoreClick(currentVideo);
    } else {
      window.open(currentVideo.storeLink, '_blank');
    }
  };

  // Effects
  useEffect(() => {
    fetchStores();
    fetchVideos();
  }, [storesApiEndpoint, videosApiEndpoint]);

  useEffect(() => {
    updateVideo();
  }, [currentVideoIndex, isPlaying, isMuted, volume]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="jewelry-showcase">
      {/* First Page - Video Carousel */}
      <section className="jewelry-first-page">
        <h1 className="jewelry-main-heading">A SPARKLE THAT LASTS FOREVER</h1>
        <h2 className="jewelry-sub-heading">Handpicked Stylist Shops for a Flawless Look</h2>
        
        <div className="jewelry-video-carousel">
          <div className="jewelry-video-container" ref={videoContainerRef}>
            {videos.map((video, index) => (
              <video
                key={video.id}
                ref={el => videoRefs.current[index] = el}
                src={video.src}
                className={`jewelry-video ${index === currentVideoIndex ? 'active' : ''}`}
                autoPlay={index === currentVideoIndex}
                muted={isMuted}
                loop
                playsInline
                preload="auto"
              />
            ))}
            
            <button className="jewelry-visit-store-btn" onClick={handleVideoStoreClick}>
              Visit Store
            </button>
            
            <div className="jewelry-video-overlay-controls">
              <div className="jewelry-sound-control" onClick={toggleMute}>
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <input
                  type="range"
                  className="jewelry-volume-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
              <button className="jewelry-fullscreen-btn" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>
          </div>
          
          <div className="jewelry-video-navigation">
            <button className="jewelry-nav-arrow jewelry-left-arrow" onClick={() => changeVideo(-1)}>
              <ChevronLeft size={24} />
            </button>
            <button className="jewelry-nav-arrow jewelry-right-arrow" onClick={() => changeVideo(1)}>
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="jewelry-video-indicators">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`jewelry-video-indicator ${index === currentVideoIndex ? 'active' : ''}`}
                onClick={() => changeVideoTo(index)}
              />
            ))}
          </div>
        </div>
        
        <p className="jewelry-video-name">
          {videos[currentVideoIndex]?.name || 'Exquisite Vines'}
        </p>
        
        <div className="jewelry-scroll-down" onClick={scrollToSecondPage}>
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Second Page - Store Grid */}
      <section id="second-page" className="jewelry-second-page">
        <div className="jewelry-filters">
          <div className="jewelry-filter-group">
            <label htmlFor="location-input">
              <MapPin size={16} />
              Filter by Location
            </label>
            <div className="jewelry-location-input-container" ref={locationDropdownRef}>
              <div 
                className="jewelry-location-multi-select"
                onClick={() => setIsLocationDropdownOpen(true)}
              >
                <div className="jewelry-selected-locations">
                  {selectedLocations.map((location) => (
                    <span key={location} className="jewelry-location-tag">
                      {location}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocationRemove(location);
                        }}
                        className="jewelry-remove-location"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={selectedLocations.length === 0 ? "Search or add locations..." : "Add more..."}
                    value={locationSearchTerm}
                    onChange={(e) => setLocationSearchTerm(e.target.value)}
                    onKeyDown={handleLocationInputKeyDown}
                    onFocus={() => setIsLocationDropdownOpen(true)}
                    className="jewelry-location-search-input"
                  />
                </div>
                <ChevronDown 
                  size={16} 
                  className={`jewelry-dropdown-arrow ${isLocationDropdownOpen ? 'open' : ''}`}
                />
              </div>
              
              {isLocationDropdownOpen && (
                <div className="jewelry-location-dropdown">
                  {filteredLocationOptions.length > 0 && (
                    <div className="jewelry-dropdown-section">
                      <div className="jewelry-dropdown-header">Available Locations</div>
                      {filteredLocationOptions.map((location) => (
                        <div
                          key={location}
                          className="jewelry-dropdown-option"
                          onClick={() => handleLocationSelect(location)}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {locationSearchTerm.trim() && !uniqueLocations.includes(locationSearchTerm.trim()) && (
                    <div className="jewelry-dropdown-section">
                      <div className="jewelry-dropdown-header">Add Custom Location</div>
                      <div
                        className="jewelry-dropdown-option jewelry-custom-option"
                        onClick={handleCustomLocationAdd}
                      >
                        Add "{locationSearchTerm.trim()}"
                      </div>
                    </div>
                  )}
                  
                  {filteredLocationOptions.length === 0 && !locationSearchTerm.trim() && (
                    <div className="jewelry-dropdown-empty">
                      All locations selected
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="jewelry-featured-stores-heading">Top Featured Stores</h2>
        <div className="jewelry-store-count">
          Showcasing {filteredStores.length} of the finest names in luxury jewelry
          {selectedLocations.length > 0 && ` in ${selectedLocations.join(', ')}`}
        </div>
        
        <div className="jewelry-grid-container">
          {filteredStores.map(store => (
            <div
              key={store.id}
              className="jewelry-grid-item"
              onClick={() => handleStoreClick(store)}
            >
              <img src={store.image} alt={store.name} />
              <div className="jewelry-grid-item .jewelry-location-tag">{store.location}</div>
              <h3>{store.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button className="jewelry-back-to-top" onClick={scrollToTop}>
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default JewelryShowcase;