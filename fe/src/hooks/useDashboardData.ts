import { useCallback, useEffect, useState } from 'react';
import { getStatistics, getTopGroupA } from '../services/api';
import { EXAM_SUBJECTS } from '../constants/subjects';
import type {
  StatisticChartData,
  StatisticResponseDto,
  TopGroupAResponseDto,
} from '../types';

function formatStatisticsForChart(
  statistics: StatisticResponseDto[],
): StatisticChartData[] {
  const statisticsBySubject = new Map(
    statistics.map((statistic) => [statistic.subject, statistic]),
  );

  return EXAM_SUBJECTS.flatMap((subject) => {
    const statistic = statisticsBySubject.get(subject.dbColumn);

    return statistic ? [{ ...statistic, label: subject.label }] : [];
  });
}

export function useDashboardData() {
  const [statsData, setStatsData] = useState<StatisticChartData[]>([]);
  const [top10Data, setTop10Data] = useState<TopGroupAResponseDto[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isTop10Loading, setIsTop10Loading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsStatsLoading(true);
    setIsTop10Loading(true);
    setErrorMsg(null);

    try {
      const [stats, top10] = await Promise.all([
        getStatistics(),
        getTopGroupA(),
      ]);

      setStatsData(formatStatisticsForChart(stats));
      setTop10Data(top10);
    } catch {
      setErrorMsg('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setIsStatsLoading(false);
      setIsTop10Loading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchDashboardData);
  }, [fetchDashboardData]);

  return {
    statsData,
    top10Data,
    isStatsLoading,
    isTop10Loading,
    errorMsg,
    refetch: fetchDashboardData,
  };
}
