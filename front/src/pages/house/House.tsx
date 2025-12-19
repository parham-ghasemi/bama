import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaRegCalendarAlt, FaTimes, FaTv } from "react-icons/fa"
import { PiSecurityCameraDuotone } from "react-icons/pi";
import { TbAirConditioning, TbFridge } from "react-icons/tb";
import { MdOutlineLtePlusMobiledata } from "react-icons/md";
import { FaLocationDot, FaStar, FaHeart, FaRegHeart, FaBrain } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import "react-multi-date-picker/styles/colors/teal.css"
import { IoIosWater } from "react-icons/io";
import { CiNoWaitingSign } from "react-icons/ci";
import Footer from "../../components/Footer";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { RiSparkling2Fill } from "react-icons/ri";

const toPersianNum = (num: number | string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

const toPersianPrice = (num: number): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishPrice = num.toLocaleString('en-US');
  return englishPrice.replace(/\d/g, (d) => persianDigits[parseInt(d)]).replace(/,/g, '،');
};

const House = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [entryDate, setEntryDate] = useState<DateObject>(new DateObject({ calendar: persian }));
  const [exitDate, setExitDate] = useState<DateObject>(new DateObject({ calendar: persian }).add(1, "day"));
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [modalCommentImage, setModalCommentImage] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);

  const initialComments = [
    {
      name: "علی رضایی",
      text: "ویلا خیلی تمیز و راحت بود. محیط آرام و میزبان بسیار مهمان‌نواز. حتما دوباره می‌آیم.",
      rating: 5,
      date: "۱۴۰۳/۰۹/۱۰",
      image: "/villa/1.jpg"
    },
    {
      name: "سارا محمدی",
      text: "مکان عالی برای تعطیلات خانوادگی. امکانات کامل بود اما اینترنت ضعیف بود.",
      rating: 4,
      date: "۱۴۰۳/۰۸/۲۵",
      image: "/villa/3.jpg"
    },
    {
      name: "محمد احمدی",
      text: "قیمت مناسب و ویو زیبا. فقط دسترسی به فروشگاه کمی دور بود.",
      rating: 4,
      date: "۱۴۰۳/۰۷/۱۵",
      image: null
    },
    {
      name: "فاطمه کریمی",
      text: "همه چیز عالی بود. تمیزی و امنیت بالا.推荐 به دوستان.",
      rating: 5,
      date: "۱۴۰۳/۰۶/۰۵",
      image: "/villa/5.jpg"
    },
    {
      name: "رضا نوری",
      text: "ویلا خوب بود اما سیستم سرمایشی نیاز به تعمیر داشت.",
      rating: 3,
      date: "۱۴۰۳/۰۵/۲۰",
      image: "/villa/2.jpg"
    }
  ];

  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    const favorited = localStorage.getItem('isFavorited') === 'true';
    setIsFavorited(favorited);
  }, []);

  const toggleFavorite = () => {
    const newValue = !isFavorited;
    setIsFavorited(newValue);
    localStorage.setItem('isFavorited', newValue.toString());
  };

  const images = [
    "/villa/1.jpg",
    "/villa/2.jpg",
    "/villa/3.jpg",
    "/villa/4.jpg",
    "/villa/5.jpg"
  ];

  const similarVillas = [
    {
      id: 1,
      name: "ویلا دوخوابه روستایی گلستان 1",
      location: "استان البرز، چهارباغ",
      rating: 4.5,
      reviews: 150,
      price: 1150000,
      image: images[0],
      unitCapacity: 5,
      units: 2
    },
    {
      id: 2,
      name: "ویلا سه خوابه کوهستانی البرز",
      location: "استان البرز، کرج",
      rating: 4.2,
      reviews: 120,
      price: 1350000,
      image: images[1],
      unitCapacity: 6,
      units: 1
    },
    {
      id: 3,
      name: "ویلا یک خوابه باغی ساوجبلاغ",
      location: "استان البرز، ساوجبلاغ",
      rating: 4.4,
      reviews: 180,
      price: 950000,
      image: images[2],
      unitCapacity: 4,
      units: 1
    },
    {
      id: 4,
      name: "ویلا دوخوابه جنگلی طالقان",
      location: "استان البرز، طالقان",
      rating: 4.6,
      reviews: 200,
      price: 1250000,
      image: images[3],
      unitCapacity: 5,
      units: 2
    }
  ];

  // Fake AI overview
  const aiOverview = "بر اساس نظرات کاربران، این ویلا دارای محیط آرام، تمیزی بالا و امکانات مناسب است. اکثر کاربران از مهمان‌نوازی میزبان راضی بودند، اما برخی به ضعف اینترنت و دسترسی به مراکز خرید اشاره کرده‌اند. امتیاز کلی: ۴.۳ از ۵.";

  // Fake occupied dates (using Persian calendar dates, e.g., assuming current year/month for demo)
  const occupiedDates = [
    new DateObject({ calendar: persian, year: 1404, month: 9, day: 10 }),
    new DateObject({ calendar: persian, year: 1404, month: 9, day: 15 }),
    new DateObject({ calendar: persian, year: 1404, month: 9, day: 20 }),
    new DateObject({ calendar: persian, year: 1404, month: 10, day: 1 }),
    new DateObject({ calendar: persian, year: 1404, month: 10, day: 2 }),
    new DateObject({ calendar: persian, year: 1404, month: 10, day: 5 }),
  ];

  const mapDays = ({ date }: { date: DateObject }) => {
    if (occupiedDates.some(occ => occ.year === date.year && occ.month.number === date.month.number && occ.day === date.day)) {
      return {
        disabled: true,
        className: 'text-gray-500 cursor-not-allowed',
        title: 'ویلا در این تاریخ اشغال شده است',
        children: (
          <div className="relative w-full h-full flex items-center justify-center">
            {date.format('D')}
            <div className="absolute w-[70%] h-[2px] bg-red-500 transform -rotate-45" />
          </div>
        ),
      };
    }
  };

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

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleEntryDateChange = (date: DateObject) => {
    setEntryDate(date);
    if (date && exitDate && date.unix > exitDate.unix) {
      setExitDate(new DateObject({ calendar: persian }).set("date", date).add(1, "day"));
    }
  };

  const handleExitDateChange = (date: DateObject) => {
    setExitDate(date);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newText || newRating === 0) return;

    const currentDate = new DateObject({ calendar: persian }).format('YYYY/MM/DD');
    const imageUrl = newImage ? URL.createObjectURL(newImage) : null;

    const newComment = {
      name: newName,
      text: newText,
      rating: newRating,
      date: currentDate,
      image: imageUrl
    };

    setComments([...comments, newComment]);
    setNewName('');
    setNewRating(0);
    setNewText('');
    setNewImage(null);
  };

  const closeCommentModal = () => {
    setModalCommentImage(null);
  };

  return (
    <div className="space-y-5">
      <div className="pt-3">
        <Link to={'/'} className="">
          <img src="/logo.png" alt="" className="h-11 px-4" />
        </Link>
      </div>

      <div className="h-px w-full bg-neutral-500" />

      <div className="mx-auto min-h-screen w-5xl py-7 space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-3.5">
            <h2 className="font-bold text-xl">ویلا دوخوابه روستایی گلستان 2 </h2>
            <div className="flex gap-3 text-sm">
              <p className="flex items-center gap-2">
                <span>
                  <FaStar size={15} className="text-yellow-400" />
                </span>
                <span>
                  4.3
                  (195 نظر ثبت شده)
                </span>
              </p>

              <p className="flex items-center gap-2">
                <span>
                  <FaLocationDot size={15} className="text-yellow-400" />
                </span>
                <span>
                  استان البرز، چهارباغ
                </span>
              </p>

              <p className="bg-red-500 text-white p-1 px-3 rounded-2xl">
                % تا 5 درصد تخفیف
              </p>
            </div>
          </div>

          <button
            onClick={toggleFavorite}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition cursor-pointer ${isFavorited ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {isFavorited ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            <span className="text-xs">{isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
          </button>
        </div>


        {/* IMAGE GALLERY START */}
        <div className="w-full h-[410px] flex gap-4 group">
          <div className="w-full h-full">
            <img
              src={images[0]}
              alt=""
              className="h-full group-hover:opacity-45 hover:rounded-xl hover:opacity-100 transition-all cursor-pointer duration-300 object-cover"
              onClick={() => openModal(0)}
            />
          </div>

          <div className="w-[725px] grid grid-cols-2 grid-rows-2 gap-2">
            <img
              src={images[1]}
              alt=""
              className="h-full group-hover:opacity-45 hover:rounded-xl hover:opacity-100 transition-all cursor-pointer duration-300 object-cover"
              onClick={() => openModal(1)}
            />
            <img
              src={images[2]}
              alt=""
              className="h-full group-hover:opacity-45 hover:rounded-xl hover:opacity-100 transition-all cursor-pointer duration-300 object-cover"
              onClick={() => openModal(2)}
            />
            <img
              src={images[3]}
              alt=""
              className="h-full group-hover:opacity-45 hover:rounded-xl hover:opacity-100 transition-all cursor-pointer duration-300 object-cover"
              onClick={() => openModal(3)}
            />
            <img
              src={images[4]}
              alt=""
              className="h-full group-hover:opacity-45 hover:rounded-xl hover:opacity-100 transition-all cursor-pointer duration-300 object-cover"
              onClick={() => openModal(4)}
            />
          </div>
        </div>
        {/* IMAGE GALLERY END */}


        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <p className="font-black text-xl">ویلا</p>
            <p className="">اجاره ویلا در چهارباغ به میزبانی وحید رجبلو </p>

            <div className="w-full h-px bg-gray-800 mt-12" />

            <p className="font-black text-xl mt-8">امکان پرداخت اقساطی</p>
            <p className="">پرداخت اقساطی از طریق اسنپ‌پی </p>

            <p className="font-black text-xl mt-8">بدون دغدغه رزرو کن </p>
            <p className="max-w-11/12">در صورت ایجاد شرایط اضطراری در کشور مبلغ رزرو شما به‌طور کامل و بدون قید و شرط بازگشت داده خواهد شد.  </p>

            <p className="font-black text-xl mt-8">رزرو آنی و قطعی جاباما </p>
            <p className="max-w-11/12">برای رزرو نهایی این مجتمع اقامتگاهی نیازی به تایید از سمت میزبان نخواهید داشت و رزرو شما قطعی خواهد بود.  </p>

            <div className="w-full h-px bg-gray-800 mt-12" />

            <div className="grid grid-cols-2 gap-4 mt-8">
              <p className="flex justify-between w-1/2 mx-auto">
                آنتن دهی موبایل
                <MdOutlineLtePlusMobiledata size={28} />
              </p>
              <p className="flex justify-between w-1/2 mx-auto">
                سیستم سرمایشی
                <TbAirConditioning size={25} />
              </p>

              <p className="flex justify-between w-1/2 mx-auto">
                یخچال
                <TbFridge size={25} />
              </p>
              <p className="flex justify-between w-1/2 mx-auto">
                تلویزیون
                <FaTv size={25} />
              </p>

              <p className="flex justify-between w-1/2 mx-auto">
                آب آشامیدنی
                <IoIosWater size={25} />
              </p>
              <p className="flex justify-between w-1/2 mx-auto">
                نگهبان
                <PiSecurityCameraDuotone size={25} />
              </p>
            </div>

            <p className="font-black text-xl mt-16">اطلاعات و فاصله مراکز نزدیک مجتمع اقامتگاهی </p>
            <p className="max-w-11/12 mt-3">تمامی فواصل به صورت حدودی و در شرایط معمولی ترافیک می‌باشد.  </p>

            <p className="font-black text-xl mt-12 mb-2">مقررات مجتمع اقامتگاهی </p>
            <p className="flex gap-2 items-center mt-3 text-green-700">
              <FaCheckCircle size={20} color="green" />
              <span>پذیرش گروه‌های مجردی (فقط آقایان یا خانم‌ها) فراهم است.  </span>
            </p>
            <p className="flex gap-2 items-center mt-1 text-red-700">
              <CiNoWaitingSign size={20} color="red" />
              <span>استعمال دخانیات مجاز نیست.  </span>
            </p>
            <p className="flex gap-2 items-center mt-1 text-red-700">
              <CiNoWaitingSign size={20} color="red" />
              <span>ورود حیوانات خانگی مجاز نیست.  </span>
            </p>
            <p className="flex gap-2 items-center mt-1 text-red-700">
              <CiNoWaitingSign size={20} color="red" />
              <span>برگزاری مراسم مجاز نیست.  </span>
            </p>

          </div>

          <div className="col-span-2 border rounded-xl p-5 space-y-3 h-fit" >
            <div className="flex justify-between items-center">
              <p className="text-sm">شروع از: 1,210,000 تومان / هرشب</p>
              <p className="flex items-center gap-2 text-xs">
                <span>
                  <FaStar size={15} className="text-yellow-400" />
                </span>
                <span>
                  4.3
                  (195 نظر ثبت شده)
                </span>
              </p>

            </div>

            <div className="rounded overflow-hidden border p-2 mx-2">
              <div className="flex w-full">
                <div className="flex items-center justify-center border text-sm text-neutral-600 gap-3 w-full h-full py-5">
                  <FaRegCalendarAlt />
                  <DatePicker
                    className="teal custom-rmdp"
                    numberOfMonths={2}
                    showOtherDays={true}
                    value={entryDate}
                    onChange={handleEntryDateChange}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-center"
                    minDate={new DateObject({ calendar: persian })}
                    maxDate={exitDate}
                    format="dddd DD MMMM"
                    portal={false}
                    offsetY={15}
                    mapDays={mapDays}
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
                    showOtherDays={true}
                    value={exitDate}
                    onChange={handleExitDateChange}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-center"
                    minDate={entryDate || new DateObject({ calendar: persian })}
                    format="dddd DD MMMM"
                    portal={false}
                    offsetY={15}
                    mapDays={mapDays}
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
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{toPersianNum(adults)}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">کودک (۲ تا ۱۲ سال)</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{toPersianNum(children)}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full bg-neutral-800 hover:bg-neutral-900 cursor-pointer rounded-lg text-white py-2 font-bold text-md">
              رزرو
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-400 mt-16" />

        {/* COMMENTS SECTION START */}
        <div className="space-y-5 mt-16">
          <h2 className="font-bold text-xl">نظرات کاربران</h2>

          {/* Fake AI Overview */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 relative">
            <h3 className="font-bold text-md mb-2">خلاصه نظرات</h3>
            <p className="text-sm">{aiOverview}</p>

            <div className="absolute left-2 bottom-2 flex gap-1 items-center opacity-50">
              <span className="text-cyan-700 text-xs">برگرفته از هوش مصنوعی</span>
              <RiSparkling2Fill className="text-cyan-700" size={14} />
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-md bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <p className="font-bold text-base">{comment.name}</p>
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

          {/* Add Comment Form */}
          <div className="mt-8 border rounded-lg p-4 shadow-md bg-white">
            <h3 className="font-bold text-md mb-4">اضافه کردن نظر جدید</h3>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <input
                type="text"
                placeholder="نام شما"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <div>
                <p className="text-sm mb-1">امتیاز:</p>
                {renderInteractiveStars()}
              </div>
              <textarea
                placeholder="نظر شما"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full p-2 border rounded h-24"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                ارسال نظر
              </button>
            </form>
          </div>
        </div>
        {/* COMMENTS SECTION END */}

        {/* SIMILAR VILLAS SECTION START */}
        <div className="space-y-5 mt-8">
          <h2 className="font-bold text-xl">ویلا های مشابه</h2>
          <Swiper
            dir="rtl"
            slidesPerView={3}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="mySwiper"
          >
            {similarVillas.map((villa) => (
              <SwiperSlide key={villa.id}>
                <Link to={`/villa/${villa.id}`} className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition block bg-white">
                  <img
                    src={villa.image}
                    alt={villa.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <p className="flex items-center gap-2 text-base font-light">
                      <FaStar size={18} className="text-yellow-400" />
                      {toPersianNum(villa.rating)} ({toPersianNum(villa.reviews)} دیدگاه)
                    </p>
                    <h3 className="font-bold text-lg">{villa.name}</h3>
                    <p className="text-xs text-gray-500">
                      {villa.location} . هر واحد {toPersianNum(villa.unitCapacity)} نفر ظرفیت {toPersianNum(villa.units)} واحد
                    </p>
                    <p className="text-sm">
                      {toPersianPrice(villa.price)} تومان / هرشب
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* SIMILAR VILLAS SECTION END */}

      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
              onClick={closeModal}
            >
              <FaTimes size={24} />
            </button>
            <img
              src={images[selectedIndex]}
              alt=""
              className="w-[80vw] h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                className="text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
              >
                <FaArrowRight size={28} />
              </button>
              <button
                className="text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
              >
                <FaArrowLeft size={28} />
              </button>
            </div>
            <div className="text-white mt-2 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {modalCommentImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeCommentModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
              onClick={closeCommentModal}
            >
              <FaTimes size={24} />
            </button>
            <img
              src={modalCommentImage}
              alt="تصویر نظر"
              className="w-[80vw] h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default House