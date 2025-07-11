import React, { useEffect } from 'react';
import { Instagram, MessageCircle, Mail, Heart } from 'lucide-react';

interface ElegantFooterProps {
  onNavigate?: (path: string) => void;
}

export const ElegantFooter: React.FC<ElegantFooterProps> = ({ onNavigate }) => {
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = currentYear.toString();
    }
  }, []);

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <footer className="elegant-footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#f8f1e9"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#f8f1e9"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#f8f1e9"></path>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="https://www.famiory.com" className="footer-logo">
              <img 
                src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=150&h=50" 
                alt="Famiory"
              />
            </a>
            <p className="footer-tagline">Preserving your love story, one chapter at a time</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="mailto:hello@famiory.com" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-column">
              <h4>Our Chapters</h4>
              <ul>
                <li><button onClick={() => handleNavClick('/first-cherish')}>First To Cherish</button></li>
                <li><button onClick={() => handleNavClick('/yes-forever')}>From Yes to Forever</button></li>
                <li><button onClick={() => handleNavClick('/timeless-captures')}>Timeless Captures</button></li>
                <li><button onClick={() => handleNavClick('/big-day')}>The Big Day Blueprint</button></li>
                <li><button onClick={() => handleNavClick('/blessing-invite')}>Blessings & Invites</button></li>
                <li><button onClick={() => handleNavClick('/traditions')}>Joyful Traditions</button></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Our Services</h4>
              <ul>
                <li><button onClick={() => handleNavClick('/wedding-planning')}>Wedding Planning</button></li>
                <li><button onClick={() => handleNavClick('/baby-registry')}>Baby Registry</button></li>
                <li><button onClick={() => handleNavClick('/gift')}>Gift</button></li>
                <li><button onClick={() => handleNavClick('/loan')}>Loan</button></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Wedding Chapters</h4>
              <ul>
                <li><button onClick={() => handleNavClick('/pre-marriage')}>Pre-marriage</button></li>
                <li><button onClick={() => handleNavClick('/wedding')}>Wedding</button></li>
                <li><button onClick={() => handleNavClick('/post-wedding')}>Post-wedding</button></li>
                <li><button onClick={() => handleNavClick('/honeymoon')}>Honeymoon</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <p>&copy; <span id="current-year"></span> Famiory. All rights reserved.</p>
          <div className="footer-credits">
            <p>Made with <Heart size={16} className="heart-icon" /> for couples in love</p>
          </div>
          <div className="legal-links">
            <button onClick={() => handleNavClick('/privacy')}>Privacy Policy</button>
            <button onClick={() => handleNavClick('/terms')}>Terms of Use</button>
          </div>
        </div>
      </div>
    </footer>
  );
};