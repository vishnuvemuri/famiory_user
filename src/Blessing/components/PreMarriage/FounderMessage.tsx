import React, { useRef, useEffect } from 'react';
import { Quote } from 'lucide-react';

export const FounderMessage: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="founder-message parallax-section">
      <div 
        ref={parallaxRef}
        className="parallax-bg"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1600')`
        }}
      />
      
      <div className="message-container">
        <Quote size={48} className="quote-icon" />
        <blockquote>
          "At Famiory, we believe every love story deserves to be beautifully preserved. 
          From the first 'yes' to the lifelong journey ahead, we're here to help you 
          cherish each precious moment."
        </blockquote>
        <p>- Famiory Team</p>
      </div>
    </section>
  );
};