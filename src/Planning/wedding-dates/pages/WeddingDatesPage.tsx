import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PageHeader from '../components/PageHeader';
import WeddingDateForm from '../components/WeddingDateForm';
import CountdownTimer from '../components/CountdownTimer';
import Calendar from '../components/Calendar';
import DatesList from '../components/DatesList';
import DateModal from '../components/DateModal';
import { WeddingDate } from '../types';
import { WeddingDateAPI } from '../services/api';
import { createSampleDates } from '../utils/dateUtils';

const WeddingDatesPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [weddingTime, setWeddingTime] = useState<string | undefined>();
  const [dates, setDates] = useState<WeddingDate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<WeddingDate | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Load wedding date
    const savedWeddingDate = await WeddingDateAPI.getWeddingDate();
    if (savedWeddingDate) {
      setWeddingDate(savedWeddingDate.date);
      setWeddingTime(savedWeddingDate.time);
    }

    // Load all dates
    const savedDates = await WeddingDateAPI.getWeddingDates();
    setDates(savedDates);
  };

  const handleWeddingDateSaved = async (date: Date, time?: string) => {
    setWeddingDate(date);
    setWeddingTime(time);

    // Generate sample dates if no dates exist yet
    const existingDates = await WeddingDateAPI.getWeddingDates();
    if (existingDates.length === 0) {
      const sampleDates = createSampleDates(date, time);
      
      // Save sample dates
      for (const sampleDate of sampleDates) {
        await WeddingDateAPI.createWeddingDate(sampleDate);
      }
      
      // Reload dates
      const updatedDates = await WeddingDateAPI.getWeddingDates();
      setDates(updatedDates);
    }
  };

  const handleAddDate = () => {
    setEditingDate(null);
    setIsModalOpen(true);
  };

  const handleEditDate = (date: WeddingDate) => {
    setEditingDate(date);
    setIsModalOpen(true);
  };

  const handleDeleteDate = async (id: string) => {
    await WeddingDateAPI.deleteWeddingDate(id);
    const updatedDates = await WeddingDateAPI.getWeddingDates();
    setDates(updatedDates);
  };

  const handleSaveDate = async (dateData: Omit<WeddingDate, 'id'>) => {
    if (editingDate) {
      // Update existing date
      await WeddingDateAPI.updateWeddingDate(editingDate.id, dateData);
    } else {
      // Create new date
      await WeddingDateAPI.createWeddingDate(dateData);
    }

    // Reload dates
    const updatedDates = await WeddingDateAPI.getWeddingDates();
    setDates(updatedDates);
    setIsModalOpen(false);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
        }}
      />
      
      <div className="relative z-10">
        <Header />
        
        <div className="max-w-6xl mx-auto px-6 py-8">
          <PageHeader />
          
          {/* Wedding Date Form */}
          <WeddingDateForm onDateSaved={handleWeddingDateSaved} />
          
          {/* Countdown Timer */}
          <CountdownTimer targetDate={weddingDate} targetTime={weddingTime} />
          
          {/* Calendar */}
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            dates={dates}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
          />
          
          {/* Dates List */}
          <DatesList
            dates={dates}
            onAddDate={handleAddDate}
            onEditDate={handleEditDate}
            onDeleteDate={handleDeleteDate}
          />
        </div>
      </div>

      {/* Date Modal */}
      <DateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDate}
        editingDate={editingDate}
      />
    </div>
  );
};

export default WeddingDatesPage;