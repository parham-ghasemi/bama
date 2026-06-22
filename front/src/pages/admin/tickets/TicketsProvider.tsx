import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../../lib/axiosConfig';
import { toast } from 'sonner';
import type { Ticket, TicketStatus, Message } from './types';

interface TicketsContextType {
  tickets: Ticket[];
  loading: boolean;
  addTicket: (newTicket: any) => void; // Kept to avoid layout compilation errors
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>;
  addMessage: (id: string, messagePayload: { sender: 'admin' | 'user'; text: string }) => Promise<void>;
  getTicketById: (id: string) => Ticket | undefined;
  refreshTickets: () => Promise<void>;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export const TicketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const mapBackendToFrontend = (backendTickets: any[]): Ticket[] => {
    if (!Array.isArray(backendTickets)) return [];

    return backendTickets.map((t: any) => {
      let displayStatus: TicketStatus = 'در انتظار';
      if (t.status === 'closed') {
        displayStatus = 'بسته شده';
      } else if (t.messages && t.messages.length > 1) {
        displayStatus = 'در حال بررسی';
      }

      // Safely structure messages
      // Safely structure messages
      const formattedMessages: Message[] = Array.isArray(t.messages)
        ? t.messages.map((m: any) => {
          // 1. Check if the backend already sanitized it to a string 'user' | 'admin'
          let normalizedSender: 'user' | 'admin' = 'admin';

          if (m.sender === 'user' || m.sender === 'admin') {
            normalizedSender = m.sender;
          } else {
            // 2. Fallback case if it's still processing raw database object formats 
            const creatorId = t.user?._id || t.user;
            normalizedSender = String(m.sender) === String(creatorId) ? 'user' : 'admin';
          }

          return {
            id: m.id || m._id || Math.random().toString(),
            sender: normalizedSender,
            text: typeof m.message === 'object' ? JSON.stringify(m.message) : String(m.message || m.text || ''),
            timestamp: m.createdAt || m.timestamp ? new Date(m.createdAt || m.timestamp) : new Date(),
          };
        })
        : [];

      // Safely extract creator name string to avoid rendering a nested user object
      let creatorName = 'کاربر سیستم';
      if (t.user) {
        if (typeof t.user === 'object') {
          creatorName = t.user.name || t.user.phoneNumber || `${t.user.firstName || ''} ${t.user.lastName || ''}`.trim() || 'کاربر سیستم';
        } else {
          creatorName = String(t.user);
        }
      }

      return {
        id: String(t._id || ''),
        title: String(t.title || 'تیکت بدون عنوان'),
        status: displayStatus,
        // CRITICAL: Guaranteeing native JS Date instances so .toLocaleDateString() doesn't fail
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        lastResponse: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        creator: creatorName,
        messages: formattedMessages,
      };
    });
  };

  const refreshTickets = async () => {
    try {
      const res = await api.get('/tickets/admin/all');
      setTickets(mapBackendToFrontend(res.data));
    } catch (err) {
      console.error(err);
      toast.error('خطا در دریافت تیکت‌های مدیریت');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTickets();
  }, []);

  const getTicketById = (id: string) => {
    return tickets.find(t => t.id === id);
  };

  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    try {
      await api.put(`/tickets/${id}/toggle-status`);
      toast.success('وضعیت تیکت بروزرسانی شد');
      await refreshTickets();
    } catch (err) {
      toast.error('خطا در تغییر وضعیت تیکت');
    }
  };

  const addMessage = async (id: string, messagePayload: { sender: 'admin' | 'user'; text: string }) => {
    try {
      await api.post(`/tickets/${id}/reply`, { message: messagePayload.text });
      await refreshTickets();
    } catch (err) {
      toast.error('خطا در ارسال پاسخ مدیر');
    }
  };

  const addTicket = () => {
    // Stub to satisfy original layout usage signature
    toast.info("ایجاد تیکت مستقیم از پنل ادمین فعال نیست.");
  };

  return (
    <TicketsContext.Provider value={{ tickets, loading, addTicket, updateTicketStatus, addMessage, getTicketById, refreshTickets }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) throw new Error('useTickets must be used inside a TicketsProvider');
  return context;
};