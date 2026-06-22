// Updated ListingDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/axiosConfig';

// Dialog imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';

// Icons
import {
  FaCheckCircle,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaBed,
  FaBath,
  FaToilet,
  FaUser,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdMeetingRoom } from 'react-icons/md';
import { TbAirConditioning, TbFridge } from 'react-icons/tb';
import { PiSecurityCameraDuotone } from 'react-icons/pi';
import { RiSparkling2Fill } from 'react-icons/ri';
import { IoBedOutline } from 'react-icons/io5';   // ← درست شد

const toPersianNum = (num: number | string): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/villas/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleApprove = async () => {
    await api.put(`/villas/${id}/approve`);
    setListing((prev: any) => ({ ...prev, status: 'approved' }));
  };

  const handleReject = async () => {
    await api.put(`/villas/${id}/reject`, { rejectionReason });
    setListing((prev: any) => ({ ...prev, status: 'rejected', rejectionReason }));
    setIsRejectOpen(false);
    setRejectionReason('');
  };

  const handleToggleActive = async () => {
    if (listing.status === 'approved') {
      await api.put(`/villas/${id}/deactivate`);
      setListing((prev: any) => ({ ...prev, status: 'inactive' }));
    } else if (listing.status === 'inactive') {
      await api.put(`/villas/${id}/activate`);
      setListing((prev: any) => ({ ...prev, status: 'approved' }));
    }
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % (listing?.images?.length || 1));
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + (listing?.images?.length || 1)) % (listing?.images?.length || 1));

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'در حال بررسی', color: 'bg-yellow-500' },
    approved: { label: 'تایید شده', color: 'bg-green-500' },
    rejected: { label: 'رد شده', color: 'bg-red-500' },
    inactive: { label: 'غیرفعال', color: 'bg-gray-500' },
  };

  if (loading) return <p className="text-center py-20 text-lg">در حال بارگذاری...</p>;
  if (!listing) return <p className="text-center py-20 text-lg">ویلا یافت نشد</p>;

  const images = listing.images || [];
  const status = statusConfig[listing.status] || { label: listing.status, color: 'bg-gray-400' };

  const toggleButtonText = listing.status === 'approved' ? 'غیرفعال کردن ویلا' : 'فعال کردن ویلا';
  const toggleButtonClass = listing.status === 'approved'
    ? 'w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl text-lg transition'
    : 'w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl text-lg transition';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin/listings" className="flex items-center gap-2 text-gray-600 hover:text-black transition">
            <FaArrowLeft /> بازگشت به لیست ویلاها
          </Link>
          <div className="flex items-center gap-4">
            <div className={`px-5 py-2 rounded-full text-white font-bold ${status.color}`}>
              {status.label}
            </div>
            <h1 className="text-2xl font-bold">{listing.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Image Gallery */}
        <div className="flex gap-4 h-[460px] mb-10">
          <div className="flex-1 relative group">
            <img
              src={`${import.meta.env.VITE_BASE_IMG_URL}${images[0]}`}
              alt={listing.name}
              className="w-full h-full object-cover rounded-3xl cursor-pointer"
              onClick={() => openImageModal(0)}
            />
          </div>

          <div className="w-[620px] grid grid-cols-2 grid-rows-2 gap-4">
            {images.slice(1, 5).map((img: string, idx: number) => (
              <img
                key={idx}
                src={`${import.meta.env.VITE_BASE_IMG_URL}${img}`}
                alt={`تصویر ${idx + 1}`}
                className="w-full h-full object-cover rounded-3xl cursor-pointer hover:scale-105 transition"
                onClick={() => openImageModal(idx + 1)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          {/* Left Column - اطلاعات */}
          <div className="col-span-8 space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser size={28} className="text-gray-600" />
              </div>
              <div>
                <p className="font-bold text-lg">صاحب ویلا</p>
                <p className="text-gray-600">
                  {listing.owner?.name?.first} {listing.owner?.name?.last}
                </p>
              </div>

              <div className="mr-auto flex items-center gap-2 text-gray-500">
                <FaMapMarkerAlt />
                <span>{listing.address} • {listing.city?.name}</span>
              </div>

              <div className="text-sm text-gray-500">
                ارسال شده در: {new Date(listing.createdAt).toLocaleDateString('fa-IR')}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-3">توضیحات</h3>
              <p className="text-gray-700 leading-relaxed">{listing.extraInformation || 'توضیحاتی ثبت نشده است.'}</p>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6">مشخصات و امکانات</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-gray-600">تعداد اتاق</span>
                  <div className="flex items-center gap-3">
                    <MdMeetingRoom size={26} />
                    <span className="font-bold text-xl">{toPersianNum(listing.numberOfRooms)}</span>
                  </div>
                </div>

                <div className="border rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-gray-600">تخت دو نفره</span>
                  <div className="flex items-center gap-3">
                    <FaBed size={26} />
                    <span className="font-bold text-xl">{toPersianNum(listing.numberOfDoubleBeds)}</span>
                  </div>
                </div>

                <div className="border rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-gray-600">تعداد تخت</span>
                  <div className="flex items-center gap-3">
                    <IoBedOutline size={26} />   {/* درست شد */}
                    <span className="font-bold text-xl">{toPersianNum(listing.numberOfBeds)}</span>
                  </div>
                </div>

                <div className="border rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-gray-600">حمام</span>
                  <div className="flex items-center gap-3">
                    <FaBath size={26} />
                    <span className="font-bold text-xl">{toPersianNum(listing.numberOfBathrooms)}</span>
                  </div>
                </div>

                <div className="border rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-gray-600">سرویس ایرانی</span>
                  <div className="flex items-center gap-3">
                    <FaToilet size={26} />
                    <span className="font-bold text-xl">{toPersianNum(listing.numberOfIranianToilets)}</span>
                  </div>
                </div>

                <div className="border rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-gray-600">سرویس فرنگی</span>
                  <div className="flex items-center gap-3">
                    <FaToilet size={26} />
                    <span className="font-bold text-xl">{toPersianNum(listing.numberOfFarangiToilets)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Admin Actions */}
          <div className="col-span-4">
            <div className="bg-white border rounded-3xl p-8 sticky top-8">
              <h3 className="font-bold text-xl mb-6">عملیات مدیریت</h3>

              <div className="space-y-4">
                {listing.status === 'pending' && (
                  <>
                    <button
                      onClick={handleApprove}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-lg transition flex items-center justify-center gap-3"
                    >
                      <FaCheckCircle size={24} />
                      تأیید ویلا
                    </button>

                    <button
                      onClick={() => setIsRejectOpen(true)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl text-lg transition flex items-center justify-center gap-3"
                    >
                      <FaTimes size={24} />
                      رد ویلا
                    </button>
                  </>
                )}

                {(listing.status === 'approved' || listing.status === 'inactive') && (
                  <button
                    onClick={handleToggleActive}
                    className={toggleButtonClass}
                  >
                    {toggleButtonText}
                  </button>
                )}

                <Link
                  to={`/admin/listings/${id}/edit`}
                  className="block w-full text-center border-2 border-gray-800 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-100 transition"
                >
                  ویرایش اطلاعات
                </Link>
              </div>

              {listing.rejectionReason && (
                <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-600 font-bold mb-2">دلیل رد:</p>
                  <p className="text-red-700 text-sm leading-relaxed">{listing.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
          <div className="relative max-w-[95vw] max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 bg-black text-white p-3 rounded-full hover:bg-gray-800"
            >
              <FaTimes size={28} />
            </button>

            <img
              src={`${import.meta.env.VITE_BASE_IMG_URL}${images[selectedImageIndex]}`}
              alt="تصویر ویلا"
              className="max-h-[90vh] rounded-3xl shadow-2xl"
            />

            <div className="absolute inset-x-0 bottom-8 flex justify-between px-8">
              <button onClick={prevImage} className="bg-white/90 hover:bg-white p-4 rounded-full text-2xl shadow">
                <FaArrowRight />
              </button>
              <button onClick={nextImage} className="bg-white/90 hover:bg-white p-4 rounded-full text-2xl shadow">
                <FaArrowLeft />
              </button>
            </div>

            <div className="text-white text-center mt-4 text-lg">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>رد ویلا</DialogTitle>
            <DialogDescription>لطفاً دلیل رد را وارد کنید (اختیاری)</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="دلیل رد..."
            className="min-h-32"
          />
          <DialogFooter>
            <button
              onClick={handleReject}
              className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700"
            >
              رد کردن ویلا
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingDetail;