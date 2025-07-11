export interface Memory {
  id: string;
  type: 'image' | 'video';
  url: string;
  file?: File;
  text: string;
  createdAt: Date;
}

export interface BlessingInviteProps {
  onUploadMemories?: (memories: Memory[]) => Promise<void>;
  onPinMemory?: (memoryId: string) => Promise<void>;
  apiEndpoint?: string;
  initialMemories?: Memory[];
  backgroundImage?: string;
}

export interface MemoryGridProps {
  memories: Memory[];
  onMemoryHover: (memory: Memory | null) => void;
  onMemoryDoubleClick: (index: number) => void;
  onDragStart: (index: number) => void;
  onDeleteMemory: (index: number) => void;
}

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], text: string) => void;
}

export interface FullViewModalProps {
  isOpen: boolean;
  memories: Memory[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}