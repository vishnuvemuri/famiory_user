import React from 'react';
import { Trash2 } from 'lucide-react';
import { MemoryGridProps } from './types';
import styles from './BlessingInvite.module.css';

export const MemoryGrid: React.FC<MemoryGridProps> = ({
  memories,
  onMemoryHover,
  onMemoryDoubleClick,
  onDragStart,
  onDeleteMemory
}) => {
  const handleDeleteClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this memory?')) {
      onDeleteMemory(index);
    }
  };

  return (
    <div className={styles['memory-grid']}>
      {memories.map((memory, index) => (
        <div
          key={memory.id}
          className={styles['grid-item']}
          draggable
          onMouseEnter={() => onMemoryHover(memory)}
          onMouseLeave={() => onMemoryHover(null)}
          onDoubleClick={() => onMemoryDoubleClick(index)}
          onDragStart={() => onDragStart(index)}
        >
          {memory.type === 'image' ? (
            <img src={memory.url} alt={memory.text} />
          ) : (
            <video src={memory.url} />
          )}
          <button
            className={styles['delete-button']}
            onClick={(e) => handleDeleteClick(e, index)}
            title="Delete memory"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};