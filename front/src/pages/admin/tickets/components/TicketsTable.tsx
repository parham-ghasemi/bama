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

  // Helper to safely handle any accidental object rendering trap
  const renderSafeString = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'object') {
      // If it's the { first, last } object breaking your build, stitch it together!
      if (val.first || val.last) {
        return `${val.first || ''} ${val.last || ''}`.trim();
      }
      return JSON.stringify(val);
    }
    return String(val);
  };

  const filteredTickets = (tickets || [])
    .filter(ticket => {
      const titleStr = renderSafeString(ticket?.title);
      const creatorStr = renderSafeString(ticket?.creator);
      const searchStr = search || '';
      return titleStr.includes(searchStr) || creatorStr.includes(searchStr);
    })
    .filter(ticket => filterStatus === 'همه' || ticket.status === filterStatus)
    .sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return timeB - timeA;
    });

  if (filteredTickets.length === 0) {
    return <div className="text-center py-4">هیچ تیکتی یافت نشد.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-right'>شناسه تیکت</TableHead>
          <TableHead className='text-right'>عنوان</TableHead>
          <TableHead className='text-right'>وضعیت</TableHead>
          <TableHead className='text-right'>تاریخ ایجاد</TableHead>
          <TableHead className='text-right'>آخرین پاسخ</TableHead>
          <TableHead className='text-right'>ایجادکننده</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTickets.map(ticket => {
          // Safeguard the id calculation helper
          let displayId = '';
          try {
            displayId = toPersianDigits(ticket.id);
            if (typeof displayId === 'object') {
              displayId = renderSafeString(displayId);
            }
          } catch (e) {
            displayId = renderSafeString(ticket.id);
          }

          return (
            <TableRow key={ticket.id} className="cursor-pointer" onClick={() => navigate(`/admin/tickets/${ticket.id}`)}>
              <TableCell>{displayId}</TableCell>
              <TableCell>{renderSafeString(ticket.title)}</TableCell>
              <TableCell>
                <Badge className={statusColors[ticket.status] || 'bg-gray-500'}>
                  {renderSafeString(ticket.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {ticket.createdAt instanceof Date ? ticket.createdAt.toLocaleDateString('fa-IR') : renderSafeString(ticket.createdAt)}
              </TableCell>
              <TableCell>
                {ticket.lastResponse instanceof Date ? ticket.lastResponse.toLocaleDateString('fa-IR') : renderSafeString(ticket.lastResponse)}
              </TableCell>
              <TableCell>{renderSafeString(ticket.creator)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};