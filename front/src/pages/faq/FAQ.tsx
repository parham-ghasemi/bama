import Search from "./search/Search"
import { useState, type ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Footer from "../../components/Footer";

const categories = [
  { title: "میزبان", img: "/faq/guest-icon 1.svg" },
  { title: "میهمان", img: "/faq/host-icon 1.svg" },
  { title: "باما", img: "/faq/host-icon 1.svg" },
]

const questions = [
  // دسته‌بندی میزبان
  { q: "چگونه اقامتگاه خود را در سایت ثبت کنم؟", a: "برای ثبت اقامتگاه، ابتدا وارد حساب کاربری خود شوید، سپس به بخش 'میزبانی' بروید و فرم ثبت اقامتگاه را پر کنید. شامل عکس‌های باکیفیت، توضیحات دقیق و قوانین خانه باشید. پس از بررسی توسط تیم ما، اقامتگاه شما فعال می‌شود.", category: "میزبان" },
  { q: "پرداخت‌ها چگونه انجام می‌شود و چه زمانی وجه به حساب من واریز می‌گردد؟", a: "پرداخت‌ها از طریق درگاه بانکی امن انجام می‌شود. وجه رزرو پس از خروج میهمان و تایید عدم مشکل، ظرف ۴۸ ساعت به حساب بانکی شما واریز می‌گردد. کارمزد پلتفرم ۱۰% از مبلغ کل است.", category: "میزبان" },
  { q: "اگر میهمان قوانین خانه را رعایت نکند، چه کنم؟", a: "در صورت نقض قوانین، می‌توانید از طریق پنل میزبانی گزارش دهید. تیم پشتیبانی ما بررسی می‌کند و در صورت لزوم، جریمه یا لغو رزرو اعمال می‌شود. همچنین، بیمه اقامتگاه برای خسارات احتمالی پوشش می‌دهد.", category: "میزبان" },
  { q: "چگونه امتیاز و نظرات میهمانان را مدیریت کنم؟", a: "پس از هر رزرو، می‌توانید نظر خود را ثبت کنید. برای بهبود امتیاز، به تمیزی، ارتباط خوب و امکانات توجه کنید. نظرات منفی را با پاسخ حرفه‌ای مدیریت کنید تا اعتبار شما حفظ شود.", category: "میزبان" },

  // دسته‌بندی میهمان
  { q: "چگونه اقامتگاه رزرو کنم؟", a: "جستجو کنید، اقامتگاه مورد نظر را انتخاب نمایید، تاریخ‌ها را وارد کنید و پرداخت را انجام دهید. رزرو فوری یا با تایید میزبان امکان‌پذیر است. ایمیل تایید برای شما ارسال می‌شود.", category: "میهمان" },
  { q: "سیاست لغو رزرو چیست؟", a: "بسته به سیاست میزبان، لغو تا ۴۸ ساعت قبل از ورود رایگان است. پس از آن، ممکن است جریمه اعمال شود. جزئیات در صفحه رزرو مشخص است. برای موارد خاص، با پشتیبانی تماس بگیرید.", category: "میهمان" },
  { q: "اگر مشکلی در اقامتگاه پیش آمد، چه کنم؟", a: "ابتدا با میزبان تماس بگیرید. اگر حل نشد، از طریق اپ یا سایت گزارش دهید. تیم ما ظرف ۲۴ ساعت بررسی می‌کند و ممکن است بازپرداخت یا تغییر اقامتگاه پیشنهاد دهد.", category: "میهمان" },
  { q: "چگونه نظر و امتیاز بدهم؟", a: "پس از خروج، ایمیلی دریافت می‌کنید. وارد حساب شوید و نظر honest خود را بنویسید. این کمک می‌کند به دیگر کاربران و بهبود کیفیت پلتفرم.", category: "میهمان" },

  // دسته‌بندی باما (با ما - سوالات عمومی درباره پلتفرم)
  { q: "پلتفرم باما چیست و چگونه کار می‌کند؟", a: "باما یک پلتفرم آنلاین برای اجاره اقامتگاه‌های کوتاه‌مدت است. میزبانان اقامتگاه ثبت می‌کنند و میهمانان رزرو می‌کنند. ما امنیت، پرداخت و پشتیبانی را تضمین می‌کنیم.", category: "باما" },
  { q: "چگونه با پشتیبانی تماس بگیرم؟", a: "از طریق چت آنلاین در سایت، ایمیل support@bama.com یا شماره تلفن ۰۲۱-۱۲۳۴۵۶۷۸. ساعات کاری ۹ صبح تا ۹ شب است. برای موارد اضطراری، ۲۴/۷ در دسترس هستیم.", category: "باما" },
  { q: "آیا اطلاعات شخصی من امن است؟", a: "بله، ما از استانداردهای امنیتی مانند رمزنگاری SSL استفاده می‌کنیم. اطلاعات شما فقط برای اهداف رزرو استفاده می‌شود و با اشخاص ثالث به اشتراک گذاشته نمی‌شود، مگر با رضایت شما.", category: "باما" },
  { q: "چگونه در باما حساب کاربری بسازم؟", a: "به سایت بروید، روی 'ثبت‌نام' کلیک کنید و با ایمیل یا شماره تلفن ثبت‌نام کنید. تایید هویت با کد ارسالی انجام می‌شود. برای میزبانان، مدارک اضافی لازم است.", category: "باما" },
];

const highlightText = (text: string, terms: string[]): ReactNode[] => {
  if (!terms.length) return [text];

  const escapedTerms = terms.map(t => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  text.replace(regex, (match, ...args) => {
    const offset = args[args.length - 2]; // Offset is second to last in replace args
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset));
    }
    parts.push(<span key={parts.length} className="bg-yellow-200/50">{match}</span>);
    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const Question = ({ q, a, searchTerms }: { q: string, a: string, searchTerms: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const highlightedQ = highlightText(q, searchTerms);
  const highlightedA = highlightText(a, searchTerms);

  return (
    <div className="rounded-xl mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left font-bold flex items-center gap-1 hover:bg-neutral-100 transition-colors duration-300 cursor-pointer"
      >
        {highlightedQ}
        <FaChevronDown className={`mr-auto transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="p-4">{highlightedA}</p>
      </div>
    </div>
  );
}

const CategoryCard = ({ img, title, onClick, isSelected }: { img: string, title: string, onClick: () => void, isSelected: boolean }) => {
  return (
    <div
      onClick={onClick}
      className={`border border-neutral-600 py-4 px-2 rounded-xl w-full cursor-pointer transition hover:-translate-y-2 duration-300 ${isSelected ? 'bg-neutral-200' : ''}`}
    >
      <img src={img} alt={img} className="mx-auto my-8" />
      <div className="w-full h-px bg-neutral-600" />
      <p className="font-bold mt-3 py-1">{title}</p>
    </div>
  )
}

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  let filteredQuestions = questions;

  if (selectedCategory) {
    filteredQuestions = filteredQuestions.filter(qa => qa.category === selectedCategory);
  }

  let terms: string[] = [];
  if (searchTerm.trim()) {
    terms = searchTerm.trim().split(/\s+/);
    filteredQuestions = filteredQuestions.filter(qa => {
      const combinedText = (qa.q + ' ' + qa.a).toLowerCase();
      return terms.every(term => combinedText.includes(term.toLowerCase()));
    });
  }

  const handleCategoryClick = (title: string) => {
    setSelectedCategory(prev => prev === title ? null : title);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col gap-4 items-center pt-11">
      <Search
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <h2 className="font-bold text-2xl w-3xl mt-14">دسته بندی سوالات</h2>
      <p className="w-3xl">به تمامی سوالات شما پیرامون سفر جواب داده‌ایم.</p>
      <div className="grid grid-cols-3 gap-5 w-3xl mt-4">
        {categories.map((cat, index) => (
          <CategoryCard
            img={cat.img}
            title={cat.title}
            key={`categcard${index}`}
            onClick={() => handleCategoryClick(cat.title)}
            isSelected={selectedCategory === cat.title}
          />
        ))}
      </div>

      <h2 className="font-bold text-2xl w-3xl mt-14">
        {selectedCategory || "پرتکرار ترین پرسش ها"}
      </h2>
      {searchTerm && (
        <p className="w-3xl mt-2 text-neutral-600">
          {filteredQuestions.length === 0 ? "هیچ نتیجه‌ای یافت نشد" : `${filteredQuestions.length} نتیجه یافت شد`}
        </p>
      )}
      <div className="w-3xl mt-4 flex flex-col gap-2">
        {filteredQuestions.map((qa, index) => (
          <Question q={qa.q} a={qa.a} searchTerms={terms} key={`question${index}`} />
        ))}
      </div>

      <div className="h-48" />
      <Footer />
    </div>
  )
}

export default FAQ