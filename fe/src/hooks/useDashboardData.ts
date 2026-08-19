import { useState, useEffect } from 'react';
import { getStatistics, getTopGroupA } from '../services/api';
import type { StatisticResponseDto, TopGroupAResponseDto } from '../types';

export function useDashboardData() {
  const [statsData, setStatsData] = useState<StatisticResponseDto[]>([]);
  const [top10Data, setTop10Data] = useState<TopGroupAResponseDto[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isTop10Loading, setIsTop10Loading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, top10] = await Promise.all([
          getStatistics(),
          getTopGroupA()
        ]);
        
        setStatsData(stats);
        setTop10Data(top10);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setIsStatsLoading(false);
        setIsTop10Loading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { statsData, top10Data, isStatsLoading, isTop10Loading };
}
