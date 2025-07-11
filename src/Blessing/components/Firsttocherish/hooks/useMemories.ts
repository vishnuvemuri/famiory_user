import { useState, useEffect } from 'react';
import { Memory, MemoryFormData, ApiResponse } from '../types/memory';

// API integration hooks - replace these with your actual API calls
export const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock initial data - replace with actual API call
  useEffect(() => {
    const mockMemories: Memory[] = [
      {
        id: '1',
        title: 'Our First Kiss',
        description: 'Under the stars by the lake, time stood still as our lips met for the first time.',
        coverImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: false,
        createdAt: new Date('2023-01-15')
      },
      {
        id: '2',
        title: 'Temple Blessings',
        description: 'Seeking blessings for our journey together at the ancient temple.',
        coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: true,
        createdAt: new Date('2023-02-20')
      },
      {
        id: '3',
        title: 'Mountain Escape',
        description: 'Our first road trip to the mountains, singing along to our favorite songs.',
        coverImage: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: false,
        createdAt: new Date('2023-03-10')
      }
    ];
    setMemories(mockMemories);
  }, []);

  // API Functions - Replace these with your actual API endpoints
  const createMemory = async (formData: MemoryFormData): Promise<ApiResponse<Memory>> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/memories', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Mock implementation
      const newMemory: Memory = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        coverImage: URL.createObjectURL(formData.coverPhoto),
        isFavorite: false,
        createdAt: new Date()
      };

      setMemories(prev => [newMemory, ...prev]);
      setLoading(false);
      
      return { success: true, data: newMemory };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create memory';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const toggleFavorite = async (memoryId: string): Promise<ApiResponse<Memory>> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/memories/${memoryId}/favorite`, {
      //   method: 'PATCH'
      // });

      setMemories(prev => 
        prev.map(memory => 
          memory.id === memoryId 
            ? { ...memory, isFavorite: !memory.isFavorite }
            : memory
        )
      );

      const updatedMemory = memories.find(m => m.id === memoryId);
      return { success: true, data: updatedMemory };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update favorite';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteMemory = async (memoryId: string): Promise<ApiResponse<void>> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/memories/${memoryId}`, {
      //   method: 'DELETE'
      // });

      setMemories(prev => prev.filter(memory => memory.id !== memoryId));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete memory';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    memories,
    loading,
    error,
    createMemory,
    toggleFavorite,
    deleteMemory
  };
};