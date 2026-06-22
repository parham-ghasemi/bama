import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/ui/button"; // ShadCN Button
import { Badge } from "../../../../../components/ui/badge"; // ShadCN Badge for flair
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog"; // ShadCN Dialog for modal
import { Edit, Trash } from "lucide-react"; // React Icons
import { useState } from "react";
import { cn } from "../../../../../lib/utils";

// Fake data
const fakeVillas = [
  {
    _id: "1",
    name: "ویلای ساحلی",
    address: "شمال - مازندران",
    maxAdults: 4,
    maxChildren: 2,
    price: 2000000,
    status: "Pending",
  },
  {
    _id: "2",
    name: "ویلای کوهستانی",
    address: "تهران - شمشک",
    maxAdults: 6,
    maxChildren: 0,
    price: 3000000,
    status: "Approved",
  },
  {
    _id: "3",
    name: "ویلای شهری",
    address: "تهران - مرکز",
    maxAdults: 2,
    maxChildren: 1,
    price: 1500000,
    status: "Rejected",
  },
  // Add more as needed
];

const VillaCard = ({ villa }: { villa: any }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isEditable = villa.status === "Approved";

  const handleEdit = () => {
    setOpen(false);
    // In real scenario, navigate to edit page or handle edit
    console.log("Editing villa:", villa._id);
  };

  return (
    <div className="mt-7 cursor-pointer group relative">
      <img src="/villa/1.jpg" alt={villa.name} className="w-80 h-60 object-cover rounded-lg group-hover:rounded group-hover:rounded-b-xs transition-all" />
      <Badge
        // variant={villa.status === "Approved" ? "default" : villa.status === "Rejected" ? "destructive" : "secondary"}
        className={cn("absolute top-2 right-2", villa.status === "Approved" ? "bg-green-600" : villa.status === "Rejected" ? "bg-red-500" : "bg-gray-700")}
      >
        {villa.status === "Pending" ? "در حال بررسی" : villa.status === "Approved" ? "تایید شده" : "رد شده"}
      </Badge>
      <p className="text-lg mt-4">{villa.name}</p>
      <p className="text-gray-400 text-sm font-light mt-0.5">
        {villa.address} - ظرفیت: {villa.maxAdults} تا {villa.maxAdults + (villa.maxChildren || 0)} مهمان
      </p>
      <p className="text-xs mt-2">قیمت: {villa.price.toLocaleString("fa-IR")} تومان / شب</p>
      <div className="flex gap-2 mt-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={!isEditable}>
              <Edit className="mr-1" /> ویرایش
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>هشدار ویرایش ویلا</DialogTitle>
              <DialogDescription>
                اگر ویلای خود را ویرایش کنید، تغییرات نیاز به تایید ادمین دارد و رزروهای آینده به طور خودکار لغو خواهند شد.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleEdit}>تایید</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>لغو</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" size="sm">
          <Trash className="mr-1" /> غیرفعال کردن
        </Button>
      </div>
    </div>
  );
};

const VillasInfo = () => {
  const [villas] = useState(fakeVillas);

  return (
    <div className="w-full mt-8">
      <h2 className="font-semibold text-lg mb-4">اطلاعات ویلاها</h2>
      {villas.length > 0 ? (
        <div className="grid grid-cols-4 gap-3.5">
          {villas.map((villa) => (
            <VillaCard key={villa._id} villa={villa} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-8">
          <img src="/not-found.svg" alt="لیست خالی" className="w-64 h-auto mb-4" />
          <p className="text-gray-500 text-center">هیچ ویلایی آپلود نشده است.</p>
        </div>
      )}
    </div>
  );
};

export default VillasInfo;