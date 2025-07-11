import React from 'react';
import WeddingReception from './components/WeddingReception';

// Sample data - replace with your API calls
const sampleWeddingData = {
  heroImage: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  coupleNames: 'Rahul & Priya',
  groomName: 'Rahul',
  brideName: 'Priya',
  eventTitle: 'The Reception Soirée',
  eventSubtitle: 'A Night of Elegance, Love, and Celebration',
  entranceVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  specialMoments: [
    {
      id: '1',
      title: 'Center Stage',
      description: 'Receiving blessings from all our guests on the beautifully decorated stage.',
      cover: 'https://images.pexels.com/photos/1729808/pexels-photo-1729808.jpeg?auto=compress&cs=tinysrgb&w=800',
      memories: [
        {
          id: '1-1',
          type: 'image' as const,
          src: 'https://images.pexels.com/photos/1729808/pexels-photo-1729808.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'On stage with family'
        }
      ]
    },
    {
      id: '2',
      title: 'Cake Cutting',
      description: 'The sweet moment of cutting our wedding cake together.',
      cover: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=800',
      memories: [
        {
          id: '2-1',
          type: 'image' as const,
          src: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Cutting the cake together'
        }
      ]
    },
    {
      id: '3',
      title: 'Toasts & Speeches',
      description: 'Heartwarming words from our closest family and friends.',
      cover: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
      memories: [
        {
          id: '3-1',
          type: 'image' as const,
          src: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Beautiful speeches'
        }
      ]
    },
    {
      id: '4',
      title: 'Dance Floor Fun',
      description: 'Joyful celebrations with family and friends on the dance floor.',
      cover: 'https://images.pexels.com/photos/1729799/pexels-photo-1729799.jpeg?auto=compress&cs=tinysrgb&w=800',
      memories: [
        {
          id: '4-1',
          type: 'image' as const,
          src: 'https://images.pexels.com/photos/1729799/pexels-photo-1729799.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Dancing the night away'
        }
      ]
    },
    {
      id: '5',
      title: 'Family & Friends',
      description: 'Precious moments with our loved ones who made our day special.',
      cover: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800',
      memories: [
        {
          id: '5-1',
          type: 'image' as const,
          src: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'With our loved ones'
        }
      ]
    },
    {
      id: '6',
      title: 'Bouquet Toss',
      description: 'The fun tradition of tossing the bouquet to single friends.',
      cover: 'https://images.pexels.com/photos/1729803/pexels-photo-1729803.jpeg?auto=compress&cs=tinysrgb&w=800',
      memories: [
        {
          id: '6-1',
          type: 'image' as const,
          src: 'https://images.pexels.com/photos/1729803/pexels-photo-1729803.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Bouquet toss moment'
        }
      ]
    }
  ],
  candidMemories: [
    {
      id: 'c1',
      type: 'image' as const,
      src: 'https://images.pexels.com/photos/1729801/pexels-photo-1729801.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Candid moment 1'
    },
    {
      id: 'c2',
      type: 'image' as const,
      src: 'https://images.pexels.com/photos/1729800/pexels-photo-1729800.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Candid moment 2'
    }
  ],
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    email: 'contact@example.com'
  },
  copyrightText: '© 2025 Rahul & Priya\'s | Memories stored with love on Famiory | All Rights Reserved'
};

// API integration functions - replace with your actual API calls
const apiHandlers = {
  onUploadHero: async (file: File): Promise<string> => {
    // Upload hero image to your backend
    // Return the new image URL
    console.log('Uploading hero image:', file.name);
    const newUrl = URL.createObjectURL(file);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return newUrl;
  },

  onUploadEntrance: async (file: File): Promise<string> => {
    // Upload entrance media to your backend
    // Return the new media URL
    console.log('Uploading entrance media:', file.name);
    console.log('File type:', file.type);
    const newUrl = URL.createObjectURL(file);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return newUrl;
  },

  onUploadMemories: async (files: File[], category: string) => {
    // Upload memories to your backend
    // Return array of new memory objects
    console.log(`Uploading ${files.length} files to ${category}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return files.map((file, index) => ({
      id: `uploaded-${Date.now()}-${index}`,
      type: file.type.startsWith('image') ? 'image' as const : 'video' as const,
      src: URL.createObjectURL(file),
      caption: `Uploaded ${file.name}`
    }));
  },

  onDeleteMemory: async (memoryId: string, category: string): Promise<void> => {
    // Delete memory from your backend
    console.log(`Deleting memory ${memoryId} from ${category}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  onUpdateMoment: async (moment: any): Promise<void> => {
    // Update moment in your backend
    console.log('Updating moment:', moment.title);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  onDeleteMoment: async (momentId: string): Promise<void> => {
    // Delete moment from your backend
    console.log(`Deleting moment ${momentId}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  onCreateMoment: async (moment: any) => {
    // Create new moment in your backend
    console.log('Creating moment:', moment.title);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: `moment-${Date.now()}`,
      ...moment
    };
  },

  onUpdateWeddingData: async (data: any): Promise<void> => {
    // Update wedding data in your backend
    console.log('Updating wedding data:', data);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  onRefreshData: async () => {
    // Refresh all data from your backend
    console.log('Refreshing wedding data from API');
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return fresh data from your API
    return sampleWeddingData;
  }
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <WeddingReception 
        data={sampleWeddingData}
        {...apiHandlers}
      />
    </div>
  );
}

export default App;