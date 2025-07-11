import { VendorData } from '../types/vendor';

export const sampleVendorData: VendorData = {
  id: 'the-royal-attire',
  name: 'The Royal Attire',
  tagline: 'Elegance Redefined',
  description: 'The Royal Attire, established in 1995, is Mumbai\'s premier destination for bridal fashion. Renowned for exquisite lehengas that blend traditional craftsmanship with contemporary elegance, our collections cater to every bride\'s unique vision.',
  logo: 'https://images.unsplash.com/photo-1590845947676-fa2576f401d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  heroImages: [
    'https://images.unsplash.com/photo-1590845947676-fa2576f401d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ],
  collections: [
    {
      image: 'https://images.unsplash.com/photo-1590845947676-fa2576f401d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Bridal Lehengas'
    },
    {
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Reception Gowns'
    },
    {
      image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Cocktail Dresses'
    }
  ],
  newArrivals: [
    {
      image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Gold Embroidery Collection'
    },
    {
      image: 'https://images.unsplash.com/photo-1595341595379-cf0ff4917965?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Floral Motif Lehengas'
    },
    {
      image: 'https://images.unsplash.com/photo-1600180750310-95f6b2c01e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Modern Minimalist Line'
    }
  ],
  locations: [
    {
      city: 'Mumbai',
      address: '123 Fashion Street, Bandra West'
    },
    {
      city: 'Delhi',
      address: '456 Design Avenue, Connaught Place'
    },
    {
      city: 'Bangalore',
      address: '789 Silk Road, MG Road'
    }
  ],
  website: 'https://www.royalattire.com',
  contact: {
    phone: '+91 1234567890',
    email: 'mailto:info@royalattire.com',
    whatsapp: 'https://wa.me/911234567890',
    instagram: 'https://instagram.com/royalattire'
  },
  message: 'Your wedding attire is more than just clothing - it\'s the embodiment of your dreams and the beginning of your forever.'
};