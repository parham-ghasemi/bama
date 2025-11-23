import { FaUser } from "react-icons/fa";
import { forwardRef } from "react";

const SignupBtn = forwardRef<HTMLDivElement, { onClick?: () => void }>(({ onClick }, ref) => {
  return (
    <div ref={ref} onClick={onClick} className="w-44 h-12 bg-white rounded-[10px] flex gap-3 py-1.5 px-3.5 z-10 relative items-center border border-[#C7BEBE75] shadow-xl shadow-[#00000040] cursor-pointer hover:scale-[102%] transition-transform">
      <div className="h-9 w-9 overflow-hidden flex items-center justify-center bg-gray-100 rounded-full">
        <FaUser className="text-gray-300 translate-y-1" size={30} />
      </div>
      <p className="text-sm">ورود یا ثبت نام</p>
    </div>
  )
})

export default SignupBtn