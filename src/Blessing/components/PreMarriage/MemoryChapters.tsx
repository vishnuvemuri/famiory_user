import React, { useRef, useEffect } from 'react';
import { ChapterCard } from './ChapterCard';
import { Chapter } from '../../types/chapter';

interface MemoryChaptersProps {
  chapters: Chapter[];
  onChapterExplore: (chapterId: string) => void;
}

export const MemoryChapters: React.FC<MemoryChaptersProps> = ({ chapters, onChapterExplore }) => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="memory-chapters parallax-section">
      <div 
        ref={parallaxRef}
        className="parallax-bg"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1600')`
        }}
      />
      
      <div className="section-header">
        <h2>Your Pre-Wedding Story</h2>
        <p className="section-subtitle">Relive every magical moment</p>
        <div className="floral-divider">
          <div className="floral-icon">✿</div>
        </div>
      </div>

      <div className="chapters-grid">
        {chapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            onExplore={onChapterExplore}
          />
        ))}
      </div>
    </section>
  );
};