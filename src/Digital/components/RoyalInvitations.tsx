import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  Paintbrush, 
  Clock, 
  Gem, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import './RoyalInvitations.css';

// API Configuration - Easy to modify for your backend
const API_CONFIG = {
  baseUrl: 'https://your-api-domain.com/api', // Replace with your API base URL
  endpoints: {
    hero: '/hero',
    services: '/services',
    features: '/features',
    portfolio: '/portfolio',
    policies: '/policies',
    contact: '/contact',
    brand: '/brand'
  },
  // Set to false to use fallback data instead of making API calls
  enabled: false
};

// Type definitions for API responses
interface HeroData {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

interface BrandData {
  name: string;
  logo: string;
}

interface ServiceItem {
  id: string;
  name: string;
  size: 'large' | 'medium';
  isActive: boolean;
}

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt: string;
  thumbnail?: string;
}

interface PolicySection {
  id: string;
  title: string;
  items: string[];
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
  socialLinks: {
    email: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface RoyalInvitationsProps {
  vendorId?: string | null;
  onBackToSelection?: () => void;
}

const RoyalInvitations: React.FC<RoyalInvitationsProps> = ({ vendorId, onBackToSelection }) => {
  // State for all dynamic content
  const [heroData, setHeroData] = useState<HeroData>({
    title: 'Famiory',
    subtitle: 'Creating timeless wedding invitations that tell your love story',
    backgroundImage: 'https://images.pexels.com/photos/1024991/pexels-photo-1024991.jpeg?auto=compress&cs=tinysrgb&w=1350&h=900&fit=crop'
  });

  const [brandData, setBrandData] = useState<BrandData>({
    name: 'Royal Invitations',
    logo: 'https://images.pexels.com/photos/1024991/pexels-photo-1024991.jpeg?auto=compress&cs=tinysrgb&w=250&h=250&fit=crop'
  });

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [policies, setPolicies] = useState<PolicySection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    hero: true,
    brand: true,
    services: true,
    features: true,
    portfolio: true,
    policies: true,
    contact: true
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Generic API call function
  const apiCall = async <T,>(endpoint: string): Promise<T | null> => {
    if (!API_CONFIG.enabled) {
      return null;
    }
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ApiResponse<T> = await response.json();
      if (result.success) {
        return result.data;
      } else {
        console.error('API Error:', result.message);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  };

  // Load hero data
  const loadHeroData = async () => {
    const data = await apiCall<HeroData>(API_CONFIG.endpoints.hero);
    if (data) {
      setHeroData(data);
    }
    setLoading(prev => ({ ...prev, hero: false }));
  };

  // Load brand data
  const loadBrandData = async () => {
    const data = await apiCall<BrandData>(API_CONFIG.endpoints.brand);
    if (data) {
      setBrandData(data);
    }
    setLoading(prev => ({ ...prev, brand: false }));
  };

  // Load services data
  const loadServices = async () => {
    const data = await apiCall<ServiceItem[]>(API_CONFIG.endpoints.services);
    if (data) {
      setServices(data.filter(service => service.isActive));
    } else {
      // Fallback data
      setServices([
        { id: '1', name: 'Wedding Invitations', size: 'large', isActive: true },
        { id: '2', name: 'Engagement Cards', size: 'large', isActive: true },
        { id: '3', name: 'Reception Invites', size: 'large', isActive: true },
        { id: '4', name: 'Digital Invitations', size: 'large', isActive: true },
        { id: '5', name: 'Save the Date', size: 'large', isActive: true },
        { id: '6', name: 'Complete Invitation Suite', size: 'large', isActive: true }
      ]);
    }
    setLoading(prev => ({ ...prev, services: false }));
  };

  // Load features data
  const loadFeatures = async () => {
    const data = await apiCall<Feature[]>(API_CONFIG.endpoints.features);
    if (data) {
      setFeatures(data);
    } else {
      // Fallback data
      setFeatures([
        {
          id: '1',
          icon: 'Award',
          title: 'Award-Winning Designs',
          description: 'Recipient of the "Best Wedding Stationery Design" award for three consecutive years.'
        },
        {
          id: '2',
          icon: 'Paintbrush',
          title: '100% Customization',
          description: 'Every design is created from scratch to match your unique vision and wedding theme.'
        },
        {
          id: '3',
          icon: 'Clock',
          title: 'Quick Turnaround',
          description: 'Express services available with delivery in as little as 7 days for last-minute weddings.'
        },
        {
          id: '4',
          icon: 'Gem',
          title: 'Premium Materials',
          description: 'We source only the finest papers, inks, and embellishments for luxurious results.'
        }
      ]);
    }
    setLoading(prev => ({ ...prev, features: false }));
  };

  // Load portfolio data
  const loadPortfolio = async () => {
    const data = await apiCall<PortfolioItem[]>(API_CONFIG.endpoints.portfolio);
    if (data) {
      setPortfolioItems(data);
    } else {
      // Fallback data
      setPortfolioItems([
        { id: '1', type: 'image', url: 'https://images.pexels.com/photos/1024991/pexels-photo-1024991.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Wedding Invitation Design 1' },
        { id: '2', type: 'image', url: 'https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Wedding Invitation Design 2' },
        { id: '3', type: 'image', url: 'https://images.pexels.com/photos/1024992/pexels-photo-1024992.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Wedding Invitation Design 3' },
        { id: '4', type: 'image', url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Wedding Invitation Design 4' },
        { id: '5', type: 'image', url: 'https://images.pexels.com/photos/1024994/pexels-photo-1024994.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Wedding Invitation Design 5' },
        { id: '6', type: 'image', url: 'https://images.pexels.com/photos/1024995/pexels-photo-1024995.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Wedding Invitation Design 6' }
      ]);
    }
    setLoading(prev => ({ ...prev, portfolio: false }));
  };

  // Load policies data
  const loadPolicies = async () => {
    const data = await apiCall<PolicySection[]>(API_CONFIG.endpoints.policies);
    if (data) {
      setPolicies(data);
    } else {
      // Fallback data
      setPolicies([
        {
          id: '1',
          title: 'Payment Policies',
          items: [
            '50% deposit required to begin design work, balance due before shipping',
            'We accept all major credit cards, UPI, bank transfers, and cash',
            'Payment plans available for orders over ₹25,000',
            'All prices inclusive of GST',
            'No refunds on deposits once design work has begun'
          ]
        },
        {
          id: '2',
          title: 'Order Process',
          items: [
            'Initial consultation (in-person or virtual)',
            'Design concept development (3-5 business days)',
            'Client review and revisions (2 rounds included)',
            'Final approval and production (7-10 business days)',
            'Quality check and delivery'
          ]
        },
        {
          id: '3',
          title: 'Other Information',
          items: [
            'Minimum order: 50 invitations',
            'Rush fees apply for orders needed in less than 14 days',
            'Address printing services available',
            'Custom wax seals and envelope liners optional',
            'Free sample kit available for ₹500 (refundable with order)',
            'Environmentally friendly options available'
          ]
        }
      ]);
    }
    setLoading(prev => ({ ...prev, policies: false }));
  };

  // Load contact data
  const loadContact = async () => {
    const data = await apiCall<ContactInfo>(API_CONFIG.endpoints.contact);
    if (data) {
      setContactInfo(data);
    } else {
      // Fallback data
      setContactInfo({
        address: 'Shop No. 12, Golden Plaza, Linking Road, Bandra West, Mumbai - 400050',
        phone: '+91 98765 43210',
        email: 'info@royalinvitations.com',
        hours: 'Monday - Saturday: 10:00 AM - 8:00 PM\nSunday: By appointment only',
        socialLinks: {
          email: 'mailto:info@royalinvitations.com',
          whatsapp: 'https://wa.me/919876543210',
          instagram: 'https://instagram.com/royalinvitations',
          facebook: 'https://facebook.com/royalinvitations'
        }
      });
    }
    setLoading(prev => ({ ...prev, contact: false }));
  };

  // Load all data on component mount
  useEffect(() => {
    loadHeroData();
    loadBrandData();
    loadServices();
    loadFeatures();
    loadPortfolio();
    loadPolicies();
    loadContact();
  }, []);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle service button click - can be connected to your API
  const handleServiceClick = async (serviceId: string) => {
    if (!API_CONFIG.enabled) {
      console.log(`Service ${serviceId} clicked (API disabled)`);
      return;
    }
    
    try {
      // Example API call for service interaction
      const response = await fetch(`${API_CONFIG.baseUrl}/services/${serviceId}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timestamp: new Date().toISOString() })
      });
      
      if (response.ok) {
        console.log(`Service ${serviceId} clicked and tracked`);
        // You can add analytics tracking here
      }
    } catch (error) {
      console.error('Error tracking service click:', error);
    }
  };

  // Handle back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Icon mapping for dynamic features
  const getFeatureIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Award,
      Paintbrush,
      Clock,
      Gem
    };
    return iconMap[iconName] || Award;
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="ri-loading">
      <div className="ri-spinner"></div>
    </div>
  );

  return (
    <div className="royal-invitations">
      {/* Back to Selection Button */}
      {onBackToSelection && (
        <button 
          className="ri-back-to-selection"
          onClick={onBackToSelection}
          aria-label="Back to vendor selection"
        >
          <ArrowLeft size={20} />
          <span>Back to Vendors</span>
        </button>
      )}

      {/* Header */}
      <header 
        className="ri-header"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroData.backgroundImage})`
        }}
      >
        {loading.hero ? (
          <LoadingSpinner />
        ) : (
          <div className="ri-header-content">
            <h1>{heroData.title}</h1>
            <p>{heroData.subtitle}</p>
          </div>
        )}
        
        <div className="ri-brand-container">
          {loading.brand ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="ri-brand-name">{brandData.name}</div>
              <div className="ri-brand-logo">
                <img 
                  src={brandData.logo} 
                  alt={`${brandData.name} Logo`}
                />
              </div>
            </>
          )}
        </div>
      </header>

      {/* Brand Section */}
      <section className="ri-brand-section"></section>

      {/* Services Section */}
      <section className="ri-services">
        <div className="ri-container">
          <div className="ri-section-title">
            <h2>Our Services</h2>
          </div>
          {loading.services ? (
            <LoadingSpinner />
          ) : (
            <div className="ri-services-buttons">
              {services.map((service) => (
                <button
                  key={service.id}
                  className={`ri-service-btn ri-service-btn-${service.size}`}
                  onClick={() => handleServiceClick(service.id)}
                >
                  {service.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="ri-why-choose-us">
        <div className="ri-container">
          <div className="ri-section-title">
            <h2>Why Choose Royal Invitations?</h2>
          </div>
          {loading.features ? (
            <LoadingSpinner />
          ) : (
            <div className="ri-features">
              {features.map((feature) => {
                const IconComponent = getFeatureIcon(feature.icon);
                return (
                  <div key={feature.id} className="ri-feature">
                    <div className="ri-feature-icon">
                      <IconComponent size={48} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="ri-portfolio" ref={portfolioRef}>
        <div className="ri-container">
          <div className="ri-section-title">
            <h2>Our Portfolio</h2>
          </div>
          {loading.portfolio ? (
            <LoadingSpinner />
          ) : (
            <div className="ri-portfolio-grid">
              {portfolioItems.map((item) => (
                <div key={item.id} className="ri-portfolio-item ri-image-item">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.alt} />
                  ) : (
                    <video 
                      src={item.url} 
                      poster={item.thumbnail}
                      muted 
                      loop 
                      playsInline
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Policies Section */}
      <section className="ri-policies">
        <div className="ri-container">
          <div className="ri-section-title">
            <h2>Our Policies</h2>
          </div>
          {loading.policies ? (
            <LoadingSpinner />
          ) : (
            <div className="ri-policy-content">
              {policies.map((policy) => (
                <div key={policy.id} className="ri-policy-item">
                  <h3>{policy.title}</h3>
                  <ul>
                    {policy.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="ri-contact">
        <div className="ri-container">
          <div className="ri-section-title">
            <h2>Get In Touch</h2>
          </div>
          {loading.contact ? (
            <LoadingSpinner />
          ) : contactInfo && (
            <div className="ri-contact-info">
              <h3>Contact Information</h3>
              
              <div className="ri-info-item">
                <MapPin className="ri-info-icon" size={24} />
                <div className="ri-info-text">{contactInfo.address}</div>
              </div>
              
              <div className="ri-info-item">
                <Phone className="ri-info-icon" size={24} />
                <div className="ri-info-text">{contactInfo.phone}</div>
              </div>
              
              <div className="ri-info-item">
                <Clock className="ri-info-icon" size={24} />
                <div className="ri-info-text">
                  {contactInfo.hours.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < contactInfo.hours.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div className="ri-social-links">
                <a href={contactInfo.socialLinks.email} aria-label="Email">
                  <Mail size={24} />
                </a>
                <a href={contactInfo.socialLinks.whatsapp} aria-label="WhatsApp">
                  <MessageCircle size={24} />
                </a>
                <a href={contactInfo.socialLinks.instagram} aria-label="Instagram">
                  <Instagram size={24} />
                </a>
                <a href={contactInfo.socialLinks.facebook} aria-label="Facebook">
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="ri-footer">
        <div className="ri-container">
          <p>&copy; 2025 {heroData.title}. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="ri-back-to-top" onClick={scrollToTop}>
          <ArrowUp size={24} />
        </div>
      )}
    </div>
  );
};

export default RoyalInvitations;