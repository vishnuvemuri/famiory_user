import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, IndianRupee, Building, Phone, Mail, Star, CheckCircle, Heart, ChevronLeft, ChevronRight, Wifi, Car, Snowflake } from 'lucide-react';
import './VenuePortfolio.css';

interface VenueImage {
  id: string;
  url: string;
  caption?: string;
  altText?: string;
}

interface EventArea {
  id: string;
  name: string;
  description: string;
  images: VenueImage[];
  details: {
    label: string;
    value: string;
    icon: string;
  }[];
}

interface Amenity {
  id: string;
  name: string;
  icon: string;
}

interface VenueDetails {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  highlights: {
    guests: string;
    price: string;
    areas: string;
  };
  heroImages: VenueImage[];
  eventAreas: EventArea[];
  amenities: Amenity[];
  whyChooseUs: {
    title: string;
    description: string;
  }[];
  socialLinks: {
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  mapEmbedUrl: string;
}

interface VenuePortfolioProps {
  venueId?: string;
  apiEndpoint?: string;
  onBackToVenues?: () => void;
  customVenueData?: VenueDetails;
}

const VenuePortfolio: React.FC<VenuePortfolioProps> = ({
  venueId,
  apiEndpoint = '/api/venues',
  onBackToVenues,
  customVenueData
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [venue, setVenue] = useState<VenueDetails | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('banquet');
  const [autoSlideInterval, setAutoSlideInterval] = useState<NodeJS.Timeout | null>(null);

  // Sample venue data for fallback
  const sampleVenueData: VenueDetails = {
    id: '1',
    name: 'Grand Royal Palace',
    location: '123 Wedding Street, Mumbai',
    address: '123 Wedding Street, Mumbai, Maharashtra 400001',
    phone: '+91 98765 43210',
    email: 'info@grandroyal.com',
    description: 'Grand Royal Palace is one of Mumbai\'s most prestigious wedding venues, offering luxurious spaces for your dream wedding. With multiple event areas, exquisite dining options, and impeccable service, we ensure your special day is nothing short of magical.',
    highlights: {
      guests: '500-1000 Guests',
      price: 'From ₹50,000',
      areas: '3 Event Areas'
    },
    heroImages: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Grand Royal Palace',
        altText: 'Elegant wedding venue exterior'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Elegant Banquet Hall',
        altText: 'Luxurious banquet hall setup'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1200',
        caption: 'Lush Garden Lawn',
        altText: 'Beautiful outdoor garden area'
      }
    ],
    eventAreas: [
      {
        id: 'banquet',
        name: 'Banquet Hall',
        description: 'The Banquet Hall is a luxurious indoor space designed for grand weddings and celebrations. Featuring elegant chandeliers, modern decor, and a spacious dance floor, it\'s perfect for ceremonies and receptions. The hall is fully air-conditioned and equipped with advanced lighting and sound systems to enhance your event experience.',
        images: [
          {
            id: 'b1',
            url: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Banquet Hall Image 1'
          },
          {
            id: 'b2',
            url: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Banquet Hall Image 2'
          },
          {
            id: 'b3',
            url: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Banquet Hall Image 3'
          }
        ],
        details: [
          { label: 'Seating Capacity', value: '500 guests', icon: 'users' },
          { label: 'Floating Capacity', value: '700 guests', icon: 'users' },
          { label: 'Parking', value: '150 cars', icon: 'car' },
          { label: 'Area', value: '8000 sq.ft.', icon: 'building' },
          { label: 'AC', value: 'Centralized AC', icon: 'snowflake' }
        ]
      },
      {
        id: 'lawn',
        name: 'Lawn Garden',
        description: 'The Lawn Garden is an expansive outdoor area surrounded by lush greenery and vibrant flowers. Ideal for large weddings, it offers a natural and serene setting with ample space for seating, decorations, and entertainment. The open sky and beautifully landscaped gardens create a magical atmosphere for your special day.',
        images: [
          {
            id: 'l1',
            url: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Lawn Garden Image 1'
          },
          {
            id: 'l2',
            url: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Lawn Garden Image 2'
          },
          {
            id: 'l3',
            url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Lawn Garden Image 3'
          }
        ],
        details: [
          { label: 'Seating Capacity', value: '800 guests', icon: 'users' },
          { label: 'Floating Capacity', value: '1000 guests', icon: 'users' },
          { label: 'Parking', value: '200 cars', icon: 'car' },
          { label: 'Area', value: '12000 sq.ft.', icon: 'building' }
        ]
      },
      {
        id: 'resort',
        name: 'Resort Area',
        description: 'The Resort Area combines indoor and outdoor spaces, offering a versatile venue for intimate weddings or pre-wedding events. With cozy interiors and a scenic outdoor patio, it provides a relaxed yet elegant setting. Modern amenities ensure comfort for all guests.',
        images: [
          {
            id: 'r1',
            url: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Resort Area Image 1'
          },
          {
            id: 'r2',
            url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Resort Area Image 2'
          },
          {
            id: 'r3',
            url: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=400',
            altText: 'Resort Area Image 3'
          }
        ],
        details: [
          { label: 'Seating Capacity', value: '300 guests', icon: 'users' },
          { label: 'Floating Capacity', value: '500 guests', icon: 'users' },
          { label: 'Parking', value: '100 cars', icon: 'car' },
          { label: 'Area', value: '5000 sq.ft.', icon: 'building' }
        ]
      }
    ],
    amenities: [
      { id: '1', name: '10 AC Rooms Available', icon: 'snowflake' },
      { id: '2', name: 'High-Speed WiFi', icon: 'wifi' },
      { id: '3', name: 'Valet Parking', icon: 'car' }
    ],
    whyChooseUs: [
      {
        title: 'Stress-Free Planning',
        description: 'Our dedicated wedding planners handle every detail so you can enjoy your engagement.'
      },
      {
        title: 'Customizable Packages',
        description: 'Tailored options to suit your budget and preferences.'
      }
    ],
    socialLinks: {
      whatsapp: '#',
      instagram: '#',
      facebook: '#',
      twitter: '#'
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.715370902429!2d72.82421431537698!3d19.05272225796717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8df0a854749%3A0xe5fec6d5c8a0f6e8!2sTaj%20Mahal%20Palace%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1623836546782!5m2!1sen!2sin'
  };

  // Easy API integration function
  const fetchVenueData = async () => {
    if (customVenueData) {
      setVenue(customVenueData);
      return;
    }

    if (!venueId) {
      setVenue(sampleVenueData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Single line API integration - replace with actual API call
      // const response = await fetch(`${apiEndpoint}/${venueId}`);
      // const data = await response.json();
      
      // For demo, using sample data
      setTimeout(() => {
        setVenue(sampleVenueData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load venue details');
      setVenue(sampleVenueData); // Fallback to sample data
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenueData();
  }, [venueId]);

  useEffect(() => {
    if (venue?.heroImages && venue.heroImages.length > 1) {
      startAutoSlide();
    }
    return () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };
  }, [venue]);

  const startAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    const interval = setInterval(() => {
      setCurrentSlide(prev => 
        venue?.heroImages ? (prev + 1) % venue.heroImages.length : 0
      );
    }, 5000);
    setAutoSlideInterval(interval);
  };

  const resetAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    startAutoSlide();
  };

  const nextSlide = () => {
    if (venue?.heroImages) {
      setCurrentSlide(prev => (prev + 1) % venue.heroImages.length);
      resetAutoSlide();
    }
  };

  const prevSlide = () => {
    if (venue?.heroImages) {
      setCurrentSlide(prev => 
        prev === 0 ? venue.heroImages.length - 1 : prev - 1
      );
      resetAutoSlide();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetAutoSlide();
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      users: <Users size={16} />,
      car: <Car size={16} />,
      building: <Building size={16} />,
      snowflake: <Snowflake size={16} />,
      wifi: <Wifi size={16} />
    };
    return icons[iconName] || <CheckCircle size={16} />;
  };

  if (loading) {
    return (
      <div className="venue-portfolio">
        <div className="venue-portfolio__loading">
          <div className="venue-portfolio__spinner"></div>
          <p>Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error && !venue) {
    return (
      <div className="venue-portfolio">
        <div className="venue-portfolio__error">
          <p>{error}</p>
          <button onClick={fetchVenueData} className="venue-portfolio__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!venue) {
    return null;
  }

  return (
    <div className="venue-portfolio">
      {/* Navigation */}
      <nav className="venue-portfolio__navbar">
        <div className="venue-portfolio__container">
          <div className="venue-portfolio__logo">Famiory</div>
          <button 
            className="venue-portfolio__back-btn"
            onClick={onBackToVenues}
          >
            <ArrowLeft size={16} />
            Back to Venues
          </button>
        </div>
      </nav>

      {/* Hero Section with Slider */}
      <section className="venue-portfolio__hero">
        <div className="venue-portfolio__slider">
          <div 
            className="venue-portfolio__slides"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {venue.heroImages.map((image, index) => (
              <div
                key={image.id}
                className="venue-portfolio__slide"
                style={{ backgroundImage: `url(${image.url})` }}
              >
                <div className="venue-portfolio__slide-content">
                  <h1>{image.caption || venue.name}</h1>
                </div>
              </div>
            ))}
          </div>
          
          {venue.heroImages.length > 1 && (
            <div className="venue-portfolio__slider-controls">
              <button 
                className="venue-portfolio__slide-btn venue-portfolio__slide-btn--prev"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="venue-portfolio__slide-dots">
                {venue.heroImages.map((_, index) => (
                  <button
                    key={index}
                    className={`venue-portfolio__dot ${index === currentSlide ? 'venue-portfolio__dot--active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                className="venue-portfolio__slide-btn venue-portfolio__slide-btn--next"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="venue-portfolio__hero-info">
          <h1>{venue.name}</h1>
          <div className="venue-portfolio__hero-meta">
            <p>
              <MapPin size={16} />
              {venue.location}
            </p>
          </div>
          <div className="venue-portfolio__hero-highlights">
            <div className="venue-portfolio__highlight-item">
              <Users size={16} />
              <span>{venue.highlights.guests}</span>
            </div>
            <div className="venue-portfolio__highlight-item">
              <IndianRupee size={16} />
              <span>{venue.highlights.price}</span>
            </div>
            <div className="venue-portfolio__highlight-item">
              <Building size={16} />
              <span>{venue.highlights.areas}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="venue-portfolio__main-content">
        <div className="venue-portfolio__container">
          <div className="venue-portfolio__content-grid">
            {/* Left Column */}
            <div className="venue-portfolio__left-column">
              {/* About Section */}
              <section className="venue-portfolio__card">
                <h2>
                  <Star size={20} />
                  About This Venue
                </h2>
                <p>{venue.description}</p>
                
                <div className="venue-portfolio__highlights-grid">
                  <div className="venue-portfolio__highlight-card">
                    <Star size={24} />
                    <h4>Luxury Experience</h4>
                    <p>Premium amenities and royal treatment for you and your guests</p>
                  </div>
                  <div className="venue-portfolio__highlight-card">
                    <Building size={24} />
                    <h4>Gourmet Catering</h4>
                    <p>Customizable menus with both traditional and modern options</p>
                  </div>
                  <div className="venue-portfolio__highlight-card">
                    <Car size={24} />
                    <h4>Ample Parking</h4>
                    <p>Secure parking for 200+ vehicles with valet service available</p>
                  </div>
                  <div className="venue-portfolio__highlight-card">
                    <Wifi size={24} />
                    <h4>Tech Ready</h4>
                    <p>High-speed WiFi, AV equipment, and dedicated tech support</p>
                  </div>
                </div>
              </section>

              {/* Event Areas */}
              <section className="venue-portfolio__card">
                <h2>
                  <MapPin size={20} />
                  Event Areas
                </h2>
                
                <div className="venue-portfolio__tabs">
                  {venue.eventAreas.map((area) => (
                    <button
                      key={area.id}
                      className={`venue-portfolio__tab-btn ${activeTab === area.id ? 'venue-portfolio__tab-btn--active' : ''}`}
                      onClick={() => setActiveTab(area.id)}
                    >
                      {area.name}
                    </button>
                  ))}
                </div>

                {venue.eventAreas.map((area) => (
                  <div
                    key={area.id}
                    className={`venue-portfolio__tab-content ${activeTab === area.id ? 'venue-portfolio__tab-content--active' : ''}`}
                  >
                    <div className="venue-portfolio__area-gallery">
                      {area.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={image.altText}
                          className="venue-portfolio__area-image"
                        />
                      ))}
                    </div>
                    
                    <div className="venue-portfolio__area-details">
                      <h3>{area.name} Details</h3>
                      <p>{area.description}</p>
                      
                      <ul className="venue-portfolio__detail-list">
                        {area.details.map((detail, index) => (
                          <li key={index}>
                            {getIcon(detail.icon)}
                            <strong>{detail.label}:</strong> {detail.value}
                          </li>
                        ))}
                      </ul>
                      
                      <button className="venue-portfolio__view-more-btn">
                        View More Photos
                      </button>
                    </div>
                  </div>
                ))}
              </section>

              {/* Amenities */}
              <section className="venue-portfolio__card">
                <h2>
                  <Star size={20} />
                  Venue Amenities
                </h2>
                <div className="venue-portfolio__amenities-grid">
                  {venue.amenities.map((amenity) => (
                    <div key={amenity.id} className="venue-portfolio__amenity-item">
                      <CheckCircle size={16} />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Why Choose Us */}
              <section className="venue-portfolio__card">
                <h2>
                  <Heart size={20} />
                  Why Couples Choose Us
                </h2>
                <div className="venue-portfolio__reasons-list">
                  {venue.whyChooseUs.map((reason, index) => (
                    <div key={index} className="venue-portfolio__reason-item">
                      <div className="venue-portfolio__reason-number">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="venue-portfolio__reason-content">
                        <h3>{reason.title}</h3>
                        <p>{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (Contact) */}
            <div className="venue-portfolio__right-column">
              <div className="venue-portfolio__contact-card venue-portfolio__sticky-card">
                <h3>
                  <Mail size={20} />
                  Contact Venue
                </h3>
                
                <div className="venue-portfolio__contact-info">
                  <div className="venue-portfolio__contact-item">
                    <MapPin size={20} />
                    <div>
                      <h4>Address</h4>
                      <p>{venue.address}</p>
                    </div>
                  </div>
                  
                  <div className="venue-portfolio__contact-item">
                    <Phone size={20} />
                    <div>
                      <h4>Phone</h4>
                      <p>
                        <a href={`tel:${venue.phone}`}>{venue.phone}</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="venue-portfolio__contact-item">
                    <Mail size={20} />
                    <div>
                      <h4>Email</h4>
                      <p>
                        <a href={`mailto:${venue.email}`}>{venue.email}</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="venue-portfolio__social-links">
                  <h4>Connect With Us</h4>
                  <div className="venue-portfolio__social-icons">
                    {venue.socialLinks.whatsapp && (
                      <a href={venue.socialLinks.whatsapp} aria-label="WhatsApp">
                        <Phone size={16} />
                      </a>
                    )}
                    {venue.socialLinks.instagram && (
                      <a href={venue.socialLinks.instagram} aria-label="Instagram">
                        <Star size={16} />
                      </a>
                    )}
                    {venue.socialLinks.facebook && (
                      <a href={venue.socialLinks.facebook} aria-label="Facebook">
                        <Star size={16} />
                      </a>
                    )}
                    {venue.socialLinks.twitter && (
                      <a href={venue.socialLinks.twitter} aria-label="Twitter">
                        <Star size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="venue-portfolio__map-container">
                  <iframe
                    src={venue.mapEmbedUrl}
                    allowFullScreen
                    loading="lazy"
                    title="Venue Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="venue-portfolio__footer">
        <div className="venue-portfolio__container">
          <p>© 2025 Famiory. All rights reserved.</p>
          <div className="venue-portfolio__footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VenuePortfolio;