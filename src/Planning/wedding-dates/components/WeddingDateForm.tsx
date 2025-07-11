import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate for the back button
import { ArrowLeft } from 'lucide-react';

// Use the new path alias for cleaner imports
import DatePicker from 'src/Planning/wedding-dates/components/DatePicker';
import { WeddingDateAPI } from 'src/Planning/wedding-dates/services/api';

// Renaming the component to reflect it's a page
const WeddingDatesPage: React.FC = () => {
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [weddingTime, setWeddingTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // <-- Initialize navigate

  useEffect(() => {
    const loadWeddingDate = async () => {
      const savedData = await WeddingDateAPI.getWeddingDate();
      if (savedData) {
        setWeddingDate(savedData.date);
        if (savedData.time) {
          // Parse time string to Date object for flatpickr
          const [time, period] = savedData.time.split(' ');
          const [hours, minutes] = time.split(':');
          let hour = parseInt(hours);
          if (period === 'PM' && hour < 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;
          const timeDate = new Date();
          timeDate.setHours(hour, parseInt(minutes), 0, 0);
          setWeddingTime(timeDate);
        }
      }
    };

    loadWeddingDate();
  }, []);

  const handleSave = async () => {
    if (!weddingDate) {
      alert('Please select a wedding date');
      return;
    }

    setIsLoading(true);
    try {
      const timeString = weddingTime ? formatTime(weddingTime) : undefined;
      await WeddingDateAPI.saveWeddingDate(weddingDate, timeString);
      // The onDateSaved prop is removed as this page now manages its own state
      alert('Wedding date saved successfully!');
    } catch (error) {
      console.error('Error saving wedding date:', error);
      alert('Failed to save wedding date. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // v-- This is the new page structure --v
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <button
            onClick={() => navigate('/')} // <-- Navigate back to the dashboard
            className="flex items-center gap-2 text-amber-800 font-semibold hover:text-amber-600 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-5xl font-serif font-medium text-amber-900 mt-4">
            Finalize Wedding Dates
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Select your official wedding date and time. This will be used to
            schedule all related events.
          </p>
        </header>

        <main>
          {/* This is your original form component */}
          <div className="bg-white border-2 border-amber-100 p-8 rounded-2xl shadow-lg">
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-amber-800 mb-2">
                  Wedding Date
                </label>
                <DatePicker
                  value={weddingDate}
                  onChange={setWeddingDate}
                  placeholder="Select wedding date"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-amber-800 mb-2">
                  Wedding Time (Optional)
                </label>
                <DatePicker
                  value={weddingTime}
                  onChange={setWeddingTime}
                  placeholder="Select wedding time"
                  enableTime
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!weddingDate || isLoading}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Saving...' : 'Save Wedding Date'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WeddingDatesPage;