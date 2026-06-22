import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table"; // ShadCN Table
import { Button } from "../../../../../components/ui/button"; // ShadCN Button
import { Input } from "../../../../../components/ui/input"; // ShadCN Input for search placeholder
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"; // ShadCN Select for filter placeholder
import { ChevronLeft, ChevronRight } from "lucide-react";

// Fake data
const fakeBookings = [
  {
    villaName: "هتل آرمان",
    userName: "پرهام",
    userLastName: "قاسمی",
    userPhone: "۰۹۹۱۲۵۲۵۹۶۴",
    startDate: "۱۴۰۴/۱۰/۱۱",
    endDate: "۱۴۰۴/۱۰/۱۳",
    price: "۱۰,۰۰۰,۰۰۰ تومان",
    status: "در حال بررسی",
    comment: "بدون نظر",
  },
  {
    villaName: "ویلای ساحلی",
    userName: "علی",
    userLastName: "احمدی",
    userPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    startDate: "۱۴۰۴/۱۱/۰۱",
    endDate: "۱۴۰۴/۱۱/۰۳",
    price: "۵,۰۰۰,۰۰۰ تومان",
    status: "تایید شده",
    comment: "عالی بود",
  },
  // Add more fake rows as needed
];

const BookingInfo = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Placeholders for backend integration
  // In real scenario, fetch data based on search, filter, page

  return (
    <div className="w-full mt-8">
      <h2 className="font-semibold text-lg mb-4">اطلاعات رزروها</h2>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="فیلتر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="pending">در حال بررسی</SelectItem>
            <SelectItem value="approved">تایید شده</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام ویلا</TableHead>
            <TableHead>نام کاربر</TableHead>
            <TableHead>نام خانوادگی کاربر</TableHead>
            <TableHead>شماره تلفن کاربر</TableHead>
            <TableHead>تاریخ شروع رزرو</TableHead>
            <TableHead>تاریخ پایان رزرو</TableHead>
            <TableHead>قیمت کلی رزرو</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fakeBookings.map((booking, index) => (
            <TableRow key={index}>
              <TableCell>{booking.villaName}</TableCell>
              <TableCell>{booking.userName}</TableCell>
              <TableCell>{booking.userLastName}</TableCell>
              <TableCell>{booking.userPhone}</TableCell>
              <TableCell>{booking.startDate}</TableCell>
              <TableCell>{booking.endDate}</TableCell>
              <TableCell>{booking.price}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm">
                  {booking.status === "در حال بررسی" ? "تایید" : "-"}
                </Button>
                <Button variant="outline" size="sm">
                  {booking.comment ? "مشاهده نظر" : "-"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))}>
          <ChevronRight />
        </Button>
        <span>صفحه {page}</span>
        <Button variant="ghost" onClick={() => setPage((p) => p + 1)}>
          <ChevronLeft />
        </Button>
      </div>
    </div>
  );
};

export default BookingInfo;