import UsersTable from '../../components/tables/UsersTable';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const Users = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مدیریت کاربران</h2>
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
            <SelectItem value="banned">مسدود</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <UsersTable />
    </div>
  );
};

export default Users;