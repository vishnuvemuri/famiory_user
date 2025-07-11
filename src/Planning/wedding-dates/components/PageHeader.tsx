import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onBack }) => {
  return (
    <div className="text-center mb-10 relative px-12">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-amber-800 transition-all duration-300 hover:-translate-x-1"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}
      
      <h1 className="font-serif text-5xl text-amber-800 mb-4 relative inline-block">
        Finalized Dates
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-yellow-600"></div>
      </h1>
      
      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Track all your important wedding dates in one place. From vendor meetings to the big day itself, never miss a milestone.
      </p>
    </div>
  );
};

export default PageHeader;