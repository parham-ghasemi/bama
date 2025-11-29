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
import { useState, useRef } from 'react';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import "react-multi-date-picker/styles/colors/teal.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { FiCalendar } from 'react-icons/fi';

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
    cell: ({ row }) => new DateObject({ date: row.original.checkIn, calendar: persian, locale: persian_fa }).format("dddd DD MMMM"),
  },
  {
    accessorKey: 'checkOut',
    header: 'تاریخ خروج',
    cell: ({ row }) => new DateObject({ date: row.original.checkOut, calendar: persian, locale: persian_fa }).format("dddd DD MMMM"),
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
    cell: ({ row }) => new DateObject({ date: row.original.registrationDate, calendar: persian, locale: persian_fa }).format("dddd DD MMMM"),
  },
];

// Define columns for recent listings (assuming Listing type has name, location, price, status; no submittedAt, so using id instead)
const listingColumns: ColumnDef<Listing>[] = [
  { accessorKey: 'name', header: 'نام' },
  { accessorKey: 'location', header: 'مکان' },
  { accessorKey: 'price', header: 'قیمت' },
  { accessorKey: 'status', header: 'وضعیت' },
  {
    accessorKey: 'submissionDate',
    header: 'تاریخ ارسال',
    cell: ({ row }) => new DateObject({ date: row.original.submissionDate, calendar: persian, locale: persian_fa }).format("dddd DD MMMM"),
  },
];

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState('all');
  const [startDate, setStartDate] = useState<DateObject | null>(null);
  const [endDate, setEndDate] = useState<DateObject | null>(null);
  const startDatePickerRef = useRef<any>(null);
  const endDatePickerRef = useRef<any>(null);

  const timeFrameLabels = {
    month: 'ماه گذشته',
    year: 'سال گذشته',
    all: 'همه زمان‌ها',
    custom: 'بازه دلخواه',
  };

  const getFilteredData = <T extends { [key: string]: any }>(data: T[], dateKey: keyof T) => {
    const now = new Date();
    let startFilter: Date | null = null;

    if (timeFrame === 'custom') {
      if (!startDate || !endDate) return data;
      const startGreg = startDate.convert(gregorian).toDate();
      const endGreg = endDate.convert(gregorian).toDate();
      return data.filter((item) => {
        const itemDateObj = new DateObject({ date: item[dateKey], calendar: persian });
        const itemGreg = itemDateObj.convert(gregorian).toDate();
        return itemGreg >= startGreg && itemGreg <= endGreg;
      });
    } else {
      if (timeFrame === 'month') {
        startFilter = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      } else if (timeFrame === 'year') {
        startFilter = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      }

      if (!startFilter) return data;

      return data.filter((item) => {
        const itemDateObj = new DateObject({ date: item[dateKey], calendar: persian });
        const itemGreg = itemDateObj.convert(gregorian).toDate();
        return itemGreg >= startFilter;
      });
    }
  };

  const handleStartDateChange = (date: DateObject | null) => {
    setStartDate(date);
    if (date && endDate && date.unix > endDate.unix) {
      setEndDate(date.add(1, "day"));
    }
  };

  const handleEndDateChange = (date: DateObject | null) => {
    setEndDate(date);
  };

  const filteredBookings = getFilteredData(bookings, 'checkIn');
  const filteredUsers = getFilteredData(users, 'registrationDate');
  const filteredListings = getFilteredData(listings, 'submissionDate');

  // Aggregate monthly revenue
  const revenueMap = new Map<string, { value: number, unix: number }>();
  for (const b of filteredBookings) {
    const dateObj = new DateObject({ date: b.checkIn, calendar: persian });
    const monthKey = dateObj.format("MMMM YYYY");
    if (!revenueMap.has(monthKey)) {
      revenueMap.set(monthKey, { value: 0, unix: dateObj.unix });
    }
    revenueMap.get(monthKey)!.value += b.amount;
  }
  const revenueData = Array.from(revenueMap, ([name, { value, unix }]) => ({ name, value, unix }))
    .sort((a, b) => a.unix - b.unix)
    .map(({ name, value }) => ({ name, value }));

  // Aggregate monthly bookings count
  const bookingsMap = new Map<string, { value: number, unix: number }>();
  for (const b of filteredBookings) {
    const dateObj = new DateObject({ date: b.checkIn, calendar: persian });
    const monthKey = dateObj.format("MMMM YYYY");
    if (!bookingsMap.has(monthKey)) {
      bookingsMap.set(monthKey, { value: 0, unix: dateObj.unix });
    }
    bookingsMap.get(monthKey)!.value += 1;
  }
  const bookingsData = Array.from(bookingsMap, ([name, { value, unix }]) => ({ name, value, unix }))
    .sort((a, b) => a.unix - b.unix)
    .map(({ name, value }) => ({ name, value }));

  // Aggregate locations count
  const locationsMap = new Map<string, number>();
  for (const l of filteredListings) {
    const key = l.province;
    locationsMap.set(key, (locationsMap.get(key) || 0) + 1);
  }
  const locationsData = Array.from(locationsMap, ([name, value]) => ({ name, value }));

  // Aggregate monthly user growth
  const userGrowthMap = new Map<string, { value: number, unix: number }>();
  for (const u of filteredUsers) {
    const dateObj = new DateObject({ date: u.registrationDate, calendar: persian });
    const monthKey = dateObj.format("MMMM YYYY");
    if (!userGrowthMap.has(monthKey)) {
      userGrowthMap.set(monthKey, { value: 0, unix: dateObj.unix });
    }
    userGrowthMap.get(monthKey)!.value += 1;
  }
  const userGrowthData = Array.from(userGrowthMap, ([name, { value, unix }]) => ({ name, value, unix }))
    .sort((a, b) => a.unix - b.unix)
    .map(({ name, value }) => ({ name, value }));

  // Calculate revenue growth
  const revenueGrowth = revenueData.length > 1
    ? ((revenueData[revenueData.length - 1].value - revenueData[0].value) / revenueData[0].value * 100).toFixed(2) + '%'
    : '0%';

  // Dashboard stats based on filtered data
  const dashboardStats = [
    { title: 'تعداد رزروها', value: filteredBookings.length.toString(), icon: <Home className="h-4 w-4 text-blue-500" />, isPrice: false },
    { title: 'درآمد کل', value: filteredBookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString('fa-IR'), icon: <DollarSign className="h-4 w-4 text-green-500" />, isPrice: true },
    { title: 'تعداد کاربران ثبت‌نام شده', value: filteredUsers.length.toString(), icon: <Users className="h-4 w-4 text-purple-500" />, isPrice: false },
    { title: 'درصد رشد نسبت به ماه قبل', value: revenueGrowth, icon: <TrendingUp className="h-4 w-4 text-red-500" />, isPrice: false },
  ];

  // Get recent data
  const recentBookings = [...filteredBookings]
    .sort((a, b) => new DateObject({ date: b.checkIn, calendar: persian }).unix - new DateObject({ date: a.checkIn, calendar: persian }).unix)
    .slice(0, 5);

  const recentUsers = [...filteredUsers]
    .sort((a, b) => new DateObject({ date: b.registrationDate, calendar: persian }).unix - new DateObject({ date: a.registrationDate, calendar: persian }).unix)
    .slice(0, 5);

  const recentListings = [...filteredListings]
    .sort((a, b) => new DateObject({ date: b.submissionDate, calendar: persian }).unix - new DateObject({ date: a.submissionDate, calendar: persian }).unix)
    .slice(0, 5);

  return (
    <div dir="rtl" className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">داشبورد</h2>
        <div className="flex items-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">به‌روزرسانی داده‌ها</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiCalendar className="text-gray-600" size={20} />
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="انتخاب بازه زمانی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">ماه گذشته</SelectItem>
              <SelectItem value="year">سال گذشته</SelectItem>
              <SelectItem value="all">همه زمان‌ها</SelectItem>
              <SelectItem value="custom">بازه دلخواه</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {timeFrame === 'custom' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiCalendar className="text-gray-600" size={20} />
            <DatePicker
              ref={startDatePickerRef}
              className="teal"
              numberOfMonths={2}
              showOtherDays={true}
              value={startDate}
              onChange={handleStartDateChange}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-center"
              minDate={new DateObject({ calendar: persian }).set("year", 1401)}
              maxDate={endDate}
              format="dddd DD MMMM"
              render={(value, openCalendar) => (
                <p onClick={openCalendar} className="text-sm text-gray-800 font-light cursor-pointer">
                  {startDate ? startDate.format("dddd DD MMMM") : "تاریخ شروع"}
                </p>
              )}
            />
          </div>
        )}
        {timeFrame === 'custom' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiCalendar className="text-gray-600" size={20} />
            <DatePicker
              ref={endDatePickerRef}
              className="teal"
              numberOfMonths={2}
              showOtherDays={true}
              value={endDate}
              onChange={handleEndDateChange}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-center"
              minDate={startDate || new DateObject({ calendar: persian })}
              format="dddd DD MMMM"
              render={(value, openCalendar) => (
                <p onClick={openCalendar} className="text-sm text-gray-800 font-light cursor-pointer">
                  {endDate ? endDate.format("dddd DD MMMM") : "تاریخ پایان"}
                </p>
              )}
            />
          </div>
        )}
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
              <CardTitle className="text-xl font-semibold text-gray-800">درآمد</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <GenericLineChart data={revenueData} dataKey="value" title="" className="h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">تعداد رزروها</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <GenericBarChart data={bookingsData} dataKey="value" title="" className="h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">تعداد ویلاها بر اساس استان</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <GenericBarChart data={locationsData} dataKey="value" title="" className="h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">رشد کاربران</CardTitle>
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