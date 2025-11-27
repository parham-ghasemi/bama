import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const Header = () => {
  return (
    <header dir="rtl" className="bg-[linear-gradient(30deg,#0048bd,#44a7fd)] p-4 flex justify-between items-center border-b border-blue-300 text-white rounded-bl-[80px]">
      <h1 className="text-xl font-bold">پنل مدیریت</h1>
      <Link to={'/'}>
        <Button variant="outline" className="border-white text-black hover:bg-white hover:text-[#0048bd] ml-9 cursor-pointer">خروج</Button>
      </Link>
    </header>
  );
};

export default Header;