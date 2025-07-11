export const NAVIGATION_ITEMS = [
  { id: 'proposal', label: 'Proposal Story' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'family', label: 'Family Celebration' },
  { id: 'party', label: 'Engagement Party' },
] as const;

export const MEMORY_CATEGORIES = {
  proposal: 'Proposal Story',
  engagement: 'Engagement',
  family: 'Family Celebration',
  party: 'Engagement Party',
} as const;

export const DEFAULT_IMAGES = {
  backgroundImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  placeholderMemory: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
} as const;

export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  acceptedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
} as const;