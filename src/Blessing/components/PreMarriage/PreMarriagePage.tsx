import React, { useEffect, useState } from 'react';
import { FloatingNav } from './FloatingNav';
import { ParallaxHero } from './ParallaxHero';
import { MemoryChapters } from './MemoryChapters';
import { FounderMessage } from './FounderMessage';
import { ElegantFooter } from './ElegantFooter';
import { Chapter, PreMarriagePageProps } from '../../types/chapter';
import './PreMarriage.css';

const defaultChapters: Chapter[] = [
  {
    id: 'first-cherish',
    title: 'First to Cherish',
    description: 'The beautiful beginning of your love story',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    icon: 'heart'
  },
  {
    id: 'yes-forever',
    title: 'From Yes to Forever',
    description: 'Your engagement and the promise of forever',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    icon: 'ring'
  },
  // {
  //   id: 'timeless-captures',
  //   title: 'Timeless Captures',
  //   description: 'Pre-wedding photos that tell your story',
  //   image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
  //   icon: 'camera'
  // },
  {
    id: 'big-day',
    title: 'The Big Day Blueprint',
    description: 'Planning your perfect wedding together',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    icon: 'clipboard'
  },
  {
    id: 'blessings',
    title: 'Blessings & Invites',
    description: 'Sharing your joy with loved ones',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    icon: 'mail',
    route: '/blessing-invite'
  },
  // {
  //   id: 'traditions',
  //   title: 'Joyful Traditions',
  //   description: 'Celebrating cultural ceremonies',
  //   image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
  //   icon: 'sparkles'
  // }
];

export const PreMarriagePage: React.FC<PreMarriagePageProps> = ({
  onNavigateToChapter,
  apiEndpoint,
  chapters = defaultChapters
}) => {
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observeElements = () => {
      const elements = document.querySelectorAll('.chapter-card, .message-container');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            setAnimatedElements(prev => new Set(prev).add(element.className));
          }
        });
      }, { threshold: 0.1 });

      elements.forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.opacity = '0';
        htmlElement.style.transform = 'translateY(30px)';
        htmlElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
      });

      return () => observer.disconnect();
    };

    const cleanup = observeElements();
    return cleanup;
  }, []);

  const handleChapterExplore = async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    
    if (chapter?.route) {
      // Navigate to specific route (like blessing-invite)
      if (onNavigateToChapter) {
        onNavigateToChapter(chapter.route);
      }
    } else {
      // Handle other chapters or API calls
      if (apiEndpoint) {
        try {
          const response = await fetch(`${apiEndpoint}/chapters/${chapterId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          console.log('Chapter data:', data);
        } catch (error) {
          console.error('Error fetching chapter:', error);
        }
      }
      
      if (onNavigateToChapter) {
        onNavigateToChapter(`/chapter/${chapterId}`);
      }
    }
  };

  const handleNavigation = (path: string) => {
    if (onNavigateToChapter) {
      onNavigateToChapter(path);
    }
  };

  return (
    <div className="pre-marriage-page">
      <FloatingNav onNavigate={handleNavigation} />
      <ParallaxHero />
      <MemoryChapters 
        chapters={chapters} 
        onChapterExplore={handleChapterExplore}
      />
      <FounderMessage />
      <ElegantFooter onNavigate={handleNavigation} />
    </div>
  );
};