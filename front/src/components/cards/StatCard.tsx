import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  growth?: string;
  isPrice?: boolean;
  className?: string;
}

const StatCard = ({ title, value, icon, growth, isPrice = false, className = '' }: StatCardProps) => {
  return (
    <Card className={`py-8 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {icon}
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