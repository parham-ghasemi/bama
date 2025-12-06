import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs/tabs";

const Trips = () => {
  return (
    <div>
      <h2 className="font-semibold text-lg"> سفرهای من </h2>

      <Tabs defaultValue="all" className="mt-8" dir="rtl">
        <TabsList className="">
          <TabsTrigger value="all" className="cursor-pointer">همه سفرها</TabsTrigger>
          <TabsTrigger value="active" className="cursor-pointer">سفرهای فعال</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="flex flex-col items-center justify-center">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/007/104/553/small/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
              alt="تصویر لیست خالی مورد علاقه‌ها"
              className="w-64 h-auto mb-4"
            />
            <p className="text-gray-500 text-center">برای ثبت اولین سفر خود، پیشنهادهای جاباما و یا تجربه‌های مسافران ما را مشاهده‌کنید.  </p>
          </div>
        </TabsContent>
        <TabsContent value="active">
          <div className="flex flex-col items-center justify-center">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/007/104/553/small/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
              alt="تصویر لیست خالی مورد علاقه‌ها"
              className="w-64 h-auto mb-4"
            />
            <p className="text-gray-500 text-center">در حال حاضر هیچ سفر فعالی ندارید </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Trips