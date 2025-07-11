import React from 'react';
import { Heart, Play } from 'lucide-react';
import { Memory } from '../types/memory';

interface MemoryCardProps {
  memory: Memory;
  onToggleFavorite: (id: string) => void;
  onReliveMemory: (memory: Memory) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onToggleFavorite,
  onReliveMemory
}) => {
  return (
    <div className="memory-card">
      <div className="memory-card-cover">
        <img 
          src={memory.coverImage} 
          alt={memory.title}
          className="memory-card-image"
        />
        <button 
          className={`memory-heart ${memory.isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(memory.id)}
          aria-label={memory.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            size={20} 
            fill={memory.isFavorite ? '#ff3366' : 'none'} 
            color={memory.isFavorite ? '#ff3366' : 'rgba(255, 255, 255, 0.7)'}
          />
        </button>
      </div>
      <div className="memory-card-content">
        <h3 className="memory-card-title">{memory.title}</h3>
        <p className="memory-card-description">{memory.description}</p>
        <button 
          className="memory-card-button"
          onClick={() => onReliveMemory(memory)}
        >
          <Play size={16} />
          Relive This Moment
        </button>
      </div>
    </div>
  );
};