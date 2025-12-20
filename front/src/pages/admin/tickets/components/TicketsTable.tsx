import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import type { Ticket, TicketStatus } from '../types';
import { toPersianDigits } from '../utils';
interface TicketTableProps {
  tickets: Ticket[];
  search: string;
  filterStatus: TicketStatus | 'همه';
}
const statusColors: Record<TicketStatus, string> = {
  'در انتظار': 'bg-yellow-500',
  'در حال بررسی': 'bg-blue-500',
  'بسته شده': 'bg-gray-500',
};
export const TicketTable: React.FC<TicketTableProps> = ({ tickets, search, filterStatus }) => {
  const navigate = useNavigate();
  const filteredTickets = tickets
    .filter(ticket => ticket.title.includes(search) || ticket.creator.includes(search))
    .filter(ticket => filterStatus === 'همه' || ticket.status === filterStatus)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Default sort by createdAt desc
  if (filteredTickets.length === 0) {
    return <div className="text-center py-4">هیچ تیکتی یافت نشد.</div>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>شناسه تیکت</TableHead>
          <TableHead>عنوان</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>تاریخ ایجاد</TableHead>
          <TableHead>آخرین پاسخ</TableHead>
          <TableHead>ایجادکننده</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTickets.map(ticket => (
          <TableRow key={ticket.id} className="cursor-pointer" onClick={() => navigate(`/admin/tickets/${ticket.id}`)}>
            <TableCell>{toPersianDigits(ticket.id)}</TableCell>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>
              <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
            </TableCell>
            <TableCell>{ticket.createdAt.toLocaleDateString('fa-IR')}</TableCell>
            <TableCell>{ticket.lastResponse.toLocaleDateString('fa-IR')}</TableCell>
            <TableCell>{ticket.creator}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};