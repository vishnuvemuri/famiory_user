import { useState, useEffect } from 'react';
import { MemoryDetail, MemoryDetailFormData, MediaItem, ApiResponse } from '../types/memoryDetail';

export const useMemoryDetail = (memoryId: string) => {
  const [memoryDetail, setMemoryDetail] = useState<MemoryDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchMemoryDetail = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/memories/${memoryId}`);
        // const data = await response.json();
        
        // Mock implementation
        const mockMemoryDetail: MemoryDetail = {
          id: memoryId,
          title: 'Our First Kiss',
          date: '2023-05-20',
          time: {
            hours: '08',
            minutes: '30',
            seconds: '45'
          },
          location: 'Beach at Sunset Point',
          note: 'The moment our lips met as the sun dipped below the horizon, time seemed to stand still. The sound of waves crashing and our hearts beating in unison created a symphony I\'ll never forget.',
          mediaItems: [
            {
              id: '1',
              type: 'image',
              url: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
              thumbnail: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
            },
            {
              id: '2',
              type: 'video',
              url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
              thumbnail: 'https://images.unsplash.com/photo-1566275529824-cca6d008f3da?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
            },
            {
              id: '3',
              type: 'image',
              url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
              thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
            },
            {
              id: '4',
              type: 'image',
              url: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
              thumbnail: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
            },
            {
              id: '5',
              type: 'image',
              url: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
              thumbnail: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
            }
          ],
          createdAt: new Date('2023-05-20'),
          updatedAt: new Date()
        };

        setMemoryDetail(mockMemoryDetail);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch memory details';
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (memoryId) {
      fetchMemoryDetail();
    }
  }, [memoryId]);

  // API Functions - Replace these with your actual API endpoints
  const updateMemoryDetail = async (formData: MemoryDetailFormData): Promise<ApiResponse<MemoryDetail>> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/memories/${memoryId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Mock implementation
      if (memoryDetail) {
        const updatedMemory: MemoryDetail = {
          ...memoryDetail,
          ...formData,
          updatedAt: new Date()
        };

        setMemoryDetail(updatedMemory);
        setLoading(false);
        
        return { success: true, data: updatedMemory };
      }
      
      throw new Error('Memory not found');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update memory';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    memoryDetail,
    loading,
    error,
    updateMemoryDetail
  };
};