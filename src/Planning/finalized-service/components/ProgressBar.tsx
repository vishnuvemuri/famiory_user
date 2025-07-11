import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progress-overview">
      <div className="progress-text">Services Booked</div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-percentage">{progress}% Complete</div>
    </div>
  );
};