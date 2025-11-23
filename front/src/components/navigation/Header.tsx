import { Button } from '../../components/ui/button';

const Header = () => {
  return (
    <header className="bg-card p-4 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold">پنل مدیریت</h1>
      <Button variant="outline">خروج</Button>
    </header>
  );
};

export default Header;