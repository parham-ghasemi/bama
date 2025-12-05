import { BsSuitcaseLg } from "react-icons/bs";
import { CiHeart, CiRollingSuitcase } from "react-icons/ci";
import { BsToggles } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { BsReceipt } from "react-icons/bs";
import { BsWallet2 } from "react-icons/bs";
import { BsCreditCard } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils";

const Item = ({ icon, subTitle, title, href, isActive }: { icon: any; title: string; subTitle: string; href: string; isActive: boolean }) => {
  return (
    <Link to={href} className={cn("flex items-center gap-3 min-w-72 relative", isActive && "sidebar-active")}>
      <div className="px-6">
        {icon}
      </div>

      <div className="flex flex-col gap-1 text-xs w-8/12">
        <p className="font-semibold">{title}</p>
        <p className="text-[10px] text-neutral-500">{subTitle}</p>
        <div className="w-full h-px bg-neutral-300 mx-auto mt-2" />
      </div>
    </Link>
  )
}

const SideBar = () => {
  const location = useLocation();

  return (
    <div className="border shadow rounded-lg py-6 flex flex-col gap-4">
      <Item icon={<CiRollingSuitcase size={24} />} subTitle="لیست سفرها و درخواست ها" title="سفر های من" href="/trips" isActive={location.pathname === "/trips"} />
      <Item icon={<CiHeart size={24} />} subTitle="لیست اقامتگاه‌ها و هتل‌های مورد علاقه" title="مورد علاقه‌ها" href="/favorites" isActive={location.pathname === "/favorites"} />

      <p className="text-neutral-400 text-[11px] mr-5 mt-3"> میزبانی اقامتگاه </p>
      <Item icon={<BsToggles size={24} />} subTitle="همین حالا اقامتگاهتان را ثبت و شروع به کسب درآمد کنید." title="میزبان شوید" href="/faq/view-more" isActive={location.pathname === "/faq/view-more"} />

      <p className="text-neutral-400 text-[11px] mr-5 mt-3"> حساب کاربری </p>
      <Item icon={<BsPerson size={24} />} subTitle="مشاهده و ویرایش اطلاعات شخصی" title="اطلاعات حساب کاربری" href="/profile/account" isActive={location.pathname === "/profile/account"} />
      <Item icon={<BsReceipt size={24} />} subTitle="مشاهده تاریخ و زمان تراکنش ها" title="تراکنش‌های من" href="/profile/account/transaction" isActive={location.pathname === "/profile/account/transaction"} />

      <p className="text-neutral-400 text-[11px] mr-5 mt-3"> اعتبار و دعوت </p>
      <Item icon={<BsWallet2 size={24} />} subTitle="موجودی، افزایش اعتبار" title="کیف پول" href="/profile/account/wallet" isActive={location.pathname === "/profile/account/wallet"} />
      <Item icon={<BsCreditCard size={24} />} subTitle="کارت هدیه جاباما و دریافت اعتبار برای سفر" title="اعتبار سفر" href="/profile/account/travel-credit" isActive={location.pathname === "/profile/account/travel-credit"} />
    </div>
  )
}

export default SideBar