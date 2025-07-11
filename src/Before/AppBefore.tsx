import React from 'react';
import WeddingMemories from './components/WeddingMemories';

// Example API integration
const apiCall = async (endpoint, options = {}) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return empty data for all GET requests (no mock data)
    // Return success for POST/DELETE operations
    let mockData = [];
    
    if (options.method === 'POST' || options.method === 'DELETE') {
      mockData = { success: true };
    }
    
    return { data: mockData, success: true };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, success: false, error: error.message };
  }
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <WeddingMemories 
        apiEndpoints={{
          getAlbums: '/api/albums',
          getPhotos: '/api/photos',
          getVideos: '/api/videos',
          createAlbum: '/api/albums',
          uploadMedia: '/api/media',
          deleteMedia: '/api/media',
          updateProfile: '/api/profile'
        }}
        onApiCall={apiCall}
        coupleNames="Alex & Sam"
        profileImageUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
      />
    </div>
  );
}

export default App;