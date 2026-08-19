import { Decimal } from '@prisma/client/runtime/client';
import { Exclude, Expose } from 'class-transformer';

export class ScoreResponseDto {
  @Expose()
  sbd: string;
  @Expose()
  toan: Decimal | null;
  @Expose()
  nguVan: Decimal | null;
  @Expose()
  ngoaiNgu: Decimal | null;

  @Expose()
  vatLi: Decimal | null;

  @Expose()
  hoaHoc: Decimal | null;

  @Expose()
  sinhHoc: Decimal | null;

  @Expose()
  lichSu: Decimal | null;

  @Expose()
  diaLi: Decimal | null;

  @Expose()
  gdcd: Decimal | null;

  // Ví dụ giấu mã ngoại ngữ (N1, N2...) đi, không cho Frontend thấy
  @Exclude()
  maNgoaiNgu: string | null;

  // Constructor để tự động map dữ liệu từ Database vào class này
  constructor(partial: Partial<ScoreResponseDto>) {
    Object.assign(this, partial);
  }
}
