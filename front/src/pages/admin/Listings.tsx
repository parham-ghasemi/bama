// Listings.tsx
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/ui/data-table';
import { listings } from '../../data/listings';
import { type Listing } from '../../data/types';
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

const columns: ColumnDef<Listing>[] = [
  { accessorKey: 'name', header: 'نام ویلا' },
  {
    accessorKey: 'ownerId',
    header: 'صاحب ویلا',
    cell: ({ row }) => {
      const user = users.find((u) => u.id === row.original.ownerId);
      return user ? user.name : 'نامشخص';
    },
  },
  {
    id: 'location',
    header: 'استان / شهر',
    cell: ({ row }) => `${row.original.province} / ${row.original.city}`,
  },
  {
    accessorKey: 'submissionDate',
    header: 'تاریخ ارسال',
    cell: ({ row }) => row.original.submissionDate.toLocaleDateString('fa-IR'),
  },
  { accessorKey: 'status', header: 'وضعیت' },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link to={`/admin/listings/${row.original.id}`}>
        <Button variant="ghost">جزئیات</Button>
      </Link>
    ),
  },
];

const Listings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مدیریت ویلاها</h2>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Input placeholder="جستجو..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="active">فعال</SelectItem>
            <SelectItem value="pending">در حال بررسی</SelectItem>
            <SelectItem value="rejected">رد شده</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={listings} />
    </div>
  );
};

export default Listings;