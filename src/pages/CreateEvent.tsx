
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Baby } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleWeddingClick = () => {
    navigate('/create-event/wedding');
  };

  const handleCloseClick = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button 
          onClick={handleCloseClick}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">FAMIORY</h1>
          <h2 className="text-lg text-gray-700">What kind of event would you like to create?</h2>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleWeddingClick}
            className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg p-6 flex flex-col items-center transition-colors"
          >
            <Heart size={40} className="mb-2 text-gray-700" />
            <span className="text-gray-800 font-medium">Wedding</span>
          </button>
          
          <div className="relative">
            <button
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded-lg p-6 flex flex-col items-center opacity-60 cursor-not-allowed"
            >
              <Baby size={40} className="mb-2 text-gray-500" />
              <span className="text-gray-600 font-medium">Baby Birth</span>
            </button>
            <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
