import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../profile/header/Header";
import { FaChevronLeft } from "react-icons/fa6";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col " dir="rtl">
      <Header />

      <div className="grow flex items-center p-6 pt-24 min-h-[90vh] flex-col">
        <img src="/404Logo2.png" alt="404" className="h-72" />

        <h1 className="text-5xl font-bold text-gray-800 my-2">۴۰۴</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">صفحه مورد نظر پیدا نشد</h2>
        <p className="text-gray-500 mb-7 leading-7">
          به نظر می‌رسد این صفحه وجود ندارد یا جابه‌جا شده است.
        </p>

        <Link to={'/'} className="text-blue-600 text-sm flex gap-0.5 items-center group">
          بازگشت به صفحه اصلی
          <FaChevronLeft className="group-hover:-translate-x-1 transition" />
        </Link>
      </div>

      <Footer />
    </div>
  );
}