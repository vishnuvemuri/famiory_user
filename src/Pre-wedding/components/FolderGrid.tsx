import React from 'react';
import FolderCard from './FolderCard';
import { Folder } from '../types';

interface FolderGridProps {
  folders: Folder[];
  isEditMode: boolean;
  onViewFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
}

const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  isEditMode,
  onViewFolder,
  onDeleteFolder
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 w-full mt-2.5 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:gap-4 sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:gap-2.5">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          isEditMode={isEditMode}
          onView={onViewFolder}
          onDelete={onDeleteFolder}
        />
      ))}
    </div>
  );
};

export default FolderGrid;