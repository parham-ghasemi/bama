import { motion, AnimatePresence } from "framer-motion";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AuthModal = ({ isAuthModalOpen, setIsAuthModalOpen, origin }: { isAuthModalOpen: boolean, setIsAuthModalOpen: (is: boolean) => void, origin: { x: number, y: number } }) => {

  const nav = useNavigate();
  const [phone, setPhone] = useState('');

  const variants = {
    initial: { clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` },
    enter: { clipPath: `circle(150% at ${origin.x}% ${origin.y}%)`, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { clipPath: `circle(0% at ${origin.x}% ${origin.y}%)`, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsAuthModalOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
  };

  const handleButtonClick = () => {
    if (phone === "000") {
      nav('/admin');
    } else {
      nav('/');
    }
  };

  return (
    <div className="">
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            // @ts-ignore
            variants={variants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleOutsideClick}
          >
            <div className="bg-slate-100 min-w-2xl py-16 rounded-xl relative">
              <button onClick={() => setIsAuthModalOpen(false)} className="rounded-lg bg-gray-300 absolute top-4 left-4 p-2">
                <IoMdExit size={28} />
              </button>
              <div className="mx-auto flex flex-col items-center gap-4">
                <p className="text-2xl font-black">ورود یا ثبت نام در باما</p>
                <p className="text-2xl font-light mt-2"> برای ورود به باما شماره همراه خود را وارد کنید.  </p>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    className="h-12 outline outline-gray-500 w-80 rounded-xl text-center mt-4"
                    placeholder="09XXXXXXXXXX"
                    value={phone}
                    onChange={handleInputChange}
                  />
                  <span className="text-xs text-red-500">شماره موبایل خود را وارد کنید </span>
                </div>
                <button className="bg-[#2D3357] text-center w-80 text-blue-50 py-2 rounded-xl hover:brightness-105 cursor-pointer font-bold text-base" onClick={handleButtonClick}> ادامه </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuthModal