import { useState, useRef } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HomeRow from "./components/HomeRow";
import SignupBtn from "../../components/SignupBtn";
import VillaTypes from "./components/VillaTypes";
import AuthModal from "./components/AuthModal";
import ScoreBtn from "../../components/ScoreBtn";
import ScoreModal from "./components/ScoreModal";

const cityCards = [
  {
    img: "/home/noshahr.jpg",
    title: "اجاره ویلا در نوشهر",
  },
  {
    img: "/home/bandaranzali.jpg",
    title: "اجاره ویلا در بندر انزلی",
  },
  {
    img: "/home/rasht.jpg",
    title: "اجاره ویلا در رشت",
  },
  {
    img: "/home/tehran.jpg",
    title: "اجاره ویلا در تهران",
  },
  {
    img: "/home/tehran.jpg",
    title: "اجاره ویلا در تهران",
  },
  {
    img: "/home/tehran.jpg",
    title: "اجاره ویلا در تهران",
  },
  {
    img: "/home/tehran.jpg",
    title: "اجاره ویلا در تهران",
  },
]

const twoCards = [
  {
    img: "/home/ejare.jpg",
    title: "میزبانی و کسب در آمد.",
    desc: "اطلاعات و تصاویر اقامتگاه خود را ثبت کرده و شروع به درآمدزایی‌کنید.‍"
  },
  {
    img: "/home/roosta.jpg",
    title: "روستا گردی با ما ",
    desc: "سفر به بکرترین نقاط ایران و تجربه‌ی زیستن با مردمان محلی.  "
  },
];

const gridItems = [
  {
    img: "/home/qeshm.jpg",
    title: "اجاره سوییت در قشم ",
    desc: "میانگین هر شب  ۲٬٦۸۸٬۰۰۰ تومان"
  },
  {
    img: "/home/kish.jpg",
    title: "اجاره سوییت در کیش ",
    desc: "میانگین هر شب  ۲٬٦۸۸٬۰۰۰ تومان"
  },
  {
    img: "/home/33pol.jpg",
    title: "اجاره سوییت در اصفهان ",
    desc: "میانگین هر شب  ۲٬٦۸۸٬۰۰۰ تومان"
  },
  {
    img: "/home/shiraz.jpg",
    title: "اجاره سوییت در شیراز ",
    desc: "میانگین هر شب  ۲٬٦۸۸٬۰۰۰ تومان"
  },
  {
    img: "/home/mashhad.jpg",
    title: "اجاره سوییت در مشهد ",
    desc: "میانگین هر شب  ۲٬٦۸۸٬۰۰۰ تومان"
  },
  {
    img: "/home/borjmilad.jpg",
    title: "اجاره سوییت در تهران ",
    desc: "میانگین هر شب  ۲٬٦۸۸٬۰۰۰ تومان"
  },
];

const GridItem = ({ img, desc, title }: { img: string; title: string; desc: string; }) => (
  <div className="flex gap-3 items-center cursor-pointer hover:-translate-y-1 hover:shadow-xl group transition-all duration-300 hover:rounded-lg hover:overflow-hidden">
    <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg shadow shadow-gray-400 group-hover:shadow-none group-hover:rounded-none transition-all duration-300" />
    <div className="flex flex-col gap-2">
      <p className="font-bold text-lg">
        {title}
      </p>
      <p className="font-light text-sm text-gray-500">
        {desc}
      </p>
    </div>
  </div>
);

const Home = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authOrigin, setAuthOrigin] = useState({ x: 50, y: 50 });
  const authButtonRef = useRef<HTMLDivElement>(null);

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreOrigin, setScoreOrigin] = useState({ x: 50, y: 50 });
  const scoreButtonRef = useRef<HTMLDivElement>(null);

  const handleOpenAuth = () => {
    if (authButtonRef.current) {
      const rect = authButtonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const xPercent = (x / window.innerWidth) * 100;
      const yPercent = (y / window.innerHeight) * 100;
      setAuthOrigin({ x: xPercent, y: yPercent });
    }
    setIsAuthModalOpen(true);
  };

  const handleOpenScore = () => {
    if (scoreButtonRef.current) {
      const rect = scoreButtonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const xPercent = (x / window.innerWidth) * 100;
      const yPercent = (y / window.innerHeight) * 100;
      setScoreOrigin({ x: xPercent, y: yPercent });
    }
    setIsScoreModalOpen(true);
  };

  return (
    <div className="w-screen min-h-screen relative ">
      <div className="absolute w-full  h-[720px] overflow-hidden z-0">
        <img src="/home/hero.jpg" alt="" className="absolute top-0 left-0 right-0 z-0" />
        <div className=" absolute left-0 right-0 h-7 bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] z-10 bottom-0"></div>
      </div>

      <div className="flex justify-between p-4 ml-4">
        <ScoreBtn ref={scoreButtonRef} onClick={handleOpenScore} />
        <SignupBtn ref={authButtonRef} onClick={handleOpenAuth} />
      </div>
      <div className="flex justify-center p-4">
        <Header />
      </div>

      <div className="w-7xl bg-white relative mx-auto mt-96 rounded-xl min-h-52 p-6">
        <VillaTypes />

        <div className="mt-7">
          <HomeRow noc={4} cards={cityCards} subtitle="اقامتگاه در شهرهای پرطرفدار با ما " title="اجاره ویلا در محبوب‌ترین شهرها " type="city" />
        </div>
        <div className="mt-32">
          <HomeRow noc={5} cards={cityCards} subtitle="تجربه اقامت در کنار مردم خونگرم جنوب با ما " title="بومگردی، ویلا و اقامتگاه در جنوب زیبا" type="house" />
        </div>
        <div className="mt-32">
          <HomeRow noc={4} cards={cityCards} subtitle="ویلا، سوئیت و کلبه در شمال زیبا" title="اجاره ویلا و اقامت تو شهرهای شمالی با ما " type="house" />
        </div>


        {/* two cards */}
        <div className="flex justify-evenly" >
          {
            twoCards.map((card, index) => (
              <div key={index} className="mt-32 flex flex-col gap-4 w-xl rounded-xl overflow-hidden shadow-lg shadow-gray-400 hover:-translate-y-1 duration-300 transition-transform">
                <img src={card.img} alt={card.title} className="object-cover w-full h-[423px]" />
                <div className="p-7 pt-0 space-y-2">
                  <p className="text-2xl font-bold">
                    {card.title}
                  </p>
                  <p className="font-light text-[16px] text-gray-500">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))
          }
        </div>

        {/* grid */}
        <div className="grid grid-cols-3 mt-36 gap-14 w-[95%] mx-auto">
          {
            gridItems.map((item, index) => (
              <GridItem desc={item.desc} img={item.img} title={item.title} key={`griditem${index}`} />
            ))
          }
        </div>


        <div className="py-40 max-w-5xl mx-auto">
          <h2 className="font-semibold text-2xl mb-6">اجاره ویلا، سوئیت، آپارتمان و انواع اقامتگاه</h2>

          <p className="font-light text-sm mt-4 text-pretty leading-relaxed">
            سفر همیشه با خودش یک "حالِ خوش" دارد، یا لبریز از انرژی هستی و دل به جاده می‌زنی ‌یا سفر می‌کنی تا این "حالِ خوش" را در جایی دورتر و زیر آسمانی آبی‌تر پیدا کنی. اگر اینجایی، یعنی به دنبال همین "حالِ خوشِ سفر" آمده‌ای!
          </p>

          <p className="font-light text-sm mt-4 text-pretty leading-relaxed">
            اینجا دستت برای اجاره ویلا،‌ از شمال تا جنوب، از شرق تا غرب ایران زیبا در هر جای ایران و با هر امکاناتی باز است؛ به فکر اجاره ویلا در شمال برای خوشگذرانی لب دریا هستی؟ یک کلبه جنگلی دنج یا ویلا استخردار برای سفر با دوستان می‌خواهی؟ شاید هم یک سوئیت در کیش برای سفر خانوادگی؟
          </p>

          <p className="font-light text-sm mt-4 text-pretty leading-relaxed">
            از بین صدها اقامتگاه‌ها در جاباما با دیدن تصاویر، خواندن نظرات میهمان‌های قبلی و مقایسه قیمت‌ها و امکانات، بهترینش را انتخاب کن. حالا که خیالت از یک جای عالی با یک میزبان میهمان‌نواز و پشتیبانی کامل جاباما از لحظه رزرو تا پایان سفر راحت است، می‌توانی برای هر ثانیه حالِ خوش در سفر برنامه‌ریزی کنی!
          </p>

          <h3 className="font-semibold text-xl mt-8 mb-4">مزایای اجاره ویلا</h3>
          <ul className="font-light text-sm list-disc list-inside space-y-2 text-gray-700">
            <li>یکی از بزرگترین مزایای اجاره ویلا، داشتن فضای خصوصی و راحتی بیشتر نسبت به هتل‌هاست. شما می‌توانید در ویلای خود با آرامش و بدون مزاحمت استراحت کنید و از فضای خصوصی‌تان لذت ببرید.</li>
            <li>ویلاهای اجاره‌ای دارای امکانات متنوع و لوکسی هستند که اقامت شما را راحت‌تر و لذت‌بخش‌تر می‌کنند. استخرهای روباز و سرپوشیده، سونا و جکوزی، زمین بازی و مناطق سرگرمی تنها بخشی از امکاناتی هستند که در انتظار شماست.</li>
          </ul>

          <h3 className="font-semibold text-xl mt-8 mb-4">مقاصد محبوب برای اجاره ویلا</h3>
          <ul className="font-light text-sm list-disc list-inside space-y-2 text-gray-700">
            <li>مازندران یکی از محبوب‌ترین مناطق شمال ایران برای اجاره ویلاست. با سواحل زیبا و جنگل‌های سرسبز، این منطقه یک مقصد عالی برای استراحت و تفریح است. اجاره ویلا در مازندران به شما امکان می‌دهد تا از طبیعت بکر و مناظر فوق‌العاده آن لذت ببرید.</li>
            <li>گیلان با طبیعت زیبا و فرهنگ غنی خود، مقصدی ایده‌آل برای اجاره ویلاست. از زیبایی‌های طبیعی این منطقه همچون جنگل‌های انبوه و ساحل‌های زیبا لذت ببرید و تجربه‌ای متفاوت از اقامت در ویلاهای گیلان داشته باشید.</li>
            <li>گلستان با مناظر طبیعی شگفت‌انگیز و جاذبه‌های گردشگری متعدد، مکانی بی‌نظیر برای اجاره ویلاست. با اجاره ویلا در گلستان، می‌توانید از طبیعت بی‌نظیر این منطقه و امکانات ویژه ویلاها بهره‌مند شوید.</li>
          </ul>

          <h3 className="font-semibold text-xl mt-8 mb-4">انواع ویلا در جاباما</h3>
          <p className="font-light text-sm mt-4 text-pretty leading-relaxed">
            در جاباما، انواع ویلاهای مدرن و سنتی در دسترس شماست. ویلاهای مدرن با طراحی‌های مدرن و امکانات به‌روز، مناسب برای کسانی هستند که به دنبال اقامتی لوکس و راحت هستند. ویلاهای سنتی نیز با دکوراسیون‌های خاص و اصیل، تجربه‌ای متفاوت و دلنشین را برای شما به ارمغان می‌آورند.
          </p>

          <h3 className="font-semibold text-xl mt-8 mb-4">رزرو آسان ویلا</h3>
          <p className="font-light text-sm mt-4 text-pretty leading-relaxed">
            رزرو ویلا در جاباما بسیار ساده است. با چند کلیک می‌توانید ویلای مورد نظر خود را انتخاب و رزرو کنید. تصاویر و جزئیات هر ویلا به شما کمک می‌کنند تا بهترین انتخاب را داشته باشید. همچنین، امکان مقایسه ویلاها نیز فراهم است تا تصمیم‌گیری برای شما آسان‌تر شود.
          </p>
        </div>
      </div>

      <AuthModal isAuthModalOpen={isAuthModalOpen} origin={authOrigin} setIsAuthModalOpen={setIsAuthModalOpen} />
      <ScoreModal isScoreModalOpen={isScoreModalOpen} origin={scoreOrigin} setIsScoreModalOpen={setIsScoreModalOpen} />

      <Footer />
    </div>
  )
}

export default Home