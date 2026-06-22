import { useState } from 'react';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { TicketTable } from '../components/TicketsTable';
import { CreateTicketDialog } from '../components/CreateTicketDialog';
import { useTickets } from '../TicketsProvider';
import type { TicketStatus } from '../types';
export const TicketsPage: React.FC = () => {
  const { tickets } = useTickets();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'همه'>('همه');
  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Input placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)} className="w-1/3" />
        <Select value={filterStatus} onValueChange={(value: TicketStatus | 'همه') => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="فیلتر وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="همه">همه</SelectItem>
            <SelectItem value="در انتظار">در انتظار</SelectItem>
            <SelectItem value="در حال بررسی">در حال بررسی</SelectItem>
            <SelectItem value="بسته شده">بسته شده</SelectItem>
          </SelectContent>
        </Select>
        <CreateTicketDialog />
      </div>
      <TicketTable tickets={tickets} search={search} filterStatus={filterStatus} />
    </div>
  );
};