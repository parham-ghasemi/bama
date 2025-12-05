import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { FaAngleDown } from "react-icons/fa6"

const DropDown = () => {
  const dropdownItems = [
    {
      text: " اطلاعات حساب کاربری ",
      link: "/profile/account"
    },
    {
      text: "سفر های من",
      link: "/profile/trips"
    },
    {
      text: "تراکنش‌های من ",
      link: "/profile/transactions"
    },
    {
      text: "مورد علاقه‌ها ",
      link: "/profile/favorites"
    },
    {
      text: "پرسش های متداول",
      link: "/faq"
    },
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 border border-slate-300 py-1.5 px-3 shadow hover:shadow-lg transition cursor-pointer rounded-md text-sm">
          پرهام قاسمی
          <FaAngleDown />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {dropdownItems.map((item) => (
          <DropdownMenuItem key={item.link} asChild className="border-b py-3 cursor-pointer" dir="rtl">
            <Link to={item.link}>{item.text}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Header = () => {
  return (
    <div className="border-b px-12 py-4 flex justify-between items-center">
      <Link to={'/'} className="flex w-fit">
        <img src="/logo.png" className="h-14" />
      </Link>

      <div className="">
        <DropDown />
      </div>
    </div>
  )
}

export default Header