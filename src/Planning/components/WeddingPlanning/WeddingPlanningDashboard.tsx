import React, { useState, useEffect } from 'react';
// Step 1: Import useNavigate
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, X, CalendarPlus, ExternalLink } from 'lucide-react';
import ProgressTracker from './ProgressTracker';

interface Event {
  id: string;
  name: string;
  date: string;
  location?: string;
  canceled?: boolean;
}

interface PlanningSection {
  id: string;
  title: string;
  image: string;
  onClick: () => void;
}

interface WeddingPlanningProps {
  onSectionClick?: (sectionId: string) => void;
  onEventCreate?: (event: Omit<Event, 'id'>) => Promise<void>;
  onEventDelete?: (eventId: string) => Promise<void>;
  initialEvents?: Event[];
}

const WeddingPlanningDashboard: React.FC<WeddingPlanningProps> = ({
  onSectionClick,
  onEventCreate,
  onEventDelete,
  initialEvents = []
}) => {
  // Step 2: Initialize the navigate function
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: ''
  });

  const planningSections: PlanningSection[] = [
    {
      id: 'progress',
      title: 'Progress Tracker',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      onClick: () => handleSectionClick('progress')
    },
    {
      id: 'dates',
      title: 'Finalized Dates',
      image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      onClick: () => handleSectionClick('dates')
    },
    {
      id: 'attire',
      title: 'Shopping & Wedding Attire',
      image: 'https://images.unsplash.com/photo-1519657337289-077653f724ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      onClick: () => handleSectionClick('attire')
    },
    {
      id: 'services',
      title: 'Finalized Services Detail',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      onClick: () => handleSectionClick('services')
    },
    {
      id: 'responsibilities',
      title: 'Person Responsibility',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      onClick: () => handleSectionClick('responsibilities')
    },
    {
      id: 'budget',
      title: 'Budget & Expense Management',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      onClick: () => handleSectionClick('budget')
    }
  ];

  // Step 3: Modify the handleSectionClick function
  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'progress') {
      setShowProgressTracker(true);
      return;
    }

    // This is the new navigation logic
    if (sectionId === 'dates') {
      navigate('/wedding-dates');
      return;
    }
    // This is the new navigation logic
    if (sectionId === 'services') {
    navigate('/finalized-services');
    return;
    }

    if (sectionId === 'responsibilities') {
    navigate('/person-responsibility');
    return;
    }

     if (sectionId === 'budget') {
     navigate('/budget-management');
     return;
    }
    
    if (onSectionClick) {
      onSectionClick(sectionId);
    } else {
      // Default behavior - can be customized
      console.log(`Opening ${sectionId} section`);
    }
  };

  const handleEventSubmit = async () => {
    if (!formData.name || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const newEvent: Omit<Event, 'id'> = {
      name: formData.name,
      date: formData.date,
      location: formData.location || undefined
    };

    try {
      if (onEventCreate) {
        await onEventCreate(newEvent);
      }
      
      const eventWithId: Event = {
        ...newEvent,
        id: Date.now().toString()
      };
      setEvents(prev => [...prev, eventWithId]);
      
      setFormData({ name: '', date: '', location: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleEventCancel = async (eventId: string) => {
    try {
      if (onEventDelete) {
        await onEventDelete(eventId);
      }
      
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId ? { ...event, canceled: true } : event
        )
      );
      
      setTimeout(() => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
      }, 3000);
    } catch (error) {
      console.error('Error canceling event:', error);
      alert('Failed to cancel event. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  if (showProgressTracker) {
    return (
      <ProgressTracker 
        onBack={() => setShowProgressTracker(false)}
        // Add your API integration props here
      />
    );
  }

  return (
    // ... JSX remains unchanged ...
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-white/95 backdrop-blur-sm shadow-sm">
        <a 
          href="https://www.famiory.com" 
          className="text-3xl font-serif font-bold text-amber-900 hover:text-amber-700 transition-colors"
        >
          Famiory
        </a>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-white/96 backdrop-blur-sm rounded-2xl shadow-xl p-10 min-h-[75vh]">
          <div className="flex flex-col xl:flex-row gap-12">
            
            {/* Left Section */}
            <div className="flex-1 xl:max-w-4xl">
              <div className="mb-8">
                <h1 className="text-5xl font-serif font-medium text-amber-900 mb-4 relative">
                  Planning The Big Day
                  <div className="absolute -bottom-2 left-0 w-20 h-1 bg-amber-600 rounded-full"></div>
                </h1>
                <h2 className="text-lg text-gray-600 max-w-4xl leading-relaxed">
                  From venue selection to final checklists, organize every detail of your wedding 
                  with our comprehensive planning tools.
                </h2>
              </div>

              {/* Planning Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {planningSections.map((section) => (
                  <div
                    key={section.id}
                    onClick={section.onClick}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:-translate-y-2"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600"></div>
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <p className="font-semibold text-amber-900 mb-3 text-base leading-snug">
                        {section.title}
                      </p>
                      <button className="bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-all duration-200 hover:-translate-y-0.5">
                        Step Inside
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Daily Plans */}
            <div className="xl:w-80">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h3 className="text-xl font-serif text-amber-900">Every Day Plan</h3>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-9 h-9 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-800 transition-all duration-200 hover:rotate-90 hover:scale-110 shadow-md"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <CalendarPlus size={48} className="mx-auto mb-4 text-amber-300" />
                      <p className="mb-2 font-medium">No events scheduled yet</p>
                      <p className="text-sm">Click the + button to add your first event</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`flex justify-between items-center bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600 shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-200 ${
                            event.canceled ? 'opacity-70 border-red-500' : ''
                          }`}
                        >
                          <div className="flex-1">
                            <div className={`font-semibold text-amber-900 text-sm mb-1 ${
                              event.canceled ? 'line-through' : ''
                            }`}>
                              {event.name}
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                              <Calendar size={12} className="mr-1.5" />
                              {formatDate(event.date)}
                            </div>
                            {event.location && (
                              <div className="flex items-center text-xs text-gray-600">
                                <MapPin size={12} className="mr-1.5" />
                                {event.location}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleEventCancel(event.id)}
                            className={`ml-3 p-1 rounded-full transition-all duration-200 hover:scale-125 ${
                              event.canceled 
                                ? 'text-red-500' 
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-2xl font-serif text-amber-900">Plan New Event</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200 hover:rotate-90"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="E.g., Venue Visit, Dress Fitting"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                />
              </div>
              
              <button
                onClick={handleEventSubmit}
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-800 transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg mt-6"
              >
                Schedule Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Famiory Link */}
      <a
        href="https://www.famiory.com"
        className="fixed bottom-6 right-6 bg-amber-600 text-white px-5 py-3 rounded-lg font-medium shadow-lg hover:bg-amber-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 z-40"
      >
        Back to Famiory
        <ExternalLink size={14} />
      </a>
    </div>
  );
};

export default WeddingPlanningDashboard;