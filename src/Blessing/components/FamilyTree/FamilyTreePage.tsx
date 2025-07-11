import React, { useState, useCallback } from 'react';
import { Edit3, Save, ArrowLeft } from 'lucide-react';
import { FamilyForm } from './FamilyForm';
import { FamilyTreeView } from './FamilyTreeView';
import { FamilyData, FamilyMember, FamilyTreeProps } from '../../types/family';

// Utility function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const FamilyTreePage: React.FC<FamilyTreeProps> = ({ 
  onSave, 
  initialData,
  apiEndpoint 
}) => {
  const [showForm, setShowForm] = useState(true);
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createFamilyMember = (name: string, role: FamilyMember['role']): FamilyMember => ({
    id: generateId(),
    name,
    role
  });

  const generateFamilyTree = useCallback((groomSiblings: number, brideSiblings: number) => {
    const newFamilyData: FamilyData = {
      groom: {
        id: generateId(),
        name: initialData?.groom?.name || 'Groom',
        image: initialData?.groom?.image,
        father: createFamilyMember(initialData?.groom?.father?.name || "Groom's Father", 'father'),
        mother: createFamilyMember(initialData?.groom?.mother?.name || "Groom's Mother", 'mother'),
        siblings: Array.from({ length: groomSiblings }, (_, i) => 
          createFamilyMember(`Groom's Sibling ${i + 1}`, 'sibling')
        )
      },
      bride: {
        id: generateId(),
        name: initialData?.bride?.name || 'Bride',
        image: initialData?.bride?.image,
        father: createFamilyMember(initialData?.bride?.father?.name || "Bride's Father", 'father'),
        mother: createFamilyMember(initialData?.bride?.mother?.name || "Bride's Mother", 'mother'),
        siblings: Array.from({ length: brideSiblings }, (_, i) => 
          createFamilyMember(`Bride's Sibling ${i + 1}`, 'sibling')
        )
      }
    };

    setFamilyData(newFamilyData);
    setShowForm(false);
  }, [initialData]);

  const handleUpdateMember = useCallback((updatedMember: FamilyMember) => {
    if (!familyData) return;

    setFamilyData(prevData => {
      if (!prevData) return null;

      const newData = { ...prevData };
      
      // Update groom
      if (updatedMember.role === 'groom' || updatedMember.id === prevData.groom.id) {
        newData.groom = { ...newData.groom, name: updatedMember.name, image: updatedMember.image };
      }
      // Update bride
      else if (updatedMember.role === 'bride' || updatedMember.id === prevData.bride.id) {
        newData.bride = { ...newData.bride, name: updatedMember.name, image: updatedMember.image };
      }
      // Update groom's family
      else if (updatedMember.id === prevData.groom.father.id) {
        newData.groom.father = updatedMember;
      }
      else if (updatedMember.id === prevData.groom.mother.id) {
        newData.groom.mother = updatedMember;
      }
      else {
        const groomSiblingIndex = prevData.groom.siblings.findIndex(s => s.id === updatedMember.id);
        if (groomSiblingIndex !== -1) {
          newData.groom.siblings[groomSiblingIndex] = updatedMember;
        }
      }
      
      // Update bride's family
      if (updatedMember.id === prevData.bride.father.id) {
        newData.bride.father = updatedMember;
      }
      else if (updatedMember.id === prevData.bride.mother.id) {
        newData.bride.mother = updatedMember;
      }
      else {
        const brideSiblingIndex = prevData.bride.siblings.findIndex(s => s.id === updatedMember.id);
        if (brideSiblingIndex !== -1) {
          newData.bride.siblings[brideSiblingIndex] = updatedMember;
        }
      }

      return newData;
    });
  }, [familyData]);

  const handleSave = async () => {
    if (!familyData) return;

    setIsLoading(true);
    try {
      if (onSave) {
        await onSave(familyData);
      } else if (apiEndpoint) {
        // Simple API call - replace with your actual API integration
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(familyData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save family tree');
        }
      } else {
        // Fallback: log to console
        console.log('Family Tree Data:', familyData);
      }
      
      alert('Family tree saved successfully!');
    } catch (error) {
      console.error('Error saving family tree:', error);
      alert('Failed to save family tree. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-amber-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent mb-4">
            Famiory
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Family Tree</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-rose-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create a visual representation of your family structure to help both families understand relationships
          </p>
        </div>

        {/* Content */}
        {showForm ? (
          <div className="max-w-2xl mx-auto">
            <FamilyForm 
              onGenerate={generateFamilyTree}
              initialGroomSiblings={initialData?.groom?.siblings?.length}
              initialBrideSiblings={initialData?.bride?.siblings?.length}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Tree Container */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
              {familyData && (
                <FamilyTreeView 
                  familyData={familyData} 
                  onUpdateMember={handleUpdateMember}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-amber-700 border-2 border-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Family Info</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isLoading ? 'Saving...' : 'Save Family Tree'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};