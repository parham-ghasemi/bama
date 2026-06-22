export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  bookingsCount: number;
  listingsCount: number;
  status: 'active' | 'blocked';
}

export interface Listing {
  id: string;
  name: string;
  ownerId: string;
  province: string;
  city: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'disabled';
  description: string;
  amenities: string[];
  location: string;
  price: number;
  images: string[];
  bookingsCount: number;
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
}

export interface Report {
  id: string;
  type: 'listing' | 'user';
  reporterId: string;
  reportedId: string;
  reason: string;
  date: Date;
  status: 'open' | 'processed';
}

export interface FinancialRecord {
  hostId: string;
  amountOwed: number;
  status: 'pending' | 'paid';
}