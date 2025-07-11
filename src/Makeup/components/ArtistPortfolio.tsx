import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle, Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import styles from './ArtistPortfolio.module.css';

interface Artist {
  id: number;
  name: string;
  specialization: string;
  location: string;
  price: string;
  image: string;
  rating?: number;
  experience?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  about?: string;
  services?: Service[];
  portfolio?: PortfolioItem[];
  stats?: Stats;
  socialLinks?: SocialLinks;
  videoReel?: string;
  packages?: Package[];
}

interface Service {
  name: string;
  price: string;
}

interface PortfolioItem {
  id: number;
  image: string;
  title: string;
  category: string;
}

interface Stats {
  experience: string;
  happyClients: string;
  premiumProducts: string;
  completedLooks: string;
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
}

interface ArtistPortfolioProps {
  artistId?: number;
  onBack?: () => void;
  apiEndpoint?: string;
}

const ArtistPortfolio: React.FC<ArtistPortfolioProps> = ({
  artistId = 1,
  onBack,
  apiEndpoint = '/api/artist'
}) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPackageDetails, setShowPackageDetails] = useState<{ [key: string]: boolean }>({});

  // Mock data - Replace with API call
  const mockArtist: Artist = {
    id: 1,
    name: "Sarah Johnson",
    specialization: "Makeup & Hairstyling",
    location: "Mumbai",
    price: "Rs. 15,000",
    image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.8,
    experience: "8+ years",
    phone: "+91 9876543210",
    email: "contact@sarahjohnson.com",
    address: "456 Beauty Lane, Mumbai, India",
    workingHours: "Mon-Sat: 9AM - 7PM",
    about: "With over 8 years of experience in the beauty industry, I specialize in creating stunning makeup looks and hairstyles for weddings, special events, and photoshoots. My approach combines technical expertise with artistic vision to enhance natural beauty and create looks that make you feel confident and radiant.",
    services: [
      { name: "Bridal Makeup", price: "Rs. 15,000" },
      { name: "Engagement Makeup", price: "Rs. 10,000" },
      { name: "Party Makeup", price: "Rs. 8,000" },
      { name: "Hairstyling", price: "Rs. 5,000" },
      { name: "Makeup Trial", price: "Rs. 5,000" },
      { name: "Editorial Makeup", price: "Rs. 12,000" }
    ],
    portfolio: [
      {
        id: 1,
        image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Bridal Makeup",
        category: "Wedding"
      },
      {
        id: 2,
        image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Editorial Makeup",
        category: "Fashion"
      },
      {
        id: 3,
        image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Party Makeup",
        category: "Event"
      },
      {
        id: 4,
        image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Natural Look",
        category: "Casual"
      },
      {
        id: 5,
        image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Creative Makeup",
        category: "Artistic"
      },
      {
        id: 6,
        image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Hairstyling",
        category: "Hair"
      }
    ],
    stats: {
      experience: "8+",
      happyClients: "500+",
      premiumProducts: "100%",
      completedLooks: "1000+"
    },
    socialLinks: {
      instagram: "https://instagram.com/sarahjohnson",
      facebook: "https://facebook.com/sarahjohnson",
      whatsapp: "https://wa.me/919876543210"
    },
    videoReel: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    packages: [
      {
        name: "Bridal Package",
        price: "Price On Request",
        description: "Complete bridal makeover package",
        features: [
          "Bridal Makeup Trial Session",
          "Wedding Day Makeup Application",
          "Hairstyling for Ceremony & Reception",
          "False Lashes Included",
          "Touch-up Kit Provided",
          "On-site Services Available"
        ]
      }
    ]
  };

  // API Integration - Replace mockArtist with actual API call
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        // const response = await fetch(`${apiEndpoint}/${artistId}`);
        // const data = await response.json();
        // setArtist(data);
        
        // Using mock data for now
        setTimeout(() => {
          setArtist(mockArtist);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching artist:', error);
        // Fallback to mock data
        setArtist(mockArtist);
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId, apiEndpoint]);

  const nextSlide = () => {
    if (artist?.portfolio) {
      setCurrentSlide((prev) => (prev + 1) % artist.portfolio.length);
    }
  };

  const prevSlide = () => {
    if (artist?.portfolio) {
      setCurrentSlide((prev) => (prev - 1 + artist.portfolio.length) % artist.portfolio.length);
    }
  };

  const togglePackageDetails = (packageName: string) => {
    setShowPackageDetails(prev => ({
      ...prev,
      [packageName]: !prev[packageName]
    }));
  };

  const handleBookAppointment = () => {
    if (artist?.socialLinks?.whatsapp) {
      window.open(artist.socialLinks.whatsapp, '_blank');
    }
  };

  if (loading) {
    return (
      <div className={styles.artistPortfolioLoading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading artist portfolio...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className={styles.artistPortfolioError}>
        <p>Artist not found</p>
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
    <div className={styles.artistPortfolio}>
      {/* Header Section */}
      <section className={styles.portfolioHeader}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          {onBack && (
            <button onClick={onBack} className={styles.backButton}>
              <ArrowLeft size={20} />
              Back to Artists
            </button>
          )}
          <h1>FAMIORY</h1>
          <h2>Beauty Redefined</h2>
          <div className={styles.artistNameHeader}>{artist.name} | {artist.specialization}</div>
        </div>
        <div className={styles.scrollIndicator}>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutUpper}>
            <div className={styles.profileColumn}>
              <img src={artist.image} alt={artist.name} className={styles.profileImage} />
            </div>
            <div className={styles.infoColumn}>
              <h2>About Me</h2>
              <ul>
                <li>With over 8 years of experience in the beauty industry, I specialize in creating stunning makeup looks and hairstyles for weddings, special events, and photoshoots.</li>
                <li>My approach combines technical expertise with artistic vision to enhance natural beauty and create looks that make you feel confident and radiant.</li>
                <li>I believe in personalized consultations to understand each client's unique features and preferences, ensuring results that exceed expectations.</li>
                <li>From bridal makeup to avant-garde editorial looks, every client receives my full attention and dedication to perfection.</li>
              </ul>
            </div>
          </div>

          <div className={styles.aboutLower}>
            <div className={styles.leftContent}>
              {/* Video Reel */}
              {artist.videoReel && (
                <div className={styles.reelSection}>
                  <h3>My Work Reel</h3>
                  <div className={styles.reelContainer}>
                    <video controls>
                      <source src={artist.videoReel} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              {/* Packages */}
              {artist.packages && artist.packages.map((pkg, index) => (
                <div key={index} className={styles.packageSection}>
                  <div className={styles.packageHeader}>
                    <h3>{pkg.name}</h3>
                    <span className={styles.packagePrice}>{pkg.price}</span>
                  </div>
                  <button 
                    className={`${styles.togglePackageBtn} ${showPackageDetails[pkg.name] ? styles.active : ''}`}
                    onClick={() => togglePackageDetails(pkg.name)}
                  >
                    See what you get <ChevronDown size={16} />
                  </button>
                  {showPackageDetails[pkg.name] && (
                    <div className={styles.packageDetails}>
                      <ul>
                        {pkg.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.rightContent}>
              {/* Services */}
              <div className={styles.servicesSection}>
                <h3>Services Offered</h3>
                {artist.services?.map((service, index) => (
                  <div key={index} className={styles.serviceRow}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.servicePrice}>{service.price}</span>
                  </div>
                ))}
              </div>

              {/* Portfolio Gallery */}
              {artist.portfolio && artist.portfolio.length > 0 && (
                <div className={styles.portfolioGallery}>
                  <h3>My Portfolio</h3>
                  <div className={styles.galleryContainer}>
                    <div className={styles.gallerySlide}>
                      <img 
                        src={artist.portfolio[currentSlide].image} 
                        alt={artist.portfolio[currentSlide].title}
                      />
                    </div>
                    <div className={styles.galleryNav}>
                      <button className={styles.galleryNavBtn} onClick={prevSlide}>
                        <ChevronLeft size={20} />
                      </button>
                      <button className={styles.galleryNavBtn} onClick={nextSlide}>
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className={styles.galleryDots}>
                      {artist.portfolio.map((_, index) => (
                        <button
                          key={index}
                          className={`${styles.galleryDot} ${index === currentSlide ? styles.active : ''}`}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {artist.stats && (
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            <h2>Why Choose Me?</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{artist.stats.experience}</div>
                <div className={styles.statTitle}>Years Experience</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{artist.stats.happyClients}</div>
                <div className={styles.statTitle}>Happy Brides</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{artist.stats.premiumProducts}</div>
                <div className={styles.statTitle}>Premium Products</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{artist.stats.completedLooks}</div>
                <div className={styles.statTitle}>Completed Looks</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <h3>Book Your Appointment</h3>
          <div className={styles.contactInfo}>
            {artist.phone && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Phone size={16} />
                </div>
                <span className={styles.contactText}>{artist.phone}</span>
              </div>
            )}
            {artist.email && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Mail size={16} />
                </div>
                <span className={styles.contactText}>{artist.email}</span>
              </div>
            )}
            {artist.address && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <MapPin size={16} />
                </div>
                <span className={styles.contactText}>{artist.address}</span>
              </div>
            )}
            {artist.workingHours && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Clock size={16} />
                </div>
                <span className={styles.contactText}>{artist.workingHours}</span>
              </div>
            )}
          </div>

          {artist.socialLinks && (
            <div className={styles.socialLinks}>
              {artist.socialLinks.instagram && (
                <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <Instagram size={20} />
                </a>
              )}
              {artist.socialLinks.facebook && (
                <a href={artist.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <Facebook size={20} />
                </a>
              )}
              {artist.socialLinks.whatsapp && (
                <a href={artist.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <MessageCircle size={20} />
                </a>
              )}
            </div>
          )}

          <button className={styles.appointmentBtn} onClick={handleBookAppointment}>
            <Calendar size={16} />
            BOOK APPOINTMENT
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.portfolioFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>Famiory</div>
          <p className={styles.copyright}>© 2025 Famiory. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ArtistPortfolio;