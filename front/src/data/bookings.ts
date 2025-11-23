import type { Booking } from './types';

export const bookings: Booking[] = [
  {
    id: '1',
    listingId: '1',
    userId: '1',
    checkIn: new Date('2025-06-01'),
    checkOut: new Date('2025-06-05'),
    amount: 20000000,
    status: 'paid',
  },
  // Add more
];