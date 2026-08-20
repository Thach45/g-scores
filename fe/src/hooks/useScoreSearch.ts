import { useState } from 'react';
import axios from 'axios';
import { getScoreBySbd } from '../services/api';
import type { ScoreResponseDto } from '../types';

export function useScoreSearch() {
  const [scoreResult, setScoreResult] = useState<ScoreResponseDto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (sbd: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setScoreResult(null);

    try {
      const data = await getScoreBySbd(sbd);
      setScoreResult(data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorMsg('Không tìm thấy dữ liệu cho số báo danh này.');
      } else {
        setErrorMsg('Đã có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { scoreResult, errorMsg, isLoading, handleSearch };
}
