import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';

const AdminLayout = () => {
  return (
    <div dir="rtl" className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;