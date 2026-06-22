import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axiosConfig';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';

const EditVilla = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    name: '',
    address: '',
    extraInformation: '',
    price: 0,
    maxAdults: 1,
    maxChildren: 0,
    numberOfRooms: 0,
    numberOfDoubleBeds: 0,
    numberOfBeds: 0,
    numberOfBathrooms: 0,
    numberOfIranianToilets: 0,
    numberOfFarangiToilets: 0,
    items: [] as string[],
    rules: {} as Record<string, boolean>,
    images: [] as string[],
  });

  const [newItem, setNewItem] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Rule options (labels بدون کلمهٔ "مجاز" تا با صفحه ثبت یکسان باشد)
  const ruleOptions = [
    { key: 'petsAllowed', label: 'ورود حیوانات خانگی' },
    { key: 'smokingAllowed', label: 'استعمال دخانیات' },
    { key: 'eventsAllowed', label: 'برگزاری مراسم' },
    { key: 'childrenAllowed', label: 'پذیرش کودکان' },
    { key: 'partiesAllowed', label: 'برگزاری مهمانی' },
  ];

  const capacityFields = [
    { label: 'قیمت هر شب (ریال)', field: 'price' },
    { label: 'حداکثر بزرگسال', field: 'maxAdults' },
    { label: 'حداکثر کودک', field: 'maxChildren' },
    { label: 'تعداد اتاق‌ها', field: 'numberOfRooms' },
    { label: 'تخت دو نفره', field: 'numberOfDoubleBeds' },
    { label: 'تعداد تخت‌ها', field: 'numberOfBeds' },
    { label: 'تعداد حمام', field: 'numberOfBathrooms' },
    { label: 'سرویس ایرانی', field: 'numberOfIranianToilets' },
    { label: 'سرویس فرنگی', field: 'numberOfFarangiToilets' },
  ];

  // Fetch villa
  useEffect(() => {
    const fetchVilla = async () => {
      try {
        const res = await api.get(`/villas/${id}`);
        const villa = res.data;

        setFormData({
          name: villa.name || '',
          address: villa.address || '',
          extraInformation: villa.extraInformation || '',
          price: villa.price || 0,
          maxAdults: villa.maxAdults || 1,
          maxChildren: villa.maxChildren || 0,
          numberOfRooms: villa.numberOfRooms || 0,
          numberOfDoubleBeds: villa.numberOfDoubleBeds || 0,
          numberOfBeds: villa.numberOfBeds || 0,
          numberOfBathrooms: villa.numberOfBathrooms || 0,
          numberOfIranianToilets: villa.numberOfIranianToilets || 0,
          numberOfFarangiToilets: villa.numberOfFarangiToilets || 0,
          items: villa.items || [],
          rules: villa.rules || {},
          images: villa.images || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVilla();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setFormData((prev: any) => ({ ...prev, items: [...prev.items, newItem.trim()] }));
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: string, i: number) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev: any) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }));
  };

  const toggleRule = (key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      rules: {
        ...prev.rules,
        [key]: !(prev.rules[key] ?? false),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/villas/${id}`, formData);

      toast.success('تغییرات با موفقیت ذخیره شد ✅');
      navigate(`/admin/listings/${id}`);
    } catch (err) {
      console.error(err);
      toast.error('خطا در ذخیره تغییرات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-20">در حال بارگذاری...</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            to={`/admin/listings/${id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <FaArrowLeft /> بازگشت به جزئیات
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">ویرایش ویلا</h1>
          <p className="text-neutral-500 mt-3 text-lg">
            اطلاعات اقامتگاه را با دقت ویرایش کنید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* اطلاعات پایه */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">اطلاعات پایه</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <Label className="text-base">نام ویلا</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">آدرس دقیق</Label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
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
                {capacityFields.map(({ label, field }) => (
                  <div key={field} className="space-y-3">
                    <Label className="text-base">{label}</Label>
                    <Input
                      type="number"
                      value={formData[field]}
                      onChange={(e) => handleNumberChange(field, e.target.value)}
                      className="h-12"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* امکانات */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">امکانات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="مثال: استخر، اینترنت، پارکینگ..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  className="h-12"
                />
                <Button type="button" onClick={addItem} className="h-12">
                  <FaPlus />
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {formData.items.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border rounded-3xl px-6 py-3 flex items-center gap-3 text-base font-medium"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* قوانین */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">قوانین اقامتگاه</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {ruleOptions.map((rule) => {
                const isAllowed = formData.rules[rule.key] ?? false;
                return (
                  <div
                    key={rule.key}
                    className="flex items-center justify-between border rounded-3xl p-6 transition-all hover:shadow-md"
                  >
                    <span className="text-lg font-medium">{rule.label}</span>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={isAllowed ? 'default' : 'outline'}
                        className={`px-8 transition-all ${isAllowed ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                        onClick={() => toggleRule(rule.key)}
                      >
                        مجاز
                      </Button>
                      <Button
                        type="button"
                        variant={!isAllowed ? 'default' : 'outline'}
                        className={`px-8 transition-all ${!isAllowed ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        onClick={() => toggleRule(rule.key)}
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
                name="extraInformation"
                value={formData.extraInformation}
                onChange={handleChange}
                placeholder="این ویلا دارای فضای پارک خودرو، حیاط خلوت آرام، دسترسی آسان به جاده..."
                className="min-h-44 text-base"
              />
            </CardContent>
          </Card>

          {/* تصاویر */}
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">تصاویر ویلا</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-8">
                <Input
                  placeholder="URL تصویر جدید..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="h-12"
                />
                <Button type="button" onClick={addImage} className="h-12">
                  <FaPlus />
                </Button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {formData.images.map((url: string, idx: number) => (
                    <div key={idx} className="relative group rounded-3xl overflow-hidden border shadow-sm">
                      <img
                        src={`${import.meta.env.VITE_BASE_IMG_URL}${url}`}
                        alt={`تصویر ${idx}`}
                        className="w-full aspect-video object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => removeImage(idx)}
                      >
                        <FaTimes size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={saving}
            className="w-full h-16 text-xl font-bold rounded-3xl bg-green-600 hover:bg-green-700 transition-all active:scale-[0.98] disabled:bg-green-400"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditVilla;