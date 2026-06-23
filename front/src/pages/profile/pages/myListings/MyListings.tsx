import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/tabs/tabs";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";
import api from "../../../../lib/axiosConfig";
import { useNavigate } from "react-router-dom";

const toPersianNum = (num: number | string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

const toPersianPrice = (num: number): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishPrice = num.toLocaleString('en-US');
  return englishPrice.replace(/\d/g, (d) => persianDigits[parseInt(d)]).replace(/,/g, '،');
};

interface VillaListing {
  _id: string;
  name: string;
  address: string;
  price: number;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  rejectionReason?: string;
  city: {
    _id: string;
    name: string;
  };
}

interface ListingItemProps {
  listing: VillaListing;
  onToggleVisibility: (id: string) => void;
}

const ListingItem = ({ listing, onToggleVisibility }: ListingItemProps) => {
  const navigate = useNavigate();
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-semibold">تایید شده (فعال)</span>;
      case 'pending':
        return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-semibold">در انتظار تایید</span>;
      case 'rejected':
        return <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-md font-semibold">رد شده</span>;
      case 'inactive':
        return <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-semibold">غیرفعال (مخفی)</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className="mt-7 flex flex-col border rounded-xl p-4 hover:shadow-md transition bg-white relative cursor-pointer group"
      onClick={() => navigate(`/profile/my-listings/edit/${listing._id}`)}
    >
      <div className="flex gap-4">
        <img
          src={listing.images[0] ? `${import.meta.env.VITE_BASE_IMG_URL}${listing.images[0]}` : '/placeholder.jpg'}
          alt={listing.name}
          className="w-32 h-32 object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex justify-between items-start">
              <p className="text-lg font-semibold text-neutral-800">{listing.name}</p>
              <div>{getStatusBadge(listing.status)}</div>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              {listing.city?.name} - {listing.address}
            </p>
            <p className="text-sm mt-3 text-neutral-700 font-medium">
              اجاره هر شب: {toPersianPrice(listing.price)} ریال
            </p>
          </div>

          {/* Actions panel row inside item card */}
          <div className="flex gap-2 mt-4 pt-2 border-t border-gray-50 items-center justify-end">
            {(listing.status === 'approved' || listing.status === 'inactive') && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents navigating to edit page when clicking toggle
                  onToggleVisibility(listing._id);
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition cursor-pointer ${listing.status === 'approved'
                  ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
              >
                {listing.status === 'approved' ? (
                  <>
                    <FaEyeSlash size={14} />
                    <span>مخفی کردن آگهی</span>
                  </>
                ) : (
                  <>
                    <FaEye size={14} />
                    <span>نمایش عمومی آگهی</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Warning Banner if Rejected */}
      {listing.status === 'rejected' && listing.rejectionReason && (
        <div className="mt-3 flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg p-3 text-xs leading-relaxed">
          <FaInfoCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">علت رد آگهی: </span>
            {listing.rejectionReason}
          </div>
        </div>
      )}
    </div>
  );
};

const MyListings = () => {
  const [listings, setListings] = useState<VillaListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/villas/my-listings');
      setListings(response.data);
    } catch (err) {
      console.error(err);
      toast.error('خطا در دریافت اطلاعات اقامتگاه‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleToggleVisibility = async (id: string) => {
    try {
      const response = await api.put(`/villas/${id}/toggle-visibility`);
      toast.success(response.data.message);

      // Update locally immediately without invoking whole page re-fetches
      setListings(prev => prev.map(item =>
        item._id === id ? { ...item, status: response.data.status } : item
      ));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'خطا در تغییر وضعیت پدیداری اقامتگاه');
    }
  };

  const activePublicVillas = listings.filter(v => v.status === 'approved');
  const pendingReviewVillas = listings.filter(v => v.status === 'pending');

  if (loading) {
    return <div className="text-center py-12 text-sm text-gray-500 dir-rtl">در حال بارگیری اقامتگاه‌ها...</div>;
  }

  return (
    <div className="w-full dir-rtl">
      <h2 className="font-semibold text-lg text-neutral-800">مدیریت اقامتگاه‌ها (میزبانی)</h2>

      <Tabs defaultValue="all" className="mt-8" dir="rtl">
        <TabsList>
          <TabsTrigger value="all" className="cursor-pointer">همه آگهی‌ها ({toPersianNum(listings.length)})</TabsTrigger>
          <TabsTrigger value="public" className="cursor-pointer">نمایش عمومی ({toPersianNum(activePublicVillas.length)})</TabsTrigger>
          <TabsTrigger value="pending" className="cursor-pointer">در انتظار بررسی ({toPersianNum(pendingReviewVillas.length)})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {listings.map((item) => (
                <ListingItem
                  key={item._id}
                  listing={item}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          ) : (
            <EmptyStateMessage text="شما هنوز هیچ اقامتگاهی ثبت نکرده‌اید." />
          )}
        </TabsContent>

        <TabsContent value="public">
          {activePublicVillas.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {activePublicVillas.map((item) => (
                <ListingItem
                  key={item._id}
                  listing={item}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          ) : (
            <EmptyStateMessage text="هیچ کدام از اقامتگاه‌های شما در حال حاضر نمایش عمومی ندارند." />
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingReviewVillas.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {pendingReviewVillas.map((item) => (
                <ListingItem
                  key={item._id}
                  listing={item}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          ) : (
            <EmptyStateMessage text="هیچ آگهی در صف تایید کارشناسان ندارید." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyStateMessage = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-gray-200 mt-6">
    <img
      src="https://static.vecteezy.com/system/resources/thumbnails/007/104/553/small/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
      alt="لیست خالی"
      className="w-48 h-auto mb-3 opacity-75"
    />
    <p className="text-gray-500 text-sm text-center px-4">{text}</p>
  </div>
);

export default MyListings;