import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cities } from "../../components/cities";

import {
  FaBed,
  FaBath,
  FaToilet,
  FaTv,
  FaTimes,
} from "react-icons/fa";
import {
  MdOutlineLtePlusMobiledata,
  MdMeetingRoom,
} from "react-icons/md";
import { TbAirConditioning, TbFridge } from "react-icons/tb";
import { IoIosWater } from "react-icons/io";
import { PiSecurityCameraDuotone } from "react-icons/pi";
import { IoBedOutline } from "react-icons/io5";

import Footer from "../../components/Footer";

// shadcn/ui
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";

// Combobox
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

import api from "../../lib/axiosConfig";
import { toast } from "sonner";

const AddVilla = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [price, setPrice] = useState<number>(0);
  const [maxAdults, setMaxAdults] = useState<number>(4);
  const [maxChildren, setMaxChildren] = useState<number>(2);

  const [numberOfRooms, setNumberOfRooms] = useState<number>(2);
  const [numberOfDoubleBeds, setNumberOfDoubleBeds] = useState<number>(1);
  const [numberOfBeds, setNumberOfBeds] = useState<number>(3);
  const [numberOfBathrooms, setNumberOfBathrooms] = useState<number>(1);
  const [numberOfIranianToilets, setNumberOfIranianToilets] = useState<number>(1);
  const [numberOfFarangiToilets, setNumberOfFarangiToilets] = useState<number>(1);

  const [extraInformation, setExtraInformation] = useState("");

  const [rules, setRules] = useState({
    singleGroups: true,
    smoking: false,
    pets: false,
    ceremonies: false,
  });

  const amenityList = [
    { key: "mobileSignal", label: "آنتن دهی موبایل", icon: MdOutlineLtePlusMobiledata },
    { key: "airConditioning", label: "سیستم سرمایشی", icon: TbAirConditioning },
    { key: "fridge", label: "یخچال", icon: TbFridge },
    { key: "tv", label: "تلویزیون", icon: FaTv },
    { key: "drinkingWater", label: "آب آشامیدنی", icon: IoIosWater },
    { key: "security", label: "نگهبان", icon: PiSecurityCameraDuotone },
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  const [open, setOpen] = useState(false);

  const toggleAmenity = (key: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 10) {
      toast.error("حداکثر ۱۰ تصویر مجاز است.");
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex((prev) => prev - 1);
    }
  };

  const toggleRule = (key: keyof typeof rules) => {
    setRules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCity) {
      toast.error("لطفاً شهر را انتخاب کنید.");
      return;
    }

    setLoading(true);

    try {
      let orderedFiles = imageFiles;
      if (imageFiles.length > 0) {
        orderedFiles = [
          imageFiles[mainImageIndex],
          ...imageFiles.filter((_, i) => i !== mainImageIndex),
        ];
      }

      // Step 1: Upload images
      const formData = new FormData();
      orderedFiles.forEach((file) => formData.append("images", file));

      const uploadRes = await api.post("/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrls = uploadRes.data.urls;

      // Step 2: Create villa
      const villaData = {
        name,
        address,
        extraInformation,
        rules,
        items: selectedAmenities,
        images: imageUrls,
        price,
        maxAdults,
        maxChildren,
        city: selectedCity,
        numberOfRooms,
        numberOfDoubleBeds,
        numberOfBeds,
        numberOfBathrooms,
        numberOfIranianToilets,
        numberOfFarangiToilets,
      };

      await api.post("/villas", villaData);

      toast.success("ویلا با موفقیت ثبت شد و در حال بررسی است! 🎉");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "خطا در ثبت ویلا. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="py-3">
        <Link to="/" className="block px-4">
          <img src="/logo.png" alt="لوگو" className="h-11" />
        </Link>
      </div>
      <div className="h-px w-full bg-neutral-500" />

      <div className="mx-auto max-w-5xl py-12 px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">ثبت ویلا / خانه جدید</h1>
          <p className="text-neutral-500 mt-3 text-lg">
            اطلاعات اقامتگاه خود را با دقت وارد کنید. پس از بررسی توسط تیم جاباما منتشر خواهد شد.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* اطلاعات پایه */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">اطلاعات پایه</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-base">نام ویلا</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ویلا دوخوابه روستایی گلستان ۲"
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base">شهر</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-start text-right font-normal"
                      >
                        {selectedCity || "انتخاب شهر"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                      <Command>
                        <CommandInput placeholder="جستجوی شهر..." className="text-right" />
                        <CommandEmpty>شهر یافت نشد</CommandEmpty>
                        <CommandGroup className="max-h-80 overflow-auto">
                          {cities.map((city) => (
                            <CommandItem
                              key={city.name}
                              value={city.name}
                              onSelect={() => {
                                setSelectedCity(city.name);
                                setOpen(false);
                              }}
                            >
                              {city.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base">آدرس دقیق</Label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="استان البرز، چهارباغ، خیابان اصلی، کوچه ۱۲، پلاک ۴۵"
                  className="min-h-32 resize-y"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* ظرفیت و مشخصات */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">ظرفیت و مشخصات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  { label: "قیمت هر شب (تومان)", value: price, setter: setPrice },
                  { label: "حداکثر بزرگسال", value: maxAdults, setter: setMaxAdults },
                  { label: "حداکثر کودک", value: maxChildren, setter: setMaxChildren },
                  { label: "تعداد اتاق‌ها", value: numberOfRooms, setter: setNumberOfRooms },
                  { label: "تخت دو نفره", value: numberOfDoubleBeds, setter: setNumberOfDoubleBeds },
                  { label: "تعداد تخت‌ها", value: numberOfBeds, setter: setNumberOfBeds },
                  { label: "تعداد حمام", value: numberOfBathrooms, setter: setNumberOfBathrooms },
                  { label: "سرویس ایرانی", value: numberOfIranianToilets, setter: setNumberOfIranianToilets },
                  { label: "سرویس فرنگی", value: numberOfFarangiToilets, setter: setNumberOfFarangiToilets },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <Label className="text-base">{item.label}</Label>
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) => item.setter(Number(e.target.value))}
                      className="h-12"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral-500 mt-4">میهمانان می‌توانند تا ۲ بزرگسال و ۲ کودک بیشتر از ظرفیت رزرو کنند، با افزایش ۵% قیمت به ازای هر نفر اضافی (حداکثر ۲۰% افزایش).</p>
            </CardContent>
          </Card>

          {/* امکانات */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">امکانات مهم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenityList.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity.key);
                  return (
                    <label
                      key={amenity.key}
                      className={`flex items-center gap-4 border rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${isChecked ? "border-blue-400 bg-blue-50 shadow-sm" : "border-neutral-200 hover:border-neutral-300"
                        }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleAmenity(amenity.key)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <div className="flex items-center gap-4">
                        <amenity.icon size={32} className="text-neutral-600" />
                        <span className="font-medium text-lg">{amenity.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* قوانین */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">قوانین اقامتگاه</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "singleGroups", label: "پذیرش گروه‌های مجردی (فقط آقایان یا خانم‌ها)" },
                { key: "smoking", label: "استعمال دخانیات" },
                { key: "pets", label: "ورود حیوانات خانگی" },
                { key: "ceremonies", label: "برگزاری مراسم" },
              ].map((rule) => {
                const isAllowed = rules[rule.key as keyof typeof rules];
                return (
                  <div
                    key={rule.key}
                    className="flex items-center justify-between border rounded-3xl p-6 transition-all hover:shadow-md"
                  >
                    <span className="text-lg font-medium">{rule.label}</span>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={isAllowed ? "default" : "outline"}
                        className={`px-8 transition-all ${isAllowed ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                        onClick={() => toggleRule(rule.key as keyof typeof rules)}
                      >
                        مجاز
                      </Button>
                      <Button
                        type="button"
                        variant={!isAllowed ? "default" : "outline"}
                        className={`px-8 transition-all ${!isAllowed ? "bg-red-600 hover:bg-red-700" : ""}`}
                        onClick={() => toggleRule(rule.key as keyof typeof rules)}
                      >
                        مجاز نیست
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* اطلاعات تکمیلی */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">اطلاعات تکمیلی</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={extraInformation}
                onChange={(e) => setExtraInformation(e.target.value)}
                placeholder="این ویلا دارای فضای پارک خودرو، حیاط خلوت آرام، دسترسی آسان به جاده..."
                className="min-h-44 text-base"
              />
            </CardContent>
          </Card>

          {/* تصاویر */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">تصاویر ویلا</CardTitle>
              <p className="text-neutral-500">حداکثر ۱۰ تصویر • تصویر اصلی به عنوان کاور نمایش داده می‌شود</p>
            </CardHeader>
            <CardContent>
              <label className="group flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-400 bg-blue-50/30 rounded-3xl p-14 cursor-pointer transition-all duration-300 hover:scale-[1.01]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="text-6xl mb-6 transition-transform group-hover:scale-110">📸</div>
                <p className="font-semibold text-xl text-blue-700">کلیک کنید یا تصاویر را اینجا رها کنید</p>
                <p className="text-sm text-neutral-500 mt-2">حداکثر ۱۰ تصویر با کیفیت بالا</p>
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className={`relative group rounded-3xl overflow-hidden border shadow-sm ${mainImageIndex === index ? 'border-blue-500 border-2' : 'border-gray-300'}`}
                    >
                      <img src={src} alt="" className="w-full aspect-[3/2] object-cover" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => removeImage(index)}
                      >
                        <FaTimes size={18} />
                      </Button>
                      {mainImageIndex === index ? (
                        <Badge className="absolute bottom-3 left-3 bg-blue-500 text-white">
                          تصویر اصلی
                        </Badge>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all text-xs"
                          onClick={() => setMainImageIndex(index)}
                        >
                          تنظیم به عنوان تصویر اصلی
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full h-16 text-xl font-bold rounded-3xl bg-blue-700 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:bg-blue-400"
          >
            {loading ? "در حال ارسال..." : "ارسال برای بررسی تیم باما"}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddVilla;