import { useParams } from 'react-router-dom';
import { listings } from '../../data/listings';
import { Carousel, CarouselContent, CarouselItem } from '../../components/ui/carousel';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import GenericLineChart from '../../components/charts/GenericLineChart';

const ListingDetail = () => {
  const { id } = useParams();
  const listing = listings.find((l) => l.id === id);
  if (!listing) return <p>ویلا یافت نشد</p>;

  const trendData = [{ name: 'فروردین', value: 5 }, /* fake */];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">جزئیات ویلا: {listing.name}</h2>
      <Carousel>
        <CarouselContent>
          {listing.images.map((img, idx) => (
            <CarouselItem key={idx}>
              <img src={img} alt={`Image ${idx}`} className="w-full h-64 object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Card>
        <CardHeader><CardTitle>اطلاعات</CardTitle></CardHeader>
        <CardContent>
          <p>توضیحات: {listing.description}</p>
          <p>امکانات: {listing.amenities.join(', ')}</p>
          <p>مکان: {listing.location}</p>
          <p>قیمت: {listing.price} ریال</p>
          <p>تعداد رزرو: {listing.bookingsCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>روند رزرو</CardTitle></CardHeader>
        <CardContent><GenericLineChart data={trendData} dataKey="value" title="" /></CardContent>
      </Card>
      <div className="flex gap-4">
        <Button>تایید</Button>
        <Button variant="destructive">رد</Button>
        <Button variant="outline">غیرفعال</Button>
        <Button>ویرایش</Button>
      </div>
    </div>
  );
};

export default ListingDetail;