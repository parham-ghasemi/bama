import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs/tabs";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaTimes } from "react-icons/fa";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const toPersianNum = (num: number | string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

const toPersianPrice = (num: number): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishPrice = num.toLocaleString('en-US');
  return englishPrice.replace(/\d/g, (d) => persianDigits[parseInt(d)]).replace(/,/g, '،');
};

interface Trip {
  id: number;
  villaName: string;
  startDate: DateObject;
  endDate: DateObject;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  image: string;
  rating: number;
  comment: string;
  isActive: boolean;
  score: number;
}

const hardcodedTrips: Trip[] = [
  {
    id: 1,
    villaName: "ویلای لوکس بهشت",
    startDate: new DateObject({ calendar: persian, locale: persian_fa, year: 1404, month: 9, day: 1 }),
    endDate: new DateObject({ calendar: persian, locale: persian_fa, year: 1404, month: 9, day: 3 }),
    nights: 2,
    pricePerNight: 5000000,
    totalPrice: 10000000,
    image: "/villa/1.jpg",
    rating: 4.5,
    comment: "عالی بود، همه چیز تمیز و مرتب بود. حتما دوباره می‌آیم.",
    isActive: false, // Past trip
    score: 6,
  },
  {
    id: 2,
    villaName: "ویلای ساحلی آرام",
    startDate: new DateObject({ calendar: persian, locale: persian_fa, year: 1404, month: 10, day: 15 }),
    endDate: new DateObject({ calendar: persian, locale: persian_fa, year: 1404, month: 10, day: 18 }),
    nights: 3,
    pricePerNight: 4000000,
    totalPrice: 12000000,
    image: "/villa/2.jpg",
    rating: 0, // No rating yet for active trip
    comment: "", // No comment yet for active trip
    isActive: true, // Active trip
    score: 0,
  },
];

interface TripItemProps {
  trip: Trip;
  onClick: () => void;
  onReport?: () => void;
}

const TripItem = ({ trip, onClick, onReport }: TripItemProps) => {
  return (
    <div
      className="mt-7 cursor-pointer group flex gap-4 border rounded-xl p-4 hover:shadow-md transition"
      onClick={onClick}
    >
      <img
        src={trip.image}
        alt={trip.villaName}
        className="w-32 h-32 object-cover rounded-lg group-hover:rounded group-hover:rounded-b-xs transition-all"
      />
      <div className="flex flex-col justify-between">
        <p className="text-lg font-semibold">{trip.villaName}</p>
        <p className="text-gray-400 text-sm">
          {toPersianNum(trip.nights)} شب اقامت
        </p>
        <p className="text-sm mt-2">
          مجموع: {toPersianPrice(trip.totalPrice)} ریال
        </p>
        {trip.isActive && (
          <button
            className="mt-2 bg-red-500 text-white py-1 px-2 rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onReport) onReport();
            }}
          >
            گزارش تخلف
          </button>
        )}
      </div>
    </div>
  );
};

const TripDetailsModal = ({ trip, isOpen, onClose }: { trip: Trip | null; isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();

  if (!isOpen || !trip) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl p-6  max-w-lg w-full space-y-6 dir-rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 left-4 text-gray-600 hover:text-black transition"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>
        <h2 className="font-bold text-xl text-center">{trip.villaName}</h2>
        <img
          src={trip.image}
          alt={trip.villaName}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="space-y-2 px-5">
          <p className="flex justify-between">
            <span>تاریخ شروع:</span>
            <span>{trip.startDate.format("YYYY/MM/DD")}</span>
          </p>
          <p className="flex justify-between">
            <span>تاریخ پایان:</span>
            <span>{trip.endDate.format("YYYY/MM/DD")}</span>
          </p>
          <p className="flex justify-between">
            <span>قیمت هر شب:</span>
            <span>{toPersianPrice(trip.pricePerNight)} ریال</span>
          </p>
          <p className="flex justify-between">
            <span>مجموع:</span>
            <span>{toPersianPrice(trip.totalPrice)} ریال</span>
          </p>
          <p className="flex justify-between border-t py-3">
            <span>امتیاز دریافتی:</span>
            <div className="flex items-center gap-0.5 e-underline ">
              <FaStar size={18} className="text-purple-500" />
              <span className="font-semibold">
                {toPersianNum(trip.score)}
              </span>
            </div>
          </p>

          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <p className="font-semibold mt-2">نظر شما:</p>
              <div className="flex items-center gap-0.5">
                <FaStar size={18} className="text-yellow-400" />
                <span className="font-bold">
                  {toPersianNum(trip.rating)}
                </span>
              </div>
            </div>
            <p className="text-gray-600">{trip.comment}</p>
          </div>
        </div>
        <button
          className="w-full bg-neutral-800 text-white py-2 rounded-md hover:bg-neutral-900 transition cursor-pointer text-[15px] font-bold"
          onClick={() => navigate('/house')}
        >
          رزرو مجدد
        </button>
      </div>
    </div>
  );
};

const ReportModal = ({ trip, isOpen, onClose }: { trip: Trip | null; isOpen: boolean; onClose: () => void }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additional, setAdditional] = useState('');

  const reasons = [
    "بد اخلاقی میزبان",
    "تفاوت بسیار نسبت به عکس ها",
    "عدم تمیزی محل",
    "مشکلات فنی (آب، برق، و غیره)",
    "سایر"
  ];

  useEffect(() => {
    if (isOpen) {
      setSelectedReasons([]);
      setAdditional('');
    }
  }, [isOpen]);

  if (!isOpen || !trip) return null;

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    console.log({
      tripId: trip.id,
      reasons: selectedReasons,
      additional: additional
    });
    toast.success('گزارش با موفقیت ارسال شد');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl p-6 max-w-lg w-full space-y-6 dir-rtl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 left-4 text-gray-600 hover:text-black transition"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>
        <h2 className="font-bold text-xl text-center text-gray-800">گزارش تخلف برای {trip.villaName}</h2>
        <div className="space-y-4">
          <p className="font-semibold text-gray-700">انتخاب دلایل:</p>
          <div className="flex flex-wrap gap-2">
            {reasons.map(reason => (
              <button
                key={reason}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${selectedReasons.includes(reason)
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                onClick={() => toggleReason(reason)}
              >
                {reason}
              </button>
            ))}
          </div>
          <p className="font-semibold text-gray-700">توضیحات اضافی:</p>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition duration-200 resize-none"
            rows={4}
            value={additional}
            onChange={e => setAdditional(e.target.value)}
            placeholder="توضیحات اضافی را اینجا وارد کنید..."
          />
        </div>
        <button
          className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200 cursor-pointer text-[15px] font-bold shadow-md"
          onClick={handleSubmit}
        >
          ارسال گزارش
        </button>
      </div>
    </div>
  );
};

const Trips = () => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedReportTrip, setSelectedReportTrip] = useState<Trip | null>(null);

  const allTrips = hardcodedTrips;
  const activeTrips = hardcodedTrips.filter((trip) => trip.isActive);

  const openModal = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const closeModal = () => {
    setSelectedTrip(null);
  };

  const openReportModal = (trip: Trip) => {
    setSelectedReportTrip(trip);
  };

  const closeReportModal = () => {
    setSelectedReportTrip(null);
  };

  return (
    <div>
      <h2 className="font-semibold text-lg"> سفرهای من </h2>

      <Tabs defaultValue="all" className="mt-8" dir="rtl">
        <TabsList className="">
          <TabsTrigger value="all" className="cursor-pointer">همه سفرها</TabsTrigger>
          <TabsTrigger value="active" className="cursor-pointer">سفرهای فعال</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {allTrips.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {allTrips.map((trip) => (
                <TripItem
                  key={trip.id}
                  trip={trip}
                  onClick={() => openModal(trip)}
                  onReport={trip.isActive ? () => openReportModal(trip) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/007/104/553/small/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                alt="تصویر لیست خالی مورد علاقه‌ها"
                className="w-64 h-auto mb-4"
              />
              <p className="text-gray-500 text-center">برای ثبت اولین سفر خود، پیشنهادهای جاباما و یا تجربه‌های مسافران ما را مشاهده‌کنید.  </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="active">
          {activeTrips.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {activeTrips.map((trip) => (
                <TripItem
                  key={trip.id}
                  trip={trip}
                  onClick={() => openModal(trip)}
                  onReport={() => openReportModal(trip)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/007/104/553/small/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                alt="تصویر لیست خالی مورد علاقه‌ها"
                className="w-64 h-auto mb-4"
              />
              <p className="text-gray-500 text-center">در حال حاضر هیچ سفر فعالی ندارید </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TripDetailsModal trip={selectedTrip} isOpen={!!selectedTrip} onClose={closeModal} />
      <ReportModal trip={selectedReportTrip} isOpen={!!selectedReportTrip} onClose={closeReportModal} />
    </div>
  );
};

export default Trips;