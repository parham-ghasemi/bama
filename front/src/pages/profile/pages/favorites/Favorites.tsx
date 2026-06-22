import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../../../lib/axiosConfig';

const Card = ({ villa }: { villa: any }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-7 cursor-pointer group" onClick={() => navigate(`/house/${villa._id}`)}>
      <img src={`${import.meta.env.VITE_BASE_IMG_URL}${villa.images[0]}` || "/placeholder.jpg"} alt={villa.name} className="w-80 h-60 object-cover rounded-lg group-hover:rounded group-hover:rounded-b-xs transition-all" />
      <p className="text-lg mt-4">{villa.name}</p>
      <p className="text-gray-400 text-sm font-light mt-0.5">{villa.address} - ظرفیت: {villa.maxAdults} تا {villa.maxAdults + (villa.maxChildren || 0)} مهمان</p>
      <p className="text-xs mt-2">قیمت: {villa.price.toLocaleString('fa-IR')} تومان / شب</p>
    </div>
  );
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/user/liked-villas');
        setFavorites(res.data);
      } catch (err: any) {
        setError(err.response?.data?.msg || 'خطا در بارگذاری مورد علاقه‌ها');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">در حال بارگذاری...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="w-full">
      <h2 className="font-semibold text-lg">مورد علاقه‌ها</h2>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-4 gap-3.5 mt-8">
          {favorites.map((villa) => (
            <Card key={villa._id} villa={villa} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-8">
          <img
            src="/not-found.svg"
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