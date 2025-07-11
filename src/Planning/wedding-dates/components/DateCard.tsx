import React from 'react';
import { Edit, Trash2, Heart, Shirt, GlassWater, Handshake, CalendarDays } from 'lucide-react';
import { WeddingDate } from '../types';
import { formatDate } from '../utils/dateUtils';

interface DateCardProps {
  date: WeddingDate;
  onEdit: (date: WeddingDate) => void;
  onDelete: (id: string) => void;
}

const DateCard: React.FC<DateCardProps> = ({ date, onEdit, onDelete }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "wedding":
        return <Heart size={20} />;
      case "preparation":
        return <Shirt size={20} />;
      case "celebration":
        return <GlassWater size={20} />;
      case "vendor":
        return <Handshake size={20} />;
      default:
        return <CalendarDays size={20} />;
    }
  };

  const handleDelete = () => {
    const message = date.isSample 
      ? "This is a sample date. Are you sure you want to delete it?"
      : "Are you sure you want to delete this date?";
    
    if (window.confirm(message)) {
      onDelete(date.id);
    }
  };

  return (
    <div className="bg-amber-50 border-l-4 border-yellow-600 rounded-lg p-4 flex items-start gap-4 transition-all duration-300 hover:translate-x-1 hover:shadow-md">
      <div className="bg-yellow-600 text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
        {getCategoryIcon(date.category)}
      </div>
      
      <div className="flex-grow">
        <div className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
          {date.title}
          {date.isSample && (
            <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
              Sample
            </span>
          )}
        </div>
        
        {date.description && (
          <div className="text-sm text-gray-600 mb-2 leading-relaxed">
            {date.description}
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-500">
          <CalendarDays size={12} className="mr-1" />
          {formatDate(date.date)}
          {date.time && ` at ${date.time}`}
          {date.location && (
            <>
              <span className="mx-3">•</span>
              <span>{date.location}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(date)}
          className="text-gray-400 hover:text-yellow-600 p-1 transition-colors duration-300"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 p-1 transition-colors duration-300"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default DateCard;