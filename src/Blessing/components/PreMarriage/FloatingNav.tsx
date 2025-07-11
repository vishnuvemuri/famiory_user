import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface FloatingNavProps {
  onNavigate?: (path: string) => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`floating-nav ${isScrolled ? 'scrolled' : ''}`}>
      <a href="https://www.famiory.com" className="logo-link">
        <img 
          src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=100&h=40" 
          alt="Famiory" 
          className="logo"
        />
      </a>
      
      <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <button 
          className="nav-link"
          onClick={() => handleNavClick('/')}
        >
          Home
        </button>
        <button className="nav-link active">Pre-marriage</button>
        <button 
          className="nav-link"
          onClick={() => handleNavClick('/wedding')}
        >
          Wedding
        </button>
        <button 
          className="nav-link"
          onClick={() => handleNavClick('/post-wedding')}
        >
          Post-wedding
        </button>
        <button 
          className="nav-link"
          onClick={() => handleNavClick('/contact')}
        >
          Contact
        </button>
      </div>
      
      <button 
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
};