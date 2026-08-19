import { Expose, Transform } from 'class-transformer';

export class TopGroupAResponseDto {
  @Expose()
  sbd: string;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  toan: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  vat_li: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  hoa_hoc: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  total_score: number;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
