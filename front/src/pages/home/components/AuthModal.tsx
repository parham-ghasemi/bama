import { motion, AnimatePresence } from "framer-motion";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { toast } from "sonner";

const AuthModal = ({ isAuthModalOpen, setIsAuthModalOpen, origin }: { isAuthModalOpen: boolean, setIsAuthModalOpen: (is: boolean) => void, origin: { x: number, y: number } }) => {

  const nav = useNavigate();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [userOTP, setUserOTP] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

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

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    return otp;
  };

  const handlePhoneSubmit = () => {
    if (!phone.trim()) {
      setPhoneError('شماره موبایل خود را وارد کنید');
      return;
    }
    generateOTP();
    setStep('otp');
    setUserOTP(['', '', '', '', '', '']);
    setError('');
    setRemainingTime(300);
    setResendCooldown(60);
    setPhoneError('');
    toast.success('کد ارسال شد');
  };

  const handleOTPChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOTP = [...userOTP];
      newOTP[index] = value;
      setUserOTP(newOTP);
      setError('');

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !userOTP[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setUserOTP(pasted.split(''));
      setError('');
    }
  };

  const handleOTPSubmit = () => {
    const enteredOTP = userOTP.join('');
    if (remainingTime <= 0) {
      setError('کد منقضی شده است');
    } else if (enteredOTP !== generatedOTP) {
      setError('کد نامعتبر');
    } else {
      if (phone === "111") {
        nav('/profile/account');
      } else if (phone === "000") {
        nav('/admin');
      } else {
        nav('/');
      }
      setIsAuthModalOpen(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown === 0) {
      generateOTP();
      setUserOTP(['', '', '', '', '', '']);
      setError('');
      setRemainingTime(300);
      setResendCooldown(60);
      toast.success('کد جدید ارسال شد');
    }
  };

  const handleChangePhone = () => {
    setStep('phone');
    setError('');
  };

  useEffect(() => {
    if (step === 'otp' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  useEffect(() => {
    if (step === 'otp' && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, remainingTime]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

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
                {step === 'phone' ? (
                  <>
                    <p className="text-2xl font-black">ورود یا ثبت نام در باما</p>
                    <p className="text-2xl font-light mt-2"> برای ورود به باما شماره همراه خود را وارد کنید.  </p>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        className="h-12 outline outline-gray-500 w-80 rounded-xl text-center mt-4"
                        placeholder="09XXXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      {phoneError && <span className="text-xs text-red-500">{phoneError}</span>}
                    </div>
                    <button className="bg-[#2D3357] text-center w-80 text-blue-50 py-2 rounded-xl hover:brightness-105 cursor-pointer font-bold text-base" onClick={handlePhoneSubmit}> ادامه </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 flex flex-col items-center gap-1 absolute top-2">
                      OTP: {generatedOTP}
                      <span>(this is for testing will be removed on prod)</span>
                    </p>

                    <div className="w-[360px] flex flex-col items-center">
                      {/* Header */}
                      <div className="text-center mb-10">
                        <p className="text-3xl font-black mb-2">تایید شماره موبایل</p>
                        <p className="text-base font-light text-gray-600">
                          کد ۶ رقمی ارسال شده به {phone}
                        </p>
                      </div>

                      {/* OTP */}
                      <div className="flex justify-center gap-3 mb-6" dir="ltr">
                        {userOTP.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleOTPKeyDown(index, e)}
                            onPaste={index === 0 ? handleOTPPaste : undefined}
                            ref={(el) => {
                              if (el) inputRefs.current[index] = el;
                            }}
                            className={`
            w-12 h-14
            text-center text-xl font-semibold
            rounded-lg
            border
            ${error ? 'border-red-500' : 'border-gray-400'}
            focus:border-[#2D3357]
            focus:outline-none
            transition
          `}
                          />
                        ))}
                      </div>

                      {/* Error */}
                      <div className="h-5 mb-4">
                        {error && (
                          <span className="text-sm text-red-500">{error}</span>
                        )}
                      </div>

                      {/* Timer + Resend */}
                      <div className="flex items-center justify-between w-full text-sm text-gray-500 mb-8">
                        <span>
                          {Math.floor(remainingTime / 60)}:
                          {(remainingTime % 60).toString().padStart(2, '0')}
                        </span>

                        <button
                          onClick={handleResend}
                          disabled={resendCooldown > 0}
                          className={`transition ${resendCooldown > 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-500 hover:underline'
                            }`}
                        >
                          ارسال مجدد
                          {resendCooldown > 0 && ` (${resendCooldown})`}
                        </button>
                      </div>

                      {/* Confirm */}
                      <button
                        onClick={handleOTPSubmit}
                        className="
        w-full
        bg-[#2D3357]
        text-blue-50
        py-3
        rounded-xl
        font-bold
        hover:brightness-105
        transition
        mb-6
      "
                      >
                        تایید
                      </button>

                      {/* Change phone */}
                      <button
                        onClick={handleChangePhone}
                        className="text-sm text-gray-500 hover:text-blue-500 transition"
                      >
                        تغییر شماره
                      </button>
                    </div>
                  </>

                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuthModal