import type { Listing } from './types';

export const listings: Listing[] = [
  {
    id: '1',
    name: 'ویلا ساحلی شمال',
    ownerId: '1',
    province: 'مازندران',
    city: 'رامسر',
    submissionDate: new Date('2025-03-10'),
    status: 'approved',
    description: 'ویلا زیبا با widok دریا',
    amenities: ['استخر', 'وای فای', 'پارکینگ'],
    location: 'ساحل رامسر',
    price: 5000000,
    images: ['https://placehold.co/600x400', 'https://placehold.co/600x400'],
    bookingsCount: 10,
  },
  // Add more
];