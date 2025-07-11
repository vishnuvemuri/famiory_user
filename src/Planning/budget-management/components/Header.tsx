import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="header">
      <a href="https://www.famiory.com" className="logo">
        Famiory
      </a>
      {onBack && (
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
      )}
    </header>
  );
};