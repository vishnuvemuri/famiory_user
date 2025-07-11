import React from 'react';
import WeddingMemoryGallery from './components/WeddingMemoryGallery';

// Example API integration functions
const apiConfig = {
  // Your API base URL
  baseUrl: 'https://your-api-endpoint.com/api',
  
  // Authentication headers
  headers: {
    'Authorization': 'Bearer your-token-here',
    'Content-Type': 'application/json'
  }
};

// Example API integration functions
const handleUploadMedia = async (files: File[], eventType: string) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`media_${index}`, file);
  });
  formData.append('event_type', eventType);
  
  try {
    const response = await fetch(`${apiConfig.baseUrl}/upload-media`, {
      method: 'POST',
      headers: {
        'Authorization': apiConfig.headers.Authorization
      },
      body: formData
    });
    
    const data = await response.json();
    return data.media; // Expected to return array of MediaItem objects
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

const handleDeleteMedia = async (mediaId: string) => {
  try {
    await fetch(`${apiConfig.baseUrl}/media/${mediaId}`, {
      method: 'DELETE',
      headers: apiConfig.headers
    });
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

const handleUpdateCoverImage = async (eventType: string, mediaId: string) => {
  try {
    await fetch(`${apiConfig.baseUrl}/events/${eventType}/cover`, {
      method: 'PUT',
      headers: apiConfig.headers,
      body: JSON.stringify({ mediaId })
    });
  } catch (error) {
    console.error('Cover update error:', error);
    throw error;
  }
};

const handleUpdateProfile = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('profile_image', imageFile);
  
  try {
    const response = await fetch(`${apiConfig.baseUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': apiConfig.headers.Authorization
      },
      body: formData
    });
    
    const data = await response.json();
    return data.imageUrl; // Expected to return the new image URL
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

function App() {
  const handleDataChange = (data: any) => {
    // Handle data changes - save to your backend, trigger sync, etc.
    console.log('Wedding gallery data changed:', data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <WeddingMemoryGallery
        // API Integration (uncomment to enable)
        // onUploadMedia={handleUploadMedia}
        // onDeleteMedia={handleDeleteMedia}
        // onUpdateCoverImage={handleUpdateCoverImage}
        // onUpdateProfile={handleUpdateProfile}
        
        // Theme customization
        theme={{
          primary: '#8b5a2b',
          secondary: '#f0e6dd',
          accent: '#5a8b46'
        }}
        
        // Data change handler
        onDataChange={handleDataChange}
        
        // Initial data (if loading from API)
        // initialData={{
        //   memories: loadedMemories,
        //   profileImage: loadedProfileImage,
        //   coupleName: loadedCoupleName
        // }}
      />
    </div>
  );
}

export default App;