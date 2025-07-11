import React from 'react';

interface AboutSectionProps {
  logo: string;
  description: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ logo, description }) => {
  return (
    <section className="about-section">
      <div className="vendor-logo-container">
        <img src={logo} alt="Vendor Logo" className="vendor-logo" />
      </div>
      <div className="about-content">
        <h2>About Us</h2>
        <p>{description}</p>
      </div>
    </section>
  );
};

export default AboutSection;