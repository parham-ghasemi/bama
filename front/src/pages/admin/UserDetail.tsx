import { useParams } from 'react-router-dom';
import { users } from '../../data/users';
import { bookings } from '../../data/bookings';
import { listings } from '../../data/listings';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// Import tables for user's bookings, listings, payments, reports

const UserDetail = () => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);
  if (!user) return <p>کاربر یافت نشد</p>;

  const userBookings = bookings.filter((b) => b.userId === id);
  const userListings = listings.filter((l) => l.ownerId === id);
  // Mock payments and reports

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">جزئیات کاربر: {user.name}</h2>
      <Card>
        <CardHeader><CardTitle>اطلاعات پروفایل</CardTitle></CardHeader>
        <CardContent>
          <p>ایمیل: {user.email}</p>
          <p>شماره: {user.phone}</p>
          <p>تاریخ ثبت: {user.registrationDate.toLocaleDateString('fa-IR')}</p>
          <p>وضعیت: {user.status}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>لیست رزروها</CardTitle></CardHeader>
        <CardContent>{/* <BookingsTable data={userBookings} /> */}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>لیست ویلاها</CardTitle></CardHeader>
        <CardContent>{/* <ListingsTable data={userListings} /> */}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>تاریخچه پرداخت‌ها</CardTitle></CardHeader>
        <CardContent>{/* Table */}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>گزارش‌های ثبت شده</CardTitle></CardHeader>
        <CardContent>{/* Table */}</CardContent>
      </Card>
      <div className="flex gap-4">
        <Button variant="destructive">مسدود کردن کاربر</Button>
        <Button variant="destructive">حذف کاربر</Button>
        <Button>بازنشانی رمز عبور</Button>
      </div>
    </div>
  );
};

export default UserDetail;