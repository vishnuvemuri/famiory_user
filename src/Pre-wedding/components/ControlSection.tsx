import React from 'react';
import { Edit, ChevronRight } from 'lucide-react';
import { WeddingCategory } from '../types';

interface ControlSectionProps {
  isEditMode: boolean;
  currentCategory: WeddingCategory;
  categories: WeddingCategory[];
  onToggleEditMode: () => void;
  onNextCategory: () => void;
  onAddContainer: () => void;
}

const ControlSection: React.FC<ControlSectionProps> = ({
  isEditMode,
  currentCategory,
  onToggleEditMode,
  onNextCategory,
  onAddContainer
}) => {
  return (
    <div className="w-full flex justify-between items-center mb-6 flex-wrap gap-4">
      {/* Edit Button */}
      <button
        onClick={onToggleEditMode}
        className={`w-10 h-10 rounded-full border-none cursor-pointer flex items-center justify-center text-xl transition-colors duration-300 flex-shrink-0 ${
          isEditMode 
            ? 'bg-blue-700 text-white' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        aria-label="Edit Mode"
      >
        <Edit size={20} />
      </button>

      {/* Category Filter */}
      <div className="flex-grow flex justify-center min-w-[200px]">
        <div 
          className="bg-gray-500 rounded-full px-6 py-2.5 flex items-center justify-between w-full max-w-md cursor-pointer transition-transform duration-200 hover:scale-105"
          onClick={onNextCategory}
        >
          <span 
            className="text-lg md:text-2xl font-bold text-white px-2 whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {currentCategory}
          </span>
          <ChevronRight className="text-white font-bold ml-2" size={20} />
        </div>
      </div>

      {/* Add Container Button */}
      <button
        onClick={onAddContainer}
        className={`bg-blue-600 text-white border-none px-5 py-2.5 rounded cursor-pointer text-base transition-colors duration-300 flex-shrink-0 hover:bg-blue-700 ${
          isEditMode ? 'block' : 'hidden'
        }`}
      >
        Add Container
      </button>
    </div>
  );
};

export default ControlSection;