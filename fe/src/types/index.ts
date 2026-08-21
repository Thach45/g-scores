export interface ScoreResponseDto {
  sbd: string;
  toan: number | null;
  nguVan: number | null;
  ngoaiNgu: number | null;
  vatLi: number | null;
  hoaHoc: number | null;
  sinhHoc: number | null;
  lichSu: number | null;
  diaLi: number | null;
  gdcd: number | null;
  maNgoaiNgu: string | null;
}

export interface StatisticResponseDto {
  subject: string;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
}

export interface StatisticChartData extends StatisticResponseDto {
  label: string;
}

export interface TopGroupAResponseDto {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  total_score: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
