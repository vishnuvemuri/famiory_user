import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <a 
          href="https://www.famiory.com" 
          className="font-serif text-2xl font-bold text-amber-800 hover:text-amber-700 transition-colors"
        >
          Famiory
        </a>
      </div>
    </div>
  );
};

export default Header;