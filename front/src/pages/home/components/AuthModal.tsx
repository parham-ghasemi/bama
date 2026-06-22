// AuthModal.tsx (updated)
import { motion, AnimatePresence } from "framer-motion";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { toast } from "sonner";
import api from "../../../lib/axiosConfig";
import { AuthContext } from "../../../context/AuthContext";

const AuthModal = ({ isAuthModalOpen, setIsAuthModalOpen, origin }: { isAuthModalOpen: boolean, setIsAuthModalOpen: (is: boolean) => void, origin: { x: number, y: number } }) => {

  const nav = useNavigate();
  const { loadUser } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [mode, setMode] = useState<"login" | "signup" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userOTP, setUserOTP] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const closeModal = () => {
    setIsAuthModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setPhone("");
    setStep("phone");
    setMode(null);
    setFirstName("");
    setLastName("");
    setUserOTP(['', '', '', '', '', '']);
    setError("");
    setPhoneError("");
    setLoading(false);
  };

  const handlePhoneSubmit = async () => {
    if (!phone.trim()) {
      setPhoneError('شماره موبایل خود را وارد کنید');
      return;
    }
    if (phone.length < 10) {
      setPhoneError('شماره موبایل معتبر وارد کنید');
      return;
    }

    setLoading(true);
    setError("");
    setPhoneError("");

    try {
      // First try login
      await api.post(`/user/login/send-otp`, { phoneNumber: phone });
      setMode("login");
      setStep('otp');
      toast.success('کد تأیید ارسال شد');
      startTimers();
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.msg?.includes("not found")) {
        // User doesn't exist → signup flow
        await api.post(`/user/signup/send-otp`, { phoneNumber: phone });
        setMode("signup");
        setStep('otp');
        toast.success('کد تأیید ارسال شد');
        startTimers();
      } else {
        setError(err.response?.data?.msg || "خطا در ارسال کد");
      }
    } finally {
      setLoading(false);
    }
  };

  const startTimers = () => {
    setRemainingTime(300);
    setResendCooldown(60);
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

  const handleOTPSubmit = async () => {
    const enteredOTP = userOTP.join('');
    if (enteredOTP.length !== 6) {
      setError("کد ۶ رقمی وارد کنید");
      return;
    }
    if (remainingTime <= 0) {
      setError('کد منقضی شده است');
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const res = await api.post(`/user/login/verify`, {
          phoneNumber: phone,
          otp: enteredOTP,
        });

        localStorage.setItem("token", res.data.token);
        await loadUser(); // Load user data after setting token
        toast.success("ورود موفقیت‌آمیز");
        closeModal();
        nav("/");
      } else {
        // Signup → go to name step
        setStep("name");
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "کد اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupComplete = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("نام و نام خانوادگی را وارد کنید");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const enteredOTP = userOTP.join("");
      const res = await api.post(`/user/signup/verify`, {
        phoneNumber: phone,
        otp: enteredOTP,
        first: firstName.trim(),
        last: lastName.trim(),
      });

      localStorage.setItem("token", res.data.token);
      await loadUser(); // Load user data after setting token
      toast.success("ثبت نام با موفقیت انجام شد");
      closeModal();
      nav("/"); // or nav('/profile/account') if you want
    } catch (err: any) {
      setError(err.response?.data?.msg || "خطا در تکمیل ثبت نام");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "user/login/send-otp" : "user/signup/send-otp";
      await api.post(`/${endpoint}`, { phoneNumber: phone });
      startTimers();
      toast.success("کد جدید ارسال شد");
      setUserOTP(['', '', '', '', '', '']);
      setError('');
    } catch (err: any) {
      setError("خطا در ارسال مجدد کد");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = () => {
    setStep('phone');
    setError('');
  };

  useEffect(() => {
    if (step === 'otp' && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
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
            <div className="bg-slate-100 w-[90%] max-w-2xl py-8 md:py-16 rounded-xl relative">
              <button onClick={closeModal} className="rounded-lg bg-gray-300 absolute top-4 left-4 p-2">
                <IoMdExit size={28} />
              </button>
              <div className="mx-auto flex flex-col items-center gap-4 px-4">
                {step === 'phone' ? (
                  <>
                    <p className="text-xl md:text-2xl font-black">ورود یا ثبت نام در باما</p>
                    <p className="text-xl md:text-2xl font-light mt-2"> برای ورود به باما شماره همراه خود را وارد کنید.  </p>
                    <div className="flex flex-col gap-3 w-full max-w-xs md:max-w-md">
                      <input
                        type="tel"
                        className="h-12 outline outline-gray-500 w-full rounded-xl text-center mt-4"
                        placeholder="09XXXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      />
                      {phoneError && <span className="text-xs text-red-500">{phoneError}</span>}
                    </div>
                    <button
                      className="bg-[#2D3357] text-center w-full max-w-xs md:max-w-md text-blue-50 py-2 rounded-xl hover:brightness-105 cursor-pointer font-bold text-base disabled:opacity-70"
                      onClick={handlePhoneSubmit}
                      disabled={loading}
                    >
                      {loading ? "در حال ارسال..." : "ادامه"}
                    </button>
                  </>
                ) : step === 'otp' ? (
                  <>
                    {/* <p className="text-xs text-gray-500 flex flex-col items-center gap-1 absolute top-2">
                      OTP: {generatedOTP}
                      <span>(this is for testing will be removed on prod)</span>
                    </p> */}

                    <div className="w-full max-w-[360px] flex flex-col items-center">
                      {/* Header */}
                      <div className="text-center mb-10">
                        <p className="text-2xl md:text-3xl font-black mb-2">تایید شماره موبایل</p>
                        <p className="text-sm md:text-base font-light text-gray-600">
                          کد ۶ رقمی ارسال شده به {phone}
                        </p>
                      </div>

                      {/* OTP */}
                      <div className="flex justify-center gap-2 md:gap-3 mb-6" dir="ltr">
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
                              w-10 h-12 md:w-12 md:h-14
                              text-center text-lg md:text-xl font-semibold
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
                          disabled={resendCooldown > 0 || loading}
                          className={`transition ${resendCooldown > 0 || loading
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
                        disabled={loading}
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
                          disabled:opacity-70
                        "
                      >
                        {loading ? "در حال بررسی..." : "تایید"}
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
                ) : (
                  <>
                    <div className="w-full max-w-[360px] flex flex-col items-center">
                      {/* Header */}
                      <div className="text-center mb-10">
                        <p className="text-2xl md:text-3xl font-black mb-2">تکمیل اطلاعات</p>
                        <p className="text-sm md:text-base font-light text-gray-600">
                          نام و نام خانوادگی خود را وارد کنید
                        </p>
                      </div>

                      {/* Name Inputs */}
                      <div className="w-full flex flex-col gap-4 mb-6">
                        <input
                          placeholder="نام"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-12 outline outline-gray-500 w-full rounded-xl px-4"
                        />
                        <input
                          placeholder="نام خانوادگی"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-12 outline outline-gray-500 w-full rounded-xl px-4"
                        />
                      </div>

                      {/* Error */}
                      <div className="h-5 mb-4">
                        {error && (
                          <span className="text-sm text-red-500">{error}</span>
                        )}
                      </div>

                      {/* Confirm */}
                      <button
                        onClick={handleSignupComplete}
                        disabled={loading}
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
                          disabled:opacity-70
                        "
                      >
                        {loading ? "در حال ثبت..." : "ثبت نام و ورود"}
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