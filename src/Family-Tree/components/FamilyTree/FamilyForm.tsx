import React, { useState } from 'react';
import { Users, TreePine } from 'lucide-react';

interface FamilyFormProps {
  onGenerate: (groomSiblings: number, brideSiblings: number) => void;
  initialGroomSiblings?: number;
  initialBrideSiblings?: number;
}

export const FamilyForm: React.FC<FamilyFormProps> = ({ 
  onGenerate, 
  initialGroomSiblings = 0, 
  initialBrideSiblings = 0 
}) => {
  const [groomSiblings, setGroomSiblings] = useState(initialGroomSiblings);
  const [brideSiblings, setBrideSiblings] = useState(initialBrideSiblings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(groomSiblings, brideSiblings);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200 transition-all duration-300 hover:shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Family Structure</h2>
        <p className="text-gray-600">Enter the number of siblings for each family</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              <Users className="inline w-4 h-4 mr-2" />
              Number of Groom's Siblings
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={groomSiblings}
              onChange={(e) => setGroomSiblings(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-amber-50 focus:outline-none focus:ring-3 focus:ring-amber-200 focus:border-amber-500 transition-all duration-200 text-lg"
              placeholder="0"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              <Users className="inline w-4 h-4 mr-2" />
              Number of Bride's Siblings
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={brideSiblings}
              onChange={(e) => setBrideSiblings(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-amber-50 focus:outline-none focus:ring-3 focus:ring-amber-200 focus:border-amber-500 transition-all duration-200 text-lg"
              placeholder="0"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <TreePine className="w-5 h-5" />
          <span>Generate Family Tree</span>
        </button>
      </form>
    </div>
  );
};