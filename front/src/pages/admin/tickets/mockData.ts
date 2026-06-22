import type { Ticket } from './types';
const mockTickets: Ticket[] = [
  {
    id: '۱',
    title: 'مشکل در ورود به حساب',
    status: 'در حال بررسی',
    createdAt: new Date('2023-10-01T10:00:00'),
    lastResponse: new Date('2023-10-02T12:00:00'),
    creator: 'کاربر ۱',
    messages: [
      { id: 'm۱', sender: 'user', text: 'نمی‌توانم وارد شوم.', timestamp: new Date('2023-10-01T10:00:00') },
      { id: 'm۲', sender: 'admin', text: 'بررسی می‌کنم.', timestamp: new Date('2023-10-02T12:00:00') },
    ],
  },
  {
    id: '۲',
    title: 'درخواست بازپرداخت',
    status: 'در انتظار',
    createdAt: new Date('2023-10-03T14:00:00'),
    lastResponse: new Date('2023-10-03T14:00:00'),
    creator: 'کاربر ۲',
    messages: [
      { id: 'm۱', sender: 'user', text: 'لطفاً بازپرداخت کنید.', timestamp: new Date('2023-10-03T14:00:00') },
    ],
  },
  {
    id: '۳',
    title: 'گزارش خطا در صفحه اصلی',
    status: 'بسته شده',
    createdAt: new Date('2023-09-15T09:00:00'),
    lastResponse: new Date('2023-09-20T11:00:00'),
    creator: 'کاربر ۳',
    messages: [
      { id: 'm۱', sender: 'user', text: 'صفحه اصلی بارگذاری نمی‌شود.', timestamp: new Date('2023-09-15T09:00:00') },
      { id: 'm۲', sender: 'admin', text: 'حل شد.', timestamp: new Date('2023-09-20T11:00:00') },
    ],
  },
];
export default mockTickets;