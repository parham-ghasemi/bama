import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from '../../lib/axiosConfig';
import { toast } from 'sonner';

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaRegCalendarAlt,
  FaTimes,
  FaTv,
  FaBed,
  FaBath,
  FaToilet,
} from "react-icons/fa";

import {
  FaLocationDot,
  FaStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";

import { PiSecurityCameraDuotone } from "react-icons/pi";
import { TbAirConditioning, TbFridge } from "react-icons/tb";
import { MdOutlineLtePlusMobiledata } from "react-icons/md";
import { IoIosWater } from "react-icons/io";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdMeetingRoom } from "react-icons/md";
import { IoBedOutline } from "react-icons/io5";
import { RiSparkling2Fill } from "react-icons/ri";

import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";

import Footer from "../../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";

const toPersianNum = (num: number | string): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

const toPersianPrice = (num: number): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishPrice = num.toLocaleString("en-US");
  return englishPrice
    .replace(/\d/g, (d) => persianDigits[parseInt(d)])
    .replace(/,/g, "،");
};

const House = () => {
  const { id } = useParams<{ id: string }>();

  const [villa, setVilla] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [entryDate, setEntryDate] = useState<DateObject>(new DateObject({ calendar: persian }));
  const [exitDate, setExitDate] = useState<DateObject>(new DateObject({ calendar: persian }).add(1, "day"));
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [modalCommentImage, setModalCommentImage] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");

  const [comments, setComments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'booked' | 'not_booked'>('all');

  const filteredComments = useMemo(() => {
    switch (filterType) {
      case 'all':
        return comments;
      case 'booked':
        return comments.filter((c) => c.hasBooked);
      case 'not_booked':
        return comments.filter((c) => !c.hasBooked);
    }
  }, [comments, filterType]);

  // Fetch villa data
  const fetchVilla = async (initialLoad: boolean = true) => {
    if (!id) {
      setError("Villa ID is missing");
      if (initialLoad) setLoading(false);
      return;
    }

    if (initialLoad) setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/villas/${id}`);
      setVilla(res.data);
    } catch (err: any) {
      console.error(err);
      if (initialLoad) setError("Failed to load villa");
      toast.error("Failed to load villa");
    } finally {
      if (initialLoad) setLoading(false);
    }
  };

  // Fetch like status
  const fetchLikeStatus = async () => {
    try {
      const res = await api.get(`/villas/${id}/like`);
      setIsFavorited(res.data.isLiked);
    } catch (err: any) {
      console.error(err);
      toast.error("خطا در بررسی وضعیت علاقه‌مندی");
    }
  };

  useEffect(() => {
    fetchVilla(true);
    fetchLikeStatus();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const res = await api.post(`/villas/${id}/like`);
      setIsFavorited(res.data.liked);
      toast.success(res.data.liked ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
    } catch (err: any) {
      console.error(err);
      toast.error("خطا در تغییر وضعیت علاقه‌مندی");
    }
  };

  useEffect(() => {
    if (villa && villa.comments) {
      setComments(
        villa.comments.map((c: any, index: number) => ({
          name: c.from?.name ? `${c.from.name.first || ''} ${c.from.name.last || ''}` : "ناشناس",
          text: c.content,
          rating: c.rating,
          date: c.date,
          image: c.image && c.image.length > 0 ? c.image[0] : null,
          hasBooked: index % 3 === 0 // For demo: set approximately 1/3 of comments to have the green flair
        }))
      );
    }
  }, [villa]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading villa...</div>;
  if (error || !villa) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error || "Villa not found"}</div>;

  const galleryImages = villa.images
    ? villa.images.map((url: string) =>
      url.startsWith("http") ? url : `${import.meta.env.VITE_BASE_IMG_URL}${url}`
    )
    : [];

  const placeholder = "https://via.placeholder.com/800x500?text=No+Image";

  const ruleConfig = [
    { key: "petsAllowed", label: "ورود حیوانات خانگی" },
    { key: "smokingAllowed", label: "استعمال دخانیات" },
    { key: "eventsAllowed", label: "برگزاری مراسم" },
    { key: "childrenAllowed", label: "پذیرش کودکان" },
    { key: "partiesAllowed", label: "برگزاری مهمانی" },
  ];

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const handleEntryDateChange = (date: DateObject) => {
    setEntryDate(date);
    if (date && exitDate && date.unix > exitDate.unix) {
      setExitDate(new DateObject({ calendar: persian }).set("date", date).add(1, "day"));
    }
  };

  const handleExitDateChange = (date: DateObject) => setExitDate(date);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText || newRating === 0) return;

    setIsSubmitting(true);
    try {
      await api.post(`/villas/${id}/comments`, {
        content: newText,
        rating: newRating,
      });
      toast.success("نظر با موفقیت ارسال شد");
      setNewRating(0);
      setNewText("");
      await fetchVilla(false); // Refetch without full loading
    } catch (err: any) {
      console.error(err);
      toast.error("خطا در ارسال نظر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCommentModal = () => setModalCommentImage(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} size={16} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
    ));
  };

  const renderInteractiveStars = () => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            size={20}
            className={i < newRating ? "text-yellow-400 cursor-pointer" : "text-gray-300 cursor-pointer"}
            onClick={() => setNewRating(i + 1)}
          />
        ))}
      </div>
    );
  };

  const similarVillas = [
    { id: 1, name: "ویلا دوخوابه روستایی گلستان 1", location: "استان البرز، چهارباغ", rating: 4.5, reviews: 150, price: 1150000, image: galleryImages[0] || placeholder, unitCapacity: 5, units: 2 },
    { id: 2, name: "ویلا سه خوابه کوهستانی البرز", location: "استان البرز، کرج", rating: 4.2, reviews: 120, price: 1350000, image: galleryImages[1] || placeholder, unitCapacity: 6, units: 1 },
    { id: 3, name: "ویلا یک خوابه باغی ساوجبلاغ", location: "استان البرز، ساوجبلاغ", rating: 4.4, reviews: 180, price: 950000, image: galleryImages[2] || placeholder, unitCapacity: 4, units: 1 },
    { id: 4, name: "ویلا دوخوابه جنگلی طالقان", location: "استان البرز، طالقان", rating: 4.6, reviews: 200, price: 1250000, image: galleryImages[3] || placeholder, unitCapacity: 5, units: 2 },
  ];

  // Calculate extra people and adjusted price
  const extraAdults = Math.max(0, adults - villa.maxAdults);
  const extraChildren = Math.max(0, children - villa.maxChildren);
  const totalExtra = extraAdults + extraChildren;
  const extraPercent = totalExtra * 5;
  const adjustedPrice = villa.price * (1 + extraPercent / 100);

  return (
    <div className="space-y-5">
      <div className="pt-3">
        <Link to={"/"}>
          <img src="/logo.png" alt="" className="h-11 px-4" />
        </Link>
      </div>

      <div className="h-px w-full bg-neutral-500" />

      <div className="mx-auto min-h-screen w-5xl py-7 space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-3.5">
            <h2 className="font-bold text-xl">{villa.name}</h2>
            <div className="flex gap-3 text-sm">
              <p className="flex items-center gap-2">
                <FaStar size={15} className="text-yellow-400" />
                <span>4.3 (195 نظر ثبت شده)</span>
              </p>
              <p className="flex items-center gap-2">
                <FaLocationDot size={15} className="text-yellow-400" />
                <span>{villa.address || "ایران"}</span>
              </p>
              <p className="bg-red-500 text-white p-1 px-3 rounded-2xl">% تا 5 درصد تخفیف</p>
            </div>
          </div>

          <button
            onClick={toggleFavorite}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition cursor-pointer ${isFavorited ? "border-red-500 text-red-500 hover:bg-red-50" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            {isFavorited ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            <span className="text-xs">{isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
          </button>
        </div>

        {/* Image Gallery */}
        <div className="w-full h-[410px] flex gap-4 group">
          <div className="w-full h-full">
            <img
              src={galleryImages[0] || placeholder}
              alt=""
              className="h-full w-full group-hover:opacity-45 hover:rounded-xl hover:opacity-100 transition-all cursor-pointer duration-300 object-cover"
              onClick={() => openModal(0)}
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="w-[725px] grid grid-cols-2 grid-rows-2 gap-2">
              {galleryImages.slice(1, 5).map((src, idx) => {
                const globalIdx = idx + 1;
                const isLast = idx === 3 && galleryImages.length > 5;
                return (
                  <div
                    key={idx}
                    className="relative overflow-hidden cursor-pointer group-hover:opacity-45 hover:rounded-xl hover:opacity-100 transition-all duration-300"
                    onClick={() => openModal(globalIdx)}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {isLast && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-3xl font-bold">
                        +{toPersianNum(galleryImages.length - 5)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <p className="font-black text-xl">ویلا</p>
            <p className="">اجاره ویلا در چهارباغ به میزبانی وحید رجبلو</p>

            <div className="w-full h-px bg-gray-800 mt-12" />

            <p className="font-black text-xl mt-8">امکان پرداخت اقساطی</p>
            <p className="">پرداخت اقساطی از طریق اسنپ‌پی</p>

            <p className="font-black text-xl mt-8">بدون دغدغه رزرو کن</p>
            <p className="max-w-11/12">در صورت ایجاد شرایط اضطراری در کشور مبلغ رزرو شما به‌طور کامل و بدون قید و شرط بازگشت داده خواهد شد.</p>

            <p className="font-black text-xl mt-8">رزرو آنی و قطعی جاباما</p>
            <p className="max-w-11/12">برای رزرو نهایی این مجتمع اقامتگاهی نیازی به تایید از سمت میزبان نخواهید داشت و رزرو شما قطعی خواهد بود.</p>

            <div className="w-full h-px bg-gray-800 mt-12" />

            <p className="font-black text-xl mt-8">امکانات مهم</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <p className="flex justify-between w-1/2 mx-auto">آنتن دهی موبایل <MdOutlineLtePlusMobiledata size={28} /></p>
              <p className="flex justify-between w-1/2 mx-auto">سیستم سرمایشی <TbAirConditioning size={25} /></p>
              <p className="flex justify-between w-1/2 mx-auto">یخچال <TbFridge size={25} /></p>
              <p className="flex justify-between w-1/2 mx-auto">تلویزیون <FaTv size={25} /></p>
              <p className="flex justify-between w-1/2 mx-auto">آب آشامیدنی <IoIosWater size={25} /></p>
              <p className="flex justify-between w-1/2 mx-auto">نگهبان <PiSecurityCameraDuotone size={25} /></p>
            </div>

            <p className="font-black text-xl mt-16">اطلاعات تکمیلی</p>
            <p className="max-w-11/12 mt-3 text-sm leading-7 text-neutral-700">
              {villa.extraInformation || "اطلاعات تکمیلی در حال تکمیل است."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "تعداد اتاق‌ها", value: villa.numberOfRooms, icon: MdMeetingRoom },
                { label: "تخت دو نفره", value: villa.numberOfDoubleBeds, icon: FaBed },
                { label: "تعداد تخت‌ها", value: villa.numberOfBeds, icon: IoBedOutline },
                { label: "حمام", value: villa.numberOfBathrooms, icon: FaBath },
                { label: "سرویس ایرانی", value: villa.numberOfIranianToilets, icon: FaToilet },
                { label: "سرویس فرنگی", value: villa.numberOfFarangiToilets, icon: FaToilet },
              ].map((item, i) => (
                <div key={i} className="border rounded-xl p-4 flex items-center justify-between">
                  <p className="text-sm text-neutral-700">{item.label}</p>
                  <div className="flex items-center gap-2 text-neutral-900">
                    <item.icon size={22} />
                    <span className="font-bold">{toPersianNum(item.value || 0)}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-black text-xl mt-12 mb-2">مقررات مجتمع اقامتگاهی</p>
            {ruleConfig.map(({ key, label }) => {
              const allowed = !!villa.rules?.[key];
              return (
                <p key={key} className={`flex gap-2 items-center mt-1 ${allowed ? "text-green-700" : "text-red-700"}`}>
                  {allowed ? <FaCheckCircle size={20} color="green" /> : <CiNoWaitingSign size={20} color="red" />}
                  <span>{label}</span>
                </p>
              );
            })}
          </div>

          <div className="col-span-2 border rounded-xl p-5 space-y-3 h-fit">
            <div className="flex justify-between items-center">
              <p className="text-sm">شروع از: {toPersianPrice(adjustedPrice)} تومان / هرشب </p>
              <p className="flex items-center gap-2 text-xs">
                <FaStar size={15} className="text-yellow-400" /> 4.3 (195 نظر ثبت شده)
              </p>
            </div>

            <p className="text-xs text-neutral-500">
              ظرفیت: {toPersianNum(villa.maxAdults || 0)} بزرگسال و {toPersianNum(villa.maxChildren || 0)} کودک
            </p>

            <div className="rounded overflow-hidden border p-2 mx-2">
              <div className="flex w-full">
                <div className="flex items-center justify-center border text-sm text-neutral-600 gap-3 w-full h-full py-5">
                  <FaRegCalendarAlt />
                  <DatePicker
                    className="teal custom-rmdp"
                    numberOfMonths={2}
                    value={entryDate}
                    onChange={handleEntryDateChange}
                    calendar={persian}
                    locale={persian_fa}
                    format="dddd DD MMMM"
                    render={(value, openCalendar) => (
                      <span onClick={openCalendar} className="cursor-pointer">
                        {entryDate ? entryDate.format("dddd DD MMMM") : "تاریخ ورود"}
                      </span>
                    )}
                  />
                </div>
                <div className="flex items-center justify-center border text-sm text-neutral-600 gap-3 w-full h-full py-5">
                  <FaRegCalendarAlt />
                  <DatePicker
                    className="teal custom-rmdp"
                    numberOfMonths={2}
                    value={exitDate}
                    onChange={handleExitDateChange}
                    calendar={persian}
                    locale={persian_fa}
                    format="dddd DD MMMM"
                    render={(value, openCalendar) => (
                      <span onClick={openCalendar} className="cursor-pointer">
                        {exitDate ? exitDate.format("dddd DD MMMM") : "تاریخ خروج"}
                      </span>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="rounded overflow-hidden border p-2 mx-2">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm">بزرگسال (بالای ۱۲ سال)</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition cursor-pointer">-</button>
                  <span className="w-8 text-center text-sm">{toPersianNum(adults)}</span>
                  <button
                    disabled={adults >= (villa.maxAdults + 2)}
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">کودک (۲ تا ۱۲ سال)</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition cursor-pointer">-</button>
                  <span className="w-8 text-center text-sm">{toPersianNum(children)}</span>
                  <button
                    disabled={children >= (villa.maxChildren + 2)}
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              {totalExtra > 0 && (
                <p className="text-orange-600 text-xs mt-2">شما {toPersianNum(totalExtra)} نفر بیش از ظرفیت انتخاب کرده‌اید. {toPersianNum(extraPercent)}% به قیمت اضافه خواهد شد (۵% به ازای هر نفر اضافی).</p>
              )}
            </div>

            <Link
              to={`/house/${id}/book`}
              state={{
                villa,
                entryStr: entryDate.format("YYYY/MM/DD"),
                exitStr: exitDate.format("YYYY/MM/DD"),
                adults,
                children
              }}
              className="w-full bg-neutral-800 hover:bg-neutral-900 cursor-pointer rounded-lg text-white py-2 font-bold text-md inline-block text-center"
            >
              رزرو
            </Link>
          </div>
        </div>

        {/* Comments section */}
        <div className="space-y-5 mt-16">
          <h2 className="font-bold text-xl">نظرات کاربران</h2>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 relative">
            <h3 className="font-bold text-md mb-2">خلاصه نظرات</h3>
            <p className="text-sm">{villa.aiSummary || "هنوز خلاصه ای تولید نشده است."}</p>
            <div className="absolute left-2 bottom-2 flex gap-1 items-center opacity-50">
              <span className="text-cyan-700 text-xs">برگرفته از هوش مصنوعی</span>
              <RiSparkling2Fill className="text-cyan-700" size={14} />
            </div>
          </div>

          <Tabs value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
            <TabsList className="justify-start">
              <TabsTrigger value="all">همه نظرات</TabsTrigger>
              <TabsTrigger value="booked">میهمانان رزرو کرده</TabsTrigger>
              <TabsTrigger value="not_booked">سایرین</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {filteredComments.map((comment, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-md bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <p className="font-bold text-base flex items-center gap-2">
                      {comment.name}
                      {comment.hasBooked && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          مهمان سابق
                        </Badge>
                      )}
                    </p>
                    <div className="flex mt-1">{renderStars(comment.rating)}</div>
                  </div>
                  <p className="text-xs text-gray-500">{comment.date}</p>
                </div>
                <p className="text-sm mb-3">{comment.text}</p>
                {comment.image && (
                  <img
                    src={comment.image}
                    alt="تصویر پیوست نظر"
                    className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => setModalCommentImage(comment.image)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border rounded-lg p-4 shadow-md bg-white">
            <h3 className="font-bold text-md mb-4">اضافه کردن نظر جدید</h3>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <Label className="mb-1 block">امتیاز:</Label>
                {renderInteractiveStars()}
              </div>
              <Textarea placeholder="نظر شما" value={newText} onChange={(e) => setNewText(e.target.value)} required />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
              </Button>
            </form>
          </div>
        </div>

        {/* Similar villas */}
        <div className="space-y-5 mt-8">
          <h2 className="font-bold text-xl">ویلا های مشابه</h2>
          <Swiper dir="rtl" slidesPerView={3} spaceBetween={24} breakpoints={{ 0: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="mySwiper">
            {similarVillas.map((villa) => (
              <SwiperSlide key={villa.id}>
                <Link to={`/house/${villa.id}`} className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition block bg-white">
                  <img src={villa.image} alt={villa.name} className="w-full h-48 object-cover" />
                  <div className="p-4 space-y-2">
                    <p className="flex items-center gap-2 text-base font-light">
                      <FaStar size={18} className="text-yellow-400" /> {toPersianNum(villa.rating)} ({toPersianNum(villa.reviews)} دیدگاه)
                    </p>
                    <h3 className="font-bold text-lg">{villa.name}</h3>
                    <p className="text-xs text-gray-500">{villa.location} . هر واحد {toPersianNum(villa.unitCapacity)} نفر ظرفیت {toPersianNum(villa.units)} واحد</p>
                    <p className="text-sm">{toPersianPrice(villa.price)} تومان / هرشب</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Image modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
            <button className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition" onClick={closeModal}>
              <FaTimes size={24} />
            </button>
            <img src={galleryImages[selectedIndex] || placeholder} alt="" className="w-[80vw] h-[80vh] object-contain rounded-lg shadow-2xl" />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button className="text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                <FaArrowLeft size={28} />
              </button>
              <button className="text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                <FaArrowRight size={28} />
              </button>
            </div>
            <div className="text-white mt-2 text-sm">{selectedIndex + 1} / {galleryImages.length}</div>
          </div>
        </div>
      )}

      {/* Comment image modal */}
      {modalCommentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={closeCommentModal}>
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
            <button className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition" onClick={closeCommentModal}>
              <FaTimes size={24} />
            </button>
            <img src={modalCommentImage} alt="تصویر نظر" className="w-[80vw] h-[80vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default House;