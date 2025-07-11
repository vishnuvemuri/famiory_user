import React from 'react';
import { FamilyTreePage } from './components/FamilyTree/FamilyTreePage';
import { FamilyData } from './types/family';

function App() {
  // Example API integration function
  const handleSaveFamilyTree = async (data: FamilyData) => {
    // Replace this with your actual API call
    console.log('Saving family tree:', data);
    
    // Example API call:
    // const response = await fetch('/api/family-tree', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="App">
      <FamilyTreePage 
        onSave={handleSaveFamilyTree}
        // apiEndpoint="/api/family-tree" // Alternative: direct API endpoint
        // initialData={{ // Optional: pre-populate with existing data
        //   groom: { name: 'John', siblings: [] },
        //   bride: { name: 'Jane', siblings: [] }
        // }}
      />
    </div>
  );
}

export default App;