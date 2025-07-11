import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WeddingPlanningDashboard } from './components/WeddingPlanning';
import { weddingPlanningAPI, handleSectionNavigation } from './components/WeddingPlanning/api';

// Import all page components
import WeddingDatesPage from './wedding-dates/pages/WeddingDatesPage';
import { ServiceDashboard } from './finalized-service/components/ServiceDashboard';
import { WeddingTaskDelegation } from './person-responsibility/components/WeddingTaskDelegation';
import BudgetManagementPage from './budget-management/pages/BudgetManagementPage';

function AppPlanning() {
  const [events, setEvents] = useState([]);

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await weddingPlanningAPI.getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadEvents();
  }, []);

  // Handle event creation
  const handleEventCreate = async (event) => {
    try {
      const newEvent = await weddingPlanningAPI.createEvent(event);
      setEvents(prev => [...prev, { ...event, id: newEvent.id }]);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  // Handle event deletion
  const handleEventDelete = async (eventId) => {
    try {
      await weddingPlanningAPI.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <WeddingPlanningDashboard
            initialEvents={events}
            onSectionClick={handleSectionNavigation}
            onEventCreate={handleEventCreate}
            onEventDelete={handleEventDelete}
          />
        } 
      />
      <Route path="/wedding-dates" element={<WeddingDatesPage />} />
      <Route path="/finalized-services" element={<ServiceDashboard />} />
      <Route path="/person-responsibility" element={<WeddingTaskDelegation />} />
      <Route path="/budget-management" element={<BudgetManagementPage />} />
    </Routes>
  );
}

export default AppPlanning;