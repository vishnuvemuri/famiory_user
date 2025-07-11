import React, { useState, useRef } from 'react';
import { Camera, User } from 'lucide-react';
import { FamilyMember } from '../../types/family';

interface FamilyNodeProps {
  member: FamilyMember;
  onUpdate: (member: FamilyMember) => void;
  size?: 'small' | 'medium' | 'large';
}

export const FamilyNode: React.FC<FamilyNodeProps> = ({ 
  member, 
  onUpdate, 
  size = 'medium' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(member.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-28 h-28',
    large: 'w-32 h-32'
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onUpdate({ ...member, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSave = () => {
    onUpdate({ ...member, name });
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setName(member.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 group">
      <div 
        className={`${sizeClasses[size]} relative rounded-full border-3 border-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl`}
        onClick={() => fileInputRef.current?.click()}
      >
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-8 h-8 text-amber-600" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      
      <div className="text-center min-w-0 max-w-32">
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleKeyPress}
            className="w-full px-2 py-1 text-sm text-center border border-amber-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <p 
            className="text-sm font-medium text-gray-700 cursor-pointer hover:text-amber-700 transition-colors duration-200 truncate"
            onClick={() => setIsEditing(true)}
            title={member.name}
          >
            {member.name}
          </p>
        )}
      </div>
    </div>
  );
};