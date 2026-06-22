// Bookings.tsx
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/ui/data-table'; // Assuming shadcn DataTable
import { bookings } from '../../data/bookings';
import { type Booking } from '../../data/types';
import { listings } from '../../data/listings';
import { users } from '../../data/users';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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
    cell: ({ row }) => new DateObject({ date: row.original.checkIn, calendar: persian, locale: persian_fa }).format("YYYY/MM/DD"),
  },
  {
    accessorKey: 'checkOut',
    header: 'تاریخ خروج',
    cell: ({ row }) => new DateObject({ date: row.original.checkOut, calendar: persian, locale: persian_fa }).format("YYYY/MM/DD"),
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
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Input placeholder="جستجو..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="confirmed">تایید شده</SelectItem>
            <SelectItem value="pending">در حال بررسی</SelectItem>
            <SelectItem value="cancelled">لغو شده</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={bookings} />
    </div>
  );
};

export default Bookings;