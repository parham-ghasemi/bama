import { Link } from 'react-router-dom';

const Sidebar = () => {
  const linkClass =
    'text-lg font-semibold text-white block p-3 pr-[30px] no-underline hover:text-[#3f5efb] hover:bg-white hover:outline-none relative hover:rounded-tr-[20px] hover:rounded-br-[20px] ' +
    "hover:after:content-[''] hover:after:absolute hover:after:bg-transparent hover:after:bottom-full hover:after:left-0 hover:after:h-[35px] hover:after:w-[35px] hover:after:rounded-bl-[18px] hover:after:shadow-[0_20px_0_0_#fff] " +
    "hover:before:content-[''] hover:before:absolute hover:before:bg-transparent hover:before:top-[38px] hover:before:left-0 hover:before:h-[35px] hover:before:w-[35px] hover:before:rounded-tl-[18px] hover:before:shadow-[0_-20px_0_0_#fff]";

  return (
    <aside dir="rtl" className="text-white w-[250px] pr-5 h-screen bg-[linear-gradient(30deg,#0048bd,#44a7fd)] rounded-bl-[80px]">
      <p className="m-0 py-10">منو</p>
      <Link to="/admin" className={linkClass}>
        <i className="fa fa-tachometer ml-[5px]" aria-hidden="true"></i>
        داشبورد
      </Link>
      <Link to="/admin/users" className={linkClass}>
        <i className="fa fa-users ml-[5px]" aria-hidden="true"></i>
        کاربران
      </Link>
      <Link to="/admin/listings" className={linkClass}>
        <i className="fa fa-home ml-[5px]" aria-hidden="true"></i>
        ویلاها
      </Link>
      <Link to="/admin/bookings" className={linkClass}>
        <i className="fa fa-calendar-check-o ml-[5px]" aria-hidden="true"></i>
        رزروها
      </Link>
      <Link to="/admin/finance" className={linkClass}>
        <i className="fa fa-money ml-[5px]" aria-hidden="true"></i>
        مالی
      </Link>
      <Link to="/admin/tickets" className={linkClass}>
        <i className="fa fa-ticket ml-[5px]" aria-hidden="true"></i>
        تیکت‌ها
      </Link>
    </aside>
  );
};

export default Sidebar;