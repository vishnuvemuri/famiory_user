import React from 'react';
import { Mail, Phone, Globe } from 'lucide-react';
import { VendorContact, Location } from '../../types/vendor';

interface FooterProps {
  vendorName: string;
  website: string;
  contact: VendorContact;
  locations: Location[];
  message: string;
}

const Footer: React.FC<FooterProps> = ({ vendorName, website, contact, locations, message }) => {
  return (
    <footer className="vendor-footer">
      <div className="footer-container">
        <hr className="footer-divider" />
        
        <div className="footer-top">
          <div className="footer-item">
            <div className="jeweler-name">{vendorName}</div>
          </div>
          
          <div className="footer-item">
            <div className="website-link">
              <a href={website} target="_blank" rel="noopener noreferrer">
                <Globe className="inline w-4 h-4 mr-2" />
                {website.replace('https://', '').replace('http://', '')}
              </a>
            </div>
          </div>
          
          <div className="footer-item">
            <div className="social-media">
              <a href={contact.whatsapp} className="social-icon" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href={contact.email} className="social-icon" target="_blank" rel="noopener noreferrer" title="Email">
                <Mail className="w-6 h-6" />
              </a>
              <a href={contact.instagram} className="social-icon" target="_blank" rel="noopener noreferrer" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-item">
            <div className="contact-info">
              <Phone className="inline w-4 h-4 mr-2" />
              <span>{contact.phone}</span>
            </div>
          </div>
        </div>

        <div className="store-locations">
          <h4>Store Locations</h4>
          <div className="locations-grid">
            {locations.map((location, index) => (
              <div key={index} className="location-item">
                <strong>{location.city}</strong><br />
                {location.address}
              </div>
            ))}
          </div>
          <button className="appointment-btn">
            Book an Appointment
          </button>
        </div>

        <p className="footer-message">{message}</p>
      </div>
    </footer>
  );
};

export default Footer;