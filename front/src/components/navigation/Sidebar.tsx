import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-card p-4 flex flex-col gap-2 border-r">
      <Link to="/admin/dashboard"><Button variant="ghost" className="w-full justify-start">داشبورد</Button></Link>
      <Link to="/admin/users"><Button variant="ghost" className="w-full justify-start">کاربران</Button></Link>
      <Link to="/admin/listings"><Button variant="ghost" className="w-full justify-start">ویلاها</Button></Link>
      <Link to="/admin/bookings"><Button variant="ghost" className="w-full justify-start">رزروها</Button></Link>
      <Link to="/admin/reports"><Button variant="ghost" className="w-full justify-start">گزارش‌ها</Button></Link>
      <Link to="/admin/finance"><Button variant="ghost" className="w-full justify-start">مالی</Button></Link>
    </aside>
  );
};

export default Sidebar;