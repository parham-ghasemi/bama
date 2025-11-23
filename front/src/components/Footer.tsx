import { FaPinterestP, FaTelegramPlane } from "react-icons/fa"
import { RiFacebookBoxFill, RiInstagramFill } from "react-icons/ri"
import { Link } from "react-router-dom"

const footerLinks = [
  {
    title: "نحوه رزرو اقامتگاه",
    links: [
      { text: "راهنمای رزرو اقامتگاه", link: "#" },
      { text: "شیوه های پرداخت ", link: "#" },
      { text: "لغو رزرو", link: "#" }
    ]
  },
  {
    title: "خدمات مشتریان",
    links: [
      { text: "پرسش  های متداول میهمان ", link: "/faq" },
      { text: "پرسش های متداول میزبان", link: "/faq" },
      { text: "چطوری اقامتگاه ثبت کنم", link: "#" },
      { text: "حریم شخصی کاربران", link: "#" }
    ]
  },
  {
    title: "با ما ",
    links: [
      { text: "مجله ما ", link: "#" },
      { text: "درباره ما ", link: "/about" },
      { text: "قوانین ما ", link: "#" },
      { text: "تماس با ما ", link: "#" },
      { text: "فرصت های شغلی", link: "#" }
    ]
  }
]

const socialLinks = [
  { icon: <FaPinterestP />, link: "#" },
  { icon: <FaTelegramPlane />, link: "#" },
  { icon: <RiFacebookBoxFill />, link: "#" },
  { icon: <RiInstagramFill />, link: "#" }
]

const Footer = () => {
  return (
    <div className="w-full border-t border-gray-300 bg-gray-200 pt-10">
      <div className="max-w-6xl mx-auto">
        <Link to={'/'} className="flex justify-center mb-24">
          <img src="/logo.png" className="h-14" />
        </Link>

        <div className="flex justify-between flex-wrap gap-10">
          {footerLinks.map((item, index) => (
            <div className="flex flex-col gap-1 min-w-[150px]" key={index}>
              <p className="mb-2 font-bold">{item.title}</p>
              {item.links.map((l, i) => (
                <Link
                  to={l.link}
                  className="font-light text-gray-600 hover:underline underline-offset-4"
                  key={i}
                >
                  {l.text}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex flex-col">
            <p className="font-bold mb-4">مارا در شبکات اجتماعی دنبال کنید :</p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Link
                  to={social.link}
                  key={index}
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300 bg-gray-300 h-12 w-12 rounded-xl flex items-center justify-center text-2xl hover:scale-105"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-slate-400 my-8" />

        <div className="flex justify-between text-sm mt-10 flex-wrap gap-4">
          <p className="font-semibold">
            <span className="font-black">در تمامی سفر‌های شما، </span>
            ۲۴ ساعته در کنار شما هستیم.
          </p>

          <p className="flex gap-1">
            تلفن پشتیبانی:
            <span className="text-blue-500">099125252964</span>
          </p>

          <p className="flex gap-1">
            ایمیل:
            <span className="text-blue-500">parham.ghasemi.1388@gmail.com</span>
          </p>

          <p className="flex gap-1">
            کدپستی:
            <span className="text-blue-500">۱۳۹۳۷۳۳۶۹۱</span>
          </p>
        </div>

        <div className="h-10"></div>
      </div>
    </div>
  )
}

export default Footer
