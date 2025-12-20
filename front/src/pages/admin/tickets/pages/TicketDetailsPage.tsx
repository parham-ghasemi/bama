import { useParams } from 'react-router-dom';
import { TicketChat } from '../components/TicketChat';
import { useTickets } from '../TicketsProvider';
export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTicketById } = useTickets();
  const ticket = id ? getTicketById(id) : undefined;
  if (!ticket) {
    return <div className="p-4 text-center">تیکت یافت نشد.</div>;
  }
  return (
    <div className="p-4">
      <TicketChat ticket={ticket} />
    </div>
  );
};