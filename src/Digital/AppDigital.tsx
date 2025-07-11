import React, { useState } from 'react';
import VendorSelection from './components/VendorSelection';
import RoyalInvitations from './components/RoyalInvitations';

function App() {
  const [currentPage, setCurrentPage] = useState<'vendor-selection' | 'vendor-portfolio'>('vendor-selection');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const handleVendorSelect = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setCurrentPage('vendor-portfolio');
  };

  const handleBackToSelection = () => {
    setCurrentPage('vendor-selection');
    setSelectedVendorId(null);
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'vendor-selection' ? (
        <VendorSelection onVendorSelect={handleVendorSelect} />
      ) : (
        <RoyalInvitations 
          vendorId={selectedVendorId} 
          onBackToSelection={handleBackToSelection} 
        />
      )}
    </div>
  );
}

export default App;