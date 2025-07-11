import React from 'react';
import { Plus } from 'lucide-react';
import { WeddingDate } from '../types';
import DateCard from './DateCard';

interface DatesListProps {
  dates: WeddingDate[];
  onAddDate: () => void;
  onEditDate: (date: WeddingDate) => void;
  onDeleteDate: (id: string) => void;
}

const DatesList: React.FC<DatesListProps> = ({ dates, onAddDate, onEditDate, onDeleteDate }) => {
  const sortedDates = [...dates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="font-serif text-2xl font-semibold text-amber-800">
          Key Wedding Dates
        </h2>
        <button
          onClick={onAddDate}
          className="bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-amber-800 transition-all duration-300 hover:-translate-y-1"
        >
          <Plus size={16} />
          Add Date
        </button>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No dates added yet. Click "Add Date" to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedDates.map((date) => (
            <DateCard
              key={date.id}
              date={date}
              onEdit={onEditDate}
              onDelete={onDeleteDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DatesList;