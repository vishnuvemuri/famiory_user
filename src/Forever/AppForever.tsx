import React from 'react';
import { LoveJourneyProvider } from './contexts/LoveJourneyContext';
import { ToastProvider } from './contexts/ToastContext';
import LoveJourneyPage from './components/LoveJourneyPage';
import Toast from './components/Toast';
import './styles/globals.css';

function App() {
  return (
    <ToastProvider>
      <LoveJourneyProvider>
        <div className="app">
          <LoveJourneyPage />
          <Toast />
        </div>
      </LoveJourneyProvider>
    </ToastProvider>
  );
}

export default App;