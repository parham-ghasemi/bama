import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  growth?: string;
  isPrice: boolean
}

const StatCard = ({ title, value, growth, isPrice }: StatCardProps) => {
  return (
    <Card className='py-8'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-end">
          {isPrice && (
            <span className='text-xs'>تومان</span>
          )}
          {value}
        </p>
        {growth && <p className="text-sm text-muted-foreground">{growth}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;