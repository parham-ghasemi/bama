import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/ui/data-table'; // Assuming shadcn DataTable
import { bookings } from '../../data/bookings';
import { type Booking } from '../../data/types';
import { listings } from '../../data/listings';
import { users } from '../../data/users';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'listingId',
    header: 'نام ویلا',
    cell: ({ row }) => {
      const listing = listings.find((l) => l.id === row.original.listingId);
      return listing ? listing.name : 'نامشخص';
    },
  },
  {
    accessorKey: 'userId',
    header: 'نام کاربر',
    cell: ({ row }) => {
      const user = users.find((u) => u.id === row.original.userId);
      return user ? user.name : 'نامشخص';
    },
  },
  {
    accessorKey: 'checkIn',
    header: 'تاریخ ورود',
    cell: ({ row }) => row.original.checkIn.toLocaleDateString('fa-IR'),
  },
  {
    accessorKey: 'checkOut',
    header: 'تاریخ خروج',
    cell: ({ row }) => row.original.checkOut.toLocaleDateString('fa-IR'),
  },
  { accessorKey: 'amount', header: 'مبلغ' },
  { accessorKey: 'status', header: 'وضعیت' },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link to={`/admin/bookings/${row.original.id}`}>
        <Button variant="ghost">جزئیات</Button>
      </Link>
    ),
  },
];

const Bookings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مدیریت رزروها</h2>
      <DataTable columns={columns} data={bookings} />
    </div>
  );
};

export default Bookings;