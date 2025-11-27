import { Bell, DollarSign, Home, MapPin, TrendingUp, Users } from 'lucide-react'; // Added MapPin for locations
import StatCard from '../../components/cards/StatCard';
import GenericLineChart from '../../components/charts/GenericLineChart';
import GenericBarChart from '../../components/charts/GenericBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { DataTable } from '../../components/ui/data-table';
import { bookings } from '../../data/bookings';
import { users } from '../../data/users';
import { listings } from '../../data/listings';
import { type Booking, type User, type Listing } from '../../data/types';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { Calendar } from 'lucide-react'; // Added for bookings icon

// Enhanced stats with icons for better visual appeal
const dashboardStats = [
  { title: 'تعداد رزروهای ماه جاری', value: '120', icon: <Home className="h-4 w-4 text-blue-500" /> },
  { title: 'درآمد کل ماه جاری', value: '500,000,000', icon: <DollarSign className="h-4 w-4 text-green-500" />, isPrice: true },
  { title: 'تعداد کاربران ثبت‌نام شده', value: '1,500', icon: <Users className="h-4 w-4 text-purple-500" /> },
  // { title: 'تعداد ویلاهای فعال', value: '300', icon: <Home className="h-4 w-4 text-orange-500" /> },
  // { title: 'تعداد ویلاهای در انتظار تایید', value: '50', icon: <Bell className="h-4 w-4 text-yellow-500" /> },
  { title: 'درصد رشد نسبت به ماه قبل', value: '+15%', icon: <TrendingUp className="h-4 w-4 text-red-500" /> },
];

// Sample data for charts (expanded for demo)
const revenueData = [
  { month: 'فروردین', value: 4000 },
  { month: 'اردیبهشت', value: 5000 },
  { month: 'خرداد', value: 6000 },
  { month: 'تیر', value: 7000 },
  { month: 'مرداد', value: 8000 },
  { month: 'شهریور', value: 9000 },
  { month: 'مهر', value: 10000 },
  { month: 'آبان', value: 11000 },
  { month: 'آذر', value: 12000 },
  { month: 'دی', value: 13000 },
  { month: 'بهمن', value: 14000 },
  { month: 'اسفند', value: 15000 },
];

const bookingsData = [
  { month: 'فروردین', value: 100 },
  { month: 'اردیبهشت', value: 120 },
  { month: 'خرداد', value: 140 },
  { month: 'تیر', value: 160 },
  { month: 'مرداد', value: 180 },
  { month: 'شهریور', value: 200 },
  { month: 'مهر', value: 220 },
  { month: 'آبان', value: 240 },
  { month: 'آذر', value: 260 },
  { month: 'دی', value: 280 },
  { month: 'بهمن', value: 300 },
  { month: 'اسفند', value: 320 },
];

const locationsData = [
  { name: 'مازندران', value: 150 },
  { name: 'گیلان', value: 120 },
  { name: 'تهران', value: 80 },
  { name: 'اصفهان', value: 60 },
  { name: 'شیراز', value: 40 },
];

const userGrowthData = [
  { month: 'فروردین', value: 200 },
  { month: 'اردیبهشت', value: 250 },
  { month: 'خرداد', value: 300 },
  { month: 'تیر', value: 350 },
  { month: 'مرداد', value: 400 },
  { month: 'شهریور', value: 450 },
  { month: 'مهر', value: 500 },
  { month: 'آبان', value: 550 },
  { month: 'آذر', value: 600 },
  { month: 'دی', value: 650 },
  { month: 'بهمن', value: 700 },
  { month: 'اسفند', value: 750 },
];

// Define columns for recent bookings
const bookingColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'listingId',
    header: 'نام ویلا',
    cell: ({ row }) => {
      const listing = listings.find((l) => l.id === row.original.listingId);
      return listing ? listing.name : 'نامشخص';
    },
  },
  {
    accessorKey: 'userId',
    header: 'نام کاربر',
    cell: ({ row }) => {
      const user = users.find((u) => u.id === row.original.userId);
      return user ? user.name : 'نامشخص';
    },
  },
  {
    accessorKey: 'checkIn',
    header: 'تاریخ ورود',
    cell: ({ row }) => row.original.checkIn.toLocaleDateString('fa-IR'),
  },
  {
    accessorKey: 'checkOut',
    header: 'تاریخ خروج',
    cell: ({ row }) => row.original.checkOut.toLocaleDateString('fa-IR'),
  },
  { accessorKey: 'amount', header: 'مبلغ' },
  { accessorKey: 'status', header: 'وضعیت' },
];

// Define columns for recent users
const userColumns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'نام' },
  { accessorKey: 'email', header: 'ایمیل' },
  {
    accessorKey: 'registrationDate',
    header: 'تاریخ ثبت‌نام',
    cell: ({ row }) => row.original.registrationDate?.toLocaleDateString('fa-IR') || 'نامشخص',
  },
];

// Define columns for recent listings (assuming Listing type has name, location, price, status; no submittedAt, so using id instead)
const listingColumns: ColumnDef<Listing>[] = [
  { accessorKey: 'name', header: 'نام' },
  { accessorKey: 'location', header: 'مکان' },
  { accessorKey: 'price', header: 'قیمت' },
  { accessorKey: 'status', header: 'وضعیت' },
  {
    accessorKey: 'id',
    header: 'شناسه',
    cell: ({ row }) => row.original.id,
  },
];

const Dashboard = () => {
  // Map bookingsData to match GenericBarChart's expected data shape
  const mappedBookingsData = bookingsData.map(({ month, value }) => ({ name: month, value }));

  // Get recent data (assuming higher id means more recent; adjust sorting if there's a date field)
  const recentBookings = [...bookings]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 5);

  const recentUsers = [...users]
    .sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime())
    .slice(0, 5);

  const recentListings = [...listings]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 5);

  return (
    <div dir="rtl" className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">داشبورد</h2>
        <div className="flex items-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">به‌روزرسانی داده‌ها</Button>
        </div>
      </div>

      {/* Stats grid with responsive layout and shadows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isPrice={stat.isPrice}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
          />
        ))}
      </div>

      {/* Charts section with tabs for better organization and interactivity */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-white p-1 rounded-lg shadow-md grid grid-cols-4">
          <TabsTrigger value="revenue">
            <DollarSign className="ml-2 h-4 w-4" />
            درآمد
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <Calendar className="ml-2 h-4 w-4" />
            رزروها
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="ml-2 h-4 w-4" />
            مکان‌ها
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="ml-2 h-4 w-4" />
            کاربران
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">درآمد ۱۲ ماه گذشته</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <GenericLineChart data={revenueData} dataKey="value" title="" className="h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">تعداد رزروها در ۱۲ ماه</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <GenericBarChart data={mappedBookingsData} dataKey="value" title="" className="h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">تعداد ویلاها بر اساس استان/شهر</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <GenericBarChart data={locationsData} dataKey="value" title="" className="h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">رشد کاربران در ۱۲ ماه</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <GenericLineChart data={userGrowthData} dataKey="value" title="" className="h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent activity sections with DataTable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gray-50 border-b flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">آخرین رزروها</CardTitle>
            <Button variant="ghost" size="sm">مشاهده همه</Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={bookingColumns} data={recentBookings} />
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gray-50 border-b flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">آخرین کاربران ثبت شده</CardTitle>
            <Button variant="ghost" size="sm">مشاهده همه</Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={userColumns} data={recentUsers} />
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gray-50 border-b flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">آخرین ویلاهای ارسال شده</CardTitle>
            <Button variant="ghost" size="sm">مشاهده همه</Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={listingColumns} data={recentListings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;