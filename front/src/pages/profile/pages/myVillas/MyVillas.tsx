// File: /pages/myVillas/index.tsx
import React, { Suspense, lazy } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs/tabs-component/tabs';

const BookingInfo = lazy(() => import('./tabs/BookingInfo'));
const VillasInfo = lazy(() => import('./tabs/VillasInfo'));
const OverallData = lazy(() => import('./tabs/OverallData'));

export default function MyVillasPage() {
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-semibold mb-4">داشبورد ویلاهای من</h1>

      <Tabs defaultValue="booking" className="w-full" dir='rtl'>
        <TabsList>
          <TabsTrigger value="booking">اطلاعات رزروها</TabsTrigger>
          <TabsTrigger value="villas">اطلاعات ویلاها</TabsTrigger>
          <TabsTrigger value="overall">داده‌های کلی</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <Suspense fallback={<div className="text-center py-10">در حال بارگذاری...</div>}>
            <TabsContent value="booking">
              <BookingInfo />
            </TabsContent>

            <TabsContent value="villas">
              <VillasInfo />
            </TabsContent>

            <TabsContent value="overall">
              <OverallData />
            </TabsContent>
          </Suspense>
        </div>
      </Tabs>
    </div>
  );
}

