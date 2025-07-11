import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FullViewModalProps } from './types';
import styles from './BlessingInvite.module.css';

export const FullViewModal: React.FC<FullViewModalProps> = ({
  isOpen,
  memories,
  currentIndex,
  onClose,
  onPrevious,
  onNext
}) => {
  if (!isOpen || currentIndex < 0 || currentIndex >= memories.length) return null;

  const currentMemory = memories[currentIndex];

  return (
    <div className={styles['full-view-modal']}>
      <div className={styles['full-view-content']}>
        <button className={styles['close-btn']} onClick={onClose}>
          <X size={24} />
        </button>

        {currentIndex > 0 && (
          <button className={`${styles['nav-arrow']} ${styles.left}`} onClick={onPrevious}>
            <ChevronLeft size={24} />
          </button>
        )}

        {currentIndex < memories.length - 1 && (
          <button className={`${styles['nav-arrow']} ${styles.right}`} onClick={onNext}>
            <ChevronRight size={24} />
          </button>
        )}

        {currentMemory.type === 'image' ? (
          <img 
            src={currentMemory.url} 
            alt={currentMemory.text}
            className={styles['full-view-media']}
          />
        ) : (
          <video 
            src={currentMemory.url} 
            controls 
            className={styles['full-view-media']}
          />
        )}
      </div>
    </div>
  );
};