import Footer from "../../components/Footer";
import Header from "../../components/Header"
import SignupBtn from "../../components/SignupBtn"

const cards = [
  {
    title: "تجربه چیدن و خشک کردن چای",
    desc: "گیلان ، شفت ۱ تا ۸ نفر ظرفیت",
    price: "قیمت : ۲٥۰،۰۰۰ تومان / نفر",
    img: "/city/1.jpg"
  },
  {
    title: "صبحانه و مزه گردی در بازار رشت ",
    desc: "گیلان ، رشت ۱ تا ۷ نفر ظرفیت",
    price: "قیمت : ٤٥۰،۰۰۰ تومان / نفر",
    img: "/city/2.jpg"
  },
  {
    title: "پخت ماهی شکم پر در انزلی ",
    desc: "گیلان ، بندرانزلی ۲ تا ۷ نفر ظرفیت",
    price: "قیمت : ۸۰۰،۰۰۰ تومان / نفر",
    img: "/city/3.jpg"
  },
  {
    title: "صبحانه محلی در ابر چاله ",
    desc: "گیلان ، ماسال ۲ تا ٦ نفر ظرفیت",
    price: "قیمت : ۳۰۰،۰۰۰ تومان / نفر",
    img: "/city/4.jpg"
  },
  {
    title: "پخت غذا های گیاهی گیلانی",
    desc: "گیلان ، شفت ۲ تا ۷ نفر ظرفیت",
    price: "قیمت : ۲٥۰،۰۰۰ تومان / نفر",
    img: "/city/5.jpg"
  },
  {
    title: "لاهیجانی که ندیدیم. پرسه در بافت قدیم ...",
    desc: "گیلان ، لاهیجان ۲ تا ۸ نفر ظرفیت",
    price: "قیمت : ۲٥۰،۰۰۰ تومان / نفر",
    img: "/city/6.jpg"
  },
  {
    title: "تجربه حصیر بافی ",
    desc: "گیلان ، شفت ۱ تا ۸ نفر ظرفیت",
    price: "قیمت : ۲٥۰،۰۰۰ تومان / نفر",
    img: "/city/7.jpg"
  },
  {
    title: "تجربه پختن نان محلی ",
    desc: "گیلان ، شفت ۱ تا ۸ نفر ظرفیت",
    price: "قیمت : ۲٥۰،۰۰۰ تومان / نفر",
    img: "/city/8.jpg"
  },
];

const Card = ({ desc, img, price, title }: { title: string; desc: string; price: string; img: string }) => (
  <div className="mt-7 cursor-pointer group">
    <img src={img} alt={img} className="w-80 h-60 object-cover rounded-lg group-hover:rounded group-hover:rounded-b-xs transition-all" />
    <p className="text-lg mt-4">{title}</p>
    <p className="text-gray-400 text-sm font-light mt-0.5">{desc}</p>
    <p className="text-xs mt-2">{price}</p>
  </div>
)

const City = () => {
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

        <h2 className="text-2xl font-semibold mt-11">باما تجربه کن ، این بار برای گیلان زیبا </h2>

        <div className="grid grid-cols-4 gap-3.5">
          {cards.map((card, i) => (
            <Card desc={card.desc} img={card.img} price={card.price} title={card.title} key={`citycardwiththeindxof${i}`} />
          ))}
        </div>
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  )
}

export default City