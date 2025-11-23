import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"


interface CardProps {
  img: string
  title: string
  noc: number
  type: "city" | "house"
}

const Card = ({ img, title, noc, type }: CardProps) => {
  const nav = useNavigate();
  const redirectLink = type === "city" ? "/city" : "/house";
  return (
    <div onClick={() => nav(redirectLink)} className={`hover:scale-[101%] transition-transform cursor-pointer ${noc === 4 ? "min-w-[22%]" : "min-w-[17%]"}`}>
      <img src={img} alt="" className={`w-60 ${noc === 4 ? "h-72" : "h-56"}  rounded-lg object-cover`} />
      <p className="font-light text-2xl mt-4">
        {title}
      </p>
    </div>
  )
}

interface HomeRowProps {
  type: "city" | "house"
  cards: { img: string, title: string }[]
  title: string
  subtitle: string
  noc: number
}

const HomeRow = ({ noc, cards, subtitle, title, type }: HomeRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 400; // Adjust this value based on card width + gap for smoother scrolling (e.g., to scroll by 1-2 cards at a time)


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
          className="cursor-pointer p-1.5 rounded-full flex items-center justify-center hover:bg-gray-100 transition duration-300"
          onClick={scrollRight} // FaAngleRight as previous (scroll right in RTL)
        >
          <FaAngleRight size={24} className="cursor-pointer" />
        </span>
        <span
          className="cursor-pointer p-1.5 rounded-full flex items-center justify-center hover:bg-gray-100 transition duration-300"
          onClick={scrollLeft} // FaAngleLeft as next (scroll left in RTL)
        >
          <FaAngleLeft size={24} />
        </span>
      </div>

      <p className="text-xl font-bold">
        {title}
      </p>
      <p className=" text-lg font-light">
        {subtitle}
      </p>

      <div
        ref={scrollRef}
        dir="rtl"
        className="flex gap-10 mt-2 max-w-[99%] mx-auto overflow-x-auto py-3"
      >
        {
          cards.map((card, index) => (
            <Card key={index} img={card.img} title={card.title} noc={noc} type={type} />
          ))
        }
      </div>
    </div>
  )
}

export default HomeRow