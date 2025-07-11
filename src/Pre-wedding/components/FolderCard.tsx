import React from 'react';
import { X } from 'lucide-react';
import { Folder } from '../types';

interface FolderCardProps {
  folder: Folder;
  isEditMode: boolean;
  onView: (folder: Folder) => void;
  onDelete: (folderId: string) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  isEditMode,
  onView,
  onDelete
}) => {
  const handleView = () => {
    onView(folder);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      onDelete(folder.id);
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative flex flex-col aspect-[3/4]">
      {/* Delete Button */}
      {isEditMode && (
        <button
          onClick={handleDelete}
          className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full border-none cursor-pointer z-10 p-0 bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors duration-200"
          aria-label="Delete folder"
        >
          <X size={16} className="text-white" />
        </button>
      )}

      {/* Image Container */}
      <div className="flex-1 overflow-hidden">
        <img
          src={folder.cover}
          alt={folder.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Folder Info */}
      <div className="p-4 bg-white">
        <h3 
          className="text-lg mb-1 whitespace-nowrap overflow-hidden text-ellipsis text-gray-800"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {folder.name}
        </h3>
        
        {folder.subtitle && (
          <p className="text-gray-600 text-sm mb-2.5 line-clamp-2">
            {folder.subtitle}
          </p>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={handleView}
            className="bg-blue-600 text-white border-none px-4 py-2 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-blue-700"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;