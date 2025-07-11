import { Memory, MediaFile } from '../contexts/LoveJourneyContext';

// API Configuration - Update these endpoints according to your backend
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || '/api';
const API_ENDPOINTS = {
  memories: `${API_BASE_URL}/memories`,
  upload: `${API_BASE_URL}/upload`,
  backgrounds: `${API_BASE_URL}/backgrounds`,
};

// API Service class for easy integration with your backend
export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        // Add your auth headers here
        // 'Authorization': `Bearer ${getAuthToken()}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Memory Management
  static async getMemories(): Promise<Memory[]> {
    return this.request<Memory[]>(API_ENDPOINTS.memories);
  }

  static async getMemory(id: string): Promise<Memory> {
    return this.request<Memory>(`${API_ENDPOINTS.memories}/${id}`);
  }

  static async createMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
    return this.request<Memory>(API_ENDPOINTS.memories, {
      method: 'POST',
      body: JSON.stringify(memory),
    });
  }

  static async updateMemory(id: string, memory: Partial<Memory>): Promise<Memory> {
    return this.request<Memory>(`${API_ENDPOINTS.memories}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memory),
    });
  }

  static async deleteMemory(id: string): Promise<void> {
    await this.request<void>(`${API_ENDPOINTS.memories}/${id}`, {
      method: 'DELETE',
    });
  }

  // Media Management
  static async deleteMediaFromMemory(memoryId: string, mediaId: string): Promise<Memory> {
    return this.request<Memory>(`${API_ENDPOINTS.memories}/${memoryId}/media/${mediaId}`, {
      method: 'DELETE',
    });
  }

  static async addMediaToMemory(memoryId: string, mediaFiles: MediaFile[]): Promise<Memory> {
    return this.request<Memory>(`${API_ENDPOINTS.memories}/${memoryId}/media`, {
      method: 'POST',
      body: JSON.stringify({ mediaFiles }),
    });
  }

  // File Upload
  static async uploadFile(file: File): Promise<{ url: string; id: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.upload, {
      method: 'POST',
      body: formData,
      // Add auth headers if needed
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  }

  static async uploadMultipleFiles(files: File[]): Promise<{ url: string; id: string }[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await fetch(`${API_ENDPOINTS.upload}/multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Multiple upload failed');
    }

    return await response.json();
  }

  // Background Management
  static async uploadBackground(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('background', file);

    const response = await fetch(API_ENDPOINTS.backgrounds, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Background upload failed');
    }

    return await response.json();
  }
}

// Utility functions for local development
export const mockApiService = {
  async getMemories(): Promise<Memory[]> {
    // Return mock data for development
    return [];
  },

  async getMemory(id: string): Promise<Memory | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock memory data - in real app this would fetch from server
    const mockMemory: Memory = {
      id,
      title: "Sample Memory",
      description: "This is a sample memory description",
      date: new Date().toISOString().split('T')[0],
      coverImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      mediaFiles: [],
      createdAt: new Date().toISOString(),
      category: 'proposal'
    };
    
    return mockMemory;
  },

  async createMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
  },

  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In real app, this would update the memory on the server
    return {
      id,
      title: updates.title || "Updated Memory",
      description: updates.description || "Updated description",
      date: updates.date || new Date().toISOString().split('T')[0],
      coverImage: updates.coverImage || "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      mediaFiles: updates.mediaFiles || [],
      createdAt: updates.createdAt || new Date().toISOString(),
      category: updates.category || 'proposal'
    };
  },

  async deleteMemory(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // In real app, this would delete the memory from the server
  },

  async uploadFile(file: File): Promise<{ url: string; id: string }> {
    // Convert file to data URL for development
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          id: Date.now().toString(),
        });
      };
      reader.readAsDataURL(file);
    });
  },
};

// Easy API integration helper
export const createApiIntegration = (baseUrl: string, authToken?: string) => {
  return {
    // Single line API calls for your backend developer
    getMemories: () => fetch(`${baseUrl}/memories`, {
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
    }).then(res => res.json()),
    
    getMemory: (id: string) => fetch(`${baseUrl}/memories/${id}`, {
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
    }).then(res => res.json()),
    
    updateMemory: (id: string, data: Partial<Memory>) => fetch(`${baseUrl}/memories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    
    deleteMemory: (id: string) => fetch(`${baseUrl}/memories/${id}`, {
      method: 'DELETE',
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
    }),
    
    uploadFile: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
        body: formData
      }).then(res => res.json());
    }
  };
};