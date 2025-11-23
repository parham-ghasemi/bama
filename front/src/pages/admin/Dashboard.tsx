import StatCard from '../../components/cards/StatCard';
import GenericLineChart from '../../components/charts/GenericLineChart';
import GenericBarChart from '../../components/charts/GenericBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import UsersTable from '../../components/tables/UsersTable'; // Reuse for last users, but limit data
// Import other tables for last bookings, last listings

const dashboardStats = [
  { title: 'تعداد رزروهای ماه جاری', value: '120' },
  { title: 'درآمد کل ماه جاری', value: '500,000,000 ریال' },
  { title: 'تعداد کاربران ثبت‌نام شده', value: '1,500' },
  { title: 'تعداد ویلاهای فعال', value: '300' },
  { title: 'تعداد ویلاهای در انتظار تایید', value: '50' },
  { title: 'درصد رشد نسبت به ماه قبل', value: '+15%' },
];

const revenueData = [{ month: 'فروردین', value: 4000 }, /* ... */];
const bookingsData = [{ month: 'فروردین', value: 100 }, /* ... */];
const locationsData = [{ name: 'مازندران', value: 150 }, /* ... */];
const userGrowthData = [{ month: 'فروردین', value: 200 }, /* ... */];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">داشبورد</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>درآمد ۱۲ ماه گذشته</CardTitle></CardHeader>
          <CardContent><GenericLineChart data={revenueData} dataKey="value" title="" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>تعداد رزروها در ۱۲ ماه</CardTitle></CardHeader>
          <CardContent><GenericBarChart data={bookingsData} dataKey="value" title="" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>تعداد ویلاها بر اساس استان/شهر</CardTitle></CardHeader>
          <CardContent><GenericBarChart data={locationsData} dataKey="value" title="" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>رشد کاربران در ۱۲ ماه</CardTitle></CardHeader>
          <CardContent><GenericLineChart data={userGrowthData} dataKey="value" title="" /></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>آخرین رزروها</CardTitle></CardHeader>
        <CardContent>{/* <BookingsTable limit={5} /> */}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>آخرین کاربران ثبت شده</CardTitle></CardHeader>
        <CardContent><UsersTable /* limit to last 5 */ /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>آخرین ویلاهای ارسال شده</CardTitle></CardHeader>
        <CardContent>{/* <ListingsTable limit={5} /> */}</CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;