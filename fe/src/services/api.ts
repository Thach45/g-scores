import axios from "axios";
import type {
  ScoreResponseDto,
  StatisticResponseDto,
  TopGroupAResponseDto,
  ApiResponse
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/scores";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getStatistics = async (): Promise<StatisticResponseDto[]> => {
  const response =
    await apiClient.get<ApiResponse<StatisticResponseDto[]>>("/statistics");
  return response.data.data;
};

export const getTopGroupA = async (): Promise<TopGroupAResponseDto[]> => {
  const response =
    await apiClient.get<ApiResponse<TopGroupAResponseDto[]>>("/top-a");
  return response.data.data;
};

export const getScoreBySbd = async (sbd: string): Promise<ScoreResponseDto> => {
  const response = await apiClient.get<ApiResponse<ScoreResponseDto>>(
    `/${sbd}`,
  );
  return response.data.data;
};
