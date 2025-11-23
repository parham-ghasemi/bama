const types = [
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/2bc92a3c-1c03-4aa6-8cfd-f9173f6324d4.png",
    title: "ویلا",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/28ab97cf-22f0-4d54-b537-98f52a763a0e.png",
    title: "آپارتمان",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/576b00be-20da-4f65-b62e-80d5c69443f9.png",
    title: "کلبه",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/0a8b3e4d-390d-47eb-93c3-ae64c6bb4b7e.png",
    title: "مثلثی",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/7be17c73-7b70-4793-8497-cbd0aba534b9.png",
    title: "لب دریا",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/e9cbf037-51b3-485b-832b-e62cb7086ac3.png",
    title: "لوکس",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/20f63246-4ef2-4fbd-a5e7-9e4e19b568cc.png",
    title: "داخل جنگل",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/c2809f67-96f0-42e0-8101-10c5f8f41f44.png",
    title: "منظره رویایی",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/db407149-e2b4-4220-a915-966d47dfc17f.png",
    title: "تفریحات",
  },
  {
    icon: "https://cdn.jabama.com/image/jabama-images/0/67c84144-6cf3-4ba2-98e0-71b3889e1219.png",
    title: "کلبه بومی",
  },
]

const VillaTypes = () => {
  return (
    <div className="w-full space-y-4">
      <p className="font-bold">انواع ویلا ها </p>
      <div className="flex justify-between">
        {
          types.map((type, index) => (
            <button key={index} className="flex flex-col items-center justify-center  w-24 h-24 cursor-pointer outline outline-gray-200 rounded-lg gap-1.5 focus:outline-2 focus:outline-gray-700">
              <img src={type.icon} alt={type.title} className="w-12 h-12" />
              <span className="text-sm font-bold">{type.title}</span>
            </button>
          ))
        }
      </div>
    </div>
  )
}

export default VillaTypes