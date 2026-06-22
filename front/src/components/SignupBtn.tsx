// SignupBtn.tsx (updated)
import { FaUser, FaAngleDown } from "react-icons/fa";
import { forwardRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const SignupBtn = forwardRef<HTMLDivElement, { onClick?: () => void }>(({ onClick }, ref) => {
  const { user, isLoggedIn } = useContext(AuthContext);

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
      text: "کیف پول",
      link: "/profile/wallet"
    },
    {
      text: "مورد علاقه‌ها ",
      link: "/profile/favorites"
    },
    {
      text: "پرسش های متداول",
      link: "/faq"
    },
  ];

  const displayName = [user?.name?.first, user?.name?.last]
    .filter(Boolean)
    .join(" ")
    .trim() || user?.phoneNumber || "کاربر";

  if (!isLoggedIn) {
    return (
      <div ref={ref} onClick={onClick} className="w-40 sm:w-44 h-12 bg-white rounded-[10px] flex gap-3 py-1.5 px-3.5 z-10 relative items-center border border-[#C7BEBE75] shadow-xl shadow-[#00000040] cursor-pointer hover:scale-[102%] transition-transform">
        <div className="h-9 w-9 overflow-hidden flex items-center justify-center bg-gray-100 rounded-full">
          <FaUser className="text-gray-300 translate-y-1" size={30} />
        </div>
        <p className="text-xs sm:text-sm">ورود یا ثبت نام</p>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div ref={ref} className="w-40 sm:w-44 h-12 bg-white rounded-[10px] flex gap-3 py-1.5 px-3.5 z-10 relative items-center border border-[#C7BEBE75] shadow-xl shadow-[#00000040] cursor-pointer hover:scale-[102%] transition-transform">
          <div className="h-7 w-7 overflow-hidden flex items-center justify-center bg-gray-100 rounded-full">
            <FaUser className="text-gray-300 translate-y-1" size={25} />
          </div>
          <p className="text-xs sm:text-sm">{displayName}</p>
          <FaAngleDown className="ml-auto" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {dropdownItems.map((item) => (
          <DropdownMenuItem key={item.link} asChild className="border-b py-3 cursor-pointer" dir="rtl">
            <Link to={item.link}>{item.text}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default SignupBtn;