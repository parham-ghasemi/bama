import Footer from "../../components/Footer";
import Header from "../../components/Header"
import SignupBtn from "../../components/SignupBtn"
import { useParams, useNavigate } from 'react-router-dom';

const cards = [
  {
    title: "ویلای لوکس بهشت",
    desc: "تهران، ایران - ظرفیت: ۴ تا ۸ مهمان",
    price: "قیمت: ۵٬۰۰۰٬۰۰۰ ریال / شب",
    img: "https://i.ytimg.com/vi/fdrNHUjK8Vw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCnlbvqTY4Cv1UBsedSd2TUTNSv8g"
  },
  {
    title: "ویلای ساحلی آرام",
    desc: "تهران، ایران - ظرفیت: ۲ تا ۶ مهمان",
    price: "قیمت: ۳٬۵۰۰٬۰۰۰ ریال / شب",
    img: "https://i.ytimg.com/vi/ayRjn_aQHUk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBG15fD1-zG390V3iHduWtzz-5tFQ"
  },
  {
    title: "ویلای کوهستانی ویو",
    desc: "تهران، ایران - ظرفیت: ۶ تا ۱۲ مهمان",
    price: "قیمت: ۷٬۲۰۰٬۰۰۰ ریال / شب",
    img: "https://amazingarchitecture.com/storage/9377/01-cheshmandaz-villa-isfahan-ghazaleh-hanaei.jpg"
  },
  {
    title: "ویلای شهری دنج",
    desc: "تهران، ایران - ظرفیت: ۱ تا ۴ مهمان",
    price: "قیمت: ۲٬۸۰۰٬۰۰۰ ریال / شب",
    img: "https://amazingarchitecture.com/storage/2413/villa_gara_kordan_iran_4architecture_studio.jpg"
  },
  {
    title: "ویلای خانوادگی بزرگ",
    desc: "تهران، ایران - ظرفیت: ۸ تا ۱۶ مهمان",
    price: "قیمت: ۱۰٬۰۰۰٬۰۰۰ ریال / شب",
    img: "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3523513205273644348"
  },
  {
    title: "ویلای مدرن لوفت",
    desc: "تهران، ایران - ظرفیت: ۲ تا ۵ مهمان",
    price: "قیمت: ۴٬۰۰۰٬۰۰۰ ریال / شب",
    img: "https://www.retalkmena.com/sites/default/files/styles/article-full/public/no131iran.jpg?itok=sd9EqD4n"
  },
  {
    title: "ویلای روستایی جذاب",
    desc: "تهران، ایران - ظرفیت: ۴ تا ۱۰ مهمان",
    price: "قیمت: ۶٬۵۰۰٬۰۰۰ ریال / شب",
    img: "https://fmzd.co/wp-content/uploads/2022/09/iranzaminvilla-tehranshahrakgharb-FMZD-render-exterior.jpg"
  },
  {
    title: "ویلای کنار استخر شیک",
    desc: "تهران، ایران - ظرفیت: ۳ تا ۷ مهمان",
    price: "قیمت: ۵٬۵۰۰٬۰۰۰ ریال / شب",
    img: "https://i0.wp.com/www.emporioarchitect.com/upload/portofolio/thumb/hasil-konstruksi-desain-rumah-modern-2-lantai-bapak-wlm-91020924-291786214020924091454-0.jpg"
  },
];

const Card = ({ desc, img, price, title }: { title: string; desc: string; price: string; img: string }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-7 cursor-pointer group" onClick={() => navigate('/house')}>
      <img src={img} alt={title} className="w-80 h-60 object-cover rounded-lg group-hover:rounded group-hover:rounded-b-xs transition-all" />
      <p className="text-lg mt-4">{title}</p>
      <p className="text-gray-400 text-sm font-light mt-0.5">{desc}</p>
      <p className="text-xs mt-2">{price}</p>
    </div>
  );
}

const VillaResults = () => {
  const { city } = useParams<{ city: string }>();
  const displayCity = city || 'تهران';
  const numResults = cards.length;

  return (
    <div className="relative">

      <div className="flex justify-between items-center py-5 px-9">
        <div className="mx-auto">
          <Header />
        </div>
        <SignupBtn />
      </div>

      <div className="w-screen h-px bg-gray-600" />

      <div className="px-16">

        <h2 className="text-2xl font-semibold mt-11">باما ویلا رزرو کن ، این بار برای {displayCity} زیبا ({numResults} نتیجه یافت شد)</h2>

        <div className="grid grid-cols-4 gap-3.5">
          {cards.map((card, i) => (
            <Card desc={card.desc} img={card.img} price={card.price} title={card.title} key={`villacardwiththeindxof${i}`} />
          ))}
        </div>
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  )
}

export default VillaResults