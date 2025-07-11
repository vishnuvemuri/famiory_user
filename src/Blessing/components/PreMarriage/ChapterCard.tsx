import React from 'react';
import { Heart, BellRing as Ring, Camera, ClipboardList, Mail, Sparkles } from 'lucide-react';
import { Chapter } from '../../types/chapter';

interface ChapterCardProps {
  chapter: Chapter;
  onExplore: (chapterId: string) => void;
}

const iconMap = {
  heart: Heart,
  ring: Ring,
  camera: Camera,
  clipboard: ClipboardList,
  mail: Mail,
  sparkles: Sparkles,
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onExplore }) => {
  const IconComponent = iconMap[chapter.icon as keyof typeof iconMap] || Heart;

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onExplore(chapter.id);
  };

  return (
    <div className="chapter-card" data-chapter={chapter.id}>
      <div className="chapter-image">
        <img src={chapter.image} alt={chapter.title} />
        <div className="chapter-overlay">
          <IconComponent size={48} />
        </div>
      </div>
      <div className="chapter-content">
        <h3>{chapter.title}</h3>
        <p>{chapter.description}</p>
        <button onClick={handleExploreClick} className="explore-btn">
          Explore <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};