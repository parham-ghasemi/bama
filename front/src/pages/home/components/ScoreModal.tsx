import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ScoreModal = ({
  isScoreModalOpen,
  setIsScoreModalOpen,
  origin
}: {
  isScoreModalOpen: boolean;
  setIsScoreModalOpen: (is: boolean) => void;
  origin: { x: number; y: number };
}) => {

  const nav = useNavigate();

  const variants = {
    initial: { clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` },
    enter: {
      clipPath: `circle(150% at ${origin.x}% ${origin.y}%)`,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      clipPath: `circle(0% at ${origin.x}% ${origin.y}%)`,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsScoreModalOpen(false);
    }
  };

  return (
    <div>
      <AnimatePresence>
        {isScoreModalOpen && (
          <motion.div
            // @ts-ignore
            variants={variants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleOutsideClick}
          >
            <div className="bg-slate-100 min-w-2xl max-w-2xl py-6 rounded-xl relative">
              <div className="flex justify-between px-4">

                <div className="w-44 h-12 flex gap-3 py-1.5 px-3.5 z-10 relative items-center cursor-pointer hover:scale-[102%] transition-transform">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-purple-600" size={25} />
                    <p className="font-bold text-sm">امتیاز شما:</p>
                  </div>

                  <span className="text-xl font-semibold border-b border-slate-800 leading-tight">0</span>
                </div>

                <button
                  onClick={() => setIsScoreModalOpen(false)}
                  className="rounded-lg bg-gray-300 p-2"
                >
                  <IoMdExit size={28} />
                </button>

              </div>

              {/* CIRCLE METER - NOW SET TO 55% */}
              <div className="relative h-72 w-72 mx-auto">

                {/* Purple progress 55% */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #6b21a8 0% 55%, 
                      #e2e8f0 55% 100%
                    )`
                  }}
                />

                {/* Inner white circle */}
                <div className="absolute top-8 bottom-0 left-0 right-0 bg-slate-100 rounded-full"></div>

                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-black">
                  ۵۵٪
                </p>

                <p className="top-4/6 absolute text-center font-bold">
                  ۴۵ امتیاز تا گرفتن تخفیف برای اقامت بعدی باقی مانده
                </p>
              </div>

              <p className="text-center px-7">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                استفاده از طراحان گرافیک است.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScoreModal;
