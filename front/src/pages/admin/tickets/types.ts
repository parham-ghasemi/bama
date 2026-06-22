export type TicketStatus = 'در انتظار' | 'در حال بررسی' | 'بسته شده';
export interface Message {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  timestamp: Date;
}
export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: Date;
  lastResponse: Date;
  creator: string;
  messages: Message[];
}