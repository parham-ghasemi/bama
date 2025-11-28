import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: { name: string; value: number }[];
  dataKey: string;
  title: string;
  className?: string;
}

const GenericLineChart = ({ data, dataKey, title, className }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GenericLineChart;