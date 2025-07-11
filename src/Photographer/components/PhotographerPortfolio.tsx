import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Globe, Phone, MapPin, Instagram, Mail, MessageCircle, ArrowLeft } from 'lucide-react';
import styles from './PhotographerPortfolio.module.css';

// Types for portfolio data
interface Service {
  name: string;
  price: string;
}

interface Package {
  name: string;
  price: string;
  details: string[];
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface ContactInfo {
  website: string;
  phone: string;
  address: string;
  email: string;
  instagram: string;
  whatsapp: string;
}

interface Stats {
  yearsInBusiness: string;
  eventsDone: string;
  inHouseCrew: string;
  crewSize: string;
}

interface PhotographerData {
  id: string;
  name: string;
  title: string;
  heroImage: string;
  aboutImage: string;
  aboutText: string[];
  videoUrl: string;
  services: Service[];
  packages: Package[];
  gallery: GalleryImage[];
  stats: Stats;
  contact: ContactInfo;
}

interface PhotographerPortfolioProps {
  photographerId?: string;
  portfolioData?: PhotographerData;
  onBack?: () => void;
  // API integration props
  fetchPortfolioData?: (id: string) => Promise<PhotographerData>;
}

const PhotographerPortfolio: React.FC<PhotographerPortfolioProps> = ({
  photographerId,
  portfolioData: initialData,
  onBack,
  fetchPortfolioData
}) => {
  // State management
  const [portfolioData, setPortfolioData] = useState<PhotographerData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showPackageDetails, setShowPackageDetails] = useState<boolean>(false);

  // Default sample data
  const defaultPortfolioData: PhotographerData = {
    id: 'john-doe',
    name: 'Famiory',
    title: 'Capture the Best Moments',
    heroImage: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200',
    aboutImage: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400',
    aboutText: [
      'With over 10 years of experience in professional photography, I specialize in capturing life\'s most precious moments with creativity and passion.',
      'My approach combines technical expertise with artistic vision to create images that tell your unique story and preserve memories for generations.',
      'I believe in building relationships with my clients to understand their vision and deliver photographs that exceed expectations.',
      'From weddings to corporate events, every project receives my full attention and dedication to quality.'
    ],
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    services: [
      { name: 'Candid Photography', price: 'Rs. 7,000' },
      { name: 'Pre Wedding Shoot', price: 'Rs. 10,000' },
      { name: 'Albums', price: 'Rs. 20,000' },
      { name: 'Traditional Photography', price: 'Rs. 8,000' },
      { name: 'Traditional Video', price: 'Rs. 10,000' },
      { name: 'Cinematography', price: 'Rs. 15,000' }
    ],
    packages: [
      {
        name: 'Basic Package',
        price: 'Price On Request',
        details: [
          '2 Photographers',
          '1 Videographer',
          '2 Sessions (4 hours per session)',
          '1 Synthetic albums (150 Photos)',
          '1 Cinematic video (15 Mins)'
        ]
      }
    ],
    gallery: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
        alt: 'Wedding Photography'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600',
        alt: 'Event Photography'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
        alt: 'Corporate Event'
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600',
        alt: 'Nature Photography'
      },
      {
        id: '5',
        url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
        alt: 'Landscape'
      },
      {
        id: '6',
        url: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600',
        alt: 'Wedding Details'
      }
    ],
    stats: {
      yearsInBusiness: '10+',
      eventsDone: '500+',
      inHouseCrew: '100%',
      crewSize: '15+'
    },
    contact: {
      website: 'www.famioryphotography.com',
      phone: '+91 9876543210',
      address: '123 Studio Lane, Mumbai, India',
      email: 'contact@famiory.com',
      instagram: 'https://instagram.com/famiory',
      whatsapp: 'https://wa.me/919876543210'
    }
  };

  // Load portfolio data
  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!portfolioData && photographerId) {
        setLoading(true);
        try {
          if (fetchPortfolioData) {
            const data = await fetchPortfolioData(photographerId);
            setPortfolioData(data);
          } else {
            // Use default data if no API function provided
            setPortfolioData(defaultPortfolioData);
          }
        } catch (error) {
          console.error('Error loading portfolio data:', error);
          setPortfolioData(defaultPortfolioData);
        } finally {
          setLoading(false);
        }
      } else if (!portfolioData) {
        setPortfolioData(defaultPortfolioData);
      }
    };

    loadPortfolioData();
  }, [photographerId, fetchPortfolioData, portfolioData]);

  // Gallery navigation
  const nextSlide = () => {
    if (portfolioData?.gallery) {
      setCurrentSlide((prev) => (prev + 1) % portfolioData.gallery.length);
    }
  };

  const prevSlide = () => {
    if (portfolioData?.gallery) {
      setCurrentSlide((prev) => (prev - 1 + portfolioData.gallery.length) % portfolioData.gallery.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (portfolioData?.gallery && portfolioData.gallery.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [portfolioData?.gallery]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className={styles.error}>
        <p>Portfolio data not found</p>
        {onBack && (
          <button onClick={onBack} className={styles.backButton}>
            <ArrowLeft size={20} />
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.portfolioContainer}>
      {/* Back Button */}
      {onBack && (
        <button onClick={onBack} className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Selection
        </button>
      )}

      {/* Hero Section */}
      <section className={styles.heroSection} id="home">
        <div 
          className={styles.heroBackground}
          style={{ backgroundImage: `url(${portfolioData.heroImage})` }}
        >
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1>{portfolioData.name}</h1>
            <h2>{portfolioData.title}</h2>
            <div className={styles.photographerName}>John Doe Photography</div>
          </div>
          <button 
            className={styles.scrollDown}
            onClick={() => scrollToSection('about')}
          >
            <ChevronDown size={24} />
          </button>
        </div>
        <div className={styles.waveDivider}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection} id="about">
        <div className={styles.container}>
          <div className={styles.aboutUpper}>
            <div className={styles.aboutImageColumn}>
              <img 
                src={portfolioData.aboutImage} 
                alt="About Us" 
                className={styles.aboutImage}
              />
            </div>
            <div className={styles.aboutTextColumn}>
              <h2 className={styles.sectionTitle}>About Us</h2>
              {portfolioData.aboutText.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className={styles.aboutLower}>
            <div className={styles.leftColumn}>
              {/* Video Reel */}
              <div className={styles.reelSection}>
                <h3>Our Best Reel</h3>
                <div className={styles.reelContainer}>
                  <video controls>
                    <source src={portfolioData.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Package Section */}
              {portfolioData.packages.map((pkg, index) => (
                <div key={index} className={styles.packageSection}>
                  <div className={styles.packageHeader}>
                    <h3>{pkg.name}</h3>
                    <span>{pkg.price}</span>
                  </div>
                  <button 
                    className={`${styles.toggleBtn} ${showPackageDetails ? styles.active : ''}`}
                    onClick={() => setShowPackageDetails(!showPackageDetails)}
                  >
                    See what you get <ChevronDown size={16} />
                  </button>
                  <div className={`${styles.packageDetails} ${showPackageDetails ? styles.show : ''}`}>
                    <ul>
                      {pkg.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.rightColumn}>
              {/* Services Section */}
              <div className={styles.servicesSection}>
                <h3>Services Offered</h3>
                {portfolioData.services.map((service, index) => (
                  <div key={index} className={styles.serviceRow}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.servicePrice}>{service.price}</span>
                  </div>
                ))}
              </div>

              {/* Gallery Section */}
              <div className={styles.gallerySection}>
                <h3>Best We Captured</h3>
                <div className={styles.galleryContainer}>
                  {portfolioData.gallery.map((image, index) => (
                    <div 
                      key={image.id}
                      className={`${styles.gallerySlide} ${index === currentSlide ? styles.active : ''}`}
                    >
                      <img src={image.url} alt={image.alt} />
                    </div>
                  ))}
                  <div className={styles.galleryNav}>
                    <button className={styles.galleryNavBtn} onClick={prevSlide}>
                      <ChevronLeft size={20} />
                    </button>
                    <button className={styles.galleryNavBtn} onClick={nextSlide}>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className={styles.galleryDots}>
                    {portfolioData.gallery.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.galleryDot} ${index === currentSlide ? styles.active : ''}`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection} id="services">
        <div className={styles.container}>
          <div className={styles.whyChooseUs}>
            <h2 className={styles.sectionTitle}>Why to Choose Us?</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{portfolioData.stats.yearsInBusiness}</div>
                <div className={styles.statTitle}>Years in Business</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{portfolioData.stats.eventsDone}</div>
                <div className={styles.statTitle}>Events Done</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{portfolioData.stats.inHouseCrew}</div>
                <div className={styles.statTitle}>In House Crew</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{portfolioData.stats.crewSize}</div>
                <div className={styles.statTitle}>Crew Size</div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className={styles.contactSection}>
            <div className={styles.contactColumn}>
              <h3>Contact Us</h3>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <Globe size={20} />
                  </div>
                  <span className={styles.contactText}>{portfolioData.contact.website}</span>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <Phone size={20} />
                  </div>
                  <span className={styles.contactText}>{portfolioData.contact.phone}</span>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <MapPin size={20} />
                  </div>
                  <span className={styles.contactText}>{portfolioData.contact.address}</span>
                </div>
              </div>
              <div className={styles.socialLinks}>
                <a href={portfolioData.contact.instagram} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} />
                </a>
                <a href={`mailto:${portfolioData.contact.email}`} className={styles.socialLink}>
                  <Mail size={20} />
                </a>
                <a href={portfolioData.contact.whatsapp} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              Famiory <span>Photography</span>
            </div>
            <p className={styles.copyright}>© 2025 Famiory Photography. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PhotographerPortfolio;