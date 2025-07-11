import { Folder, WeddingCategory } from '../types';

export const WEDDING_CATEGORIES: WeddingCategory[] = [
  'Pre-marriage',
  'Planning', 
  'Marriage',
  'Post Marriage'
];

export const MOCK_FOLDERS: Record<WeddingCategory, Folder[]> = {
  'Pre-marriage': [
    {
      id: '1',
      name: "Before I DO",
      cover: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Pre-marriage',
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'The Celestial Bond',
      cover: 'https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Pre-marriage',
      createdAt: new Date('2024-01-02')
    },
    {
      id: '3',
      name: 'The Family Tree',
      cover: 'https://images.pexels.com/photos/1024966/pexels-photo-1024966.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Pre-marriage',
      createdAt: new Date('2024-01-03')
    },
    {
      id: '4',
      name: 'Pre-marriage Chapter',
      cover: 'https://images.pexels.com/photos/1128783/pexels-photo-1128783.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Pre-marriage',
      createdAt: new Date('2024-01-04')
    },
    {
      id: '5',
      name: 'Dressing the Dream',
      cover: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Pre-marriage',
      createdAt: new Date('2024-01-05')
    }
  ],
  'Planning': [
    {
      id: '6',
      name: 'Digital Invitation Selection',
      cover: 'https://images.pexels.com/photos/3342739/pexels-photo-3342739.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Planning',
      createdAt: new Date('2024-02-01')
    },
    {
      id: '7',
      name: 'Guest List',
      cover: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Planning',
      createdAt: new Date('2024-02-02')
    },
    {
      id: '8',
      name: 'Photographers',
      cover: 'https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Planning',
      createdAt: new Date('2024-02-03')
    },
    {
      id: '9',
      name: 'Jewellery Shopping',
      cover: 'https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Planning',
      createdAt: new Date('2024-02-04')
    },
    {
      id: '10',
      name: 'Makeup & Hairstyling Services',
      cover: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Planning',
      createdAt: new Date('2024-02-05')
    },
    {
      id: '11',
      name: 'Venue Selection',
      cover: 'https://images.pexels.com/photos/1024958/pexels-photo-1024958.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Planning',
      createdAt: new Date('2024-02-06')
    },
    {
      id: '12',
      name: 'Event Planners',
      cover: 'https://images.pexels.com/photos/1024959/pexels-photo-1024959.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Planning',
      createdAt: new Date('2024-02-07')
    },
    {
      id: '13',
      name: 'Event Anchors',
      cover: 'https://images.pexels.com/photos/1024961/pexels-photo-1024961.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Planning',
      createdAt: new Date('2024-02-08')
    }
  ],
  'Marriage': [
    {
      id: '14',
      name: 'Golden Glow',
      cover: 'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-01')
    },
    {
      id: '15',
      name: 'Mehendi & Sangeet Soirée',
      cover: 'https://images.pexels.com/photos/3992657/pexels-photo-3992657.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-02')
    },
    {
      id: '16',
      name: 'The Grand Arrival: Baarat',
      cover: 'https://images.pexels.com/photos/1024968/pexels-photo-1024968.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-03')
    },
    {
      id: '17',
      name: 'Sacred Vows',
      cover: 'https://images.pexels.com/photos/1167352/pexels-photo-1167352.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-04')
    },
    {
      id: '18',
      name: 'The Bridal Walk',
      cover: 'https://images.pexels.com/photos/1024969/pexels-photo-1024969.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-05')
    },
    {
      id: '19',
      name: 'Eternal Bond: Vermala Exchange',
      cover: 'https://images.pexels.com/photos/1167356/pexels-photo-1167356.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-06')
    },
    {
      id: '20',
      name: 'Sacred Union: Kanyadana & Saptapadi',
      cover: 'https://images.pexels.com/photos/1024970/pexels-photo-1024970.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-07')
    },
    {
      id: '21',
      name: 'Blessing & Farewell',
      cover: 'https://images.pexels.com/photos/1167357/pexels-photo-1167357.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-08')
    },
    {
      id: '22',
      name: 'The Playful Chase',
      cover: 'https://images.pexels.com/photos/1024971/pexels-photo-1024971.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Marriage',
      createdAt: new Date('2024-03-09')
    }
  ],
  'Post Marriage': [
    {
      id: '23',
      name: 'First Steps Together',
      cover: 'https://images.pexels.com/photos/1167358/pexels-photo-1167358.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-01')
    },
    {
      id: '24',
      name: 'Sacred Rings',
      cover: 'https://images.pexels.com/photos/1024972/pexels-photo-1024972.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-02')
    },
    {
      id: '25',
      name: 'The Reception Saree',
      cover: 'https://images.pexels.com/photos/1167359/pexels-photo-1167359.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-03')
    },
    {
      id: '26',
      name: 'The First Night',
      cover: 'https://images.pexels.com/photos/1024973/pexels-photo-1024973.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-04')
    },
    {
      id: '27',
      name: 'Love & Laughter',
      cover: 'https://images.pexels.com/photos/1167360/pexels-photo-1167360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-05')
    },
    {
      id: '28',
      name: 'Unwrapping Joy',
      cover: 'https://images.pexels.com/photos/1024974/pexels-photo-1024974.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-06')
    },
    {
      id: '29',
      name: 'The Wedding Storybook',
      cover: 'https://images.pexels.com/photos/1167361/pexels-photo-1167361.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-07')
    },
    {
      id: '30',
      name: 'Thanks Note to Visitor',
      cover: 'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-08')
    },
    {
      id: '31',
      name: 'The First Escape',
      cover: 'https://images.pexels.com/photos/1167362/pexels-photo-1167362.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      category: 'Post Marriage',
      createdAt: new Date('2024-04-09')
    }
  ]
};