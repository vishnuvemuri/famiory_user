import { Folder, WeddingCategory, FolderFormData, ApiResponse } from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API client with error handling
class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  // Get folders for a specific category
  async getFolders(category: WeddingCategory): Promise<ApiResponse<Folder[]>> {
    return this.request<Folder[]>(`/folders?category=${encodeURIComponent(category)}`);
  }

  // Create new folder
  async createFolder(formData: FolderFormData, category: WeddingCategory): Promise<ApiResponse<Folder>> {
    const data = new FormData();
    data.append('coverImage', formData.coverImage);
    data.append('title', formData.title);
    data.append('category', category);
    if (formData.subtitle) {
      data.append('subtitle', formData.subtitle);
    }

    return fetch(`${API_BASE_URL}/folders`, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(data => ({ data, success: true }))
      .catch(error => ({
        data: null as Folder,
        success: false,
        message: error.message
      }));
  }

  // Delete folder
  async deleteFolder(folderId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/folders/${folderId}`, {
      method: 'DELETE',
    });
  }

  // View folder contents
  async viewFolder(folderId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/folders/${folderId}/contents`);
  }
}

export const apiClient = new ApiClient();

// Easy integration functions for your backend developer
export const integrationHelpers = {
  // Replace this single line with your API endpoint
  getFoldersEndpoint: (category: WeddingCategory) => `/folders?category=${category}`,
  
  // Replace this single line with your API endpoint  
  createFolderEndpoint: () => '/folders',
  
  // Replace this single line with your API endpoint
  deleteFolderEndpoint: (id: string) => `/folders/${id}`,
  
  // Replace this single line with your API endpoint
  viewFolderEndpoint: (id: string) => `/folders/${id}/contents`
};