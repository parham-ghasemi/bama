import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { Button } from '../../../../components/ui/button';
import type { Ticket, Message, TicketStatus } from '../types';
import { useTickets } from '../TicketsProvider';
interface TicketChatProps {
  ticket: Ticket;
}
const statusColors: Record<TicketStatus, string> = {
  'در انتظار': 'bg-yellow-500',
  'در حال بررسی': 'bg-blue-500',
  'بسته شده': 'bg-gray-500',
};
export const TicketChat: React.FC<TicketChatProps> = ({ ticket }) => {
  const { updateTicketStatus, addMessage } = useTickets();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket.messages]);
  const handleSend = () => {
    if (message) {
      addMessage(ticket.id, { sender: 'admin', text: message });
      setMessage('');
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticket.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
          <Select value={ticket.status} onValueChange={(value: TicketStatus) => updateTicketStatus(ticket.id, value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="در انتظار">در انتظار</SelectItem>
              <SelectItem value="در حال بررسی">در حال بررسی</SelectItem>
              <SelectItem value="بسته شده">بسته شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p>تاریخ ایجاد: {ticket.createdAt.toLocaleDateString('fa-IR')}</p>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto mb-4">
          {ticket.messages.map(msg => (
            <div key={msg.id} className={`mb-2 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.sender === 'admin' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {msg.text}
              </div>
              <p className="text-xs text-gray-500">{msg.timestamp.toLocaleString('fa-IR')}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Textarea placeholder="پیام جدید" value={message} onChange={e => setMessage(e.target.value)} />
          <Button onClick={handleSend}>ارسال</Button>
        </div>
      </CardContent>
    </Card>
  );
};