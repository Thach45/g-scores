import { Trophy, Medal } from 'lucide-react';
import type { TopGroupAResponseDto } from '../../types';

interface LeaderboardTableProps {
  data: TopGroupAResponseDto[];
  isLoading?: boolean;
}

export default function LeaderboardTable({ data, isLoading }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50/50 rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50/50 rounded-xl text-gray-500">
        Chưa có dữ liệu Top 10.
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-y border-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold rounded-tl-lg">Hạng</th>
              <th className="px-4 py-3 font-semibold">Số báo danh</th>
              <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Tổng điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((student, index) => (
              <tr key={student.sbd} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-gray-600">
                    {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                    {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                    {index === 2 && <Medal className="w-4 h-4 text-amber-600" />}
                    {index > 2 && index + 1}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{student.sbd}</td>
                <td className="px-4 py-3 font-bold text-blue-600 text-right">
                  {Number(student.total_score).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
