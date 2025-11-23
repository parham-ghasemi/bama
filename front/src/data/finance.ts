import type { FinancialRecord } from './types';

export const financialRecords: FinancialRecord[] = [
  {
    hostId: '1',
    amountOwed: 10000000,
    status: 'pending',
  },
  // Add more
];

export const revenueData = [
  { month: 'فروردین', revenue: 40000000 },
  { month: 'اردیبهشت', revenue: 50000000 },
  // 12 months
];

export const payoutData = [
  { host: 'علی احمدی', amount: 30000000 },
  // more
];