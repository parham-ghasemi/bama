import { Button } from "../../../../../components/ui/button"; // ShadCN Button
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"; // ShadCN Card
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Assuming Recharts is installed for charts
import { Download } from "lucide-react"; // React Icons

// Fake data
const fakeStats = {
  totalBookings: 150,
  totalIncome: 450000000,
  villas: [
    { name: "ویلای ساحلی", bookings: 50, income: 100000000 },
    { name: "ویلای کوهستانی", bookings: 60, income: 180000000 },
    { name: "ویلای شهری", bookings: 40, income: 170000000 },
  ],
};

const fakeChartData = [
  { month: "فروردین", bookings: 10, income: 20000000 },
  { month: "اردیبهشت", bookings: 15, income: 30000000 },
  // Add more months
];

const OverallData = () => {
  const handleExportExcel = () => {
    // Fake export: In real, use xlsx library
    console.log("Exporting to Excel...");
  };

  const handleExportPdf = () => {
    // Fake export: In real, use jspdf
    console.log("Exporting to PDF...");
  };

  return (
    <div className="w-full mt-8">
      <h2 className="font-semibold text-lg mb-4">داده‌های کلی</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>تعداد کل رزروها</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{fakeStats.totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>درآمد کلی</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{fakeStats.totalIncome.toLocaleString("fa-IR")} تومان</p>
          </CardContent>
        </Card>
      </div>
      <h3 className="text-md font-semibold mb-2">عملکرد ویلاها</h3>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {fakeStats.villas.map((villa, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{villa.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>رزروها: {villa.bookings}</p>
              <p>درآمد: {villa.income.toLocaleString("fa-IR")} تومان</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <h3 className="text-md font-semibold mb-2">نمودار عملکرد</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={fakeChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#8884d8" name="رزروها" />
          <Bar dataKey="income" fill="#82ca9d" name="درآمد" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-end gap-4 mt-8">
        <Button onClick={handleExportExcel}>
          <Download className="mr-1" /> خروجی اکسل
        </Button>
        <Button onClick={handleExportPdf}>
          <Download className="mr-1" /> خروجی PDF
        </Button>
      </div>
    </div>
  );
};

export default OverallData;