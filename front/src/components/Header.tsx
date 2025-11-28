import { useState, useRef, useEffect } from "react"
import { IoSearchOutline } from "react-icons/io5"
import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import "react-multi-date-picker/styles/colors/teal.css"
import { cities } from "./cities"  // Import the cities list
import { useNavigate } from "react-router-dom";

const options = [
  {
    title: "مقصد سفرت کجاست؟",
    desc: "جستجو مقصد سفر "
  },
  {
    title: "تاریخ ورود",
    desc: "انتخاب تاریخ"
  },
  {
    title: "تاریخ خروج",
    desc: "انتخاب تاریخ"
  },
  {
    title: "تعداد نفرات",
    desc: "انتخاب تعداد نفرات"
  },
]

const toPersianNum = (num: number | undefined): string => {
  if (num === undefined) return '';
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

const Header = () => {
  const [active, setActive] = useState<number | undefined>(undefined)
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [entryDate, setEntryDate] = useState<DateObject>(new DateObject({ calendar: persian }));
  const [exitDate, setExitDate] = useState<DateObject>(new DateObject({ calendar: persian }).add(1, "day"));
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const guests = adults + children;
  const headerRef = useRef<HTMLDivElement>(null);
  const entryDatePickerRef = useRef<any>(null);
  const exitDatePickerRef = useRef<any>(null);
  const navigate = useNavigate();

  // Compute filtered cities for suggestions
  const filteredCities = search
    ? cities
      .filter((c) => c.name.includes(search))
      .sort((a, b) => b.population - a.population)
      .slice(0, 9)
      .map(c => c.name)
    : cities.slice(0, 9).map(c => c.name);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActive(undefined);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleEntryDateChange = (date: DateObject) => {
    setEntryDate(date);
    if (date && exitDate && date.unix > exitDate.unix) {
      setExitDate(new DateObject({ calendar: persian }).set("date", date).add(1, "day"));
    }
  };

  const handleExitDateChange = (date: DateObject) => {
    setExitDate(date);
  };

  const handleOptionClick = (idx: number) => {
    if (idx === 0) {
      setActive(active === 0 ? undefined : 0);
      entryDatePickerRef.current.closeCalendar();
      exitDatePickerRef.current.closeCalendar();
    } else if (idx === 1) {
      setActive(undefined);
      entryDatePickerRef.current.openCalendar();
    } else if (idx === 2) {
      setActive(undefined);
      exitDatePickerRef.current.openCalendar();
    } else if (idx === 3) {
      setActive(active === 3 ? undefined : 3);
      entryDatePickerRef.current.closeCalendar();
      exitDatePickerRef.current.closeCalendar();
    }
  };

  const handleSearch = () => {
    if (search) {
      navigate(`/villa-results/${encodeURIComponent(search)}`);
    }
  };

  return (
    <div ref={headerRef} className="relative z-10 bg-white rounded-[1000px] px-5 py-1 w-4xl shadow-lg shadow-gray-800/25 flex items-center justify-between hover:bg-gray-200 transition-colors group">
      <style>{`
        .custom-rmdp .rmdp-container {
          width: 100%;
        }
        .custom-rmdp .rmdp-panel {
          display: none;
        }
        .custom-rmdp .rmdp-header {
          background-color: white;
          padding: 10px;
          font-weight: bold;
          color: #333;
        }
        .custom-rmdp .rmdp-header-values {
          font-size: 16px;
        }
        .custom-rmdp .rmdp-arrow {
          border-color: #888;
        }
        .custom-rmdp .rmdp-week-day {
          color: #666;
          font-size: 14px;
        }
        .custom-rmdp .rmdp-day span {
          font-size: 14px;
          color: #333;
        }
        .custom-rmdp .rmdp-day.rmdp-today span {
          background-color: #f0f0f0;
          color: #000;
        }
        .custom-rmdp .rmdp-day.rmdp-selected span {
          background-color: #007bff;
          color: white;
        }
        .custom-rmdp .rmdp-range {
          background-color: #cce5ff;
        }
        .custom-rmdp .rmdp-day.rmdp-disabled span {
          color: #ccc;
        }
        .custom-rmdp .rmdp-week .rmdp-day:last-child span {
          color: red;
        }
        .custom-rmdp .rmdp-month-picker, .custom-rmdp .rmdp-year-picker {
          background: white;
        }
      `}</style>
      {options.map((option, idx) => (
        <div
          onClick={() => handleOptionClick(idx)}
          className="flex flex-col gap-1 cursor-pointer min-w-40 hover:bg-gray-50 hover:rounded-xl hover:outline hover:outline-black py-4 px-2 transition-all duration-300 relative"
          key={`header-option-${idx}`}
        >
          <p className="font-semibold text-sm">{option.title}</p>
          {idx === 0 ? (
            <input
              type="text"
              value={search ?? ''}
              onChange={(e) => setSearch(e.target.value || undefined)}
              onFocus={() => setActive(0)}
              placeholder={option.desc}
              className="text-sm text-gray-800 font-light bg-transparent border-none outline-none"
            />
          ) : idx === 1 ? (
            <div onClick={(e) => e.stopPropagation()}>
              <DatePicker
                ref={entryDatePickerRef}
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
                render={(value, openCalendar) => (
                  <p onClick={openCalendar} className="text-sm text-gray-800 font-light">
                    {entryDate ? entryDate.format("dddd DD MMMM") : option.desc}
                  </p>
                )}
              />
            </div>
          ) : idx === 2 ? (
            <div onClick={(e) => e.stopPropagation()}>
              <DatePicker
                ref={exitDatePickerRef}
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
                render={(value, openCalendar) => (
                  <p onClick={openCalendar} className="text-sm text-gray-800 font-light">
                    {exitDate ? exitDate.format("dddd DD MMMM") : option.desc}
                  </p>
                )}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-800 font-light">
              {`${toPersianNum(guests)} نفر`}
            </p>
          )}
          {idx === 0 && (
            <div onClick={(e) => e.stopPropagation()} className={`absolute bottom-0 bg-white rounded-lg p-3 min-w-80 shadow-lg shadow-gray-700/45 transition-all pb-6 ${active === 0 ? "opacity-100 translate-y-[calc(100%+10px)] pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"}`}>
              <p className="text-xs text-gray-500">{search ? "پیشنهادها" : "محبوب‌ترین مقصدها"}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {filteredCities.map((city, index) => (
                  <p
                    key={`citydropdown${index}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearch(city);
                    }}
                    className="text-xs border border-gray-300 py-1.5 px-3 rounded-4xl cursor-pointer hover:bg-gray-100 transition"
                  >
                    {city}
                  </p>
                ))}
              </div>
            </div>
          )}
          {idx === 3 && (
            <div onClick={(e) => e.stopPropagation()} className={`absolute bottom-0 bg-white rounded-lg p-3 min-w-80 shadow-lg shadow-gray-700/45 transition-all pb-6 ${active === 3 ? "opacity-100 translate-y-[calc(100%+10px)] pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"}`}>
              <p className="text-xs text-gray-500">تعداد میهمان‌ها</p>
              <div className="mt-3">
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
            </div>
          )}
        </div>
      ))}
      <div onClick={handleSearch} className="h-12 w-12 bg-[#2891C3] group-hover:brightness-110 hover:brightness-125 rounded-full hover:scale-105 transition cursor-pointer flex items-center justify-center ">
        <IoSearchOutline className="text-blue-50" size={24} />
      </div>
    </div>
  )
}
export default Header