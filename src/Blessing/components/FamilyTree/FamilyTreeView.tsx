import React from 'react';
import { FamilyNode } from './FamilyNode';
import { FamilyData, FamilyMember } from '../../types/family';

interface FamilyTreeViewProps {
  familyData: FamilyData;
  onUpdateMember: (member: FamilyMember) => void;
}

export const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({ 
  familyData, 
  onUpdateMember 
}) => {
  return (
    <div className="w-full overflow-x-auto py-8">
      <div className="min-w-[800px] mx-auto">
        {/* Parents Level */}
        <div className="flex justify-center space-x-32 mb-16">
          {/* Groom's Parents */}
          <div className="flex flex-col items-center">
            <div className="flex space-x-8 mb-4">
              <FamilyNode 
                member={familyData.groom.father} 
                onUpdate={onUpdateMember}
                size="medium"
              />
              <FamilyNode 
                member={familyData.groom.mother} 
                onUpdate={onUpdateMember}
                size="medium"
              />
            </div>
            <div className="w-20 h-0.5 bg-amber-600 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
            </div>
          </div>
          
          {/* Bride's Parents */}
          <div className="flex flex-col items-center">
            <div className="flex space-x-8 mb-4">
              <FamilyNode 
                member={familyData.bride.father} 
                onUpdate={onUpdateMember}
                size="medium"
              />
              <FamilyNode 
                member={familyData.bride.mother} 
                onUpdate={onUpdateMember}
                size="medium"
              />
            </div>
            <div className="w-20 h-0.5 bg-amber-600 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Connection Lines to Couple */}
        <div className="flex justify-center mb-8">
          <div className="w-96 h-0.5 bg-gradient-to-r from-amber-600 via-rose-400 to-amber-600 relative">
            <div className="absolute top-0 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-2 h-12 bg-amber-600"></div>
            <div className="absolute top-0 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-2 h-12 bg-amber-600"></div>
          </div>
        </div>

        {/* Couple Level */}
        <div className="flex justify-center space-x-16 mb-16 relative">
          <FamilyNode 
            member={{ ...familyData.groom, role: 'groom' }} 
            onUpdate={onUpdateMember}
            size="large"
          />
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-amber-600 to-rose-400">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-gradient-to-br from-amber-600 to-rose-400 rounded-full shadow-lg"></div>
            </div>
          </div>
          <FamilyNode 
            member={{ ...familyData.bride, role: 'bride' }} 
            onUpdate={onUpdateMember}
            size="large"
          />
        </div>

        {/* Siblings Levels */}
        {(familyData.groom.siblings.length > 0 || familyData.bride.siblings.length > 0) && (
          <div className="space-y-12">
            {/* Groom's Siblings */}
            {familyData.groom.siblings.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-amber-700 mb-4">Groom's Siblings</div>
                <div className="flex flex-wrap justify-center gap-8">
                  {familyData.groom.siblings.map((sibling) => (
                    <FamilyNode 
                      key={sibling.id}
                      member={sibling} 
                      onUpdate={onUpdateMember}
                      size="small"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bride's Siblings */}
            {familyData.bride.siblings.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-amber-700 mb-4">Bride's Siblings</div>
                <div className="flex flex-wrap justify-center gap-8">
                  {familyData.bride.siblings.map((sibling) => (
                    <FamilyNode 
                      key={sibling.id}
                      member={sibling} 
                      onUpdate={onUpdateMember}
                      size="small"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};