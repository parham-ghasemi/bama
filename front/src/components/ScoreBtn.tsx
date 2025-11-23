import { FaStar } from "react-icons/fa";
import { forwardRef } from "react";

const ScoreBtn = forwardRef<HTMLDivElement, { onClick?: () => void }>(({ onClick }, ref) => {
  return (
    <div ref={ref} onClick={onClick} className="w-44 h-12 bg-white rounded-[10px] flex gap-3 py-1.5 px-3.5 z-10 relative items-center border border-[#C7BEBE75] shadow-xl shadow-[#00000040] cursor-pointer hover:scale-[102%] transition-transform">
      <div className="flex items-center gap-2">
        <FaStar className="text-purple-600" size={25} />
        <p className="font-bold text-sm">امتیاز شما:</p>
      </div>

      <span className="text-xl font-semibold border-b border-slate-800 leading-tight">0</span>
    </div>
  )
})

export default ScoreBtn