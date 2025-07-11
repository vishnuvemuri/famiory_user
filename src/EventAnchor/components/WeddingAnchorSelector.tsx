import React, { useState, useEffect } from 'react';
import { MapPin, IndianRupee, ChevronDown, Mic, MessageSquare, Users, Clock, Theater, Languages, Award, Globe, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';
import './WeddingAnchorSelector.css';

interface Anchor {
  id: number;
  name: string;
  image: string;
  location: string;
  languages: string;
  expertise: string;
  budgetRange: string;
  heroImage?: string;
  logo?: string;
  description?: string;
  stats?: {
    eventsHosted: number;
    languages: number;
    cities: number;
    awards: number;
  };
  specializations?: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  gallery?: {
    images: string[];
    videos: string[];
  };
  testimonials?: Array<{
    content: string;
    author: string;
    role: string;
    image: string;
  }>;
  contact?: {
    address: string;
    phone: string;
    email: string;
    website: string;
    social: {
      instagram?: string;
      facebook?: string;
      whatsapp?: string;
    };
  };
}

const WeddingAnchorSelector: React.FC = () => {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [filteredAnchors, setFilteredAnchors] = useState<Anchor[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('all');
  const [currentBudget, setCurrentBudget] = useState<string>('all');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'portfolio'>('list');
  const [selectedAnchor, setSelectedAnchor] = useState<Anchor | null>(null);

  // Mock data with complete portfolio information
  const mockAnchors: Anchor[] = [
    {
      id: 1,
      name: "Priya Malhotra",
      image: "https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      heroImage: "https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
      logo: "https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      location: "Delhi NCR",
      languages: "Hindi, English, Punjabi",
      expertise: "Expert in North Indian wedding traditions",
      budgetRange: "standard",
      description: "With over 6 years of experience in wedding anchoring, I specialize in creating memorable experiences that reflect your unique love story. My approach combines professionalism with personalization, ensuring your wedding flows seamlessly while maintaining the joy and excitement of your special day.",
      stats: {
        eventsHosted: 300,
        languages: 3,
        cities: 15,
        awards: 5
      },
      specializations: [
        {
          name: "North Indian Weddings",
          description: "Expert in traditional North Indian wedding ceremonies and rituals",
          icon: "fas fa-hands-praying"
        },
        {
          name: "Bilingual Hosting",
          description: "Fluent in Hindi, English, and Punjabi hosting",
          icon: "fas fa-language"
        },
        {
          name: "Cultural Ceremonies",
          description: "Knowledgeable in all traditional wedding rituals",
          icon: "fas fa-theater-masks"
        },
        {
          name: "Guest Engagement",
          description: "Interactive activities to involve all your guests",
          icon: "fas fa-users"
        }
      ],
      gallery: {
        images: [
          "https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
        ],
        videos: []
      },
      testimonials: [
        {
          content: "Priya made our wedding so special! Her energy kept our guests engaged throughout the event and her knowledge of traditions was perfect for our North Indian wedding.",
          author: "Ravi & Simran",
          role: "Bride & Groom",
          image: "https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
        },
        {
          content: "Professional, punctual, and with incredible stage presence. Our guests are still talking about how wonderful our wedding host was!",
          author: "The Sharma Family",
          role: "Groom's Parents",
          image: "https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
        }
      ],
      contact: {
        address: "123 Wedding Lane, Delhi NCR, India 110001",
        phone: "+91 9876543210",
        email: "bookings@priyamalhotra.com",
        website: "www.priyamalhotra-anchor.com",
        social: {
          instagram: "https://instagram.com/priyamalhotra",
          facebook: "https://facebook.com/priyamalhotra",
          whatsapp: "https://wa.me/919876543210"
        }
      }
    },
    {
      id: 2,
      name: "Rahul Sharma",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      heroImage: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
      logo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      location: "Mumbai",
      languages: "Hindi, English, Marathi",
      expertise: "Specialist in multicultural weddings",
      budgetRange: "premium",
      description: "With over 8 years of experience in wedding anchoring, I specialize in creating memorable experiences that reflect your unique love story. My approach combines professionalism with personalization, ensuring your wedding flows seamlessly while maintaining the joy and excitement of your special day.",
      stats: {
        eventsHosted: 500,
        languages: 4,
        cities: 25,
        awards: 10
      },
      specializations: [
        {
          name: "Multicultural Weddings",
          description: "Expert in blending traditions from different cultures seamlessly",
          icon: "fas fa-globe-asia"
        },
        {
          name: "Bilingual Hosting",
          description: "Fluent in English, Hindi, and regional language hosting",
          icon: "fas fa-language"
        },
        {
          name: "Grand Entrance Coordination",
          description: "Creating unforgettable bride/groom entrance moments",
          icon: "fas fa-door-open"
        },
        {
          name: "Interactive Games",
          description: "Engaging activities to involve all your guests",
          icon: "fas fa-gamepad"
        },
        {
          name: "Ceremony Scripting",
          description: "Custom-written scripts for your unique ceremony",
          icon: "fas fa-scroll"
        },
        {
          name: "Cultural Rituals",
          description: "Knowledgeable in all traditional wedding rituals",
          icon: "fas fa-hands-praying"
        },
        {
          name: "Live Event Coordination",
          description: "Real-time adjustments to keep your event flowing perfectly",
          icon: "fas fa-users"
        },
        {
          name: "Personalized Introductions",
          description: "Custom introductions for each member of the wedding party",
          icon: "fas fa-user-plus"
        }
      ],
      gallery: {
        images: [
          "https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
        ],
        videos: []
      },
      testimonials: [
        {
          content: "Rahul made our wedding so special! His energy kept our guests engaged throughout the event and his bilingual skills were perfect for our multicultural wedding.",
          author: "Priya & Rohan",
          role: "Bride & Groom",
          image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
        },
        {
          content: "Professional, punctual, and with incredible stage presence. Our guests are still talking about how wonderful our wedding host was!",
          author: "The Kapoor Family",
          role: "Groom's Parents",
          image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
        },
        {
          content: "We've worked with many anchors over the years, but Rahul stands out for his ability to adapt to any situation and keep the event flowing perfectly.",
          author: "Grand Venues",
          role: "Wedding Planner",
          image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
        }
      ],
      contact: {
        address: "123 Wedding Lane, Mumbai, India 400001",
        phone: "+91 9876543210",
        email: "bookings@rahulsharma.com",
        website: "www.rahulsharma-anchor.com",
        social: {
          instagram: "https://instagram.com/rahulsharma",
          facebook: "https://facebook.com/rahulsharma",
          whatsapp: "https://wa.me/919876543210"
        }
      }
    },
    {
      id: 3,
      name: "Ananya Patel",
      image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      heroImage: "https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
      logo: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      location: "Ahmedabad",
      languages: "Hindi, Gujarati, English",
      expertise: "Traditional Gujarati wedding expert",
      budgetRange: "standard",
      description: "With over 5 years of experience in wedding anchoring, I specialize in traditional Gujarati weddings and creating memorable experiences that honor your cultural heritage while ensuring modern elegance.",
      stats: {
        eventsHosted: 250,
        languages: 3,
        cities: 12,
        awards: 4
      },
      specializations: [
        {
          name: "Gujarati Traditions",
          description: "Expert in traditional Gujarati wedding ceremonies",
          icon: "fas fa-hands-praying"
        },
        {
          name: "Cultural Ceremonies",
          description: "Knowledgeable in all traditional rituals",
          icon: "fas fa-theater-masks"
        },
        {
          name: "Family Coordination",
          description: "Seamless coordination between families",
          icon: "fas fa-users"
        },
        {
          name: "Regional Languages",
          description: "Fluent in Hindi, Gujarati, and English",
          icon: "fas fa-language"
        }
      ],
      gallery: {
        images: [
          "https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          "https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
        ],
        videos: []
      },
      testimonials: [
        {
          content: "Ananya perfectly understood our Gujarati traditions and made our wedding ceremony beautiful and meaningful.",
          author: "Kiran & Amit",
          role: "Bride & Groom",
          image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
        }
      ],
      contact: {
        address: "123 Wedding Lane, Ahmedabad, India 380001",
        phone: "+91 9876543211",
        email: "bookings@ananyapatel.com",
        website: "www.ananyapatel-anchor.com",
        social: {
          instagram: "https://instagram.com/ananyapatel",
          facebook: "https://facebook.com/ananyapatel",
          whatsapp: "https://wa.me/919876543211"
        }
      }
    }
  ];

  const locations = [
    "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai", 
    "Kolkata", "Jaipur", "Ahmedabad", "Pune"
  ];

  const budgetOptions = [
    { value: "all", label: "All Budgets" },
    { value: "standard", label: "Standard (₹15k-₹30k)" },
    { value: "premium", label: "Premium (₹30k-₹60k)" },
    { value: "elite", label: "Elite (₹60k+)" }
  ];

  // Initialize data
  useEffect(() => {
    loadAnchors();
  }, []);

  // Filter anchors when filters change
  useEffect(() => {
    filterAnchors();
  }, [anchors, currentLocation, currentBudget]);

  // API Integration Functions - Replace these with your actual API calls
  const loadAnchors = async () => {
    try {
      // Replace with: const response = await fetch('YOUR_API_ENDPOINT/anchors');
      // const data = await response.json();
      setAnchors(mockAnchors);
    } catch (error) {
      console.error('Error loading anchors:', error);
      setAnchors(mockAnchors);
    }
  };

  const loadAnchorDetails = async (anchorId: number) => {
    try {
      // Replace with: const response = await fetch(`YOUR_API_ENDPOINT/anchors/${anchorId}`);
      // const data = await response.json();
      const anchor = mockAnchors.find(a => a.id === anchorId);
      return anchor;
    } catch (error) {
      console.error('Error loading anchor details:', error);
      return mockAnchors.find(a => a.id === anchorId);
    }
  };

  const filterAnchors = () => {
    let filtered = [...anchors];

    if (currentLocation !== 'all') {
      filtered = filtered.filter(anchor => anchor.location === currentLocation);
    }

    if (currentBudget !== 'all') {
      filtered = filtered.filter(anchor => anchor.budgetRange === currentBudget);
    }

    setFilteredAnchors(filtered);
  };

  // Filter locations for search
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    setCurrentLocation(location);
    setLocationDropdownOpen(false);
    setLocationSearch('');
  };

  const handleBudgetSelect = (budget: string) => {
    setCurrentBudget(budget);
    setBudgetDropdownOpen(false);
  };

  const handleAnchorClick = async (anchorId: number) => {
    const anchorDetails = await loadAnchorDetails(anchorId);
    if (anchorDetails) {
      setSelectedAnchor(anchorDetails);
      setCurrentView('portfolio');
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedAnchor(null);
  };

  const featuredAnchor = anchors.find(anchor => anchor.id === 2) || anchors[0];

  // Portfolio View Component
  const PortfolioView = ({ anchor }: { anchor: Anchor }) => (
    <div className="was-portfolio-container">
      {/* Hero Section */}
      <header className="was-portfolio-hero">
        <div 
          className="was-hero-background" 
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${anchor.heroImage}')`
          }}
        ></div>
        <div className="was-hero-content">
          <h1>Famiory</h1>
          <h2>Professional Wedding Anchoring Services</h2>
          <div className="was-anchor-name">{anchor.name}</div>
        </div>
        <div className="was-logo-container">
          <img src={anchor.logo} alt={`${anchor.name} Logo`} className="was-anchor-logo" />
        </div>
        <button className="was-back-button" onClick={handleBackToList}>
          ← Back to Anchors
        </button>
      </header>

      {/* Main Content */}
      <main className="was-portfolio-main">
        {/* Anchor Info Section */}
        <section className="was-anchor-info-section">
          <div className="was-anchor-about">
            <h3>About Me</h3>
            <p>{anchor.description}</p>
            <div className="was-anchor-stats">
              <div className="was-stat-item">
                <Mic size={24} />
                <span>{anchor.stats?.eventsHosted}+</span>
                <span>Events Hosted</span>
              </div>
              <div className="was-stat-item">
                <Languages size={24} />
                <span>{anchor.stats?.languages}</span>
                <span>Languages</span>
              </div>
              <div className="was-stat-item">
                <MapPin size={24} />
                <span>{anchor.stats?.cities}+</span>
                <span>Cities</span>
              </div>
              <div className="was-stat-item">
                <Award size={24} />
                <span>{anchor.stats?.awards}+</span>
                <span>Awards</span>
              </div>
            </div>
          </div>
        </section>

        {/* Specializations Section */}
        <section className="was-specializations-section">
          <h3>My Specializations</h3>
          <div className="was-specializations-grid">
            {anchor.specializations?.map((spec, index) => (
              <div key={index} className="was-specialization-card">
                <div className="was-specialization-icon">
                  <Users size={32} />
                </div>
                <h4>{spec.name}</h4>
                <p>{spec.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="was-gallery-section">
          <h3>Event Highlights</h3>
          <div className="was-gallery-grid">
            {anchor.gallery?.images.map((image, index) => (
              <div key={index} className="was-gallery-item">
                <img src={image} alt={`${anchor.name} hosting event ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="was-testimonials-section">
          <h3>Client Testimonials</h3>
          <div className="was-testimonials-container">
            {anchor.testimonials?.map((testimonial, index) => (
              <div key={index} className="was-testimonial-card">
                <div className="was-testimonial-content">{testimonial.content}</div>
                <div className="was-testimonial-author">
                  <img src={testimonial.image} alt={testimonial.author} />
                  <div className="was-testimonial-author-info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Contact Section */}
      <footer className="was-booking-section">
        <div className="was-booking-container">
          <h3>Contact Me</h3>
          <div className="was-booking-info">
            <div className="was-booking-details">
              <p><MapPin size={16} /> {anchor.contact?.address}</p>
              <p><Phone size={16} /> {anchor.contact?.phone}</p>
              <p><Mail size={16} /> {anchor.contact?.email}</p>
              <p><Globe size={16} /> <a href={`https://${anchor.contact?.website}`} target="_blank" rel="noopener noreferrer">{anchor.contact?.website}</a></p>
              <div className="was-social-links">
                {anchor.contact?.social.instagram && (
                  <a href={anchor.contact.social.instagram} className="was-social-icon" target="_blank" rel="noopener noreferrer">
                    <Instagram size={20} />
                  </a>
                )}
                {anchor.contact?.social.facebook && (
                  <a href={anchor.contact.social.facebook} className="was-social-icon" target="_blank" rel="noopener noreferrer">
                    <Facebook size={20} />
                  </a>
                )}
                {anchor.contact?.social.whatsapp && (
                  <a href={anchor.contact.social.whatsapp} className="was-social-icon" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="was-copyright">
          <p>&copy; 2025 Famiory. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );

  // List View Component
  const ListView = () => (
    <div className="wedding-anchor-selector">
      {/* Header */}
      <header className="was-header">
        <div className="was-container">
          <h1>Select Your Wedding Anchor</h1>
          <p className="was-subheading">Expert hosts to elevate your wedding experience</p>
        </div>
      </header>

      {/* Filters */}
      <div className="was-filter-container was-container">
        <div className="was-dropdown">
          <button 
            className="was-filter-btn" 
            onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
          >
            <MapPin size={16} />
            {currentLocation === 'all' ? 'Select Location' : currentLocation}
            <ChevronDown size={14} className={locationDropdownOpen ? 'was-rotate' : ''} />
          </button>
          {locationDropdownOpen && (
            <div className="was-dropdown-content">
              <input
                type="text"
                placeholder="Search city..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="was-search-input"
              />
              <div className="was-dropdown-options">
                <div onClick={() => handleLocationSelect('all')}>All Locations</div>
                {filteredLocations.map(location => (
                  <div key={location} onClick={() => handleLocationSelect(location)}>
                    {location}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="was-dropdown">
          <button 
            className="was-filter-btn"
            onClick={() => setBudgetDropdownOpen(!budgetDropdownOpen)}
          >
            <IndianRupee size={16} />
            {budgetOptions.find(opt => opt.value === currentBudget)?.label || 'Budget Range'}
            <ChevronDown size={14} className={budgetDropdownOpen ? 'was-rotate' : ''} />
          </button>
          {budgetDropdownOpen && (
            <div className="was-dropdown-content">
              {budgetOptions.map(option => (
                <div key={option.value} onClick={() => handleBudgetSelect(option.value)}>
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="was-main-container">
        {/* Left Sidebar */}
        <aside className="was-left-sidebar">
          <div className="was-sidebar-content">
            <h3>Why Hire Professional Anchors?</h3>
            <ul>
              <li><Mic size={16} /> Flawless event coordination</li>
              <li><MessageSquare size={16} /> Multilingual presentation</li>
              <li><Users size={16} /> Guest engagement expertise</li>
              <li><Clock size={16} /> Punctual timeline management</li>
              <li><Theater size={16} /> Cultural ceremony knowledge</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="was-content">
          {/* Featured Anchor */}
          {featuredAnchor && (
            <section className="was-featured-anchor">
              <h2>Featured Anchor</h2>
              <div className="was-anchor-highlight">
                <img src={featuredAnchor.image} alt={featuredAnchor.name} className="was-featured-img" />
                <div className="was-anchor-details">
                  <h3>{featuredAnchor.name}</h3>
                  <p className="was-location">
                    <MapPin size={14} /> {featuredAnchor.location}
                  </p>
                  <p className="was-expertise">{featuredAnchor.expertise}</p>
                </div>
              </div>
            </section>
          )}

          {/* Anchor Grid */}
          <section className="was-anchor-collection">
            <h2>Our Professional Anchors</h2>
            <div className="was-anchors-grid">
              {filteredAnchors.length > 0 ? (
                filteredAnchors.map(anchor => (
                  <div 
                    key={anchor.id} 
                    className="was-anchor-card"
                    onClick={() => handleAnchorClick(anchor.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={anchor.image} alt={anchor.name} className="was-anchor-img" />
                    <div className="was-anchor-info">
                      <h3 className="was-anchor-name">{anchor.name}</h3>
                      <p className="was-anchor-location">
                        <MapPin size={14} /> {anchor.location}
                      </p>
                      <p className="was-anchor-languages">
                        <Languages size={14} /> {anchor.languages}
                      </p>
                      <p className="was-anchor-expertise">{anchor.expertise}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="was-no-results">No anchors match your selected filters.</p>
              )}
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="was-right-sidebar">
          <h3>Event Portfolio</h3>
          <div className="was-gallery">
            <img src="https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=150&h=200&fit=crop" alt="Grand Wedding Event" />
            <img src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=150&h=200&fit=crop" alt="Traditional Ceremony" />
            <img src="https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg?auto=compress&cs=tinysrgb&w=150&h=200&fit=crop" alt="Destination Wedding" />
            <img src="https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=150&h=200&fit=crop" alt="Cultural Event" />
          </div>
        </aside>
      </div>
    </div>
  );

  return (
    <>
      {currentView === 'list' && <ListView />}
      {currentView === 'portfolio' && selectedAnchor && <PortfolioView anchor={selectedAnchor} />}
    </>
  );
};

export default WeddingAnchorSelector;