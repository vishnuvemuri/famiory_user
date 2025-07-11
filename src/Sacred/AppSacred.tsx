import React from 'react';
import { useState } from 'react';
import WeddingEvents from './components/WeddingEvents';
import HerFirstStep from './components/HerFirstStep';
import CherishedExhaustion from './components/CherishedExhaustion';
import PostMarriageMemories from './components/WeddingMemories';

// Example of easy API integration
const handleEventClick = (eventId: string, action: string) => {
  console.log(`Event ${eventId} clicked with action: ${action}`);
  // Your navigation logic here
};

const handleImageUpload = (eventId: string, file: File) => {
  console.log(`Image uploaded for event ${eventId}:`, file.name);
  // Your image upload logic here
};

function App() {
  const [currentPage, setCurrentPage] = useState<'events' | 'her-first-step' | 'cherished-exhaustion' | 'post-marriage-memories'>('events');

  const handleNavigation = (eventId: string, action: string) => {
    console.log(`Event ${eventId} clicked with action: ${action}`);
    
    // Navigate to Her First Step page when Griha Pravesh is clicked
    if (eventId === 'griha-pravesh') {
      setCurrentPage('her-first-step');
    }
    
    // Navigate to Cherished Exhaustion page when Cherished Exhaustion is clicked
    if (eventId === 'cherished-exhaustion') {
      setCurrentPage('cherished-exhaustion');
    }
    
    // Navigate to Post-Marriage Memories page when Whispers & Giggles is clicked
    if (eventId === 'whispers-giggles') {
      setCurrentPage('post-marriage-memories');
    }
    
    // Your additional navigation logic here
  };

  const handleBackToEvents = () => {
    setCurrentPage('events');
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'events' ? (
        <WeddingEvents
          onEventClick={handleNavigation}
          onImageUpload={handleImageUpload}
          
          // Optional: Override default content
          headerTitle="The Beginning of a Lifetime Together"
          headerSubtitle="Hold onto the love, laughter, and warmth of your first steps together"
        />
      ) : currentPage === 'her-first-step' ? (
        <HerFirstStep
          onBack={handleBackToEvents}
          // Easy API integration - just pass your endpoint
          // apiEndpoint="https://your-api.com/her-first-step-media"
          onMediaUpload={(file, type) => {
            console.log(`${type} uploaded:`, file.name);
            // Your API call here
          }}
          onMediaDelete={(mediaId) => {
            console.log(`Media deleted:`, mediaId);
            // Your API call here
          }}
        />
      ) : currentPage === 'post-marriage-memories' ? (
        <PostMarriageMemories
          onBack={handleBackToEvents}
          // Easy API integration - just pass your endpoint
          // apiEndpoint="https://your-api.com/post-marriage-memories"
          onMemoryUpload={(file, type, tab) => {
            console.log(`${type} uploaded for ${tab}:`, file.name);
            // Your API call here
          }}
          onMemoryDelete={(memoryId, tab) => {
            console.log(`Memory deleted from ${tab}:`, memoryId);
            // Your API call here
          }}
          onFeaturedVideoSet={(memoryId, tab) => {
            console.log(`Featured video set for ${tab}:`, memoryId);
            // Your API call here
          }}
        />
      ) : (
        <CherishedExhaustion
          onBack={handleBackToEvents}
          // Easy API integration - just pass your endpoint
          // apiEndpoint="https://your-api.com/cherished-exhaustion-pairs"
          onImageUpload={(file, type, category, caption) => {
            console.log(`${type} image uploaded for ${category}:`, file.name, caption);
            // Your API call here
          }}
          onImagePairSave={(pair) => {
            console.log('Image pair saved:', pair);
            // Your API call here
          }}
          onImageDelete={(pairId) => {
            console.log('Image pair deleted:', pairId);
            // Your API call here
          }}
        />
      )}
    </div>
  );
}

export default App;