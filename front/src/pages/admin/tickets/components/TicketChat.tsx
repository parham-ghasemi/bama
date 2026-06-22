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
  'در انتظار': 'bg-amber-500 text-white border-none',
  'در حال بررسی': 'bg-sky-500 text-white border-none',
  'بسته شده': 'bg-zinc-500 text-white border-none',
};

export const TicketChat: React.FC<TicketChatProps> = ({ ticket }) => {
  const { updateTicketStatus, addMessage } = useTickets();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Read the status mapping helper safely
  const isClosed = ticket.status === 'بسته شده';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket.messages]);

  const handleSend = () => {
    if (message && !isClosed) {
      addMessage(ticket.id, { sender: 'admin', text: message });
      setMessage('');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border border-zinc-200 shadow-xl rounded-2xl overflow-hidden bg-white flex flex-col h-[650px] dir-rtl">
      <CardHeader className="bg-zinc-50/70 border-b border-zinc-100 p-5 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-bold text-zinc-900">{ticket.title}</CardTitle>
          <p className="text-xs text-zinc-400">تاریخ ایجاد: {ticket.createdAt.toLocaleDateString('fa-IR')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</Badge>
          <Select value={ticket.status} onValueChange={(value: TicketStatus) => updateTicketStatus(ticket.id, value)}>
            <SelectTrigger className="w-[140px] h-9 border-zinc-200 rounded-lg text-sm bg-white shadow-sm focus:ring-zinc-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="در انتظار">در انتظار</SelectItem>
              <SelectItem value="در حال بررسی">در حال بررسی</SelectItem>
              <SelectItem value="بسته شده">بسته شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30 mb-0">
        {ticket.messages.map(msg => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
            <div className="flex flex-col max-w-[75%] space-y-1">
              <div className={`px-4 py-2.5 shadow-sm text-sm leading-relaxed whitespace-pre-wrap
                ${msg.sender === 'admin'
                  ? 'bg-zinc-900 text-white rounded-2xl rounded-tr-none'
                  : 'bg-sky-50 text-sky-950 border border-sky-100 rounded-2xl rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <p className={`text-[10px] text-zinc-400 px-1 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleString('fa-IR')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-4 border-t border-zinc-100 bg-white flex items-end gap-2">
        <Textarea
          placeholder={isClosed ? "این تیکت بسته شده است" : "پیام جدید"}
          disabled={isClosed}
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="flex-1 min-h-[50px] max-h-[120px] resize-none border-zinc-200 rounded-xl bg-zinc-50/50 p-3 text-sm focus-visible:ring-zinc-400 focus-visible:bg-white transition disabled:opacity-60"
        />
        <Button
          onClick={handleSend}
          disabled={isClosed || !message.trim()}
          className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl px-5 h-11 flex items-center transition font-medium shadow-sm default:disabled:opacity-50"
        >
          ارسال
        </Button>
      </div>
    </Card>
  );
};