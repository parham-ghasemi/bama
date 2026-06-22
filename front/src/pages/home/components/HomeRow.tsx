import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  img: string;
  title: string;
  noc: number;
  type: "city" | "house";
}

const Card = ({ img, title, noc, type }: CardProps) => {
  const nav = useNavigate();

  const handleCardClick = () => {
    // 1. Clean the title to get just the city name (e.g., "تهران" or "بندر انزلی")
    const cityName = title
      .replace("اجاره ویلا در ", "")
      .replace("بومگردی، ویلا و اقامتگاه در ", "")
      .trim();

    // 2. Encode the city name for the path parameter
    const encodedCity = encodeURIComponent(cityName);

    // 3. Fallback dates/guests to prevent 404 or empty states if your results page expects them
    // (Adjust these default query strings to match your fallback preferences if needed)
    const defaultQueryParams = "entry=&exit=&adults=1&children=0";

    // 4. Navigate directly to your villa-results path layout
    nav(`/villa-results/${encodedCity}?${defaultQueryParams}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="hover:scale-[101%] transition-transform cursor-pointer flex-shrink-0 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[17%]"
    >
      <img src={img} alt={title} className="w-full h-48 sm:h-60 md:h-72 rounded-lg object-cover" />
      <p className="font-light text-lg md:text-2xl mt-4">
        {title}
      </p>
    </div>
  );
};

interface HomeRowProps {
  type: "city" | "house";
  cards: { img: string; title: string }[];
  title: string;
  subtitle: string;
  noc: number;
}

const HomeRow = ({ noc, cards, subtitle, title, type }: HomeRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 300;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-1 relative">
      <div className="absolute top-8 left-4 flex gap-6">
        <span
          className="cursor-pointer p-1.5 rounded-full hidden sm:flex items-center justify-center hover:bg-gray-100 transition duration-300"
          onClick={scrollRight}
        >
          <FaAngleRight size={24} />
        </span>
        <span
          className="cursor-pointer p-1.5 rounded-full hidden sm:flex items-center justify-center hover:bg-gray-100 transition duration-300"
          onClick={scrollLeft}
        >
          <FaAngleLeft size={24} />
        </span>
      </div>

      <p className="text-lg md:text-xl font-bold">
        {title}
      </p>
      <p className="text-base md:text-lg font-light">
        {subtitle}
      </p>

      <div
        ref={scrollRef}
        dir="rtl"
        className="flex gap-4 md:gap-10 mt-2 max-w-[99%] mx-auto overflow-x-auto py-3 no-scrollbar"
      >
        {cards.map((card, index) => (
          <Card key={index} img={card.img} title={card.title} noc={noc} type={type} />
        ))}
      </div>
    </div>
  );
};

export default HomeRow;