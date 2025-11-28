import { type ColumnDef } from '@tanstack/react-table'; // assuming shadcn table uses tanstack
import { DataTable } from '../../components/ui/data-table';
import { type User } from '../../data/types';
import { users } from '../../data/users';

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'نام' },
  {
    id: 'contact',
    header: 'ایمیل / شماره',
    cell: ({ row }) => row.original.email || row.original.phone,
  },
  {
    accessorKey: 'registrationDate',
    header: 'تاریخ ثبت‌نام',
    cell: ({ row }) => row.original.registrationDate.toLocaleDateString('fa-IR'),
  },
  { accessorKey: 'bookingsCount', header: 'تعداد رزرو' },
  { accessorKey: 'listingsCount', header: 'تعداد ویلاهای ثبت شده' },
  { accessorKey: 'status', header: 'وضعیت' },
];

const UsersTable = () => {
  return <DataTable columns={columns} data={users} />;
};

export default UsersTable;
