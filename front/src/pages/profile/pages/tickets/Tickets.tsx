import { useState, useEffect, useRef } from "react";
import api from "../../../../lib/axiosConfig";
import { toast } from "sonner";
import { FaArrowRight, FaPaperPlane, FaPlus, FaComments } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Card, CardContent } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";

interface Message {
  sender: string;
  message: string;
  createdAt: string;
}

interface Ticket {
  _id: string;
  title: string;
  status: 'open' | 'closed';
  messages: Message[];
  updatedAt: string;
}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/my-tickets');
      setTickets(res.data);
      if (selectedTicket) {
        const updated = res.data.find((t: Ticket) => t._id === selectedTicket._id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err) {
      toast.error("خطا در بارگیری تیکت‌ها");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketMessage.trim()) return;

    try {
      await api.post('/tickets', { title: newTicketTitle, message: newTicketMessage });
      toast.success("تیکت با موفقیت ثبت شد");
      setNewTicketTitle("");
      setNewTicketMessage("");
      setIsCreating(false);
      fetchTickets();
    } catch (err) {
      toast.error("خطا در ایجاد تیکت");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      const res = await api.post(`/tickets/${selectedTicket._id}/reply`, { message: replyMessage });
      setReplyMessage("");
      setSelectedTicket(res.data);
      fetchTickets();
    } catch (err) {
      toast.error("خطا در ارسال پیام");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[550px] dir-rtl">
      {/* 1. CHAT WINDOW PANEL */}
      {selectedTicket ? (
        <Card className="border border-zinc-200 shadow-xl rounded-2xl overflow-hidden bg-white flex flex-col h-[600px]">
          <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-zinc-200/60 text-zinc-600 hover:text-zinc-900 rounded-lg transition"
              >
                <FaArrowRight size={16} />
              </button>
              <div>
                <h3 className="font-bold text-lg text-zinc-900">{selectedTicket.title}</h3>
                <span className="text-xs text-zinc-400">
                  آخرین بروزرسانی: {new Date(selectedTicket.updatedAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>
            <Badge className={`px-2.5 py-0.5 rounded-full font-medium ${selectedTicket.status === 'open' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-zinc-500 hover:bg-zinc-600 text-white'}`}>
              {selectedTicket.status === 'open' ? 'باز' : 'بسته شده'}
            </Badge>
          </div>

          {/* User Side Message Flow */}
          <CardContent className="flex-1 overflow-y-auto space-y-4 p-6 bg-zinc-50/20">
            {selectedTicket.messages.map((msg, index) => {
              const isUser = msg.sender === selectedTicket.messages[0].sender;
              return (
                <div key={index} className={`flex w-full ${isUser ? 'justify-start' : 'justify-end'}`}>
                  <div className="flex flex-col max-w-[75%] space-y-1">
                    <div className={`p-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap rounded-2xl
                      ${isUser
                        ? 'bg-zinc-900 text-white rounded-tr-none'
                        : 'bg-sky-50 text-sky-950 border border-sky-100 rounded-tl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-zinc-400 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </CardContent>

          {/* User Send Form */}
          <form onSubmit={handleSendReply} className="p-4 border-t border-zinc-100 bg-white flex gap-2 items-center">
            <Input
              type="text"
              placeholder={selectedTicket.status === 'closed' ? "این تیکت بسته شده است" : "پاسخ خود را بنویسید..."}
              disabled={selectedTicket.status === 'closed'}
              className="flex-1 h-11 border-zinc-200 bg-zinc-50/50 rounded-xl focus-visible:ring-zinc-400 focus-visible:bg-white transition"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <Button
              type="submit"
              disabled={!replyMessage.trim() || selectedTicket.status === 'closed'}
              className="h-11 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl px-5 transition shadow-sm"
            >
              <FaPaperPlane className="scale-x-[-1]" />
            </Button>
          </form>
        </Card>
      ) : isCreating ? (
        /* 2. NEW TICKET FORM PANEL */
        <Card className="border border-zinc-200 shadow-xl rounded-2xl p-6 bg-white">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-6">
            <button
              onClick={() => setIsCreating(false)}
              className="p-2 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 rounded-lg transition"
            >
              <FaArrowRight size={16} />
            </button>
            <h3 className="font-bold text-xl text-zinc-900">ایجاد تیکت پشتیبانی جدید</h3>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-5 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">موضوع تیکت</label>
              <Input
                type="text"
                className="border-zinc-200 h-11 rounded-xl focus-visible:ring-zinc-400"
                placeholder="عنوان مشکل را وارد کنید..."
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">توضیحات</label>
              <Textarea
                className="border-zinc-200 rounded-xl h-36 resize-none focus-visible:ring-zinc-400 p-3"
                placeholder="جزئیات مشکل را کامل شرح دهید..."
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold h-11 rounded-xl px-6 transition shadow-sm">
              ارسال تیکت پشتیبانی
            </Button>
          </form>
        </Card>
      ) : (
        /* 3. TICKET LOG INDEX MASTER TABLE */
        <Card className="border border-zinc-200 shadow-xl rounded-2xl p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-zinc-900">تیکت‌های پشتیبانی من</h2>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-semibold h-10 rounded-xl px-4 flex items-center gap-1.5 transition shadow-sm"
            >
              <FaPlus size={12} />
              ثبت تیکت جدید
            </Button>
          </div>

          {tickets.length > 0 ? (
            <div className="border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow>
                    <TableHead className="p-4 text-right font-semibold text-zinc-700">موضوع</TableHead>
                    <TableHead className="p-4 text-right font-semibold text-zinc-700">وضعیت</TableHead>
                    <TableHead className="p-4 text-right font-semibold text-zinc-700">آخرین بروزرسانی</TableHead>
                    <TableHead className="p-4 text-center font-semibold text-zinc-700">اقدام</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket._id} className="hover:bg-zinc-50/60 transition border-b border-zinc-100">
                      <TableCell className="p-4 font-medium text-zinc-950">{ticket.title}</TableCell>
                      <TableCell className="p-4">
                        <Badge className={`px-2 py-0.5 rounded-full text-xs font-medium border-none ${ticket.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-700'}`}>
                          {ticket.status === 'open' ? 'بررسی نشده / باز' : 'پاسخ داده شده'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 text-zinc-500">
                        {new Date(ticket.updatedAt).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell className="p-4 text-center">
                        <Button
                          onClick={() => setSelectedTicket(ticket)}
                          variant="ghost"
                          className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 font-bold text-xs h-8 rounded-lg"
                        >
                          مشاهده و گفتگو
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/40">
              <FaComments className="text-zinc-300 mb-3" size={36} />
              <p className="text-zinc-400 text-sm">تاکنون هیچ تیکتی ثبت نکرده‌اید.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Tickets;