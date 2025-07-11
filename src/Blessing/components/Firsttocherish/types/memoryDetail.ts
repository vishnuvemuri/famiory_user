export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title?: string;
}

export interface MemoryDetail {
  id: string;
  title: string;
  date: string;
  time: {
    hours: string;
    minutes: string;
    seconds: string;
  };
  location: string;
  note: string;
  mediaItems: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryDetailFormData {
  title: string;
  date: string;
  time: {
    hours: string;
    minutes: string;
    seconds: string;
  };
  location: string;
  note: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}