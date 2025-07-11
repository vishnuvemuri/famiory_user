import React from 'react';
import MakeupHairstylistSelection from './components/MakeupHairstylistSelection';

function App() {
  const handleArtistSelect = (artist: any) => {
    console.log('Selected artist:', artist);
    // Handle artist selection - navigate to artist details, etc.
  };

  return (
    <div className="min-h-screen">
      <MakeupHairstylistSelection 
        onArtistSelect={handleArtistSelect}
        apiEndpoint="/api/artists" // Your API endpoint
      />
    </div>
  );
}

export default App;