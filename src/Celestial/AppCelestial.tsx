import React from 'react';
import VedicAstrologyForm from './components/VedicAstrologyForm';

function App() {
  // Example of how to use the component with custom API handlers
  const handleGroomSubmit = async (data: any) => {
    console.log('Groom data:', data);
    // Your custom API logic here
    // await fetch('/api/groom-analysis', { method: 'POST', body: JSON.stringify(data) });
  };

  const handleBrideSubmit = async (data: any) => {
    console.log('Bride data:', data);
    // Your custom API logic here
    // await fetch('/api/bride-analysis', { method: 'POST', body: JSON.stringify(data) });
  };

  return (
    <div className="min-h-screen">
      <VedicAstrologyForm 
        onGroomSubmit={handleGroomSubmit}
        onBrideSubmit={handleBrideSubmit}
        apiEndpoint="/api/analyze-kundali"
      />
    </div>
  );
}

export default App;