import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Ticket, TicketStatus, Message } from './types';
import mockTickets from './mockData';
interface TicketsContextType {
  tickets: Ticket[];
  addTicket: (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'lastResponse' | 'messages'> & { initialMessage: string }) => void;
  updateTicketStatus: (id: string, newStatus: TicketStatus) => void;
  addMessage: (id: string, newMessage: Omit<Message, 'id' | 'timestamp'>) => void;
  getTicketById: (id: string) => Ticket | undefined;
}
const TicketsContext = createContext<TicketsContextType | undefined>(undefined);
export const TicketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const addTicket = (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'lastResponse' | 'messages'> & { initialMessage: string }) => {
    const id = (tickets.length + 1).toString();
    const now = new Date();
    const message: Message = {
      id: 'm1',
      sender: 'admin',
      text: newTicket.initialMessage,
      timestamp: now,
    };
    setTickets(prev => [
      ...prev,
      {
        ...newTicket,
        id,
        createdAt: now,
        lastResponse: now,
        messages: [message],
      },
    ]);
  };
  const updateTicketStatus = (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(ticket => ticket.id === id ? { ...ticket, status: newStatus } : ticket));
  };
  const addMessage = (id: string, newMessage: Omit<Message, 'id' | 'timestamp'>) => {
    const now = new Date();
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === id) {
        const messageId = `m${ticket.messages.length + 1}`;
        return {
          ...ticket,
          messages: [...ticket.messages, { ...newMessage, id: messageId, timestamp: now }],
          lastResponse: now,
        };
      }
      return ticket;
    }));
  };
  const getTicketById = (id: string) => tickets.find(ticket => ticket.id === id);
  return (
    <TicketsContext.Provider value={{ tickets, addTicket, updateTicketStatus, addMessage, getTicketById }}>
      {children}
    </TicketsContext.Provider>
  );
};
export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) throw new Error('useTickets must be used within TicketsProvider');
  return context;
};