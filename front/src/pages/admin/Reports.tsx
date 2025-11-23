import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/ui/data-table';
import { reports } from '../../data/reports';
import { type Report } from '../../data/types';
import { users } from '../../data/users';
import { listings } from '../../data/listings';
import { Button } from '../../components/ui/button';
import { useState } from 'react';

const columns: ColumnDef<Report>[] = [
  { accessorKey: 'type', header: 'نوع گزارش' },
  {
    accessorKey: 'reporterId',
    header: 'گزارش‌دهنده',
    cell: ({ row }) => {
      const user = users.find((u) => u.id === row.original.reporterId);
      return user ? user.name : 'نامشخص';
    },
  },
  {
    accessorKey: 'reportedId',
    header: 'گزارش‌شده',
    cell: ({ row }) => {
      if (row.original.type === 'user') {
        const user = users.find((u) => u.id === row.original.reportedId);
        return user ? user.name : 'نامشخص';
      } else {
        const listing = listings.find((l) => l.id === row.original.reportedId);
        return listing ? listing.name : 'نامشخص';
      }
    },
  },
  { accessorKey: 'reason', header: 'دلیل' },
  {
    accessorKey: 'date',
    header: 'تاریخ',
    cell: ({ row }) => row.original.date.toLocaleDateString('fa-IR'),
  },
  { accessorKey: 'status', header: 'وضعیت' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [status, setStatus] = useState(row.original.status);
      return (
        <Button
          onClick={() => setStatus(status === 'open' ? 'processed' : 'open')}
          variant="outline"
        >
          {status === 'open' ? 'پردازش شده' : 'باز کردن'}
        </Button>
      );
    },
  },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">گزارش‌ها و نظارت</h2>
      <DataTable columns={columns} data={reports} />
    </div>
  );
};

export default Reports;