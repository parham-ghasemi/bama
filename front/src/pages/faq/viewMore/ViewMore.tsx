import { useState } from 'react';
import Search from "../search/Search";
import Footer from "../../../components/Footer";
import { Link } from 'react-router-dom';

const categories = [
  { title: "میزبان", img: "/faq/guest-icon 1.svg" },
  { title: "میهمان", img: "/faq/host-icon 1.svg" },
  { title: "باما", img: "/faq/host-icon 1.svg" },
];

interface SectionProps {
  text: string;
  image: string;
}

const Section = ({ text, image }: SectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      <img src={image} alt="" className="mx-auto w-72 h-auto rounded-lg" />
      <p className="text-neutral-800">{text}</p>
    </div>
  );
};

const sections = [
  {
    text: "پس از ثبت‌نام و ایجاد حساب کاربری در جاباما، از منوی پایین صفحه گزینه «+» را انتخاب کنید. با انتخاب این گزینه، انواع اقامتگاه (سوئیت، آپارتمان، ویلا و …) برای شما قابل مشاهده است. در این قسمت نوع اقامتگاه خود را انتخاب کنید.",
    image: "https://www.jabama.com/help/wp-content/uploads/2021/01/h12.1-536x1024.jpg"
  },
  {
    text: "بعد از تعیین نوع اقامتگاه، در صفحه بعد منطقه اقامتگاهی خود را انتخاب کنید.",
    image: "https://www.jabama.com/help/wp-content/uploads/2021/01/h12.2-536x1024.jpg"
  },
  {
    text: "در صفحه بعد نوع اقامتگاه خود را از لحاظ (دربستی، اشتراکی) مشخص و دکمه ثبت و ادامه را انتخاب کنید. در ادامه نحوه ثبت اقامتگاه دربستی و اشتراکی به تفکیک قید شده است",
    image: "https://www.jabama.com/help/wp-content/uploads/2021/01/h12.3-536x1024.jpg"
  },
  {
    text: "در مرحله بعد مشخصات اقامتگاه (نام، متراژ و …) را وارد کرده و دکمه ثبت و ادامه را انتخاب کنید.",
    image: "https://www.jabama.com/help/wp-content/uploads/2021/01/h12.4-536x1024.jpg"
  },
];

const ViewMore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <div className="w-screen min-h-screen flex flex-col gap-4 items-center pt-11">
      <Search
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isRedirectSearch={true}
      />

      <div className="w-3xl mt-4 flex gap-2 items-center text-sm">
        <Link to="/">خانه</Link>
        &gt;
        <Link to="/faq">سوالات متداول</Link>
        &gt;
        <b>
          چگونه اقامتگاه خود را در سایت ثبت کنم؟
        </b>
      </div>

      <h2 className="font-bold text-2xl w-3xl mt-8">
        چگونه اقامتگاه خود را در سایت ثبت کنم؟
      </h2>

      <div className="w-3xl mt-4 flex flex-col gap-8">
        {sections.map((s, i) => (
          <Section key={i} text={s.text} image={s.image} />
        ))}
      </div>

      <div className="h-48" />
      <Footer />
    </div>
  );
};

export default ViewMore;