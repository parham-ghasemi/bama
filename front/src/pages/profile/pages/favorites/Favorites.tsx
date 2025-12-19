import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Favorites = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(localStorage.getItem('isFavorited') === 'true');
  }, []);

  return (
    <div className="w-full">
      <h2 className="font-semibold text-lg">مورد علاقه‌ها</h2>
      {isFavorited ? (
        <div className="grid grid-cols-4 gap-3.5 mt-8">
          <Card
            title="ویلا دوخوابه روستایی گلستان 2"
            desc="استان البرز، چهارباغ - ظرفیت: ۴ تا ۸ مهمان"
            price="قیمت: ۱٬۲۱۰٬۰۰۰ تومان / شب"
            img="/villa/1.jpg"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-8">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/007/104/553/small/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
            alt="تصویر لیست خالی مورد علاقه‌ها"
            className="w-64 h-auto mb-4"
          />
          <p className="text-gray-500 text-center">لیست علاقه‌مندی‌های شما خالی است. چند مورد اضافه کنید تا اینجا ببینید!</p>
        </div>
      )}
    </div>
  )
}

export default Favorites