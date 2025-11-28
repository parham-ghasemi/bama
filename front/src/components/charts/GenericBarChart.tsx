import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: { name: string; value: number }[];
  dataKey: string;
  title: string;
  className?: string;
}

const GenericBarChart = ({ data, dataKey, title, className }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GenericBarChart;