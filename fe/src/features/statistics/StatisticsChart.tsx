import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import  type{ StatisticResponseDto } from '../../types';

interface StatisticsChartProps {
  data: StatisticResponseDto[];
  isLoading?: boolean;
}

export default function StatisticsChart({ data, isLoading }: StatisticsChartProps) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50/50 rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50/50 rounded-xl text-gray-500">
        Chưa có dữ liệu thống kê.
      </div>
    );
  }

  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="subject" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="level1" name=">= 8 điểm" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="level2" name="6 - 8 điểm" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="level3" name="4 - 6 điểm" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          <Bar dataKey="level4" name="< 4 điểm" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
