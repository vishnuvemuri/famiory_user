import React from 'react';
import WeddingGallery from './components/WeddingGallery';

// Example API integration functions
const handleUpload = async (files: File[], eventType: string, date: string) => {
  // Example API call - replace with your actual API endpoint
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('eventType', eventType);
  formData.append('date', date);

  try {
    const response = await fetch('/api/upload-memories', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

const handleDelete = async (memoryId: string, eventType: string) => {
  // Example API call - replace with your actual API endpoint
  try {
    const response = await fetch(`/api/memories/${memoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventType })
    });
    
    if (!response.ok) {
      throw new Error('Delete failed');
    }
    
    console.log('Delete successful');
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

function App() {
  return (
    <div className="min-h-screen">
      <WeddingGallery 
        coupleNames="Dhruv & Khushi"
        pageTitle="Our Wedding Journey"
        pageSubtitle="Relive every magical moment of our special days"
        eventDates={{
          haldi: "May 15, 2023",
          mehndi: "May 16, 2023",
          sangeet: "May 17, 2023"
        }}
        onDeleteMemory={handleDelete}
        apiEndpoints={{
          upload: '/api/upload-memories',
          delete: '/api/memories',
          fetch: '/api/memories'
        }}
      />
    </div>
  );
}

export default App;