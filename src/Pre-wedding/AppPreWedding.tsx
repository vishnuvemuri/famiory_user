import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlSection from './components/ControlSection';
import FolderGrid from './components/FolderGrid';
import AddContainerModal from './components/AddContainerModal';
import { Folder, WeddingCategory, FolderFormData } from './types';
import { WEDDING_CATEGORIES, MOCK_FOLDERS } from './data/mockData';
import { apiClient } from './services/api';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentCategory = WEDDING_CATEGORIES[currentCategoryIndex];

  // Load folders for current category
  useEffect(() => {
    loadFolders(currentCategory);
  }, [currentCategory]);

  const loadFolders = async (category: WeddingCategory) => {
    setIsLoading(true);
    try {
      // Replace this with actual API call when backend is ready
      // const response = await apiClient.getFolders(category);
      // if (response.success) {
      //   setFolders(response.data);
      // }
      
      // For now, use mock data
      setFolders(MOCK_FOLDERS[category] || []);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextCategory = () => {
    const nextIndex = (currentCategoryIndex + 1) % WEDDING_CATEGORIES.length;
    setCurrentCategoryIndex(nextIndex);
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // const handleViewFolder = async (folder: Folder) => {
  //   // Replace this with actual API call when backend is ready
  //   // const response = await apiClient.viewFolder(folder.id);
  //   // if (response.success) {
  //   //   // Handle folder contents
  //   // }
    
  //   // For now, show alert
  //   alert(`Opening "${folder.name}" folder`);
  // };

  const handleViewFolder = (folder: Folder) => {
    const routeMap: Record<string, string> = {
      'Before I DO': '/pre-wedding/before',
      'The Celestial Bond': '/pre-wedding/celestial',
      'The Family Tree': '/pre-wedding/family',
      'Pre-marriage Chapter': '/pre-wedding/blessing',
      'Dressing the Dream': '/pre-wedding/dressing',
      'Digital Invitation Selection':'/planning/digital',
      'Guest List':'/planning/guest',
      'Photographers':'/planning/photographers',
      'Jewellery Shopping':'/planning/jewellery',
      'Makeup & Hairstyling Services':'/planning/makeup',
      'Venue Selection':'/planning/venue',
      'Event Planners':'/planning/eventplanner',
      'Event Anchors':'/planning/eventanchor',
      'Golden Glow':'/marriage/goldandmehendi',
      'Mehendi & Sangeet Soirée':'/marriage/goldandmehendi',
      'The Grand Arrival: Baarat':'/marriage/grandarrival',
      'Blessing & Farewell':'/marriage/blessingfarewell',
      'The Bridal Walk':'/marriage/mandap',
      'Eternal Bond: Vermala Exchange':'/marriage/mandap',
      'Sacred Union: Kanyadana & Saptapadi':'/marriage/mandap',
      'Sacred Rings':'/marriage/sacred',
      'The Reception Saree':'/marriage/saree',
      'First Steps Together':'/marriage/sacred',
      'Unwrapping Joy':'/marriage/joy',
      'The First Escape':'/marriage/escape',
      'Thanks Note to Visitor':'/marriage/gratitude'
    };

    const route = routeMap[folder.name];
    if (route) {
      navigate(route);
    } else {
      alert(`No route defined for category "${folder.category}"`);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // Replace this with actual API call when backend is ready
      // const response = await apiClient.deleteFolder(folderId);
      // if (response.success) {
      //   setFolders(prev => prev.filter(folder => folder.id !== folderId));
      // }
      
      // For now, just remove from state
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder. Please try again.');
    }
  };

  const handleAddContainer = async (formData: FolderFormData) => {
    try {
      // Replace this with actual API call when backend is ready
      // const response = await apiClient.createFolder(formData, currentCategory);
      // if (response.success) {
      //   setFolders(prev => [response.data, ...prev]);
      // }
      
      // For now, create mock folder
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: formData.title,
        subtitle: formData.subtitle,
        cover: URL.createObjectURL(formData.coverImage),
        category: currentCategory,
        createdAt: new Date()
      };
      
      setFolders(prev => [newFolder, ...prev]);
    } catch (error) {
      console.error('Error adding container:', error);
      throw error;
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-5 px-0"
      style={{ backgroundColor: '#FFFFF8', color: '#23292E' }}
    >
      {/* Main Container */}
      <div className="w-[90%] max-w-6xl flex flex-col items-center">
        <Header />
        
        <ControlSection
          isEditMode={isEditMode}
          currentCategory={currentCategory}
          categories={WEDDING_CATEGORIES}
          onToggleEditMode={handleToggleEditMode}
          onNextCategory={handleNextCategory}
          onAddContainer={() => setIsModalOpen(true)}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <FolderGrid
            folders={folders}
            isEditMode={isEditMode}
            onViewFolder={handleViewFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        )}
      </div>

      {/* Add Container Modal */}
      <AddContainerModal
        isOpen={isModalOpen}
        currentCategory={currentCategory}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddContainer}
      />
    </div>
  );
}

export default App;