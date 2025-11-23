import { type User } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'علی احمدی',
    email: 'ali@example.com',
    phone: '09123456789',
    registrationDate: new Date('2025-01-01'),
    bookingsCount: 5,
    listingsCount: 2,
    status: 'active',
  },
  {
    id: '2',
    name: 'مینا کریمی',
    email: 'mina@example.com',
    phone: '09187654321',
    registrationDate: new Date('2025-02-15'),
    bookingsCount: 3,
    listingsCount: 1,
    status: 'blocked',
  },
];