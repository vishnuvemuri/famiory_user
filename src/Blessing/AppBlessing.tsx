import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PreMarriagePage } from './components/PreMarriage';
import { BlessingInvite } from './components/BlessingInvite';
import { Memory } from './components/BlessingInvite/types';
import Cherish from './components/Firsttocherish/AppFirst';
import './indexBlessing.css'

// Component for placeholder pages
function PageComingSoon({ title }: { title: string }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl">{title} - Coming Soon</h1>
    </div>
  );
}

// Main App Component (NO <Router> here)
function AppBlessing() {
  const navigate = useNavigate();

  const handleNavigateToChapter = (path: string) => {
    navigate(path);
  };

  const handleUploadMemories = async (memories: Memory[]) => {
    console.log('Uploading memories:', memories);
    await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
  };

  const handlePinMemory = async (memoryId: string) => {
    console.log('Pinning memory:', memoryId);
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PreMarriagePage onNavigateToChapter={handleNavigateToChapter} />
        }
      />
      <Route
        path="/blessing-invite"
        element={
          <BlessingInvite
            onUploadMemories={handleUploadMemories}
            onPinMemory={handlePinMemory}
          />
        }
      />
      
      <Route
        path="/chapter/first-cherish"
        element={<Cherish />}
      />

      {/* Placeholder chapter routes */}
      <Route path="/cherish" element={<PageComingSoon title="First to Cherish" />} />
      <Route path="/yes-forever" element={<PageComingSoon title="From Yes to Forever" />} />
      <Route path="/timeless-captures" element={<PageComingSoon title="Timeless Captures" />} />
      <Route path="/big-day" element={<PageComingSoon title="The Big Day Blueprint" />} />
      <Route path="/traditions" element={<PageComingSoon title="Joyful Traditions" />} />
      <Route path="/wedding" element={<PageComingSoon title="Wedding" />} />
      <Route path="/post-wedding" element={<PageComingSoon title="Post-Wedding" />} />
      <Route path="/contact" element={<PageComingSoon title="Contact" />} />
    </Routes>
  );
}

export default AppBlessing;
