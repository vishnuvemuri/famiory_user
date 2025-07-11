import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthName, getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';
import { WeddingDate } from '../types';

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  dates: WeddingDate[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  currentYear,
  dates,
  onPreviousMonth,
  onNextMonth
}) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonthNow = today.getMonth();
  const currentYearNow = today.getFullYear();

  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day: number) => {
    return dates.filter(date => {
      const eventDate = new Date(date.date);
      return eventDate.getMonth() === currentMonth && 
             eventDate.getDate() === day && 
             eventDate.getFullYear() === currentYear;
    });
  };

  const renderDay = (day: number) => {
    const isToday = day === currentDay && currentMonth === currentMonthNow && currentYear === currentYearNow;
    const events = getEventsForDay(day);

    return (
      <div 
        key={day}
        className={`bg-white rounded-lg min-h-28 p-3 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-yellow-600 ${
          isToday ? 'ring-2 ring-yellow-600' : ''
        }`}
      >
        <div className={`text-right mb-1 font-semibold text-amber-800 ${
          isToday ? 'bg-yellow-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm ml-auto' : ''
        }`}>
          {day}
        </div>
        
        {events.length > 0 && (
          <>
            <div className="w-2 h-2 bg-yellow-600 rounded-full mx-auto mb-1"></div>
            <div className="bg-yellow-50 border-l-2 border-yellow-600 p-1 rounded text-xs overflow-hidden">
              <div className="truncate font-medium text-amber-800">{events[0].title}</div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderEmptyDay = (index: number) => (
    <div 
      key={`empty-${index}`}
      className="bg-gray-50 rounded-lg min-h-28 border border-gray-200 border-dashed"
    />
  );

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-serif text-2xl font-bold text-amber-800">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onPreviousMonth}
            className="bg-gray-100 text-amber-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-colors duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={onNextMonth}
            className="bg-gray-100 text-amber-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-colors duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-amber-800 p-3 bg-yellow-50 rounded-lg">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDay }, (_, i) => renderEmptyDay(i))}
        
        {Array.from({ length: daysInMonth }, (_, i) => renderDay(i + 1))}
      </div>
    </div>
  );
};

export default Calendar;