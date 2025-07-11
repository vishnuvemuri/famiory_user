export interface Memory {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  additionalMedia?: string[];
  isFavorite: boolean;
  createdAt: Date;
}

export interface MemoryFormData {
  title: string;
  description: string;
  coverPhoto: File;
  additionalMedia?: FileList;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}