import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: { month: string; value: number }[];
  dataKey: string;
  title: string;
}

const GenericLineChart = ({ data, dataKey, title }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GenericLineChart;
