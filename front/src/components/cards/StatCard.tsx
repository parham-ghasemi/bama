import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  growth?: string;
}

const StatCard = ({ title, value, growth }: StatCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {growth && <p className="text-sm text-muted-foreground">{growth}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;