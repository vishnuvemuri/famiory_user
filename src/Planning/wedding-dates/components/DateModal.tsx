import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DatePicker from './DatePicker';
import { WeddingDate } from '../types';

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: Omit<WeddingDate, 'id'>) => void;
  editingDate?: WeddingDate | null;
}

const DateModal: React.FC<DateModalProps> = ({ isOpen, onClose, onSave, editingDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<WeddingDate['category']>('wedding');

  useEffect(() => {
    if (editingDate) {
      setTitle(editingDate.title);
      setDescription(editingDate.description || '');
      setDate(editingDate.date);
      if (editingDate.time) {
        // Parse time string to Date object for flatpickr
        const [timeStr, period] = editingDate.time.split(' ');
        const [hours, minutes] = timeStr.split(':');
        let hour = parseInt(hours);
        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        const timeDate = new Date();
        timeDate.setHours(hour, parseInt(minutes), 0, 0);
        setTime(timeDate);
      } else {
        setTime(null);
      }
      setLocation(editingDate.location || '');
      setCategory(editingDate.category);
    } else {
      resetForm();
    }
  }, [editingDate, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(null);
    setTime(null);
    setLocation('');
    setCategory('wedding');
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for this date');
      return;
    }
    
    if (!date) {
      alert('Please select a date');
      return;
    }

    const timeString = time ? formatTime(time) : undefined;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: timeString,
      location: location.trim() || undefined,
      category,
      isSample: false
    });

    resetForm();
    onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h3 className="font-serif text-2xl text-amber-800 font-semibold">
            {editingDate ? 'Edit Date' : 'Add Important Date'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Dress Fitting, Catering Tasting"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this date"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 outline-none transition-all duration-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Date
              </label>
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Time (Optional)
              </label>
              <DatePicker
                value={time}
                onChange={setTime}
                placeholder="Select time"
                enableTime
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as WeddingDate['category'])}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 outline-none transition-all duration-300"
            >
              <option value="wedding">Wedding</option>
              <option value="preparation">Preparation</option>
              <option value="celebration">Celebration</option>
              <option value="vendor">Vendor Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-amber-800 text-amber-800 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-yellow-600 text-white rounded-full font-semibold hover:bg-amber-800 transition-all duration-300 hover:-translate-y-1"
          >
            Save Date
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateModal;