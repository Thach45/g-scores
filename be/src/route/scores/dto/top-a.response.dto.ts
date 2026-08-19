import { Expose } from 'class-transformer';

export class TopGroupAResponseDto {
  @Expose()
  sbd: string;

  @Expose()
  toan: number;

  @Expose()
  vat_li: number;

  @Expose()
  hoa_hoc: number;

  @Expose()
  total_score: number;

  constructor(partial: Partial<TopGroupAResponseDto>) {
    Object.assign(this, partial);
    this.toan = Number(this.toan);
    this.vat_li = Number(this.vat_li);
    this.hoa_hoc = Number(this.hoa_hoc);
    this.total_score = Number(this.total_score);
  }
}
