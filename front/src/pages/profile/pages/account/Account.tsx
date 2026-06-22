


// fix national code and home number validation



import { FaPen } from "react-icons/fa6"
import { useState, useEffect, useRef, useContext } from "react"
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
import api from "../../../../lib/axiosConfig"
import { AuthContext } from "../../../../context/AuthContext"

const Account = () => {
  const { user, loadUser, logout } = useContext(AuthContext)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nationalCode, setNationalCode] = useState("")
  const [isNationalCodeValid, setIsNationalCodeValid] = useState(true)
  const [gender, setGender] = useState("")
  const [birthDate, setBirthDate] = useState<DateObject | null>(null)
  const [mobile, setMobile] = useState("")
  const [isMobileValid, setIsMobileValid] = useState(true)
  const [email, setEmail] = useState("")
  const [homePhone, setHomePhone] = useState("")
  const [isHomePhoneValid, setIsHomePhoneValid] = useState(true)
  const [bio, setBio] = useState("")
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const validateNationalCode = (code: string): boolean => {
    if (!/^\d{10}$/.test(code)) return false
    const digits = code.split('').map(Number)
    const checkDigit = digits[9]
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i)
    }
    const remainder = sum % 11
    return (remainder < 2 && checkDigit === remainder) || (remainder >= 2 && checkDigit === 11 - remainder)
  }

  const validateIranianPhone = (phone: string): boolean => {
    return /^0[1-9]\d{9}$/.test(phone)
  }

  const loadNationalCode = () => {
    const savedNationalCode = localStorage.getItem("nationalCode")
    const defaultNationalCode = "0251170829"
    const newNationalCode = savedNationalCode || defaultNationalCode
    setNationalCode(newNationalCode)
    setIsNationalCodeValid(validateNationalCode(newNationalCode))
  }

  useEffect(() => {
    if (user) {
      setFirstName(user.name?.first || "")
      setLastName(user.name?.last || "")
      setGender(user.gender || "")
      if (user.birthdate) {
        setBirthDate(new DateObject({
          date: user.birthdate,
          format: "YYYY/MM/DD",
          calendar: persian,
          locale: persian_fa
        }))
      } else {
        setBirthDate(null)
      }
      const newMobile = user.phoneNumber || ""
      setMobile(newMobile)
      setIsMobileValid(validateIranianPhone(newMobile))
      setEmail(user.email || "")
      const newHomePhone = user.homeNumber || ""
      setHomePhone(newHomePhone)
      setIsHomePhoneValid(validateIranianPhone(newHomePhone))
      setBio(user.bio || "")
      setProfilePicture(user.pfp || null)
    }
    loadNationalCode()
  }, [user])

  const handleSubmit = async () => {
    if (!isNationalCodeValid || !isHomePhoneValid) {
      toast.error("لطفاً اطلاعات نامعتبر را بررسی کنید")
      return
    }

    try {
      const updateData: any = {
        name: { first: firstName, last: lastName },
        gender,
        birthdate: birthDate?.format("YYYY/MM/DD") || "",
        email,
        homeNumber: homePhone,
        bio,
      }
      if (profilePicture) {
        updateData.pfp = profilePicture
      }

      await api.patch("/user/profile", updateData)
      await loadUser()
      localStorage.setItem("nationalCode", nationalCode)
      toast.success("تغییرات با موفقیت ذخیره شد")
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "خطا در ذخیره تغییرات")
    }
  }

  const handleCancel = () => {
    if (user) {
      setFirstName(user.name?.first || "")
      setLastName(user.name?.last || "")
      setGender(user.gender || "")
      if (user.birthdate) {
        setBirthDate(new DateObject({
          date: user.birthdate,
          format: "YYYY/MM/DD",
          calendar: persian,
          locale: persian_fa
        }))
      } else {
        setBirthDate(null)
      }
      const newMobile = user.phoneNumber || ""
      setMobile(newMobile)
      setIsMobileValid(validateIranianPhone(newMobile))
      setEmail(user.email || "")
      const newHomePhone = user.homeNumber || ""
      setHomePhone(newHomePhone)
      setIsHomePhoneValid(validateIranianPhone(newHomePhone))
      setBio(user.bio || "")
      setProfilePicture(user.pfp || null)
    }
    loadNationalCode()
    toast.info("تغییرات لغو شد")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="h-14 w-14 bg-neutral-100 border border-neutral-300 rounded-full flex items-center justify-center font-black">
              {firstName[0] || "پ"}
            </div>
          )}

          <p
            className="text-blue-600 text-xs flex items-center gap-1 cursor-pointer hover:underline"
            onClick={() => inputRef.current?.click()}
          >
            <FaPen />
            ویرایش عکس پروفایل
          </p>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />
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

        <div className="flex gap-12 items-start py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32 mt-2">کد ملی </p>
          <div className="w-xl flex flex-col gap-1">
            <input
              type="text"
              value={nationalCode}
              onChange={(e) => {
                const value = e.target.value
                setNationalCode(value)
                setIsNationalCodeValid(validateNationalCode(value))
              }}
              className={`border ${isNationalCodeValid ? 'border-neutral-300' : 'border-red-500'} rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full`}
              dir="ltr"
            />
            {!isNationalCodeValid && <p className="text-red-500 text-xs">کد ملی نامعتبر</p>}
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">جنسیت</p>
          <div className="w-xl flex gap-6">
            <Select value={gender} onValueChange={setGender} dir="rtl">
              <SelectTrigger className="w-1/3 border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300">
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
                  dir="ltr"
                />
              )}
            />
          </div>
        </div>

        <div className="flex gap-12 items-start py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32 mt-2">شماره همراه </p>
          <div className="w-xl flex flex-col gap-1">
            <input
              type="text"
              value={mobile}
              className={`border ${isMobileValid ? 'border-neutral-300' : 'border-red-500'} rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full bg-gray-100 cursor-not-allowed`}
              dir="ltr"
              disabled
            />
            {!isMobileValid && <p className="text-red-500 text-xs">شماره همراه نامعتبر</p>}
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
              dir="ltr"
            />
          </div>
        </div>

        <div className="flex gap-12 items-start py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32 mt-2">شماره ثابت </p>
          <div className="w-xl flex flex-col gap-1">
            <input
              type="text"
              value={homePhone}
              onChange={(e) => {
                const value = e.target.value
                setHomePhone(value)
                setIsHomePhoneValid(validateIranianPhone(value))
              }}
              className={`border ${isHomePhoneValid ? 'border-neutral-300' : 'border-red-500'} rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full`}
              dir="ltr"
            />
            {!isHomePhoneValid && <p className="text-red-500 text-xs">شماره ثابت نامعتبر</p>}
          </div>
        </div>

        <div className="flex gap-12 items-center py-4 border-dashed border-b border-neutral-400">
          <p className="text-sm w-32">معرفی مختصر </p>
          <div className="w-xl flex gap-6">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border border-neutral-300 rounded px-2 py-3 text-sm focus:outline-none focus:shadow shadow-neutral-400 transition-all duration-300 w-full"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          {user?.role === 'admin' && (
            <Button onClick={() => window.location.href = "/admin"}>
              پنل مدیریت
            </Button>
          )}
          <Button onClick={logout} variant="destructive">
            خروج از حساب
          </Button>
          <Button onClick={handleCancel} variant="outline">لغو</Button>
          <Button onClick={handleSubmit}>ثبت</Button>
        </div>
      </div>
    </div>
  )
}

export default Account