import { FaPen } from "react-icons/fa6"
import { useState, useEffect } from "react"
import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import "react-multi-date-picker/styles/colors/teal.css"
import { Button } from "../../../../components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import { toast } from "sonner"

const Account = () => {
  const [firstName, setFirstName] = useState("پرهام")
  const [lastName, setLastName] = useState("قاسمی")
  const [nationalCode, setNationalCode] = useState("0251170829")
  const [gender, setGender] = useState("male")
  const [birthDate, setBirthDate] = useState<DateObject | null>(null)
  const [mobile, setMobile] = useState("09912525964")
  const [email, setEmail] = useState("parham.ghasemi.1388@gmail.com")
  const [homePhone, setHomePhone] = useState("02156781234") // Random Tehran format
  const [bio, setBio] = useState("")

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem("accountData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setFirstName(parsedData.firstName || "پرهام")
      setLastName(parsedData.lastName || "قاسمی")
      setNationalCode(parsedData.nationalCode || "0251170829")
      setGender(parsedData.gender || "male")
      if (parsedData.birthDate) {
        // @ts-ignore
        setBirthDate(new DateObject({ calendar: persian }).parse(parsedData.birthDate, "YYYY/MM/DD"))
      } else {
        setBirthDate(null)
      }
      setMobile(parsedData.mobile || "09912525964")
      setEmail(parsedData.email || "parham.ghasemi.1388@gmail.com")
      setHomePhone(parsedData.homePhone || "02156781234")
      setBio(parsedData.bio || "")
    }
  }

  useEffect(() => {
    loadFromLocalStorage()
  }, [])

  const handleSubmit = () => {
    const data = {
      firstName,
      lastName,
      nationalCode,
      gender,
      birthDate: birthDate?.format("YYYY/MM/DD") || null,
      mobile,
      email,
      homePhone,
      bio
    }
    localStorage.setItem("accountData", JSON.stringify(data))
    toast("تغییرات با موفقیت ذخیره شد")
  }

  const handleCancel = () => {
    loadFromLocalStorage()
    toast("تغییرات لغو شد")
  }

  return (
    <div>
      <h2 className="font-semibold text-lg"> حساب کاربری </h2>

      <div className="shadow border rounded-lg px-10 py-5 w-full mt-5">
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
        <div className="flex gap-12 items-center py-3 border-dashed border-b border-neutral-400">
          <div className="h-14 w-14 bg-neutral-100 border border-neutral-300 rounded-full flex items-center justify-center font-black">
            {firstName[0] || "پ"}
          </div>

          <p className="text-blue-600 text-xs flex items-center gap-1 cursor-pointer hover:underline">
            <FaPen />
            ویرایش عکس پروفایل
          </p>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">نام و نام خانوادگی </p>
          <div className="w-xl flex gap-6">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
            />
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">کد ملی </p>
          <div className="w-xl flex gap-6">
            <input
              type="text"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
            />
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">جنسیت</p>
          <div className="w-xl flex gap-6">
            <Select value={gender} onValueChange={setGender} dir="rtl">
              <SelectTrigger className="w-full border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">مرد</SelectItem>
                <SelectItem value="female">زن</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">تاریخ تولد </p>
          <div className="w-xl flex gap-6">
            <DatePicker
              className="teal custom-rmdp"
              value={birthDate}
              onChange={setBirthDate}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-center"
              format="YYYY/MM/DD"
              maxDate={new DateObject({ calendar: persian })}
              render={(_, openCalendar) => (
                <input
                  type="text"
                  value={birthDate ? birthDate.format("YYYY/MM/DD") : ""}
                  onClick={openCalendar}
                  className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
                  readOnly
                />
              )}
            />
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">شماره همراه </p>
          <div className="w-xl flex gap-6">
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
            />
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">ایمیل </p>
          <div className="w-xl flex gap-6">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
            />
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">شماره ثابت </p>
          <div className="w-xl flex gap-6">
            <input
              type="text"
              value={homePhone}
              onChange={(e) => setHomePhone(e.target.value)}
              className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
            />
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">معرفی مختصر </p>
          <div className="w-xl flex gap-6">
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={handleCancel} variant="outline">لغو</Button>
          <Button onClick={handleSubmit}>ثبت</Button>
        </div>
      </div>
    </div>
  )
}

export default Account