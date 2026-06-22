import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

import api from '../../lib/axiosConfig';

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SignupBtn from "../../components/SignupBtn";

const Card = ({
  title,
  desc,
  price,
  img,
  id
}: {
  title: string;
  desc: string;
  price: string;
  img: string;
  id: string;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="mt-7 cursor-pointer group"
      onClick={() => navigate(`/house/${id}`)}
    >
      <img
        src={`${import.meta.env.VITE_BASE_IMG_URL}${img}`}
        alt={title}
        className="w-80 h-60 object-cover rounded-lg group-hover:rounded group-hover:rounded-b-xs transition-all"
      />
      <p className="text-lg mt-4">{title}</p>
      <p className="text-gray-400 text-sm font-light mt-0.5">{desc}</p>
      <p className="text-xs mt-2">{price}</p>
    </div>
  );
};

const VillaResults = () => {
  const { city } = useParams<{ city: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const displayCity = city || 'تهران';

  const entry = searchParams.get('entry') || '';
  const exit = searchParams.get('exit') || '';
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');

  const [villas, setVillas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVillas = async () => {
      if (!city) {
        setVillas([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          city,
          ...(entry && { entry }),
          ...(exit && { exit }),
          adults: adults.toString(),
          children: children.toString(),
        });

        const response = await api.get(`/villas/search?${params.toString()}`);

        setVillas(response.data);
      } catch (err: any) {
        console.error(err);
        setError('خطا در بارگذاری ویلاها');
      } finally {
        setLoading(false);
      }
    };

    fetchVillas();
  }, [city, entry, exit, adults, children]);

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
        <h2 className="text-2xl font-semibold mt-11">
          باما ویلا رزرو کن ، این بار برای {displayCity} زیبا ({villas.length} نتیجه یافت شد)
        </h2>

        {loading && <p className="text-center mt-20 text-lg">در حال جستجو...</p>}
        {error && <p className="text-center mt-20 text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-4 gap-3.5 mt-8">
            {villas.map((villa) => (
              <Card
                key={villa._id}
                id={villa._id}
                title={villa.name}
                desc={`${villa.city?.name || displayCity}، ایران - ظرفیت: ${villa.maxAdults} تا ${villa.maxAdults + (villa.maxChildren || 0)} مهمان`}
                price={`قیمت: ${villa.price.toLocaleString('fa-IR')} ریال / شب`}
                img={villa.images?.[0] || "https://via.placeholder.com/320x200?text=بدون+تصویر"}
              />
            ))}

            {villas.length === 0 && (
              <p className="col-span-4 text-center mt-20 text-gray-500 text-lg">
                هیچ ویلایی با شرایط مورد نظر شما یافت نشد
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
};

export default VillaResults;