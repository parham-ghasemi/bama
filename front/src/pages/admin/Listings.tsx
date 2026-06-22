import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/data-table';
import api from '../../lib/axiosConfig';
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
import type { ColumnDef } from '@tanstack/react-table';

type Villa = any;

const Listings = () => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const res = await api.get('/villas/admin');
        setVillas(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVillas();
  }, []);

  const columns: ColumnDef<Villa>[] = [
    { accessorKey: 'name', header: 'نام ویلا' },
    {
      accessorKey: 'owner',
      header: 'صاحب ویلا',
      cell: ({ row }) => {
        const owner = row.original.owner;
        return owner?.name
          ? `${owner.name.first || ''} ${owner.name.last || ''}`.trim() || 'نامشخص'
          : 'نامشخص';
      },
    },
    {
      id: 'location',
      header: 'آدرس / شهر',
      cell: ({ row }) => `${row.original.address || ''} / ${row.original.city?.name || ''}`,
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ ارسال',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date
          ? new DateObject({ date, calendar: persian, locale: persian_fa }).format("YYYY/MM/DD")
          : '';
      },
    },
    {
      accessorKey: 'status',
      header: 'وضعیت',
      cell: ({ row }) => {
        const map: Record<string, string> = {
          pending: 'در حال بررسی',
          approved: 'فعال',
          rejected: 'رد شده',
          inactive: 'غیرفعال',
        };
        return map[row.original.status] || row.original.status;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const villa = row.original;
        const isToggleable = villa.status === 'approved' || villa.status === 'inactive';
        const toggleText = villa.status === 'approved' ? 'غیرفعال' : 'فعال';
        const toggleVariant = villa.status === 'approved' ? 'destructive' : 'default';

        const handleToggle = async () => {
          try {
            if (villa.status === 'approved') {
              await api.put(`/villas/${villa._id}/deactivate`);
            } else {
              await api.put(`/villas/${villa._id}/activate`);
            }
            // Update local state
            setVillas((prev: Villa[]) =>
              prev.map((v) =>
                v._id === villa._id
                  ? { ...v, status: villa.status === 'approved' ? 'inactive' : 'approved' }
                  : v
              )
            );
          } catch (err) {
            console.error(err);
          }
        };

        return (
          <div className="flex gap-2">
            <Link to={`/admin/listings/${villa._id}`}>
              <Button variant="ghost">جزئیات</Button>
            </Link>
            {isToggleable && (
              <Button variant={toggleVariant} onClick={handleToggle}>
                {toggleText}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const filtered = villas.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.owner?.name && `${v.owner.name.first} ${v.owner.name.last}`.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مدیریت ویلاها</h2>

      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Input
          placeholder="جستجو..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="approved">فعال</SelectItem>
            <SelectItem value="pending">در حال بررسی</SelectItem>
            <SelectItem value="rejected">رد شده</SelectItem>
            <SelectItem value="inactive">غیرفعال</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? <p>در حال بارگذاری...</p> : <DataTable columns={columns} data={filtered} />}
    </div>
  );
};

export default Listings;