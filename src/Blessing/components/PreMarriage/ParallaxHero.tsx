import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const ParallaxHero: React.FC = () => {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      
      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      }
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translateY(${scrollPosition * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.animation = 'fadeInUp 1s ease forwards 0.5s';
    }
  }, []);

  return (
    <header className="parallax-hero">
      <div 
        ref={layer1Ref}
        className="parallax-layer layer-1"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1600')`
        }}
      />
      <div 
        ref={layer2Ref}
        className="parallax-layer layer-2"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1600')`
        }}
      />
      
      <div ref={contentRef} className="hero-content">
        <h1 className="hero-title">Pre-marriage Chapter</h1>
        <p className="hero-subtitle">Your Journey to Forever Starts Here</p>
        <div className="divider">
          <svg viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0,5 Q25,10 50,5 T100,5" fill="none" stroke="#fff" strokeWidth="0.5"></path>
          </svg>
        </div>
        <p className="hero-text">Capture and cherish every beautiful moment leading to your special day</p>
      </div>
      
      <div className="scroll-indicator">
        <ChevronDown className="scroll-arrow" />
      </div>
    </header>
  );
};