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
}

export interface StatisticResponseDto {
  /** Tên cột được backend trả về, ví dụ: "ngu_van". */
  subject: string;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
}

export interface StatisticChartData extends StatisticResponseDto {
  /** Nhãn hiển thị trên biểu đồ, ví dụ: "Ngữ Văn". */
  label: string;
}

export interface TopGroupAResponseDto {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  total_score: number;
}

// Wrapper format từ TransformInterceptor backend
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
