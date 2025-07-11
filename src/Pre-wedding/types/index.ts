export interface Folder {
  id: string;
  name: string;
  cover: string;
  subtitle?: string;
  category: WeddingCategory;
  createdAt: Date;
}

export type WeddingCategory = 'Pre-marriage' | 'Planning' | 'Marriage' | 'Post Marriage';

export interface FolderFormData {
  coverImage: File;
  title: string;
  subtitle?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}