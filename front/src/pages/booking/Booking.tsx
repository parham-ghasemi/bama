import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import { FaRegCalendarAlt, FaStar, FaTimes } from "react-icons/fa";
import { MdOutlineLtePlusMobiledata } from "react-icons/md";
import api from "../../lib/axiosConfig"; // your axios wrapper
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from 'sonner';
import { AuthContext } from "../../context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const toPersianNum = (num: number | string): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};
const toPersianPrice = (num: number): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishPrice = Math.round(num).toLocaleString("en-US");
  return englishPrice.replace(/\d/g, (d) => persianDigits[parseInt(d)]).replace(/,/g, "،");
};
const clone = (d: DateObject) =>
  new DateObject({
    date: d,
    calendar: persian,
    locale: persian_fa,
  });
const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  console.log(user);
  const location = useLocation();
  const navigate = useNavigate();
  // Try to get villa from navigation state (passed from House) to avoid re-fetching
  const initialVilla = (location.state as any)?.villa || null;
  const initialEntry = (location.state as any)?.entryDate || null;
  const initialExit = (location.state as any)?.exitDate || null;
  const initAdults = (location.state as any)?.adults || 1;
  const initChildren = (location.state as any)?.children || 0;
  const [villa, setVilla] = useState<any | null>(initialVilla);
  const [loading, setLoading] = useState(false);
  const [entryDate, setEntryDate] = useState<DateObject>(() => {
    const initialD = initialEntry ? new DateObject(initialEntry) : new DateObject();
    return clone(initialD);
  });
  const [exitDate, setExitDate] = useState<DateObject>(() => {
    const initialD = initialExit ? new DateObject(initialExit) : new DateObject().add(1, "day");
    return clone(initialD);
  });
  const [adults, setAdults] = useState<number>(initAdults);
  const [children, setChildren] = useState<number>(initChildren);
  const [balance, setBalance] = useState<number>(0);
  // user info (editable on the right column); try localStorage fallback
  const [userName, setUserName] = useState<string>(() => localStorage.getItem("userName") || "");
  const [userPhone, setUserPhone] = useState<string>(() => localStorage.getItem("userPhone") || "");
  const [showLowBalanceModal, setShowLowBalanceModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // if no villa passed via state, fetch it (non-critical - front-end only)
    if (!villa && id) {
      setLoading(true);
      api.get(`/villas/${id}`).then((res) => {
        setVilla(res.data);
      }).catch((err) => {
        console.error("Failed to fetch villa (booking page)", err);
      }).finally(() => setLoading(false));
    }
  }, [id, villa]);
  useEffect(() => {
    if (user) {
      setUserName(`${user.name.first} ${user.name.last}`.trim());
      setUserPhone(user.phoneNumber || user.homeNumber || "");
    }
  }, [user]);
  useEffect(() => {
    // persist user info locally for next visits
    localStorage.setItem("userName", userName);
    localStorage.setItem("userPhone", userPhone);
  }, [userName, userPhone]);
  useEffect(() => {
    // Fetch wallet balance
    api.get('/user/balance').then((res) => {
      setBalance(res.data.balance);
    }).catch((err) => {
      console.error("Failed to fetch balance", err);
    });
  }, []);
  // nights calculation using unix difference (DateObject.unix is seconds)
  const nights = useMemo(() => {
    if (exitDate.unix <= entryDate.unix) return 0;
    return Math.floor((exitDate.unix - entryDate.unix) / 86400);
  }, [entryDate, exitDate]);
  const isDateValid = useMemo(() => nights > 0, [nights]);
  // pricing logic (mirror behaviour from House)
  const basePricePerNight = villa?.price || 0;
  const baseSubtotal = basePricePerNight * nights;
  const extraAdults = Math.max(0, adults - (villa?.maxAdults || 0));
  const extraChildren = Math.max(0, children - (villa?.maxChildren || 0));
  const totalExtra = extraAdults + extraChildren;
  const extraPercent = totalExtra * 5; // 5% per extra guest
  const extraFee = Math.round((baseSubtotal * extraPercent) / 100);
  // example discount: 20% discount if >=7 nights (adjust as you like)
  const discountPercent = nights >= 7 ? 20 : 0;
  const discountAmount = Math.round((baseSubtotal * discountPercent) / 100);
  // platform fee (example fixed percent)
  const platformFeePercent = 5;
  const platformFee = Math.round(((baseSubtotal - discountAmount) * platformFeePercent) / 100);
  const totalPayable = Math.max(0, baseSubtotal - discountAmount + extraFee + platformFee);
  const handleRequestBooking = async () => {
    if (!isDateValid) {
      toast.error("تاریخ خروج باید بعد از تاریخ ورود باشد");
      return;
    }
    if (balance < totalPayable) {
      setShowLowBalanceModal(true);
      return;
    }
    try {
      await api.post('/reservations', {
        villaId: id,
        from: entryDate.format("YYYY/MM/DD"),
        until: exitDate.format("YYYY/MM/DD"),
        adults,
        children
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      if (err.response?.status === 402) {
        setShowLowBalanceModal(true);
      } else {
        toast.error("خطا در رزرو");
      }
    }
  };
  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">در حال بارگذاری...</div>;
  const thumbnail = villa?.images?.length ? (villa.images[0].startsWith("http") ? villa.images[0] : `${import.meta.env.VITE_BASE_IMG_URL}${villa.images[0]}`) : "https://via.placeholder.com/400x250?text=No+Image";
  return (
    <div className="min-h-screen bg-neutral-50 pb-12 space-y-10">
      <div className="pt-4 px-6 flex items-center justify-between">
        <Link to={`/house/${id}`} className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="h-10" />
        </Link>
      </div>
      <div className="mx-auto w-5xl mt-6 grid grid-cols-5 gap-6 items-start">
        {/* Left: main booking form / details (3 cols) */}
        <div className="col-span-3 space-y-6">
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <img src={thumbnail} alt={villa?.name} className="w-36 h-24 object-cover rounded-md" />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{villa?.name || "ویلا"}</h2>
                <p className="text-xs text-neutral-500 mt-1">ظرفیت: {toPersianNum(villa?.maxAdults || 0)} بزرگسال و {toPersianNum(villa?.maxChildren || 0)} کودک</p>
                <p className="mt-2 text-sm text-neutral-700">{villa?.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500">امتیاز</p>
                <div className="flex items-center gap-1 mt-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-bold">4.3</span>
                  <span className="text-xs text-neutral-500">(195 نظر)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <h3 className="font-bold mb-3">تاریخ اقامت</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">تاریخ ورود</label>
                <DatePicker
                  className="teal custom-rmdp w-full"
                  numberOfMonths={2}
                  value={entryDate}
                  onChange={(d: DateObject) => {
                    const newEntry = clone(d);
                    setEntryDate(newEntry);
                    if (newEntry.unix >= exitDate.unix) {
                      setExitDate(clone(newEntry).add(1, "day"));
                    }
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  render={(value, openCalendar) => (
                    <div onClick={openCalendar} className="cursor-pointer border rounded p-3 flex items-center gap-3">
                      <FaRegCalendarAlt />
                      {entryDate.format("YYYY/MM/DD")}
                    </div>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">تاریخ خروج</label>
                <DatePicker
                  className="teal custom-rmdp w-full"
                  numberOfMonths={2}
                  value={exitDate}
                  minDate={clone(entryDate).add(1, "day")}
                  onChange={(d: DateObject) => setExitDate(clone(d))}
                  calendar={persian}
                  locale={persian_fa}
                  render={(value, openCalendar) => (
                    <div onClick={openCalendar} className="cursor-pointer border rounded p-3 flex items-center gap-3">
                      <FaRegCalendarAlt />
                      {exitDate.format("YYYY/MM/DD")}
                    </div>
                  )}
                />
              </div>
            </div>
            {!isDateValid && <p className="text-red-600 text-xs mt-2">تاریخ خروج باید بعد از تاریخ ورود باشد.</p>}
            <p className="text-xs text-neutral-500 mt-3">تعداد شب: <span className="font-bold">{toPersianNum(nights)}</span></p>
          </div>
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <h3 className="font-bold mb-3">تعداد مهمانان</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm">بزرگسال (بالای ۱۲)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border">-</button>
                  <div className="w-8 text-center">{toPersianNum(adults)}</div>
                  <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border">+</button>
                </div>
              </div>
              <div className="border rounded p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm">کودک (۲ تا ۱۲)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border">-</button>
                  <div className="w-8 text-center">{toPersianNum(children)}</div>
                  <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border">+</button>
                </div>
              </div>
            </div>
            {(adults > (villa?.maxAdults || 0) || children > (villa?.maxChildren || 0)) && (
              <p className="text-orange-600 text-xs mt-3">شما {toPersianNum(totalExtra)} نفر بیشتر از ظرفیت انتخاب کرده‌اید — {toPersianNum(extraPercent)}% به مبلغ اضافه خواهد شد.</p>
            )}
          </div>
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <h3 className="font-bold mb-3">قوانین و نکات</h3>
            <p className="text-sm text-neutral-700 leading-7">{villa?.extraInformation || "قوانین و اطلاعات تکمیلی در اینجا نمایش داده خواهد شد."}</p>
          </div>
        </div>
        {/* Right: booking summary card (2 cols) */}
        <div className="col-span-2">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-neutral-500">ویلا</p>
                  <h3 className="font-bold">{villa?.name || "—"}</h3>
                </div>
                <img src={thumbnail} alt="thumb" className="w-20 h-12 object-cover rounded-md" />
              </div>
              <div className="text-sm text-neutral-600 grid grid-cols-2 gap-2 mb-3">
                <div>شروع از:</div>
                <div className="text-right font-bold">{toPersianPrice(basePricePerNight)} تومان / هرشب</div>
                <div>ظرفیت</div>
                <div className="text-right">{toPersianNum(villa?.maxAdults || 0)} بزرگسال</div>
              </div>
              <div className="h-px bg-neutral-100 my-3" />
              {/* Price breakdown */}
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <div>قیمت ({toPersianNum(nights)} شب)</div>
                  <div>{toPersianPrice(basePricePerNight)} × {toPersianNum(nights)} = {toPersianPrice(baseSubtotal)} تومان</div>
                </div>
                {totalExtra > 0 && (
                  <div className="flex justify-between">
                    <div>هزینه نفر اضافی ({toPersianNum(totalExtra)} نفر)</div>
                    <div>+ {toPersianPrice(extraFee)} تومان</div>
                  </div>
                )}
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-700">
                    <div>تخفیف ({toPersianNum(discountPercent)}%)</div>
                    <div>- {toPersianPrice(discountAmount)} تومان</div>
                  </div>
                )}
                <div className="flex justify-between">
                  <div>کارمزد سامانه ({toPersianNum(platformFeePercent)}%)</div>
                  <div>{toPersianPrice(platformFee)} تومان</div>
                </div>
                <div className="h-px bg-neutral-100 my-2" />
                <div className="flex justify-between items-center">
                  <div className="font-bold">جمع قابل پرداخت</div>
                  <div className="text-xl font-bold">{toPersianPrice(totalPayable)} تومان</div>
                </div>
              </div>
              <button onClick={handleRequestBooking} className="mt-4 w-full bg-neutral-800 hover:bg-neutral-900 text-white py-3 rounded-lg font-bold">ثبت درخواست رزرو</button>
            </div>
            {/* Right user info card */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h4 className="font-bold mb-3">اطلاعات تماس</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-500">نام و نام خانوادگی</label>
                  <Input value={userName} onChange={(e) => setUserName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-neutral-500">شماره موبایل</label>
                  <Input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div className="h-px bg-neutral-100 my-3" />
              <p className="text-xs text-neutral-500">با ثبت درخواست، مالک برای تایید رزرو با شما تماس خواهد گرفت. لازم به پرداخت آنلاین نیست مگر اینکه میزبان درخواست کند.</p>
            </div>
            {/* Small helpful notes box */}
            <div className="bg-white border rounded-xl p-4 text-sm text-neutral-600 shadow-sm">
              <p className="font-bold mb-2">نکات</p>
              <ul className="list-disc pr-5 space-y-1">
                <li>تخفیف‌های بلندمدت به صورت خودکار محاسبه می‌شوند.</li>
                <li>در صورت وجود شرایط اضطراری مبلغ رزرو قابل بازگشت خواهد بود.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Low Balance Modal */}
      <Dialog open={showLowBalanceModal} onOpenChange={setShowLowBalanceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>موجودی ناکافی</DialogTitle>
            <DialogDescription>
              موجودی کیف پول شما برای پرداخت این مبلغ کافی نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLowBalanceModal(false)}>
              لغو
            </Button>
            <Button onClick={() => {
              window.open('/profile/wallet', '_blank');
              setShowLowBalanceModal(false);
            }}>
              هدایت به کیف پول
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent dir="rtl">
          <DialogHeader className="items-start">
            <DialogTitle className="text-green-700  font-black">درخواست رزرو ارسال شد!</DialogTitle>
            <DialogDescription className="text-start text-black mt-3 flex flex-col gap-3">
              <p>
                درخواست رزرو شما به مالک ارسال شد. زمانی که مالک رزرو را تایید کند، به شما اطلاع‌رسانی خواهد شد.
              </p>
              <p>
                در صورتی که مالک درخواست را رد کند، نیز به شما اطلاع‌رسانی شده و مبلغ به کیف پول شما بازگردانده خواهد شد.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {
              setShowSuccessModal(false);
              navigate('/', { state: { message: "رزرو با موفقیت انجام شد" } });
            }}
              className="bg-neutral-700"
            >
              بازگشت به صفحه اصلی
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Booking;