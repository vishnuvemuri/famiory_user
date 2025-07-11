import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  vendorName: string;
  heroImages: string[];
  tagline: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ vendorName, heroImages, tagline }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleControlClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="hero-section">
      <Link to="/" className="famiory-link">
        Famiory
      </Link>
      
      <div className="hero-content">
        <p className="hero-subheading">{tagline}</p>
        <h1 className="vendor-name">{vendorName}</h1>
      </div>

      <div className="hero-images-container">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${vendorName} Hero ${index + 1}`}
            className={`hero-image ${index === currentImageIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="hero-controls">
        {heroImages.map((_, index) => (
          <div
            key={index}
            className={`hero-control ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => handleControlClick(index)}
          />
        ))}
      </div>

      <div className="wave">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#f9f9f9"
            d="M0,224L48,213.3C96,203,192,181,288,160C384,139,480,117,576,128C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;