
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, ChevronRight, Plus, X, Upload } from 'lucide-react';

interface Container {
  id: string;
  title: string;
  subtitle?: string;
  coverImage?: string;
}

const PreWeddingEvent = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<Container[]>([
    {
      id: '1',
      title: "Before 'I DO'",
      // coverImage: '/lovable-uploads/be9b3476-303c-48ee-859d-42de003fdcef.png'
    },
    {
      id: '2',
      title: 'The Celestial Bond',
      // coverImage: '/lovable-uploads/be9b3476-303c-48ee-859d-42de003fdcef.png'
    },
    {
      id: '3',
      title: 'The Family Tree',
      // coverImage: '/lovable-uploads/be9b3476-303c-48ee-859d-42de003fdcef.png'
    },
    {
      id: '4',
      title: 'Pre-marriage Chapter',
      // coverImage: '/lovable-uploads/be9b3476-303c-48ee-859d-42de003fdcef.png'
    },
    {
      id: '5',
      title: 'Dressing the Dream',
      // coverImage: '/lovable-uploads/be9b3476-303c-48ee-859d-42de003fdcef.png'
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newContainer, setNewContainer] = useState({
    title: '',
    subtitle: '',
    coverImage: null as File | null
  });

  const handleAddContainer = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewContainer({ title: '', subtitle: '', coverImage: null });
  };

  const handleSubmitContainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContainer.title && newContainer.coverImage) {
      // TODO: Upload image to backend and get URL
      const newId = Date.now().toString();
      const imageUrl = URL.createObjectURL(newContainer.coverImage);
      
      setContainers(prev => [...prev, {
        id: newId,
        title: newContainer.title,
        subtitle: newContainer.subtitle || undefined,
        coverImage: imageUrl
      }]);
      
      handleCloseModal();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewContainer(prev => ({ ...prev, coverImage: file }));
    }
  };

  const handleViewContainer = (containerId: string) => {
    // TODO: Navigate to container detail view
    console.log('Viewing container:', containerId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-purple-600">Famiory</h1>
        </div>
      </header>

      {/* Control Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Edit3 size={20} />
          </button>

          <div className="flex items-center bg-gray-400 text-white px-6 py-3 rounded-full">
            <span className="font-medium">Pre-marriage</span>
            <ChevronRight size={20} className="ml-2" />
            <ChevronRight size={20} className="-ml-1" />
          </div>

          <button
            onClick={handleAddContainer}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Plus size={20} />
            <span>Add Container</span>
          </button>
        </div>

        {/* Containers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {containers.map((container) => (
            <div key={container.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 relative">
                {container.coverImage && (
                  <img
                    src={container.coverImage}
                    alt={container.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{container.title}</h3>
                {container.subtitle && (
                  <p className="text-sm text-gray-600 mb-3">{container.subtitle}</p>
                )}
                <button
                  onClick={() => handleViewContainer(container.id)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Container Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Container</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitContainer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image (Required)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Required)
                </label>
                <input
                  type="text"
                  value={newContainer.title}
                  onChange={(e) => setNewContainer(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={newContainer.subtitle}
                  onChange={(e) => setNewContainer(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Enter subtitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Container
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreWeddingEvent;
