import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Facebook, 
  Heart,
  Camera,
  Music,
  Film,
  Mic,
  Gem,
  Columns,
  Mail as MailIcon,
  Video,
  Palette,
  Users
} from 'lucide-react';

// API Configuration for Portfolio
const PORTFOLIO_API_CONFIG = {
  plannerDetails: (id: string) => `https://your-api.com/api/wedding-planners/${id}`,
  services: (id: string) => `https://your-api.com/api/wedding-planners/${id}/services`,
  gallery: (id: string) => `https://your-api.com/api/wedding-planners/${id}/gallery`,
  partners: (id: string) => `https://your-api.com/api/wedding-planners/${id}/partners`,
  contact: (id: string) => `https://your-api.com/api/wedding-planners/${id}/contact`
};

// Types
interface Service {
  name: string;
  description: string;
  icon: string;
}

interface Gallery {
  images: string[];
  videos: string[];
}

interface Partner {
  name: string;
  logo: string;
}

interface Contact {
  address: string;
  phone: string;
  email: string;
  website: string;
  social: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
  };
}

interface PlannerDetails {
  id: string;
  name: string;
  logo: string;
  description: string;
  services: Service[];
  gallery: Gallery;
  partners: Partner[];
  contact: Contact;
}

interface WeddingPlannerPortfolioProps {
  plannerId: string;
  onBack: () => void;
}

// Sample data for demonstration
const samplePlannerData: PlannerDetails = {
  id: '1',
  name: 'Elite Events by Sarah',
  logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
  description: 'With over 10 years of experience in creating magical wedding moments, Elite Events by Sarah specializes in luxury weddings that reflect your unique love story. We believe every couple deserves a celebration as extraordinary as their love.',
  services: [
    {
      name: 'Full Wedding Planning',
      description: 'End-to-end wedding planning from concept to execution',
      icon: 'Heart'
    },
    {
      name: 'Themed Wedding Decor',
      description: 'Custom decor to match your wedding theme perfectly',
      icon: 'Palette'
    },
    {
      name: 'Choreographers',
      description: 'Professional dance choreography for your special moments',
      icon: 'Music'
    },
    {
      name: 'Wedding Films',
      description: 'Cinematic wedding films to cherish forever',
      icon: 'Film'
    },
    {
      name: 'Entertainment Setups',
      description: 'Live bands, DJs, and performance artists',
      icon: 'Mic'
    },
    {
      name: 'Ceremony Accessories',
      description: 'Everything from mandaps to aisle decorations',
      icon: 'Gem'
    },
    {
      name: 'Ceremony Venues',
      description: 'Finding and booking the perfect venue',
      icon: 'MapPin'
    },
    {
      name: 'Stage Setups',
      description: 'Grand stage designs for your ceremonies',
      icon: 'Columns'
    },
    {
      name: 'Invitation Cards',
      description: 'Custom designed wedding invitations',
      icon: 'MailIcon'
    },
    {
      name: 'Videographers',
      description: 'Professional wedding videography services',
      icon: 'Video'
    }
  ],
  gallery: {
    images: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    videos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
    ]
  },
  partners: [
    { name: 'Grand Venues', logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Elegant Catering', logo: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Bliss Photography', logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Royal Decor', logo: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Harmony Music', logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Precious Jewelry', logo: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Classic Cars', logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Gourmet Delights', logo: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Floral Dreams', logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Luxury Linens', logo: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Crystal Lights', logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Silk Invitations', logo: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Heavenly Cakes', logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Pearl Makeup', logo: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Velvet Couture', logo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ],
  contact: {
    address: '123 Wedding Lane, Mumbai, India 400001',
    phone: '+91 9876543210',
    email: 'contact@eliteevents.com',
    website: 'www.eliteevents.com',
    social: {
      instagram: 'https://instagram.com/eliteevents',
      facebook: 'https://facebook.com/eliteevents',
      pinterest: 'https://pinterest.com/eliteevents'
    }
  }
};

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Heart,
  Palette,
  Music,
  Film,
  Mic,
  Gem,
  MapPin,
  Columns,
  MailIcon,
  Video,
  Camera,
  Users
};

const WeddingPlannerPortfolio: React.FC<WeddingPlannerPortfolioProps> = ({ plannerId, onBack }) => {
  const [plannerData, setPlannerData] = useState<PlannerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // API Integration Functions
  const fetchPlannerData = async () => {
    try {
      const [details, services, gallery, partners, contact] = await Promise.all([
        fetch(PORTFOLIO_API_CONFIG.plannerDetails(plannerId)).then(res => res.json()),
        fetch(PORTFOLIO_API_CONFIG.services(plannerId)).then(res => res.json()),
        fetch(PORTFOLIO_API_CONFIG.gallery(plannerId)).then(res => res.json()),
        fetch(PORTFOLIO_API_CONFIG.partners(plannerId)).then(res => res.json()),
        fetch(PORTFOLIO_API_CONFIG.contact(plannerId)).then(res => res.json())
      ]);

      setPlannerData({
        ...details,
        services,
        gallery,
        partners,
        contact
      });
    } catch (error) {
      console.log('Using sample data for portfolio');
      setPlannerData(samplePlannerData);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPlannerData();
      setLoading(false);
    };
    loadData();
  }, [plannerId]);

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (!plannerData) {
    return (
      <div className="portfolio-error">
        <p>Error loading portfolio data</p>
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Back Button */}
      <button onClick={onBack} className="back-button">
        <ArrowLeft size={20} />
        Back to Selection
      </button>

      {/* Hero Section */}
      <header className="portfolio-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1>Famiory</h1>
          <h2>Crafting Unforgettable Wedding Experiences</h2>
          <div className="planner-name">{plannerData.name}</div>
        </div>
        <div className="logo-container">
          <img 
            src={plannerData.logo} 
            alt={`${plannerData.name} Logo`} 
            className="planner-logo"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="portfolio-main">
        {/* About Section */}
        <section className="planner-info-section">
          <div className="planner-about">
            <h3>About Us</h3>
            <p>{plannerData.description}</p>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h3>Our Services</h3>
          <div className="services-grid">
            {plannerData.services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Heart;
              return (
                <div key={index} className="service-card">
                  <div className="service-icon">
                    <IconComponent size={40} />
                  </div>
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="gallery-section">
          <h3>Signature Wedding Moments</h3>
          <div className="gallery-grid">
            {/* Column 1 */}
            <div className="gallery-column col1">
              {plannerData.gallery.images[0] && (
                <div className="gallery-item">
                  <img src={plannerData.gallery.images[0]} alt="Wedding moment" />
                </div>
              )}
              {plannerData.gallery.videos[0] && (
                <div className="gallery-video">
                  <video controls>
                    <source src={plannerData.gallery.videos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            {/* Column 2 */}
            <div className="gallery-column col2">
              {plannerData.gallery.images[1] && (
                <div className="gallery-item">
                  <img src={plannerData.gallery.images[1]} alt="Wedding moment" />
                </div>
              )}
              {plannerData.gallery.images[2] && (
                <div className="gallery-item">
                  <img src={plannerData.gallery.images[2]} alt="Wedding moment" />
                </div>
              )}
            </div>

            {/* Column 3 */}
            <div className="gallery-column col3">
              {plannerData.gallery.videos[1] && (
                <div className="gallery-video">
                  <video controls>
                    <source src={plannerData.gallery.videos[1]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            {/* Column 4 */}
            <div className="gallery-column col4">
              {plannerData.gallery.images[3] && (
                <div className="gallery-item">
                  <img src={plannerData.gallery.images[3]} alt="Wedding moment" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="partners-section">
          <h3>Our Trusted Partners</h3>
          <div className="partners-container">
            {plannerData.partners.map((partner, index) => (
              <div key={index} className="partner-card">
                <img src={partner.logo} alt={partner.name} title={partner.name} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Contact Section */}
      <footer className="contact-section">
        <div className="contact-container">
          <h3>Get In Touch</h3>
          <div className="contact-info">
            <div className="contact-details">
              <p><MapPin size={20} /> {plannerData.contact.address}</p>
              <p><Phone size={20} /> {plannerData.contact.phone}</p>
              <p><Mail size={20} /> {plannerData.contact.email}</p>
              <p><Globe size={20} /> <a href={`https://${plannerData.contact.website}`} target="_blank" rel="noopener noreferrer">{plannerData.contact.website}</a></p>
            </div>
            <div className="social-links">
              {plannerData.contact.social.instagram && (
                <a href={plannerData.contact.social.instagram} className="social-icon" target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} />
                </a>
              )}
              {plannerData.contact.social.facebook && (
                <a href={plannerData.contact.social.facebook} className="social-icon" target="_blank" rel="noopener noreferrer">
                  <Facebook size={20} />
                </a>
              )}
              {plannerData.contact.social.pinterest && (
                <a href={plannerData.contact.social.pinterest} className="social-icon" target="_blank" rel="noopener noreferrer">
                  <Heart size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 Famiory. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WeddingPlannerPortfolio;