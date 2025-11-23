import GenericLineChart from '../../components/charts/GenericLineChart';
import GenericBarChart from '../../components/charts/GenericBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// Import PayoutsTable

import { revenueData, payoutData } from '../../data/finance';

const Finance = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مرکز مالی</h2>
      <Card>
        <CardHeader><CardTitle>بررسی درآمد</CardTitle></CardHeader>
        <CardContent>
          <p>درآمد کل: 1,000,000,000 ریال</p>
          <p>کارمزد پلتفرم: 100,000,000 ریال</p>
          <p>پرداخت به میزبانان: 900,000,000 ریال</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>درآمد ماهانه</CardTitle></CardHeader>
          <CardContent><GenericLineChart data={revenueData} dataKey="revenue" title="" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>مجموع پرداخت به میزبانان</CardTitle></CardHeader>
          <CardContent><GenericBarChart data={payoutData} dataKey="amount" title="" /></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>مدیریت پرداخت‌ها</CardTitle></CardHeader>
        <CardContent>{/* <PayoutsTable /> */}</CardContent>
      </Card>
    </div>
  );
};

export default Finance;