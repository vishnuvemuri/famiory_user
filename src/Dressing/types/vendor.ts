export interface Collection {
  image: string;
  title: string;
}

export interface Location {
  city: string;
  address: string;
}

export interface VendorContact {
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
}

export interface VendorData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  heroImages: string[];
  collections: Collection[];
  newArrivals: Collection[];
  locations: Location[];
  website: string;
  contact: VendorContact;
  message: string;
}