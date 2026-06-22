// src/pages/admin/Finance.tsx (or wherever it is)
import { useState, useRef } from 'react';
import GenericLineChart from '../../components/charts/GenericLineChart';
import GenericBarChart from '../../components/charts/GenericBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { FiPrinter, FiCalendar } from 'react-icons/fi'; // Using feather icons from react-icons

import { revenueData, payoutData, financialRecords } from '../../data/finance';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import "react-multi-date-picker/styles/colors/teal.css";

const Finance = () => {
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

  const getFilteredData = (data: any[]) => {
    const now = new Date();
    let startFilter: Date | null = null;
    let endFilter: Date = now;

    if (timeFrame === 'custom') {
      if (!startDate || !endDate) return data;
      const startGreg = startDate.convert(gregorian).toDate();
      const endGreg = endDate.convert(gregorian).toDate();
      return data.filter((item) => {
        const itemDateObj = new DateObject({ date: item.date, calendar: persian, format: "YYYY-MM-DD" });
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
        const itemDateObj = new DateObject({ date: item.date, calendar: persian, format: "YYYY-MM-DD" });
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

  const filteredRevenue = getFilteredData(revenueData);
  const filteredPayouts = getFilteredData(payoutData);

  const totalRevenue = filteredRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const platformFee = totalRevenue * 0.1; // Assuming 10% platform fee
  const payoutsSum = filteredPayouts.reduce((sum, item) => sum + item.amount, 0); // Actual sum of payouts
  const totalPayouts = payoutsSum; // Use actual sum instead of calculated for accuracy
  const averageRevenue = filteredRevenue.length > 0 ? totalRevenue / filteredRevenue.length : 0;
  const averagePayout = filteredPayouts.length > 0 ? totalPayouts / filteredPayouts.length : 0;
  const numTransactions = filteredPayouts.length; // Assuming payouts represent transactions
  const numMonths = filteredRevenue.length;
  const totalPending = financialRecords.reduce((sum, r) => r.status === 'pending' ? sum + r.amountOwed : sum, 0);
  const totalPaid = financialRecords.reduce((sum, r) => r.status === 'paid' ? sum + r.amountOwed : sum, 0);
  const numPending = financialRecords.filter(r => r.status === 'pending').length;
  const numPaid = financialRecords.filter(r => r.status === 'paid').length;
  const numHosts = financialRecords.length;

  // Fake additional data for more metrics
  const operatingExpenses = totalRevenue * 0.05; // Fake 5% expenses on revenue
  const netProfit = platformFee - operatingExpenses; // Platform's net profit
  const revenueGrowth = filteredRevenue.length > 1
    ? ((filteredRevenue[filteredRevenue.length - 1].revenue - filteredRevenue[0].revenue) / filteredRevenue[0].revenue) * 100
    : 0; // Simple growth percentage

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const label = timeFrame === 'custom'
      ? `بازه از ${startDate?.format("YYYY/MM/DD") ?? ''} تا ${endDate?.format("YYYY/MM/DD") ?? ''}`
      : timeFrameLabels[timeFrame as keyof typeof timeFrameLabels];

    printWindow.document.write('<html><head><title>چاپ داده‌های مالی</title>');
    printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: "Vazirmatn", sans-serif; direction: rtl; text-align: right; margin: 20px; }');
    printWindow.document.write('h1, h2 { text-align: center; }');
    printWindow.document.write('p { font-size: 16px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid black; padding: 10px; text-align: right; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('</style></head><body>');

    printWindow.document.write(`<h1>داده‌های مالی - ${label}</h1>`);
    printWindow.document.write('<h2>خلاصه مالی</h2>');
    printWindow.document.write(`<p>درآمد کل: ${totalRevenue.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>کارمزد پلتفرم: ${platformFee.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>پرداخت به میزبانان: ${totalPayouts.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>هزینه‌های عملیاتی (تخمینی): ${operatingExpenses.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>سود خالص پلتفرم: ${netProfit.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>میانگین درآمد ماهانه: ${averageRevenue.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>میانگین پرداخت ماهانه: ${averagePayout.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>تعداد ماه‌ها: ${numMonths}</p>`);
    printWindow.document.write(`<p>تعداد تراکنش‌ها/پرداخت‌ها: ${numTransactions}</p>`);
    printWindow.document.write(`<p>رشد درآمد (درصد): ${revenueGrowth.toFixed(2)}%</p>`);
    printWindow.document.write(`<p>مجموع پرداخت‌های پرداخت‌شده: ${totalPaid.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>مجموع پرداخت‌های در انتظار: ${totalPending.toLocaleString('fa-IR')} ریال</p>`);
    printWindow.document.write(`<p>تعداد پرداخت‌های پرداخت‌شده: ${numPaid}</p>`);
    printWindow.document.write(`<p>تعداد پرداخت‌های در انتظار: ${numPending}</p>`);
    printWindow.document.write(`<p>تعداد کل میزبانان: ${numHosts}</p>`);

    printWindow.document.write('<h2>جزئیات درآمد</h2>');
    printWindow.document.write('<table><thead><tr><th>تاریخ</th><th>ماه</th><th>درآمد (ریال)</th></tr></thead><tbody>');
    filteredRevenue.forEach((item) => {
      printWindow.document.write(`<tr><td>${item.date}</td><td>${item.month}</td><td>${item.revenue.toLocaleString('fa-IR')}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');

    printWindow.document.write('<h2>جزئیات پرداخت‌ها</h2>');
    printWindow.document.write('<table><thead><tr><th>تاریخ</th><th>میزبان</th><th>مبلغ (ریال)</th></tr></thead><tbody>');
    filteredPayouts.forEach((item) => {
      printWindow.document.write(`<tr><td>${item.date}</td><td>${item.host}</td><td>${item.amount.toLocaleString('fa-IR')}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');

    printWindow.document.write('<h2>رکوردهای مالی میزبانان (وضعیت فعلی)</h2>');
    printWindow.document.write('<table><thead><tr><th>شناسه میزبان</th><th>مبلغ بدهی (ریال)</th><th>وضعیت</th></tr></thead><tbody>');
    financialRecords.forEach((record) => {
      const statusText = record.status === 'pending' ? 'در انتظار' : 'پرداخت شده';
      printWindow.document.write(`<tr><td>${record.hostId}</td><td>${record.amountOwed.toLocaleString('fa-IR')}</td><td>${statusText}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800">مرکز مالی</h2>

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
        <Button onClick={handlePrint} className="w-full sm:w-auto">
          <FiPrinter className="mr-2" size={16} />
          چاپ داده‌ها
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">بررسی درآمد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">درآمد کل</p>
              <p className="text-lg font-bold">{totalRevenue.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">کارمزد پلتفرم</p>
              <p className="text-lg font-bold">{platformFee.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">پرداخت به میزبانان</p>
              <p className="text-lg font-bold">{totalPayouts.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">هزینه‌های عملیاتی (تخمینی)</p>
              <p className="text-lg font-bold">{operatingExpenses.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">سود خالص پلتفرم</p>
              <p className="text-lg font-bold">{netProfit.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">میانگین درآمد ماهانه</p>
              <p className="text-lg font-bold">{averageRevenue.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">میانگین پرداخت ماهانه</p>
              <p className="text-lg font-bold">{averagePayout.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">تعداد ماه‌ها</p>
              <p className="text-lg font-bold">{numMonths}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">تعداد تراکنش‌ها/پرداخت‌ها</p>
              <p className="text-lg font-bold">{numTransactions}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">رشد درآمد (درصد)</p>
              <p className="text-lg font-bold">{revenueGrowth.toFixed(2)}%</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">مجموع پرداخت‌های پرداخت‌شده</p>
              <p className="text-lg font-bold">{totalPaid.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">مجموع پرداخت‌های در انتظار</p>
              <p className="text-lg font-bold">{totalPending.toLocaleString('fa-IR')} ریال</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">تعداد پرداخت‌های پرداخت‌شده</p>
              <p className="text-lg font-bold">{numPaid}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">تعداد پرداخت‌های در انتظار</p>
              <p className="text-lg font-bold">{numPending}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">تعداد کل میزبانان</p>
              <p className="text-lg font-bold">{numHosts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">درآمد ماهانه</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericLineChart data={filteredRevenue} dataKey="revenue" title="" />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">مجموع پرداخت به میزبانان</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericBarChart data={filteredPayouts} dataKey="amount" title="" />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">مدیریت پرداخت‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">شناسه میزبان</TableHead>
                <TableHead className="text-right">مبلغ بدهی (ریال)</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialRecords.map((record) => (
                <TableRow key={record.hostId}>
                  <TableCell className="text-right">{record.hostId}</TableCell>
                  <TableCell className="text-right">{record.amountOwed.toLocaleString('fa-IR')}</TableCell>
                  <TableCell className="text-right">
                    {record.status === 'pending' ? 'در انتظار' : 'پرداخت شده'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance;